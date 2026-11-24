import { useRef } from 'react';
import { MessagesSquare, FileCheck2, Hammer, Rocket, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { processSteps } from '../../data/portfolio';
import SectionLabel from './SectionLabel';
import Magnetic from './Magnetic';
import { openAssistant } from '../../lib/assistant';

const ICONS = [MessagesSquare, FileCheck2, Hammer, Rocket];

export default function Process() {
  const root = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap.fromTo(q('[data-track]'), { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: q('[data-steps]')[0], start: 'top 75%', end: 'bottom 55%', scrub: true },
    });
    gsap.from(q('[data-step]'), {
      y: 60, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out',
      scrollTrigger: { trigger: q('[data-steps]')[0], start: 'top 80%' },
    });
  }, { scope: root });

  return (
    <section ref={root} id="process" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="03" label="Process" />
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14 md:mb-20">
          <h2 className="font-display text-white text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">
            From idea to launch in <span className="text-gradient">four steps.</span>
          </h2>
          <p className="text-white/50 max-w-sm">A simple, transparent process, so you always know what’s happening, what it costs and what comes next.</p>
        </div>

        <ol data-steps className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <span className="hidden lg:block absolute left-0 right-0 top-[38px] h-px bg-white/10" aria-hidden="true" />
          <span data-track className="hidden lg:block absolute left-0 right-0 top-[38px] h-px origin-left bg-gradient-to-r from-primary-500 via-accent to-sky-400" aria-hidden="true" />
          {processSteps.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <li key={s.step} data-step className="relative">
                <div className="relative z-[1] mb-6 flex items-center gap-3">
                  <span className="grid place-items-center w-[76px] h-[76px] rounded-full bg-[var(--color-surface)] border border-primary-500/40 shadow-[0_0_0_8px_rgb(var(--primary-500)/0.08)] text-primary-400">
                    <Icon size={26} />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">Step {s.step}</span>
                </div>
                <div className="glass-pearl rounded-3xl p-6 md:p-7 h-[calc(100%-100px)]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400">{s.time}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-white">{s.title}</h3>
                  <p className="mt-3 text-white/55 leading-relaxed">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Magnetic>
            <button onClick={() => openAssistant('project')} className="group inline-flex items-center gap-2 rounded-full bg-primary-500 px-7 py-4 text-sm font-medium text-[#fff] hover:bg-primary-600 transition-colors">
              Start with a free consultation
              <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
            </button>
          </Magnetic>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">Takes about 2 minutes</span>
        </div>
      </div>
    </section>
  );
}
