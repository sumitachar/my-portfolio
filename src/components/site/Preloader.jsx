import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';

/** Counter 0 → 100, then the panel slides away to reveal the site. Calls onDone when finished. */
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const [gone, setGone] = useState(false);

  useGSAP(() => {
    if (prefersReducedMotion()) { setGone(true); onDone(); return; }
    const counter = { v: 0 };
    const num = root.current.querySelector('[data-num]');
    const tl = gsap.timeline({ onComplete: () => { setGone(true); } });
    tl.to(counter, {
      v: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => { num.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
    })
      .to('[data-bar]', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
      .to('[data-word]', { yPercent: -100, duration: 0.5, ease: 'power3.in' }, '+=0.15')
      .add(() => onDone(), '-=0.1')
      .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.1');
  }, { scope: root });

  if (gone) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[150] bg-[var(--color-surface)] flex flex-col justify-between p-6 md:p-10">
      <div className="overflow-hidden">
        <p data-word className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">Sumit Achar · Portfolio</p>
      </div>
      <div className="flex items-end justify-between gap-6">
        <div className="overflow-hidden">
          <p data-word className="font-display text-white text-2xl md:text-4xl font-medium">Crafting interfaces…</p>
        </div>
        <div className="overflow-hidden">
          <span data-word data-num className="block font-display text-white text-7xl md:text-[10rem] leading-none font-bold tabular-nums">000</span>
        </div>
      </div>
      <div data-bar className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-primary-500 via-accent to-sky-400" />
    </div>
  );
}
