import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { stackLayers } from '../../data/portfolio';
import SectionLabel from './SectionLabel';

/** The stack as layers (frontend → craft) in large type, instead of skill-percentage bars. */
export default function Skills() {
  const root = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    q('[data-layer]').forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 82%' } });
      tl.from(row.querySelector('[data-rule]'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' })
        .from(row.querySelectorAll('[data-meta]'), { y: 20, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.2)
        .from(row.querySelectorAll('[data-item]'), { yPercent: 110, duration: 0.9, stagger: 0.04, ease: 'expo.out' }, 0.25);
    });
  }, { scope: root });

  return (
    <section ref={root} id="skills" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="06" label="Stack" />
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16 md:mb-20">
          <h2 className="font-display text-white text-5xl md:text-7xl font-semibold tracking-[-0.045em] leading-[0.92] max-w-3xl">
            The stack behind <span className="text-gradient">every build.</span>
          </h2>
          <p className="text-white/50 max-w-sm leading-relaxed">From the interface your customers see to the APIs and database behind it, I work across the full stack.</p>
        </div>

        <div>
          {stackLayers.map((l, i) => (
            <div key={l.layer} data-layer className="relative grid md:grid-cols-[260px_1fr] gap-4 md:gap-12 py-8 md:py-10">
              <span data-rule className="absolute left-0 right-0 top-0 h-px origin-left bg-[var(--line-strong)]" aria-hidden="true" />
              <div>
                <p data-meta className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-400">{String(i + 1).padStart(2, '0')} · {l.layer}</p>
                <p data-meta className="mt-2 text-sm text-white/45">{l.note}</p>
              </div>
              <ul className="flex flex-wrap gap-x-3 gap-y-1">
                {l.items.map((item, j) => (
                  <li key={item} className="overflow-hidden pb-1">
                    <span
                      data-item
                      className="group inline-flex items-baseline font-display text-2xl sm:text-3xl md:text-5xl font-medium tracking-[-0.035em] text-white/85 hover:text-primary-400 transition-colors cursor-default"
                    >
                      {item}
                      {j < l.items.length - 1 && <span className="ml-3 text-white/15 font-light">/</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <span className="block h-px bg-[var(--line-strong)]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
