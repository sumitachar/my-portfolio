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
      y: 60, opacity: 0, scale: 0.97, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 85%' },
    });
  }, { scope: root });

  return (
    <section ref={root} className="relative px-5 md:px-6 py-10">
      <div data-band className="relative max-w-7xl mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-600 via-primary-500 to-sky-500 px-7 py-12 md:px-14 md:py-16">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-white/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -left-10 -bottom-32 w-96 h-96 rounded-full bg-sky-300/30 blur-3xl" aria-hidden="true" />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#fff]/70">Not sure where to start?</p>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight text-[#fff] leading-[1.05]">
              Answer 6 quick questions. Get a free estimate in 24 hours.
            </h2>
          </div>
          <div className="flex flex-wrap lg:justify-end gap-3">
            <Magnetic>
              <button onClick={() => openAssistant('project')} className="group inline-flex items-center gap-2 rounded-full bg-[#fff] px-7 py-4 text-sm font-semibold text-[#1e1b4b] hover:bg-[#fff]/90 transition-colors">
                <Bot size={17} /> Plan my project
                <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
              </button>
            </Magnetic>
            <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 rounded-full border border-[#fff]/40 px-7 py-4 text-sm font-medium text-[#fff] hover:bg-[#fff]/10 transition-colors">
              Email instead
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
