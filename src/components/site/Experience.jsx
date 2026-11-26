import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { ArrowUpRight } from 'lucide-react';
import { scramble } from '../../lib/scramble';
import { experience } from '../../data/portfolio';
import SectionLabel from './SectionLabel';

export default function Experience() {
  const root = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);

    // cards: cursor spotlight
    q('.spotlight').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    if (prefersReducedMotion()) {
      q('[data-item]').forEach((el) => el.setAttribute('data-active', 'true'));
      return;
    }

    // heading words rise from a mask
    gsap.from(q('[data-head] .split-inner'), {
      yPercent: 115, duration: 1.1, stagger: 0.06, ease: 'expo.out',
      scrollTrigger: { trigger: q('[data-head]')[0], start: 'top 85%' },
    });

    // progress line fills, with a glowing comet riding its tip
    const list = q('[data-list]')[0];
    const scrub = { trigger: list, start: 'top 60%', end: 'bottom 55%', scrub: 0.4 };
    gsap.fromTo(q('[data-progress]'), { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: scrub });
    gsap.fromTo(q('[data-comet]'), { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: { ...scrub } });

    q('[data-item]').forEach((item) => {
      // focus: the role crossing the middle of the screen lights up, the rest dim back
      ScrollTrigger.create({
        trigger: item,
        start: 'top 58%',
        end: 'bottom 42%',
        onToggle: (self) => item.setAttribute('data-active', self.isActive ? 'true' : 'false'),
      });

      // entrance
      const period = item.querySelector('[data-period]');
      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 78%' } });
      tl.from(item.querySelector('[data-dot]'), { scale: 0, duration: 0.5, ease: 'back.out(3)' })
        .add(() => scramble(period, period.dataset.text, { speed: 1.2 }), 0)
        .fromTo(item.querySelector('[data-card]'),
          { clipPath: 'inset(0% 100% 0% 0% round 24px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.2, ease: 'expo.inOut' }, 0.05)
        .from(item.querySelectorAll('[data-role] .split-inner'), { yPercent: 115, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, 0.55)
        .fromTo(item.querySelector('[data-underline]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.inOut' }, 0.75)
        .from(item.querySelectorAll('[data-fade]'), { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' }, 0.8)
        .from(item.querySelectorAll('[data-chip]'), { y: 16, scale: 0.8, rotate: -6, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'back.out(2.2)' }, 0.95);
    });
  }, { scope: root });

  return (
    <section ref={root} id="experience" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="05" label="Experience" />
        <h2 data-head className="font-display text-white text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl mb-16 md:mb-24">
          {['Where', 'I’ve', 'been'].map((w) => (
            <span key={w} className="split-mask mr-[0.25em]"><span className="split-inner">{w}</span></span>
          ))}
          <span className="split-mask"><span className="split-inner text-gradient">building.</span></span>
        </h2>

        <ol data-list className="relative">
          <span className="absolute left-[7px] md:left-[calc(25%+7px)] top-2 bottom-2 w-px bg-white/10" aria-hidden="true" />
          <span data-progress className="absolute left-[7px] md:left-[calc(25%+7px)] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-primary-500 via-accent to-primary-400" aria-hidden="true" />
          {/* glowing comet riding the tip of the progress line */}
          <span className="absolute left-[7px] md:left-[calc(25%+7px)] top-2 bottom-2 w-px" aria-hidden="true">
            <span data-comet className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary-400 shadow-[0_0_14px_4px_rgb(var(--primary-500)/0.7),0_0_40px_10px_rgb(var(--primary-500)/0.25)]" />
          </span>

          {experience.map((job) => (
            <li
              key={`${job.company}-${job.period}`}
              data-item
              data-active="false"
              className="group relative grid md:grid-cols-[25%_1fr] gap-4 md:gap-12 pl-10 md:pl-0 pb-20 last:pb-0"
            >
              <div className="md:pr-12 md:text-right pt-0.5">
                <p
                  data-period
                  data-text={job.period}
                  className="font-mono text-sm text-white/40 transition-colors duration-500 group-data-[active=true]:text-primary-400"
                >
                  {job.period}
                </p>
              </div>

              {/* timeline dot: pulses while this role is in focus */}
              <span data-dot className="absolute left-0 md:left-[25%] top-1 w-[15px] h-[15px]">
                <span className="absolute inset-0 rounded-full border-2 border-primary-500 opacity-0 group-data-[active=true]:animate-ping group-data-[active=true]:opacity-60" />
                <span className="absolute inset-0 rounded-full bg-[var(--color-surface)] border-2 border-primary-500 shadow-[0_0_0_6px_rgb(var(--primary-500)/0.15)] transition-colors duration-500 group-data-[active=true]:bg-primary-500" />
              </span>

              <div
                data-card
                className="md:ml-12 glass-pearl spotlight rounded-3xl p-6 md:p-8 transition-[opacity,transform,border-color] duration-700 opacity-45 scale-[0.98] group-data-[active=true]:opacity-100 group-data-[active=true]:scale-100 group-data-[active=true]:border-primary-500/35"
              >
                <h3 data-role className="font-display text-2xl md:text-4xl font-semibold text-white">
                  {job.role.split(' ').map((w, i) => (
                    <span key={i} className="split-mask mr-[0.25em]"><span className="split-inner">{w}</span></span>
                  ))}
                </h3>
                <p className="relative mt-2 inline-block text-lg text-primary-400">
                  {job.company}
                  <span data-underline className="absolute left-0 -bottom-0.5 h-px w-full origin-left bg-primary-500/70" aria-hidden="true" />
                </p>

                {/* promotion within the same company: earliest role → current role */}
                {job.roles?.length > 1 && (
                  <div data-fade className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-primary-400">
                      <ArrowUpRight size={12} /> Promoted
                    </span>
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs">
                      {[...job.roles].reverse().map((r, i, all) => (
                        <li key={r.title} className="flex items-center gap-2">
                          <span className={i === all.length - 1 ? 'text-white/90' : 'text-white/50'}>
                            {r.title} <span className="text-white/35">· {r.period}</span>
                          </span>
                          {i < all.length - 1 && <span className="text-primary-400" aria-hidden="true">→</span>}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <p data-fade className="mt-5 max-w-2xl text-white/60 leading-relaxed">{job.description}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {job.highlights.map((h) => (
                    <li
                      key={h}
                      data-chip
                      className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-xs text-white/70 transition-colors duration-500 group-data-[active=true]:border-primary-500/30 group-data-[active=true]:text-white/85"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
