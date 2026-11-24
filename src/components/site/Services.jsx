import { useRef } from 'react';
import { Globe, Rocket, Smartphone, ShoppingBag, BarChart3, Building2, ShieldCheck, Wrench, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { services } from '../../data/portfolio';
import SectionLabel from './SectionLabel';
import Magnetic from './Magnetic';
import { openAssistant } from '../../lib/assistant';

const ICONS = [Globe, Rocket, Smartphone, ShoppingBag, BarChart3, Building2, ShieldCheck, Wrench];

export default function Services() {
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
    gsap.from(q('[data-service]'), {
      y: 50,
      opacity: 0,
      duration: 0.9,
      stagger: 0.06,
      ease: 'expo.out',
      scrollTrigger: { trigger: q('[data-grid]')[0], start: 'top 80%' },
    });
  }, { scope: root });

  return (
    <section ref={root} id="services" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="01" label="Services" />
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <h2 className="font-display text-white text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">
            What I can <span className="text-gradient">build</span> for you.
          </h2>
          <p className="text-white/50 max-w-sm">
            One point of contact from idea to launch. I lead the build and bring in trusted developers and designers when your project needs them.
          </p>
        </div>

        <div data-grid className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <article key={s.title} data-service className="glass-pearl spotlight rounded-3xl p-6 md:p-7 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="grid place-items-center w-11 h-11 rounded-2xl bg-primary-500/10 text-primary-400">
                    <Icon size={20} />
                  </span>
                  <span className="font-mono text-xs text-white/30">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white leading-snug">{s.title}</h3>
                <p className="mt-3 text-sm text-white/50 leading-relaxed">{s.text}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic>
            <button
              onClick={() => openAssistant('project')}
              className="group inline-flex items-center gap-2 rounded-full bg-primary-500 px-7 py-4 text-sm font-medium text-on-primary hover:bg-primary-600 transition-colors"
            >
              Get a free project estimate
              <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
            </button>
          </Magnetic>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">Reply within 24 hours</span>
        </div>
      </div>
    </section>
  );
}
