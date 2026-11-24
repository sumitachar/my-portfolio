import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { personalInfo, stats } from '../../data/portfolio';
import SectionLabel from './SectionLabel';

const STATEMENT =
  'Your tech partner from idea to launch. I scope it, build it and ship it, then stay around to keep it fast and running.';


export default function About() {
  const root = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    if (prefersReducedMotion()) return;

    // words light up as the paragraph scrolls through the viewport
    gsap.fromTo(q('[data-word]'), { opacity: 0.12 }, {
      opacity: 1,
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: { trigger: q('[data-statement]')[0], start: 'top 80%', end: 'bottom 45%', scrub: true },
    });

    // counters
    q('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => { el.textContent = Math.round(obj.v); },
      });
    });

  }, { scope: root });

  return (
    <section ref={root} id="about" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="04" label="About" />

        <p data-statement className="font-display text-white text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.15] tracking-tight max-w-5xl">
          {STATEMENT.split(' ').map((w, i) => (
            <span key={i} data-word className="inline-block mr-[0.25em]">{w}</span>
          ))}
        </p>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 mt-20 md:mt-28">
          <p className="text-white/50 leading-relaxed text-lg">{personalInfo.bio}</p>

          <dl className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass-pearl rounded-3xl p-6 md:p-8">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">{s.label}</dt>
                <dd className="mt-3 font-display text-5xl md:text-6xl font-bold text-white">
                  <span data-count={s.value}>{s.value}</span>
                  <span className="text-gradient">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

      </div>
    </section>
  );
}
