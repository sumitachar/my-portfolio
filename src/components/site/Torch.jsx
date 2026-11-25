import { useEffect, useRef, useState } from 'react';
import { Flashlight, Sun } from 'lucide-react';
import { getTorchMode, setTorchMode, torchSupported } from '../../lib/torch';

// geometry (px)
// lens → focus pool: scales with the screen (≈38% of its diagonal), 560–820px
const beamLengthFor = (w, h) => Math.min(820, Math.max(560, Math.hypot(w, h) * 0.38));
const BEAM_NEAR = 12;   // beam half-width at the lens
const FOCUS_R = 240;    // bright focus pool at the end of the beam
const THROW = 1.55;     // beam keeps going past the focus (× length), fading out
const NEAR_GLOW = 120;  // soft light around the torch itself
const GLIMMER = 70;     // faint glow before the torch is switched on
const FOLLOW = 0.2;     // how smoothly the torch glides after the cursor (lower = smoother)
const TURN = 0.06;      // how smoothly the beam turns toward the direction of travel
const DEADZONE = 14;    // px of movement needed before the beam re-aims (stops jitter)
// [width scale, strength]: wide faint layers outside, narrow strong ones inside → soft edges
const SOFT_LAYERS = Array.from({ length: 9 }, (_, i) => [1.36 - i * 0.07, 0.24]);

/** Flashlight cursor drawn horizontally, lens on the right. Lens centre = (50, 15). */
function FlashlightCursor() {
  return (
    <svg width="72" height="36" viewBox="0 0 60 30" fill="none" aria-hidden="true" style={{ position: 'absolute', left: -60, top: -18 }}>
      {/* body */}
      <rect x="4" y="10" width="30" height="10" rx="2.5" fill="#1d1d20" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      {[10, 16, 22].map((x) => <rect key={x} x={x} y="11.5" width="2" height="7" rx="1" fill="rgba(255,255,255,0.08)" />)}
      {/* switch */}
      <rect x="25" y="8" width="6" height="3" rx="1.2" fill="rgb(var(--primary-500))" />
      {/* head, widening toward the lens */}
      <path d="M34 10 L48 5 L48 25 L34 20 Z" fill="#2a2a2e" stroke="rgb(var(--primary-500))" strokeWidth="1.2" strokeLinejoin="round" />
      {/* glowing lens */}
      <ellipse cx="49.5" cy="15" rx="2.2" ry="10" fill="rgb(var(--primary-500))" />
    </svg>
  );
}

const readAccent = () =>
  (getComputedStyle(document.documentElement).getPropertyValue('--primary-500').trim() || '197 232 108').split(/\s+/).join(',');

/** Cone from the lens: narrow at the lens, widening to w1, with a rounded end. */
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
 * Whole-page torch. First visit starts with the lights off and a prompt. Once on, the
 * cursor becomes a flashlight that glides smoothly after the mouse; its beam points the
 * way you travel (heavily smoothed, with a dead-zone so it never jitters) and ends in a
 * bright focus pool. Double-click anywhere toggles it. Navbar and chat stay above the
 * darkness. Off on touch devices and for prefers-reduced-motion.
 */
