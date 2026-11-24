import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { skills } from '../../data/portfolio';
import SectionLabel from './SectionLabel';

export default function Skills() {
  const root = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);

    // spotlight follows the cursor inside each card
    q('.spotlight').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    if (prefersReducedMotion()) return;
    gsap.from(q('[data-skill]'), {
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: { each: 0.06, from: 'start' },
      ease: 'expo.out',
      scrollTrigger: { trigger: q('[data-grid]')[0], start: 'top 80%' },
    });
    q('[data-level]').forEach((bar) => {
      gsap.fromTo(bar, { scaleX: 0 }, {
        scaleX: Number(bar.dataset.level) / 100,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: bar, start: 'top 90%' },
      });
    });
  }, { scope: root });

  return (
    <section ref={root} id="skills" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="06" label="Skills" />
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <h2 className="font-display text-white text-4xl md:text-6xl font-semibold tracking-tight max-w-2xl">
            Tools I use to <span className="text-gradient">ship</span> great products.
          </h2>
          <p className="text-white/50 max-w-sm">From the interface your customers see to the APIs and database behind it, I work across the full stack.</p>
        </div>

        <div data-grid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s, i) => (
            <div key={s.name} data-skill className="glass-pearl spotlight rounded-3xl p-6 md:p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-white/30">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-mono text-sm text-white/60">{s.level}%</span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold text-white">{s.name}</h3>
              <div className="mt-5 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div data-level={s.level} className="h-full origin-left rounded-full bg-gradient-to-r from-primary-500 via-accent to-sky-400" style={{ transform: `scaleX(${s.level / 100})` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
