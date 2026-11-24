import { useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { personalInfo } from '../../data/portfolio';
import SplitText from './SplitText';
import Magnetic from './Magnetic';
import { useLenis, scrollToId } from './SmoothScroll';
import { openAssistant } from '../../lib/assistant';

const ROLES = ['websites', 'web apps', 'mobile apps', 'e-commerce', 'SaaS products', 'ERP & CRM'];

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
    tl.from(q('[data-name] .split-inner'), { yPercent: 115, rotate: 6, duration: 1.4, stagger: 0.045 })
      .from(q('[data-fade]'), { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, '-=1')
      .from(q('[data-line]'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }, '-=1.1');

    // cycling role word
    const words = q('[data-role]');
    gsap.set(words, { yPercent: 100 });
    gsap.set(words[0], { yPercent: 0 });
    // step one word at a time; a self-restarting delayedCall avoids the blank gap a repeating timeline leaves on loop
    let current = 0;
    const cycle = gsap.delayedCall(2.2, () => {
      const next = (current + 1) % words.length;
      gsap.to(words[current], { yPercent: -100, duration: 0.6, ease: 'expo.inOut' });
      gsap.fromTo(words[next], { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' });
      current = next;
      cycle.restart(true);
    });

    // scroll-out parallax
    gsap.to(q('[data-content]'), {
      yPercent: -18,
      opacity: 0.2,
      scale: 0.96,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(q('[data-outline]'), {
      xPercent: -25,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
  }, { scope: root, dependencies: [ready] });

  return (
    <section ref={root} id="top" className="relative min-h-[100svh] flex items-center overflow-hidden px-5 md:px-6 pt-28 pb-16">
      {/* giant outline word drifting on scroll */}
      <p data-outline className="absolute -bottom-[3vw] left-0 whitespace-nowrap font-display font-bold text-[18vw] leading-none text-outline select-none pointer-events-none" aria-hidden="true">
        Full-Stack · Tech Partner · Full-Stack
      </p>

      <div data-content className="max-w-7xl mx-auto w-full">
        <div data-fade className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-8">
          <span className="inline-flex items-center gap-2 text-emerald-400">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            Open for freelance &amp; contract
          </span>
          <span>{personalInfo.location.split(',')[0]}, India · Remote worldwide</span>
          <span>3+ years experience</span>
        </div>

        <h1 data-name className="font-display font-bold text-white leading-[0.88] tracking-[-0.04em] text-[clamp(3.5rem,13vw,12.5rem)]">
          <SplitText text={first} className="block" />
          <span className="block">
            <SplitText text={last} className="text-gradient" />
          </span>
        </h1>

        <div data-line className="origin-left h-px w-full max-w-3xl bg-gradient-to-r from-white/30 to-transparent my-8" />

        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div data-fade className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-400 mb-3">{personalInfo.role}</p>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              I help startups and businesses go from idea to launch with{' '}
              <span className="relative inline-flex overflow-hidden align-bottom h-[1.6em] min-w-[13ch]">
                {ROLES.map((r) => (
                  <span key={r} data-role className="absolute left-0 top-0 text-white font-medium whitespace-nowrap">
                    {r}
                  </span>
                ))}
              </span>
            </p>
          </div>

          <div data-fade className="flex flex-wrap gap-3">
            <Magnetic>
              <button
                onClick={() => openAssistant('project')}
                className="group inline-flex items-center gap-2 rounded-full bg-primary-500 px-7 py-4 text-sm font-medium text-white shadow-[0_10px_40px_-10px_rgb(var(--primary-500)/0.7)] hover:bg-primary-600 transition-colors"
              >
                Get a free estimate
                <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
              </button>
            </Magnetic>
            <Magnetic>
              <button onClick={() => scrollToId(lenis, 'work')} className="glass-pearl inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium text-white">
                See my work
              </button>
            </Magnetic>
          </div>
        </div>
      </div>

      <button
        data-fade
        onClick={() => scrollToId(lenis, 'services')}
        className="absolute bottom-8 right-6 hidden md:flex flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
        aria-label="Scroll to services"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="relative w-px h-14 overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-white animate-[scrollLine_1.8s_ease-in-out_infinite]" />
        </span>
        <ArrowDown size={14} />
      </button>
    </section>
  );
}
