import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { experience } from '../../data/portfolio';
import SectionLabel from './SectionLabel';

export default function Experience() {
  const root = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    if (prefersReducedMotion()) return;

    // progress line fills as you scroll through the timeline
    gsap.fromTo(q('[data-progress]'), { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: q('[data-list]')[0], start: 'top 70%', end: 'bottom 60%', scrub: true },
    });

    q('[data-item]').forEach((item) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 75%' } });
      tl.from(item.querySelector('[data-dot]'), { scale: 0, duration: 0.5, ease: 'back.out(3)' })
        .from(item.querySelectorAll('[data-reveal]'), { y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, '-=0.2')
        .from(item.querySelectorAll('[data-chip]'), { y: 12, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }, '-=0.5');
    });
  }, { scope: root });

  return (
    <section ref={root} id="experience" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="05" label="Experience" />
        <h2 className="font-display text-white text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl mb-16 md:mb-24">
          Where I’ve been <span className="text-white/40">building.</span>
        </h2>

        <ol data-list className="relative">
          <span className="absolute left-[7px] md:left-[calc(25%+7px)] top-2 bottom-2 w-px bg-white/10" aria-hidden="true" />
          <span data-progress className="absolute left-[7px] md:left-[calc(25%+7px)] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-primary-500 via-accent to-sky-400" aria-hidden="true" />

          {experience.map((job) => (
            <li key={`${job.company}-${job.period}`} data-item className="relative grid md:grid-cols-[25%_1fr] gap-4 md:gap-12 pl-10 md:pl-0 pb-20 last:pb-0">
              <div data-reveal className="md:pr-12 md:text-right pt-0.5">
                <p className="font-mono text-sm text-white/50">{job.period}</p>
              </div>
              <span data-dot className="absolute left-0 md:left-[25%] top-1 w-[15px] h-[15px] rounded-full bg-[var(--color-surface)] border-2 border-primary-500 shadow-[0_0_0_6px_rgb(var(--primary-500)/0.15)]" />
              <div className="md:ml-12 glass-pearl rounded-3xl p-6 md:p-8">
                <h3 data-reveal className="font-display text-2xl md:text-4xl font-semibold text-white">{job.role}</h3>
                <p data-reveal className="mt-1 text-lg text-primary-400">{job.company}</p>
                <p data-reveal className="mt-5 max-w-2xl text-white/55 leading-relaxed">{job.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {job.highlights.map((h) => (
                    <li key={h} data-chip className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-xs text-white/70">{h}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
