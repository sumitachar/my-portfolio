import { useEffect, useRef, useState } from 'react';
import { Flashlight, Sun } from 'lucide-react';
import { getTorchMode, setTorchMode, torchSupported } from '../../lib/torch';

// beam geometry (px): narrow at the lens, wide at the far end
const BEAM_LENGTH = 470;
const BEAM_NEAR = 14;   // half-width at the lens
const BEAM_FAR = 175;   // half-width at the far end
const NEAR_GLOW = 95;   // soft light around the torch itself
const GLIMMER = 70;     // faint glow before the torch is switched on
// [width scale, strength]: wide faint layers outside, narrow strong ones inside
const SOFT_LAYERS = Array.from({ length: 9 }, (_, i) => [1.36 - i * 0.07, 0.24]);

/** Flashlight drawn horizontally, lens on the right. Lens centre = (50, 15). */
function FlashlightCursor() {
  return (
    <svg width="60" height="30" viewBox="0 0 60 30" fill="none" aria-hidden="true" style={{ position: 'absolute', left: -50, top: -15 }}>
      {/* body */}
      <rect x="4" y="10" width="30" height="10" rx="2.5" fill="#1d1d20" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      {/* switch */}
      <rect x="15" y="8" width="6" height="3" rx="1.2" fill="rgb(var(--primary-500))" />
      {/* head, widening toward the lens */}
      <path d="M34 10 L48 5 L48 25 L34 20 Z" fill="#2a2a2e" stroke="rgb(var(--primary-500))" strokeWidth="1.2" strokeLinejoin="round" />
      {/* glowing lens */}
      <ellipse cx="49.5" cy="15" rx="2.2" ry="10" fill="rgb(var(--primary-500))" />
    </svg>
  );
}

const readAccent = () =>
  (getComputedStyle(document.documentElement).getPropertyValue('--primary-500').trim() || '197 232 108').split(/\s+/).join(',');

/** Cone from the lens: narrow → wide, ending in a rounded pool of light. */
function beamPath(ctx, x, y, a, len, w0, w1) {
  const dx = Math.cos(a), dy = Math.sin(a);
  const px = -dy, py = dx;
  const fx = x + dx * len, fy = y + dy * len;
  ctx.beginPath();
  ctx.moveTo(x + px * w0, y + py * w0);
  ctx.lineTo(fx + px * w1, fy + py * w1);
  ctx.ellipse(fx, fy, w1 * 0.55, w1, a, Math.PI / 2, -Math.PI / 2, true);
  ctx.lineTo(x - px * w0, y - py * w0);
  ctx.closePath();
  return { fx, fy, dx, dy };
}

/**
 * Whole-page torch. First visit starts with the lights off and a prompt; switching the
 * torch on grows a cone-shaped beam from the flashlight, which turns to face the
 * direction the mouse moves. Navbar and chat stay above the darkness.
 * Off on touch devices and for prefers-reduced-motion.
 */
