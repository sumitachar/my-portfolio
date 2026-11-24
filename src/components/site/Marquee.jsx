import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { techStack } from '../../data/portfolio';

function Row({ items, reverse }) {
  return (
    <div data-row data-reverse={reverse || undefined} className="flex w-max">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 || undefined}>
          {items.map((t) => (
            <span key={`${copy}-${t.name}`} className="flex items-center gap-6 px-6 font-display text-4xl md:text-6xl font-medium tracking-[-0.03em] text-white/25 hover:text-white/70 transition-colors whitespace-nowrap">
              {t.name}
              <span className="text-primary-500/80 text-xl md:text-2xl">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Two infinite rows moving in opposite directions; scrolling speeds them up and flips direction. */
export default function Marquee() {
  const root = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const tweens = gsap.utils.toArray('[data-row]', root.current).map((row) =>
      gsap.fromTo(row, { xPercent: row.dataset.reverse ? -50 : 0 }, { xPercent: row.dataset.reverse ? 0 : -50, duration: 40, ease: 'none', repeat: -1 }),
    );
    ScrollTrigger.create({
      trigger: root.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
        tweens.forEach((t) => gsap.to(t, { timeScale: (self.direction || 1) * (1 + Math.abs(boost)), duration: 0.3, overwrite: true }));
        gsap.delayedCall(0.4, () => tweens.forEach((t) => gsap.to(t, { timeScale: self.direction || 1, duration: 1.2 })));
      },
    });
  }, { scope: root });

  const half = Math.ceil(techStack.length / 2);
  return (
    <section ref={root} className="relative py-16 md:py-24 overflow-hidden border-y border-[var(--line)]" aria-label="Technologies I work with">
      <Row items={techStack.slice(0, half)} />
      <div className="h-4 md:h-6" />
      <Row items={techStack.slice(half)} reverse />
    </section>
  );
}
