import { useEffect, useRef, useState } from 'react';
import { getTorch, torchSupported } from '../../lib/torch';

const RADIUS = 280; // px, size of the lit circle

/**
 * Whole-page torch: the site sits in darkness and a soft, slightly flickering circle of
 * light follows the cursor. Sits below the navbar and chat button so they stay usable.
 * Off on touch devices and for prefers-reduced-motion.
 */
export default function Torch({ ready }) {
  const el = useRef(null);
  const [supported] = useState(torchSupported);
  const [on, setOn] = useState(getTorch);

  useEffect(() => {
    const sync = (e) => setOn(e.detail);
    window.addEventListener('torchchange', sync);
    return () => window.removeEventListener('torchchange', sync);
  }, []);

  useEffect(() => {
    const node = el.current;
    if (!supported || !on || !node) return;
    let x = window.innerWidth / 2, y = window.innerHeight * 0.4;
    let tx = x, ty = y, raf = 0, t0 = performance.now();
    const move = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = (now) => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      // gentle torch flicker: two slow sines, about ±2.5% of the radius
      const t = (now - t0) / 1000;
      const r = RADIUS * (1 + 0.018 * Math.sin(t * 7.3) + 0.008 * Math.sin(t * 17.1));
      node.style.setProperty('--tx', `${x}px`);
      node.style.setProperty('--ty', `${y}px`);
      node.style.setProperty('--tr', `${r}px`);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, [supported, on]);

  if (!supported) return null;
  const visible = on && ready;

  return (
    <div
      ref={el}
      aria-hidden="true"
      className={`fixed inset-0 z-[45] pointer-events-none transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ '--tx': '50vw', '--ty': '40vh', '--tr': `${RADIUS}px` }}
    >
      {/* darkness with a soft-edged hole around the cursor */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle var(--tr) at var(--tx) var(--ty), transparent 0%, transparent 38%, rgb(0 0 0 / 0.55) 68%, rgb(0 0 0 / 0.9) 100%)',
        }}
      />
      {/* warm glow of the beam, tinted with the theme colour */}
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{ background: 'radial-gradient(circle calc(var(--tr) * 0.9) at var(--tx) var(--ty), rgb(var(--primary-500) / 0.07), transparent 70%)' }}
      />
    </div>
  );
}
