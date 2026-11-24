import { useRef, useState } from 'react';
import { Globe, Rocket, Smartphone, ShoppingBag, BarChart3, Building2, ShieldCheck, Wrench, ArrowUpRight, Plus } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { services } from '../../data/portfolio';
import SectionLabel from './SectionLabel';
import Magnetic from './Magnetic';
import { openAssistant } from '../../lib/assistant';

const ICONS = [Globe, Rocket, Smartphone, ShoppingBag, BarChart3, Building2, ShieldCheck, Wrench];

/** Sticky heading + large interactive rows that expand on hover (desktop) or tap (touch). */
export default function Services() {
  const root = useRef(null);
  const [open, setOpen] = useState(0);
  const hover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap.from(q('[data-service]'), {
      y: 50, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out',
      scrollTrigger: { trigger: q('[data-list]')[0], start: 'top 80%' },
    });
  }, { scope: root });

  return (
    <section ref={root} id="services" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1.4fr] gap-12 lg:gap-20">
        <div>
          <div className="lg:sticky lg:top-32">
            <SectionLabel index="01" label="Services" />
            <h2 className="font-display text-white text-5xl md:text-6xl xl:text-7xl font-semibold tracking-[-0.045em] leading-[0.92]">
              What I can <span className="text-gradient">build</span> for you.
            </h2>
            <p className="mt-6 text-white/55 max-w-sm leading-relaxed">
              One point of contact from idea to launch. I lead the build and bring in trusted developers and designers when your project needs them.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <button
                  onClick={() => openAssistant('project')}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3.5 text-sm font-medium text-on-primary hover:bg-primary-600 transition-colors"
                >
                  Get a free project estimate
                  <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
                </button>
              </Magnetic>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Reply within 24h</span>
            </div>
          </div>
        </div>

        <ul data-list className="border-t border-[var(--line)]">
          {services.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            const active = open === i;
            return (
              <li
                key={s.title}
                data-service
                onMouseEnter={() => hover && setOpen(i)}
                className="relative border-b border-[var(--line)]"
              >
                {/* accent bar that grows on the active row */}
                <span className={`absolute left-0 top-0 h-full w-[2px] origin-top bg-primary-500 transition-transform duration-500 ${active ? 'scale-y-100' : 'scale-y-0'}`} aria-hidden="true" />
                <button
                  onClick={() => setOpen(active && !hover ? -1 : i)}
                  aria-expanded={active}
                  className="w-full grid grid-cols-[44px_1fr_auto] items-center gap-4 py-6 md:py-7 pl-5 text-left"
                >
                  <span className={`font-mono text-xs transition-colors ${active ? 'text-primary-400' : 'text-white/35'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={`font-display text-2xl md:text-[2.1rem] font-semibold tracking-[-0.03em] leading-tight transition-all duration-500 ${active ? 'text-white translate-x-1' : 'text-white/55'}`}>
                    {s.title}
                  </span>
                  <span className={`grid place-items-center w-10 h-10 rounded-full border transition-all duration-500 ${active ? 'rotate-45 bg-primary-500 border-primary-500 text-on-primary' : 'border-[var(--line)] text-white/50'}`}>
                    <Plus size={17} />
                  </span>
                </button>
                {/* smooth height via the grid 0fr → 1fr trick */}
                <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="grid sm:grid-cols-[44px_1fr] gap-4 pl-5 pr-14 pb-8">
                      <span className="hidden sm:grid place-items-center w-9 h-9 rounded-xl bg-primary-500/10 text-primary-400"><Icon size={17} /></span>
                      <div>
                        <p className="text-white/65 leading-relaxed md:text-lg max-w-xl">{s.text}</p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {s.tags.map((t) => (
                            <li key={t} className="rounded-full border border-[var(--line-strong)] px-3 py-1 font-mono text-[11px] text-white/70">{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
