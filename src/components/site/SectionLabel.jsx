import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { scramble } from '../../lib/scramble';

/** "01 — About" eyebrow: the line draws in and the label decodes from glyphs on first view. */
export default function SectionLabel({ index, label, className = '' }) {
  const ref = useRef(null);
  const text = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(ref.current.querySelector('[data-rule]'), {
      scaleX: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: ref.current, start: 'top 90%' },
    });
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        text.current.textContent = '';
        scramble(text.current, label, { speed: 1.4 });
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={`flex items-center gap-4 mb-12 md:mb-16 font-mono text-xs uppercase tracking-[0.25em] text-white/50 ${className}`}>
      <span className="text-primary-400">{index}</span>
      <span data-rule className="h-px w-16 origin-left bg-white/30" />
      <span ref={text} aria-label={label}>{label}</span>
    </div>
  );
}
