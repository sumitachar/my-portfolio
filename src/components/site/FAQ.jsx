import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Bot } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { faqs, personalInfo } from '../../data/portfolio';
import SectionLabel from './SectionLabel';
import { openAssistant } from '../../lib/assistant';

export default function FAQ() {
  const root = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(gsap.utils.selector(root)('[data-faq]'), {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 75%' },
    });
  }, { scope: root });

  return (
    <section ref={root} id="faq" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">
        <div>
          <SectionLabel index="07" label="FAQ" />
          <h2 className="font-display text-white text-4xl md:text-6xl font-semibold tracking-tight">
            Questions, <span className="text-gradient">answered.</span>
          </h2>
          <p className="mt-6 text-white/50 max-w-sm leading-relaxed">The things clients usually ask before we start. Don’t see yours?</p>
          <div className="mt-8 glass-pearl rounded-3xl p-6 max-w-sm">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-primary-500/15 text-primary-400"><Bot size={20} /></span>
            <p className="mt-4 font-display text-xl font-semibold text-white">Ask the project assistant</p>
            <p className="mt-2 text-sm text-white/55 leading-relaxed">Get instant answers, or describe your project and get a free estimate from {personalInfo.name.split(' ')[0]} within 24 hours.</p>
            <button onClick={() => openAssistant()} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-3 text-sm font-medium text-on-primary hover:bg-primary-600 transition-colors">
              Open chat
            </button>
          </div>
        </div>

        <ul className="border-t border-[var(--line)]">
          {faqs.map((f, i) => {
            const open = openIndex === i;
            return (
              <li key={f.q} data-faq className="border-b border-[var(--line)]">
                <h3>
                  <button
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-6 py-6 md:py-7 text-left group"
                  >
                    <span className={`font-display text-lg md:text-2xl font-medium transition-colors ${open ? 'text-white' : 'text-white/75 group-hover:text-white'}`}>{f.q}</span>
                    <span className={`grid place-items-center shrink-0 w-10 h-10 rounded-full border transition-all duration-300 ${open ? 'rotate-45 bg-primary-500 border-primary-500 text-on-primary' : 'border-[var(--line)] text-white/60'}`}>
                      <Plus size={18} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-7 pr-14 text-white/55 leading-relaxed md:text-lg">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
