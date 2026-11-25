import { useEffect, useRef, useState } from 'react';
import { Flashlight, Sun } from 'lucide-react';
import { getTorchMode, setTorchMode, torchSupported } from '../../lib/torch';

const RADIUS = 280; // px, lit circle when the torch is on
const GLIMMER = 70; // px, faint glow before the torch is switched on

/** Flashlight drawn in SVG, pointing up-left toward the beam. */
function FlashlightCursor() {
  return (
    <svg width="58" height="58" viewBox="0 0 46 46" fill="none" aria-hidden="true">
      <g transform="rotate(-45 23 23)">
        {/* lens glow */}
        <ellipse cx="23" cy="6" rx="8" ry="2.6" fill="rgb(var(--primary-500))" opacity="0.9" />
        {/* head */}
        <path d="M14 7 h18 l-4 9 h-10 z" fill="#2a2a2e" stroke="rgb(var(--primary-500))" strokeWidth="1.2" strokeLinejoin="round" />
        {/* body */}
        <rect x="18" y="16" width="10" height="24" rx="2.5" fill="#1d1d20" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        {/* switch */}
        <rect x="21.5" y="21" width="3" height="5" rx="1.2" fill="rgb(var(--primary-500))" />
      </g>
    </svg>
  );
}

/**
 * Whole-page torch. First visit starts with the lights off and a prompt; clicking it
 * switches the torch on (the beam opens from the click) and the cursor becomes a
 * flashlight. Navbar and chat stay above the darkness. Off on touch / reduced motion.
 */
export default function Torch({ ready }) {
  const el = useRef(null);
  const lamp = useRef(null);
  const radiusTarget = useRef(GLIMMER);
  const [supported] = useState(torchSupported);
  const [mode, setMode] = useState(getTorchMode);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const sync = (e) => setMode(e.detail.mode);
    window.addEventListener('torchchange', sync);
    return () => window.removeEventListener('torchchange', sync);
  }, []);

  // hide the native cursor + follower ring while the flashlight cursor is shown
  useEffect(() => {
    const on = supported && mode === 'on';
    document.documentElement.classList.toggle('torch-on', on);
    radiusTarget.current = on ? RADIUS : GLIMMER;
    return () => document.documentElement.classList.remove('torch-on');
  }, [supported, mode]);

  useEffect(() => {
    const node = el.current;
    if (!supported || mode === 'off' || !node) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y, r = GLIMMER, raf = 0;
    const t0 = performance.now();
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const tick = (now) => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      r += (radiusTarget.current - r) * 0.08; // beam opens smoothly when switched on
      const t = (now - t0) / 1000;
      const flicker = 1 + 0.018 * Math.sin(t * 7.3) + 0.008 * Math.sin(t * 17.1);
      node.style.setProperty('--tx', `${x}px`);
      node.style.setProperty('--ty', `${y}px`);
      node.style.setProperty('--tr', `${r * flicker}px`);
      if (lamp.current) lamp.current.style.transform = `translate3d(${tx + 6}px, ${ty + 6}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      cancelAnimationFrame(raf);
    };
  }, [supported, mode]);

  if (!supported) return null;
  const dark = mode !== 'off' && ready;
  const intro = mode === 'intro' && ready;

  const turnOn = () => setTorchMode('on');
  const lightsOn = () => setTorchMode('off');

  return (
    <>
      <div
        ref={el}
        aria-hidden="true"
        className={`fixed inset-0 z-[45] pointer-events-none transition-opacity duration-1000 ${dark ? 'opacity-100' : 'opacity-0'}`}
        style={{ '--tx': '50vw', '--ty': '50vh', '--tr': `${GLIMMER}px` }}
      >
        {/* darkness with a soft-edged hole around the cursor */}
        <div
          className="absolute inset-0"
          style={{
            background: mode === 'intro'
              ? 'radial-gradient(circle var(--tr) at var(--tx) var(--ty), rgb(0 0 0 / 0.55) 0%, rgb(0 0 0 / 0.96) 100%)'
              : 'radial-gradient(circle var(--tr) at var(--tx) var(--ty), transparent 0%, transparent 38%, rgb(0 0 0 / 0.55) 68%, rgb(0 0 0 / 0.9) 100%)',
          }}
        />
        {/* warm glow of the beam, tinted with the theme colour */}
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{ background: 'radial-gradient(circle calc(var(--tr) * 0.9) at var(--tx) var(--ty), rgb(var(--primary-500) / 0.08), transparent 70%)' }}
        />
      </div>

      {/* flashlight cursor (only while the torch is on) */}
      {mode === 'on' && (
        <div ref={lamp} className="fixed left-0 top-0 z-[210] pointer-events-none" aria-hidden="true">
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
