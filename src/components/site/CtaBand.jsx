import { useRef } from 'react';
import { ArrowUpRight, Bot } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { personalInfo } from '../../data/portfolio';
import Magnetic from './Magnetic';
import { openAssistant } from '../../lib/assistant';

/** Mid-page conversion band for visitors who are interested but not ready to write a brief. */
export default function CtaBand() {
  const root = useRef(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(root.current.querySelector('[data-band]'), {
      y: 50, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 85%' },
    });
  }, { scope: root });

  return (
    <section ref={root} className="relative px-5 md:px-6 py-10">
      <div data-band className="glass-pearl relative max-w-7xl mx-auto rounded-[1.75rem] px-7 py-12 md:px-14 md:py-16">
        <div className="absolute inset-0 backdrop-grid opacity-70 -z-10" aria-hidden="true" />
        <div className="absolute -right-24 -top-32 w-[28rem] h-[28rem] rounded-full bg-primary-500/10 blur-[100px] -z-10" aria-hidden="true" />
        <div className="relative grid lg:grid-cols-[1.5fr_1fr] gap-10 items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/45">Not sure where to start?</p>
            <h2 className="mt-5 font-display text-3xl md:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.05]">
              Answer 6 quick questions. Get a <span className="text-gradient">free estimate</span> in 24 hours.
            </h2>
          </div>
          <div className="flex flex-wrap lg:justify-end gap-3">
            <Magnetic>
              <button onClick={() => openAssistant('project')} className="group inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3.5 text-sm font-medium text-on-primary hover:bg-primary-600 transition-colors">
                <Bot size={16} /> Plan my project
                <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
              </button>
            </Magnetic>
            <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-6 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:border-white/40 transition-colors">
              Email instead
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
