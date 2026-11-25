import { useEffect, useRef, useState } from 'react';
import { Flashlight, Sun } from 'lucide-react';
import { getTorchMode, setTorchMode, torchSupported } from '../../lib/torch';

// geometry (px)
const TORCH_LEN = 112;  // handle end → lens
const BEAM_NEAR = 16;   // beam half-width at the lens
const FOCUS_R = 170;    // round focus light at the cursor
const GLIMMER = 70;     // faint glow before the torch is switched on
const FOLLOW = 0.2;     // how quickly the light catches up with the cursor (0–1)
// [width scale, strength]: wide faint layers outside, narrow strong ones inside → soft edges
const SOFT_LAYERS = Array.from({ length: 9 }, (_, i) => [1.36 - i * 0.07, 0.24]);

/** Hand-held torch, drawn horizontally: handle at x=0, lens at x=112. */
function HeldTorch() {
  return (
    <svg width="124" height="52" viewBox="0 0 124 52" fill="none" aria-hidden="true" style={{ position: 'absolute', left: 0, top: -26 }}>
      {/* handle */}
      <rect x="2" y="17" width="66" height="18" rx="5" fill="#1b1b1e" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />
      {[14, 24, 34, 44].map((x) => <rect key={x} x={x} y="19" width="3" height="14" rx="1.5" fill="rgba(255,255,255,0.08)" />)}
      {/* switch */}
      <rect x="50" y="13" width="10" height="5" rx="2" fill="rgb(var(--primary-500))" />
      {/* head, widening toward the lens */}
      <path d="M68 16 L106 6 L106 46 L68 36 Z" fill="#26262a" stroke="rgb(var(--primary-500))" strokeWidth="1.4" strokeLinejoin="round" />
      {/* glowing lens */}
      <ellipse cx="109" cy="26" rx="4" ry="20" fill="rgb(var(--primary-500))" />
    </svg>
  );
}

const readAccent = () =>
  (getComputedStyle(document.documentElement).getPropertyValue('--primary-500').trim() || '197 232 108').split(/\s+/).join(',');

/** Cone from the lens to the focus point: narrow at the lens, as wide as the focus light at the end. */
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
  return { fx, fy };
}

/**
 * Whole-page torch. First visit starts with the lights off and a prompt. Once on, a torch
 * held at the bottom of the screen always aims its beam at the cursor and makes a round
 * focus light there, so steering is as easy as pointing. The light is drawn on a fixed
 * layer, so two-finger trackpad scrolling keeps it steady under the cursor.
 * Navbar and chat stay above the darkness. Off on touch devices and for reduced motion.
 */
export default function Torch({ ready }) {
  const canvas = useRef(null);
  const lamp = useRef(null);
  const [supported] = useState(torchSupported);
  const [mode, setMode] = useState(getTorchMode);
  const modeRef = useRef(mode);

  useEffect(() => {
    const sync = (e) => setMode(e.detail.mode);
    window.addEventListener('torchchange', sync);
    return () => window.removeEventListener('torchchange', sync);
  }, []);

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
    let tx = w / 2, ty = h * 0.4;   // cursor
    let x = tx, y = ty;             // smoothed focus point
    let open = 0;                   // beam grows from the lens (0) to the cursor (1)
    let press = 0, pressTarget = 0;
    let raf = 0;
    const t0 = performance.now();

    // pointer position only changes when the pointer moves; scrolling (incl. two-finger
    // trackpad scroll) leaves it where it is, so the light stays steady under the cursor
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const down = () => { pressTarget = 1; };
    const up = () => { pressTarget = 0; };

    const tick = (now) => {
      const on = modeRef.current === 'on';
      x += (tx - x) * FOLLOW;
      y += (ty - y) * FOLLOW;
      open += ((on ? 1 : 0) - open) * 0.06;
      press += (pressTarget - press) * 0.25;
      const t = (now - t0) / 1000;
      const flicker = 1 + 0.015 * Math.sin(t * 7.3) + 0.007 * Math.sin(t * 17.1);

      // torch held at the bottom centre, pointing at the focus point
      const bx = w / 2, by = h + 24;
      const a = Math.atan2(y - by, x - bx);
      const lx = bx + Math.cos(a) * TORCH_LEN, ly = by + Math.sin(a) * TORCH_LEN;
      const dist = Math.hypot(x - lx, y - ly);
      const focusR = FOCUS_R * (0.35 + 0.65 * open) * (1 + 0.08 * press) * flicker;

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(0,0,0,${on ? 0.9 : 0.95})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'destination-out';

      if (open < 0.02) {
        // before the torch is on: a faint glimmer around the cursor
        const g = ctx.createRadialGradient(x, y, 0, x, y, GLIMMER);
        g.addColorStop(0, 'rgba(0,0,0,0.5)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - GLIMMER, y - GLIMMER, GLIMMER * 2, GLIMMER * 2);
      } else {
        const len = dist * open;
        const w1 = focusR * 0.72;
        // beam: many thin layered cones for smooth soft edges
        if (len > 4) {
          SOFT_LAYERS.forEach(([k, m]) => {
            const { fx, fy } = beamPath(ctx, lx, ly, a, len, BEAM_NEAR * k, w1 * k);
            const g = ctx.createLinearGradient(lx, ly, fx, fy);
            g.addColorStop(0, `rgba(0,0,0,${0.45 * m})`);
            g.addColorStop(0.5, `rgba(0,0,0,${0.7 * m})`);
            g.addColorStop(1, `rgba(0,0,0,${0.9 * m})`);
            ctx.fillStyle = g;
            ctx.fill();
          });
        }
        // focus light: bright round pool where the beam lands
        const fx = lx + Math.cos(a) * len, fy = ly + Math.sin(a) * len;
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, focusR);
        fg.addColorStop(0, 'rgba(0,0,0,1)');
        fg.addColorStop(0.45, 'rgba(0,0,0,0.95)');
        fg.addColorStop(0.75, 'rgba(0,0,0,0.5)');
        fg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fg;
        ctx.fillRect(fx - focusR, fy - focusR, focusR * 2, focusR * 2);

        // warm tint in the theme colour
        ctx.globalCompositeOperation = 'source-over';
        if (len > 4) {
          const { fx: ex, fy: ey } = beamPath(ctx, lx, ly, a, len, BEAM_NEAR, w1);
          const tint = ctx.createLinearGradient(lx, ly, ex, ey);
          tint.addColorStop(0, `rgba(${accent},0.1)`);
          tint.addColorStop(1, `rgba(${accent},0.02)`);
          ctx.fillStyle = tint;
          ctx.fill();
        }
        const ft = ctx.createRadialGradient(fx, fy, 0, fx, fy, focusR);
        ft.addColorStop(0, `rgba(${accent},${0.07 + 0.05 * press})`);
        ft.addColorStop(1, `rgba(${accent},0)`);
        ctx.fillStyle = ft;
        ctx.fillRect(fx - focusR, fy - focusR, focusR * 2, focusR * 2);
      }

      if (lamp.current) lamp.current.style.transform = `translate3d(${bx}px, ${by}px, 0) rotate(${a}rad)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('palettechange', onPalette);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
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

      {/* the torch itself, held at the bottom of the screen and aimed at the cursor */}
      <div
        ref={lamp}
        className={`fixed left-0 top-0 z-[46] pointer-events-none will-change-transform transition-opacity duration-700 ${mode === 'on' && ready ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      >
        <HeldTorch />
      </div>

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
          <p className="mt-3 text-white/55 leading-relaxed">Turn on the torch and point anywhere to explore my work.</p>
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
