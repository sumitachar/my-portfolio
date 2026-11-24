import { useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { personalInfo } from '../../data/portfolio';
import { useKolkataTime } from '../../lib/time';
import SplitText from './SplitText';
import Magnetic from './Magnetic';
import { useLenis, scrollToId } from './SmoothScroll';
import { openAssistant } from '../../lib/assistant';

const ROLES = ['websites', 'web apps', 'mobile apps', 'e-commerce', 'SaaS products', 'ERP & CRM'];

/** Terminal-style "status" card: what I'm doing now, stack, track record, reply time. */
function StatusCard() {
  const time = useKolkataTime();
  const rows = [
    ['role', 'Full-stack developer · tech partner'],
    ['now', personalInfo.currentWork],
    ['stack', personalInfo.coreStack.join(' · ')],
    ['shipped', '20+ projects · ~30% faster loads'],
    ['based', `${personalInfo.location.split(',')[0]}, IN · ${time} IST`],
  ];
  return (
    <aside data-fade className="glass-pearl rounded-2xl font-mono text-[12.5px] leading-relaxed" aria-label="Current status">
      <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        </span>
        <span className="ml-2 text-white/40">~/sumit/status</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-primary-400">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-60" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-primary-500" />
          </span>
          online
        </span>
      </div>
      <dl className="px-4 py-4 space-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[72px_1fr] gap-3">
            <dt className="text-white/35">{k}</dt>
            <dd className="text-white/80">{v}</dd>
          </div>
        ))}
        <div className="grid grid-cols-[72px_1fr] gap-3 pt-2 mt-2 border-t border-dashed border-[var(--line)]">
          <dt className="text-white/35">reply</dt>
          <dd className="text-primary-400">
            within 24h<span className="ml-0.5 inline-block w-[7px] h-[14px] align-[-2px] bg-primary-500 animate-[blink_1.1s_steps(1)_infinite]" />
          </dd>
        </div>
      </dl>
    </aside>
  );
}

export default function Hero({ ready }) {
  const root = useRef(null);
  const lenis = useLenis();
  const [first, last] = personalInfo.name.split(' ');

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const reduced = prefersReducedMotion();

    if (!ready) return;
    if (reduced) {
      gsap.set(q('.split-inner, [data-fade]'), { clearProps: 'all' });
      return;
    }

    // intro timeline
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(q('[data-name] .split-inner'), { yPercent: 115, duration: 1.3, stagger: 0.04 })
      .from(q('[data-fade]'), { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, '-=0.95');

    // cycling role word: step one word at a time
    const words = q('[data-role]');
    gsap.set(words, { yPercent: 100 });
    gsap.set(words[0], { yPercent: 0 });
    let current = 0;
    const cycle = gsap.delayedCall(2.2, () => {
      const next = (current + 1) % words.length;
      gsap.to(words[current], { yPercent: -100, duration: 0.6, ease: 'expo.inOut' });
      gsap.fromTo(words[next], { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' });
      current = next;
      cycle.restart(true);
    });

    // gentle scroll-out
    gsap.to(q('[data-content]'), {
      yPercent: -10,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(q('[data-outline]'), {
      xPercent: -20,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
  }, { scope: root, dependencies: [ready] });

  return (
    <section ref={root} id="top" className="relative min-h-[100svh] flex items-center overflow-hidden px-5 md:px-6 pt-32 pb-20">
      <p data-outline className="absolute -bottom-[2vw] left-0 whitespace-nowrap font-display font-semibold text-[16vw] leading-none tracking-tight text-outline select-none pointer-events-none" aria-hidden="true">
        Full-Stack · Tech Partner · Full-Stack
      </p>

      <div data-content className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-16 items-end">
        <div>
          <div data-fade className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-3 py-1.5 text-xs text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Available for new projects
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">Remote · Worldwide</span>
          </div>

          <h1 data-name className="font-display font-semibold text-white leading-[0.9] tracking-[-0.045em] text-[clamp(3.75rem,10vw,9.5rem)]">
            <SplitText text={first} className="block" />
            <span className="block">
              <SplitText text={last} className="text-gradient tracking-[-0.02em]" />
            </span>
          </h1>

          <p data-fade className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-white/45">
            {personalInfo.role} — 3+ years
          </p>
          <p data-fade className="mt-4 max-w-xl text-lg md:text-xl text-white/65 leading-relaxed">
            I help startups and businesses go from idea to launch with{' '}
            <span className="relative inline-flex overflow-hidden align-bottom h-[1.6em] min-w-[13ch]">
              {ROLES.map((r) => (
                <span key={r} data-role className="absolute left-0 top-0 text-white font-medium whitespace-nowrap">
                  {r}
                </span>
              ))}
            </span>
          </p>

          <div data-fade className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button
                onClick={() => openAssistant('project')}
                className="group inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3.5 text-sm font-medium text-on-primary hover:bg-primary-600 transition-colors"
              >
                Get a free estimate
                <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => scrollToId(lenis, 'work')}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-6 py-3.5 text-sm font-medium text-white/85 hover:text-white hover:border-white/40 transition-colors"
              >
                See my work
              </button>
            </Magnetic>
          </div>
        </div>

        <StatusCard />
      </div>

      <button
        data-fade
        onClick={() => scrollToId(lenis, 'services')}
        className="absolute bottom-8 right-6 hidden md:flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/35 hover:text-white transition-colors"
        aria-label="Scroll to services"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="relative w-px h-12 overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-white/70 animate-[scrollLine_1.8s_ease-in-out_infinite]" />
        </span>
        <ArrowDown size={14} />
      </button>
    </section>
  );
}