export default function Torch({ ready }) {
  const canvas = useRef(null);
  const lamp = useRef(null);
  const [supported] = useState(torchSupported);
  const [mode, setMode] = useState(getTorchMode);
  const [pressed, setPressed] = useState(false);
  const modeRef = useRef(mode);

  useEffect(() => {
    const sync = (e) => setMode(e.detail.mode);
    window.addEventListener('torchchange', sync);
    return () => window.removeEventListener('torchchange', sync);
  }, []);

  // hide the native cursor + follower ring while the flashlight cursor is shown
  useEffect(() => {
    modeRef.current = mode;
    const on = supported && mode === 'on';
    document.documentElement.classList.toggle('torch-on', on);
    return () => document.documentElement.classList.remove('torch-on');
  }, [supported, mode]);

  useEffect(() => {
    const cv = canvas.current;
    if (!supported || mode === 'off' || !cv) return;
    const ctx = cv.getContext('2d');
    let w = 0, h = 0;
    const resize = () => { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; };
    resize();

    let accent = readAccent();
    const onPalette = () => setTimeout(() => { accent = readAccent(); }, 2100); // after the 2s theme blend
    let x = w / 2, y = h / 2, tx = x, ty = y;
    let ax = x, ay = y;                     // anchor for measuring movement direction
    let angle = -Math.PI / 3, target = angle;
    let open = 0;                           // 0 = closed beam, 1 = fully open
    let raf = 0;
    const t0 = performance.now();

    const move = (e) => {
      tx = e.clientX; ty = e.clientY;
      const mx = tx - ax, my = ty - ay;
      if (mx * mx + my * my > 36) { // moved more than 6px: aim the torch that way
        target = Math.atan2(my, mx);
        ax = tx; ay = ty;
      }
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    const tick = (now) => {
      const on = modeRef.current === 'on';
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      let diff = target - angle;                       // shortest way round
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      angle += diff * 0.12;
      open += ((on ? 1 : 0) - open) * 0.06;            // beam grows small → large
      const t = (now - t0) / 1000;
      const flicker = 1 + 0.02 * Math.sin(t * 7.3) + 0.01 * Math.sin(t * 17.1);

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(0,0,0,${on ? 0.9 : 0.95})`;
      ctx.fillRect(0, 0, w, h);

      // cut the light out of the darkness
      ctx.globalCompositeOperation = 'destination-out';
      const nearR = (on ? NEAR_GLOW : GLIMMER) * (0.6 + 0.4 * Math.max(open, on ? 0 : 1)) * flicker;
      const g0 = ctx.createRadialGradient(x, y, 0, x, y, nearR);
      g0.addColorStop(0, `rgba(0,0,0,${on ? 0.85 : 0.5})`);
      g0.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g0;
      ctx.fillRect(x - nearR, y - nearR, nearR * 2, nearR * 2);

      if (open > 0.01) {
        const len = BEAM_LENGTH * open * flicker;
        // many thin layered cones give the beam smooth, soft edges
        SOFT_LAYERS.forEach(([k, m]) => {
          const { fx, fy } = beamPath(ctx, x, y, angle, len, BEAM_NEAR * k, BEAM_FAR * k * open * flicker);
          const g = ctx.createLinearGradient(x, y, fx, fy);
          g.addColorStop(0, `rgba(0,0,0,${0.4 * m})`);
          g.addColorStop(0.3, `rgba(0,0,0,${0.85 * m})`);
          g.addColorStop(1, `rgba(0,0,0,${0.95 * m})`);
          ctx.fillStyle = g;
          ctx.fill();
        });

        // faint warm tint in the theme colour
        ctx.globalCompositeOperation = 'source-over';
        const { fx, fy } = beamPath(ctx, x, y, angle, len, BEAM_NEAR, BEAM_FAR * open * flicker);
        const tint = ctx.createLinearGradient(x, y, fx, fy);
        tint.addColorStop(0, `rgba(${accent},0.12)`);
        tint.addColorStop(1, `rgba(${accent},0.03)`);
        ctx.fillStyle = tint;
        ctx.fill();
      }

      if (lamp.current) lamp.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('palettechange', onPalette);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('palettechange', onPalette);
      cancelAnimationFrame(raf);
    };
    // the loop reads the live mode from modeRef, so it only restarts when switching to/from 'off'
  }, [supported, mode === 'off']); // eslint-disable-line react-hooks/exhaustive-deps

  if (!supported) return null;
  const dark = mode !== 'off' && ready;
  const intro = mode === 'intro' && ready;

  const turnOn = () => setTorchMode('on');
  const lightsOn = () => setTorchMode('off');

  return (
    <>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`fixed inset-0 z-[45] h-full w-full pointer-events-none transition-opacity duration-1000 ${dark ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* flashlight cursor, rotated to face the beam (only while the torch is on) */}
      {mode === 'on' && (
        <div ref={lamp} className="fixed left-0 top-0 z-[210] pointer-events-none will-change-transform" aria-hidden="true">
          <div className={`transition-transform duration-150 ${pressed ? 'scale-90' : 'scale-100'}`}>
            <FlashlightCursor />
          </div>
        </div>
      )}

      {/* first-visit prompt */}
      <div
        className={`fixed inset-0 z-[46] grid place-items-center px-6 pointer-events-none transition-all duration-700 ${intro ? 'opacity-100' : 'opacity-0 scale-95'}`}
        aria-hidden={!intro}
      >
        <div className={`text-center max-w-md ${intro ? 'pointer-events-auto' : 'pointer-events-none'}`} role="dialog" aria-label="Turn on the torch">
          <button
            type="button"
            onClick={turnOn}
            aria-label="Turn on the torch"
            className="group relative mx-auto grid place-items-center w-20 h-20 rounded-full border border-primary-500/50 bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-on-primary transition-colors"
            tabIndex={intro ? 0 : -1}
          >
            <span className="absolute inset-0 rounded-full border border-primary-500/40 animate-ping" aria-hidden="true" />
            <Flashlight size={30} className="transition-transform group-hover:-rotate-12" />
          </button>
          <p className="mt-7 font-display text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-white">
            The lights are <span className="text-gradient">off.</span>
          </p>
          <p className="mt-3 text-white/55 leading-relaxed">Turn on the torch and move your mouse to explore my work.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={turnOn}
              tabIndex={intro ? 0 : -1}
              className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-medium text-on-primary hover:bg-primary-600 transition-colors"
            >
              <Flashlight size={15} /> Turn on torch
            </button>
            <button
              type="button"
              onClick={lightsOn}
              tabIndex={intro ? 0 : -1}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-5 py-3 text-sm text-white/70 hover:text-white transition-colors"
            >
              <Sun size={15} /> Switch the lights on
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
