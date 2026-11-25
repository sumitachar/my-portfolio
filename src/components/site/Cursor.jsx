import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';

/**
 * Subtle follower ring that sits around the native cursor (which stays visible, so
 * clicking is always precise). It grows softly over links/buttons and shows a small
 * pill label over elements with [data-cursor="Label"]. Desktop (fine pointer) only.
 */
export default function Cursor() {
  const ring = useRef(null);
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const el = ring.current;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const rx = gsap.quickTo(el, 'x', { duration: 0.25, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'y', { duration: 0.25, ease: 'power3.out' });
    let hoverScale = 1;

    const move = (e) => { rx(e.clientX); ry(e.clientY); gsap.to(el, { opacity: 1, duration: 0.2, overwrite: 'auto' }); };
    const over = (e) => {
      const labelled = e.target.closest('[data-cursor]');
      const interactive = e.target.closest('a, button, input, textarea, select, [role="button"]');
      const text = labelled?.dataset.cursor || '';
      setLabel(text);
      hoverScale = text ? 1 : interactive ? 1.5 : 1;
      gsap.to(el, { scale: hoverScale, duration: 0.3, ease: 'power3.out' });
    };
    const down = () => gsap.to(el, { scale: hoverScale * 0.85, duration: 0.12 });
    const up = () => gsap.to(el, { scale: hoverScale, duration: 0.2 });
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 });

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <div
      ref={ring}
      data-cursor-ring
      aria-hidden="true"
      className={`${enabled ? '' : 'hidden'} fixed top-0 left-0 z-[200] pointer-events-none flex items-center justify-center transition-[width,height,border-radius,background-color] duration-300 ${
        label
          ? 'h-8 px-3 rounded-full bg-white text-black'
          : 'w-8 h-8 rounded-full border border-white/40'
      }`}
    >
      {label && <span className="text-[11px] font-medium uppercase tracking-wider whitespace-nowrap">{label}</span>}
    </div>
  );
}
