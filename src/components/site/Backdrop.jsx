import { useEffect, useRef } from 'react';

/**
 * Calm ambient background: a hairline grid that fades out from the top, one soft
 * accent glow behind the hero, and a faint light that eases after the cursor.
 * No WebGL and no constant motion, so it stays easy on the eyes while reading.
 */
export default function Backdrop() {
  const light = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = light.current;
    if (!fine || reduced || !el) return;

    let x = window.innerWidth / 2, y = window.innerHeight / 3;
    let tx = x, ty = y, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate3d(${x - 400}px, ${y - 400}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 backdrop-grid" />
      {/* soft accent glow behind the hero */}
      <div className="absolute left-1/2 -top-[30vh] -translate-x-1/2 w-[90vw] max-w-[1100px] h-[70vh] rounded-full bg-primary-500/[0.07] blur-[120px]" />
      {/* cursor light */}
      <div
        ref={light}
        className="absolute left-0 top-0 w-[800px] h-[800px] rounded-full opacity-0 transition-opacity duration-700"
        style={{ background: 'radial-gradient(circle, rgb(var(--primary-500) / 0.06), transparent 60%)' }}
      />
    </div>
  );
}