export default function Torch({ ready }) {
  const canvas = useRef(null);
  const lamp = useRef(null);
  const dot = useRef(null);
  const [supported] = useState(torchSupported);
  const [mode, setMode] = useState(getTorchMode);
  const modeRef = useRef(mode);
  const [hint, setHint] = useState(false);
  const pointer = useRef(null); // last known pointer position, so the light starts where you are

  // double-click anywhere (outside text fields, buttons, links and dialogs) toggles the torch
  useEffect(() => {
    if (!supported) return;
    const onDbl = (e) => {
      if (e.target.closest?.('input, textarea, select, button, a, [contenteditable="true"], [role="dialog"]:not([data-torch-prompt])')) return;
      window.getSelection()?.removeAllRanges(); // a double-click also selects a word; clear it
      setTorchMode(modeRef.current === 'on' ? 'off' : 'on');
    };
    const track = (e) => { pointer.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('dblclick', onDbl);
    window.addEventListener('pointermove', track, { passive: true });
    window.addEventListener('pointerdown', track, { passive: true });
    return () => {
      window.removeEventListener('dblclick', onDbl);
      window.removeEventListener('pointermove', track);
      window.removeEventListener('pointerdown', track);
    };
  }, [supported]);

  // first time the torch turns on, briefly explain how to switch it off
  useEffect(() => {
    if (!supported || mode !== 'on') return;
    try { if (localStorage.getItem('torch-hint')) return; localStorage.setItem('torch-hint', '1'); } catch { return; }
    const show = setTimeout(() => setHint(true), 900);
    const hide = setTimeout(() => setHint(false), 5200);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [supported, mode]);

  useEffect(() => {
    const sync = (e) => setMode(e.detail.mode);
    window.addEventListener('torchchange', sync);
    return () => window.removeEventListener('torchchange', sync);
  }, []);

  // the flashlight replaces the cursor while the torch is on
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
    let w = 0, h = 0, beamLen = 600;
    const resize = () => { w = cv.width = window.innerWidth; h = cv.height = window.innerHeight; beamLen = beamLengthFor(w, h); };
    resize();

    let accent = readAccent();
    const onPalette = () => setTimeout(() => { accent = readAccent(); }, 2100); // after the 2s theme blend
    let tx = pointer.current?.x ?? w / 2, ty = pointer.current?.y ?? h * 0.5; // real cursor
    let x = tx, y = ty;             // smoothed torch position
    let ax = tx, ay = ty;           // anchor for measuring the direction of travel
    let angle = -Math.PI / 4, target = angle; // start pointing up-right
    let open = 0;                   // beam grows from the lens (0) to full length (1)
    let press = 0, pressTarget = 0;
    let raf = 0;
    const t0 = performance.now();

    // pointer position only changes when the pointer moves; scrolling (incl. two-finger
    // trackpad scroll) leaves it where it is, so the light stays steady
    const move = (e) => {
      tx = e.clientX; ty = e.clientY;
      const mx = tx - ax, my = ty - ay;
      if (mx * mx + my * my > DEADZONE * DEADZONE) {
        target = Math.atan2(my, mx);
        ax = tx; ay = ty;
      }
    };
    const down = () => { pressTarget = 1; };
    const up = () => { pressTarget = 0; };

    const tick = (now) => {
      const on = modeRef.current === 'on';
      x += (tx - x) * FOLLOW;
      y += (ty - y) * FOLLOW;
      let diff = target - angle;                      // shortest way round
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      angle += diff * TURN;
      open += ((on ? 1 : 0) - open) * 0.06;
      press += (pressTarget - press) * 0.25;
      const t = (now - t0) / 1000;
      const flicker = 1 + 0.015 * Math.sin(t * 7.3) + 0.007 * Math.sin(t * 17.1);

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(0,0,0,${on ? 0.9 : 0.95})`;
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'destination-out';

      // soft light around the torch (or a faint glimmer before it is switched on)
      const nearR = (on ? NEAR_GLOW * (0.5 + 0.5 * open) : GLIMMER) * flicker;
      const g0 = ctx.createRadialGradient(x, y, 0, x, y, nearR);
      g0.addColorStop(0, `rgba(0,0,0,${on ? 0.8 : 0.5})`);
      g0.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g0;
      ctx.fillRect(x - nearR, y - nearR, nearR * 2, nearR * 2);

      if (open > 0.02) {
        const len = beamLen * open * flicker;         // lens → focus
        const throwLen = len * THROW;                 // continues past the focus, fading
        const fp = 1 / THROW;                         // focus position along the beam (0–1)
        const focusR = FOCUS_R * (0.35 + 0.65 * open) * (1 + 0.08 * press) * flicker;
        const w1 = focusR * 0.72;
        const wEnd = w1 * (1 + (THROW - 1) * 0.9);

        SOFT_LAYERS.forEach(([k, m]) => {
          const { fx, fy } = beamPath(ctx, x, y, angle, throwLen, BEAM_NEAR * k, wEnd * k);
          const g = ctx.createLinearGradient(x, y, fx, fy);
          g.addColorStop(0, `rgba(0,0,0,${0.5 * m})`);
          g.addColorStop(fp * 0.5, `rgba(0,0,0,${0.78 * m})`);
          g.addColorStop(fp, `rgba(0,0,0,${0.95 * m})`);
          g.addColorStop(fp + (1 - fp) * 0.55, `rgba(0,0,0,${0.45 * m})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fill();
        });

        // focus pool where the beam lands
        const fx = x + Math.cos(angle) * len, fy = y + Math.sin(angle) * len;
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, focusR);
        fg.addColorStop(0, 'rgba(0,0,0,1)');
        fg.addColorStop(0.45, 'rgba(0,0,0,0.95)');
        fg.addColorStop(0.75, 'rgba(0,0,0,0.5)');
        fg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = fg;
        ctx.fillRect(fx - focusR, fy - focusR, focusR * 2, focusR * 2);

        // warm tint in the theme colour
        ctx.globalCompositeOperation = 'source-over';
        const { fx: ex, fy: ey } = beamPath(ctx, x, y, angle, throwLen, BEAM_NEAR, wEnd);
        const tint = ctx.createLinearGradient(x, y, ex, ey);
        tint.addColorStop(0, `rgba(${accent},0.1)`);
        tint.addColorStop(fp, `rgba(${accent},0.04)`);
        tint.addColorStop(1, `rgba(${accent},0)`);
        ctx.fillStyle = tint;
        ctx.fill();
        const ft = ctx.createRadialGradient(fx, fy, 0, fx, fy, focusR);
        ft.addColorStop(0, `rgba(${accent},${0.07 + 0.05 * press})`);
        ft.addColorStop(1, `rgba(${accent},0)`);
        ctx.fillStyle = ft;
        ctx.fillRect(fx - focusR, fy - focusR, focusR * 2, focusR * 2);
      }

      if (lamp.current) lamp.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad) scale(${1 - 0.1 * press})`;
      if (dot.current) dot.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
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
  const on = mode === 'on' && ready;

  const turnOn = () => setTorchMode('on');
  const lightsOn = () => setTorchMode('off');

  return (
    <>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`fixed inset-0 z-[45] h-full w-full pointer-events-none transition-opacity duration-1000 ${dark ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* flashlight cursor: glides after the mouse and turns with the beam */}
      <div
        ref={lamp}
        className={`fixed left-0 top-0 z-[210] pointer-events-none will-change-transform transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      >
        <FlashlightCursor />
      </div>
      {/* precise pointer dot, so clicking stays accurate */}
      <div
        ref={dot}
        className={`fixed left-0 top-0 z-[211] pointer-events-none transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      >
        <span className="absolute -left-[3px] -top-[3px] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.6)]" />
      </div>

      {/* one-time hint after switching on */}
      <div
        role="status"
        className={`fixed left-1/2 top-24 z-[47] -translate-x-1/2 pointer-events-none rounded-full border border-[var(--line-strong)] bg-black/75 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/75 shadow-xl backdrop-blur transition-all duration-500 ${hint ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      >
        <span className="text-primary-400">Tip</span> · double-click anywhere to switch the torch off
      </div>

      {/* first-visit prompt */}
      <div
        className={`fixed inset-0 z-[46] grid place-items-center px-6 pointer-events-none transition-all duration-700 ${intro ? 'opacity-100' : 'opacity-0 scale-95'}`}
        aria-hidden={!intro}
      >
        <div data-torch-prompt className={`text-center max-w-md ${intro ? 'pointer-events-auto' : 'pointer-events-none'}`} role="dialog" aria-label="Turn on the torch">
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
          <p className="mt-3 text-white/55 leading-relaxed">
            Turn on the torch and move your mouse to explore my work.<br />
            <span className="text-white/40">Tip: double-click anywhere to switch it on or off.</span>
          </p>
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
