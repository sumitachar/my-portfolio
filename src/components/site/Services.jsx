import { useEffect, useRef, useState } from 'react';
import { Globe, Rocket, Smartphone, ShoppingBag, BarChart3, Building2, ShieldCheck, Wrench, ArrowUpRight, Plus } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { scramble } from '../../lib/scramble';
import { drawIcon } from '../../lib/draw';
import { services } from '../../data/portfolio';
import SectionLabel from './SectionLabel';
import Magnetic from './Magnetic';
import { openAssistant } from '../../lib/assistant';

const ICONS = [Globe, Rocket, Smartphone, ShoppingBag, BarChart3, Building2, ShieldCheck, Wrench];
const pad = (n) => String(n).padStart(2, '0');
const RING = 2 * Math.PI * 62; // circumference of the progress ring

/** Sticky heading + live service display; large rows that expand on hover (desktop) or tap (touch). */
export default function Services() {
  const root = useRef(null);
  const [open, setOpen] = useState(0);
  const [hover] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches);
  const shown = Math.max(open, 0);
  const ShownIcon = ICONS[shown % ICONS.length];

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);

    // heading words rise; the accent word decodes
    gsap.from(q('[data-head] .split-inner'), {
      yPercent: 115, duration: 1.1, stagger: 0.06, ease: 'expo.out',
      scrollTrigger: {
        trigger: q('[data-head]')[0], start: 'top 85%',
        onEnter: () => { const el = q('[data-accent]')[0]; scramble(el, el.dataset.text, { speed: 0.9 }); },
      },
    });

    // rows rise in and their divider lines draw across
    const list = q('[data-list]')[0];
    gsap.from(q('[data-service]'), { y: 50, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: list, start: 'top 80%' } });
    gsap.fromTo(q('[data-rule]'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.07, ease: 'expo.inOut', scrollTrigger: { trigger: list, start: 'top 80%' } });

    // live display pops in
    gsap.from(q('[data-display]'), { y: 30, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: q('[data-display]')[0], start: 'top 90%' } });
  }, { scope: root });

  // whenever the active service changes: redraw icons, decode numbers, pop the tags
  useEffect(() => {
    if (open < 0 || prefersReducedMotion()) return;
    const el = root.current;
    const row = el.querySelector(`[data-service][data-index="${open}"]`);
    drawIcon(el.querySelector('[data-display-icon] svg'), { duration: 1.2 });
    drawIcon(row?.querySelector('[data-row-icon] svg'), { duration: 0.9, delay: 0.15 });
    const num = row?.querySelector('[data-num]');
    if (num) scramble(num, num.dataset.text, { speed: 1.6 });
    const count = el.querySelector('[data-count]');
    if (count) scramble(count, pad(open + 1), { speed: 1.2 });
    const tags = row?.querySelectorAll('[data-tag]');
    if (tags?.length) gsap.fromTo(tags, { y: 12, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, delay: 0.2, ease: 'back.out(2)', overwrite: true });
  }, [open]);

  return (
    <section ref={root} id="services" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1.4fr] gap-12 lg:gap-20">
        <div>
          <div className="lg:sticky lg:top-32">
            <SectionLabel index="01" label="Services" />
            <h2 data-head className="font-display text-white text-5xl md:text-6xl xl:text-7xl font-semibold tracking-[-0.045em] leading-[0.92]">
              {['What', 'I', 'can'].map((w) => (
                <span key={w} className="split-mask mr-[0.22em]"><span className="split-inner">{w}</span></span>
              ))}
              <span className="split-mask mr-[0.22em]"><span data-accent data-text="build" className="split-inner text-gradient">build</span></span>
              {['for', 'you.'].map((w) => (
                <span key={w} className="split-mask mr-[0.22em]"><span className="split-inner">{w}</span></span>
              ))}
            </h2>
            <p className="mt-6 text-white/55 max-w-sm leading-relaxed">
              One point of contact from idea to launch. I lead the build and bring in trusted developers and designers when your project needs them.
            </p>

            {/* live display of the active service (desktop) */}
            <div data-display className="hidden lg:flex items-center gap-7 mt-10" aria-hidden="true">
              <div className="relative grid place-items-center w-36 h-36">
                <svg viewBox="0 0 140 140" className="absolute inset-0 -rotate-90">
                  <circle cx="70" cy="70" r="62" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
                  <circle
                    cx="70" cy="70" r="62" fill="none" stroke="rgb(var(--primary-500))" strokeWidth="2.5" strokeLinecap="round"
                    strokeDasharray={RING}
                    strokeDashoffset={RING * (1 - (shown + 1) / services.length)}
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(.22,1,.36,1)' }}
                  />
                </svg>
                <span className="absolute inset-4 rounded-full bg-primary-500/[0.07] blur-md" />
                <span data-display-icon key={shown} className="relative text-primary-400">
                  <ShownIcon size={46} strokeWidth={1.4} />
                </span>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Service</p>
                <p className="mt-1 font-display text-6xl font-semibold leading-none tabular-nums text-white">
                  <span data-count>{pad(shown + 1)}</span>
                  <span className="text-2xl text-white/30"> / {pad(services.length)}</span>
                </p>
                <p className="mt-2 max-w-[14rem] text-sm text-white/50 leading-snug">{services[shown].title}</p>
              </div>
            </div>

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

        <ul data-list className="relative">
          <span data-rule className="absolute left-0 right-0 top-0 h-px origin-left bg-[var(--line)]" aria-hidden="true" />
          {services.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            const active = open === i;
            return (
              <li
                key={s.title}
                data-service
                data-index={i}
                data-active={active}
                onMouseEnter={() => hover && setOpen(i)}
                className="group relative overflow-hidden"
              >
                {/* soft wash that sweeps across the active row */}
                <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-primary-500/[0.08] via-primary-500/[0.03] to-transparent transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-data-[active=true]:scale-x-100" aria-hidden="true" />
                {/* accent bar */}
                <span className="absolute left-0 top-0 h-full w-[2px] origin-top scale-y-0 bg-primary-500 transition-transform duration-500 group-data-[active=true]:scale-y-100" aria-hidden="true" />
                {/* divider that draws in */}
                <span data-rule className="absolute left-0 right-0 bottom-0 h-px origin-left bg-[var(--line)]" aria-hidden="true" />

                <button
                  onClick={() => setOpen(active && !hover ? -1 : i)}
                  aria-expanded={active}
                  className="relative w-full grid grid-cols-[44px_1fr_auto] items-center gap-4 py-6 md:py-7 pl-5 text-left"
                >
                  <span data-num data-text={pad(i + 1)} className="font-mono text-xs text-white/35 transition-colors group-data-[active=true]:text-primary-400">{pad(i + 1)}</span>
                  <span className="font-display text-2xl md:text-[2.1rem] font-semibold tracking-[-0.03em] leading-tight text-white/55 transition-all duration-500 group-hover:text-white/80 group-data-[active=true]:text-white group-data-[active=true]:translate-x-1.5">
                    {s.title}
                  </span>
                  <span className="grid place-items-center w-10 h-10 rounded-full border border-[var(--line)] text-white/50 transition-all duration-500 group-data-[active=true]:rotate-45 group-data-[active=true]:bg-primary-500 group-data-[active=true]:border-primary-500 group-data-[active=true]:text-on-primary">
                    <Plus size={17} />
                  </span>
                </button>

                {/* smooth height via the grid 0fr → 1fr trick */}
                <div className={`relative grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${active ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="grid sm:grid-cols-[44px_1fr] gap-4 pl-5 pr-14 pb-8">
                      <span data-row-icon className="hidden sm:grid place-items-center w-9 h-9 rounded-xl bg-primary-500/10 text-primary-400"><Icon size={17} /></span>
                      <div>
                        <p className="text-white/65 leading-relaxed md:text-lg max-w-xl">{s.text}</p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {s.tags.map((t) => (
                            <li key={t} data-tag className="rounded-full border border-[var(--line-strong)] bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/75">{t}</li>
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
