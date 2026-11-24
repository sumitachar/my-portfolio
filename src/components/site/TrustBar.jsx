import { useRef } from 'react';
import { BadgeCheck, ClipboardList, MonitorPlay, KeyRound } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { trustPoints } from '../../data/portfolio';

const ICONS = [BadgeCheck, ClipboardList, MonitorPlay, KeyRound];

/** Four reassurance points right under the hero, answering "is this safe to hire?" early. */
export default function TrustBar() {
  const root = useRef(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(gsap.utils.selector(root)('[data-trust]'), {
      y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: root.current, start: 'top 90%' },
    });
  }, { scope: root });

  return (
    <section ref={root} aria-label="Why clients work with me" className="relative px-5 md:px-6 pb-16">
      <ul className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
        {trustPoints.map((t, i) => {
          const Icon = ICONS[i];
          return (
            <li key={t.title} data-trust className="glass-pearl rounded-2xl px-4 py-4 md:px-5 flex items-start gap-3">
              <span className="grid place-items-center shrink-0 w-9 h-9 rounded-xl bg-emerald-400/15 text-emerald-400"><Icon size={17} /></span>
              <div>
                <p className="text-sm md:text-[15px] font-medium text-white">{t.title}</p>
                <p className="mt-0.5 text-xs md:text-[13px] text-white/50 leading-snug">{t.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
