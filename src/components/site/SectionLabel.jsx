import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';

/** "01 — About" style eyebrow with a line that draws in. */
export default function SectionLabel({ index, label, className = '' }) {
  const ref = useRef(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(ref.current.querySelector('[data-rule]'), {
      scaleX: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: ref.current, start: 'top 90%' },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={`flex items-center gap-4 mb-12 md:mb-16 font-mono text-xs uppercase tracking-[0.25em] text-white/50 ${className}`}>
      <span className="text-primary-400">{index}</span>
      <span data-rule className="h-px w-16 origin-left bg-white/30" />
      <span>{label}</span>
    </div>
  );
}
