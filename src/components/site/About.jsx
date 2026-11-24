import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { personalInfo, stats } from '../../data/portfolio';
import SectionLabel from './SectionLabel';

// statement split into plain and accent segments (accent = serif italic + drawn underline)
const STATEMENT = [
  { t: 'Your tech partner from' },
  { t: 'idea to launch.', accent: true },
  { t: 'I scope it, build it and' },
  { t: 'ship it,', accent: true },
  { t: 'then stay around to keep it' },
  { t: 'fast and running.', accent: true },
];

const VALUES = ['Clear scope', 'Regular demos', 'Code you own', 'Fast pages', 'Honest timelines', 'Long-term support'];

/** Number that rolls into place digit by digit, like an odometer. */
function Odometer({ value }) {
  const digits = String(value).split('');
  return (
    <span className="inline-flex" aria-label={String(value)}>
      {digits.map((d, i) => (
        <span key={i} className="relative inline-block h-[1em] overflow-hidden" aria-hidden="true">
          <span data-digit={d} className="flex flex-col">
            {Array.from({ length: 20 }, (_, n) => <span key={n} className="h-[1em] leading-none">{n % 10}</span>)}
          </span>
          {/* sizing ghost so the column has the width of its final digit */}
          <span className="invisible block h-0">{d}</span>
        </span>
      ))}
    </span>
  );
}

export default function About() {
  const root = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);

    // stat cards: spotlight follows the cursor
    q('.spotlight').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    if (prefersReducedMotion()) {
      q('[data-digit]').forEach((col) => gsap.set(col, { yPercent: -(10 + Number(col.dataset.digit)) * 5 }));
      return;
    }

    // giant outlined word drifting behind the section
    gsap.fromTo(q('[data-ghost]'), { xPercent: 8 }, {
      xPercent: -18, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // statement: words emerge from blur as you scroll, then the accent underlines draw in
    const st = gsap.timeline({
      scrollTrigger: { trigger: q('[data-statement]')[0], start: 'top 80%', end: 'bottom 40%', scrub: 0.6 },
    });
    st.fromTo(q('[data-word]'), { opacity: 0.1, filter: 'blur(10px)', yPercent: 30 }, {
      opacity: 1, filter: 'blur(0px)', yPercent: 0, stagger: 0.06, ease: 'none',
    }).fromTo(q('[data-underline]'), { scaleX: 0 }, { scaleX: 1, stagger: 0.15, ease: 'none' }, '-=0.4');

    // "now building" pill + bio words cascade in
    const bio = gsap.timeline({ scrollTrigger: { trigger: q('[data-bio]')[0], start: 'top 82%' } });
    bio.from(q('[data-now]'), { y: 20, opacity: 0, duration: 0.7, ease: 'expo.out' })
      .from(q('[data-bio-word]'), { y: 14, opacity: 0, duration: 0.6, stagger: 0.008, ease: 'power3.out' }, '-=0.4');

    // stat cards flip up in 3D, then each number rolls into place
    const cards = q('[data-stat]');
    gsap.set(cards, { transformPerspective: 900, transformOrigin: '50% 100%' });
    const statsTl = gsap.timeline({ scrollTrigger: { trigger: q('[data-stats]')[0], start: 'top 80%' } });
    statsTl.from(cards, { rotationX: -75, y: 60, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' });
    cards.forEach((card, ci) => {
      card.querySelectorAll('[data-digit]').forEach((col, di) => {
        statsTl.fromTo(col, { yPercent: 0 }, {
          yPercent: -(10 + Number(col.dataset.digit)) * 5, duration: 1.6, ease: 'expo.out',
        }, 0.25 + ci * 0.12 + di * 0.08);
      });
    });

    // values ticker moves with the scroll
    gsap.fromTo(q('[data-ticker]'), { xPercent: 0 }, {
      xPercent: -30, ease: 'none',
      scrollTrigger: { trigger: q('[data-ticker]')[0], start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }, { scope: root });

  return (
    <section ref={root} id="about" className="relative overflow-hidden py-28 md:py-40">
      <p data-ghost className="pointer-events-none select-none absolute top-16 left-0 whitespace-nowrap font-display font-semibold text-[22vw] leading-none tracking-tight text-outline" aria-hidden="true">
        About · About
      </p>

      <div className="relative px-5 md:px-6 max-w-7xl mx-auto">
        <SectionLabel index="04" label="About" />

        <p data-statement className="font-display text-white text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.15] tracking-tight max-w-5xl">
          {STATEMENT.map((seg, si) => {
            const words = seg.t.split(' ').map((w, wi) => (
              <span key={wi} data-word className="inline-block mr-[0.25em] will-change-[filter,transform]">{w}</span>
            ));
            return seg.accent ? (
              <span key={si} className="relative inline-block whitespace-nowrap text-gradient">
                {words}
                <span data-underline className="absolute left-0 right-[0.25em] -bottom-1 h-[3px] origin-left rounded-full bg-primary-500/70" aria-hidden="true" />
              </span>
            ) : (
              <span key={si}>{words}</span>
            );
          })}
        </p>

        <div className="grid md:grid-cols-[1fr_1.4fr] gap-12 mt-20 md:mt-28 items-start">
          <div data-bio>
            <p data-now className="inline-flex items-center gap-2.5 rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-white/70">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-60" />
                <span className="relative w-2 h-2 rounded-full bg-primary-500" />
              </span>
              Now · {personalInfo.currentWork}
            </p>
            <p className="mt-6 text-white/55 leading-relaxed text-lg">
              {personalInfo.bio.split(' ').map((w, i) => (
                <span key={i} data-bio-word className="inline-block mr-[0.28em]">{w}</span>
              ))}
            </p>
          </div>

          <dl data-stats className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} data-stat className="glass-pearl spotlight rounded-3xl p-6 md:p-8">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">{s.label}</dt>
                <dd className="mt-3 flex items-end font-display text-5xl md:text-6xl font-bold leading-none tabular-nums text-white">
                  <Odometer value={s.value} />
                  <span className="text-gradient">{s.suffix}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* values ticker */}
      <div className="relative mt-24 md:mt-32 border-y border-[var(--line)] py-6 md:py-8 overflow-hidden" aria-label="How I work">
        <div data-ticker className="flex w-max gap-10 md:gap-14 pl-[5vw]">
          {[...VALUES, ...VALUES, ...VALUES].map((v, i) => (
            <span key={i} className="flex items-center gap-10 md:gap-14 font-display text-3xl md:text-5xl font-medium tracking-[-0.03em] whitespace-nowrap" aria-hidden={i >= VALUES.length || undefined}>
              <span className={i % 2 ? 'text-outline-strong' : 'text-white/85'}>{v}</span>
              <span className="text-primary-500 text-xl md:text-2xl">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
