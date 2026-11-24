import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { personalInfo } from '../../data/portfolio';
import { useKolkataTime } from '../../lib/time';
import { scramble } from '../../lib/scramble';
import SplitText from './SplitText';
import Magnetic from './Magnetic';
import { useLenis, scrollToId } from './SmoothScroll';
import { openAssistant } from '../../lib/assistant';

const WORDS = ['websites', 'web apps', 'SaaS products', 'ERP systems', 'online stores', 'mobile apps'];

/** Terminal-style "status" card that tilts toward the cursor. */
function StatusCard() {
  const time = useKolkataTime();
  const card = useRef(null);

  useEffect(() => {
    const el = card.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    gsap.set(el, { transformPerspective: 1000 });
    const move = (e) => {
      ry((e.clientX / window.innerWidth - 0.5) * 10);
      rx(-(e.clientY / window.innerHeight - 0.5) * 8);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const rows = [
    ['name', personalInfo.name],
    ['role', 'Full-stack developer · tech partner'],
    ['now', personalInfo.currentWork],
    ['stack', personalInfo.coreStack.join(' · ')],
    ['shipped', '20+ projects · ~30% faster loads'],
    ['based', `${personalInfo.location.split(',')[0]}, IN · ${time} IST`],
  ];
  return (
    <div data-fade className="[perspective:1000px]">
      <aside ref={card} className="glass-pearl rounded-2xl font-mono text-[12.5px] leading-relaxed will-change-transform" aria-label="Current status">
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
          {rows.map(([k, v], i) => (
            <div key={k} data-row style={{ '--i': i }} className="grid grid-cols-[72px_1fr] gap-3">
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
    </div>
  );
}

export default function Hero({ ready }) {
  const root = useRef(null);
  const word = useRef(null);
  const lenis = useLenis();

  // the key word "decrypts" into the next one every few seconds
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % WORDS.length;
      scramble(word.current, WORDS[i]);
    }, 2800);
    return () => clearInterval(id);
  }, [ready]);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    if (!ready) return;
    if (prefersReducedMotion()) {
      word.current.textContent = WORDS[0];
      gsap.set(q('.split-inner, [data-fade], [data-row]'), { clearProps: 'all' });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(q('[data-headline] .split-inner'), { yPercent: 120, duration: 1.3, stagger: 0.06 })
      .add(() => scramble(word.current, WORDS[0], { speed: 0.8 }), 0.35)
      .from(q('[data-fade]'), { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.5)
      .from(q('[data-row]'), { x: -10, opacity: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out' }, 0.9);

    // scroll-out: headline lines drift apart slightly, content fades
    gsap.to(q('[data-line="1"]'), { xPercent: -6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(q('[data-line="3"]'), { xPercent: 6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(q('[data-content]'), { opacity: 0.25, yPercent: -6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
  }, { scope: root, dependencies: [ready] });

  return (
    <section ref={root} id="top" className="relative min-h-[100svh] flex items-center overflow-hidden px-5 md:px-6 pt-32 pb-20">
      <div data-content className="max-w-7xl mx-auto w-full">
        <div data-fade className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-3 py-1.5 text-xs text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Available for new projects
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            {personalInfo.name} — {personalInfo.role}
          </span>
        </div>

        <h1
          data-headline
          aria-label="I turn ideas into websites, apps and business systems that grow businesses."
          className="font-display font-semibold text-white leading-[0.95] tracking-[-0.045em] text-[clamp(2.75rem,7.6vw,7.5rem)]"
        >
          <span data-line="1" className="block" aria-hidden="true"><SplitText text="I turn ideas into" by="words" /></span>
          <span data-line="2" className="block text-gradient tracking-[-0.02em] min-h-[1.05em]" aria-hidden="true">
            <span ref={word} className="inline-block whitespace-nowrap">{' '}</span>
          </span>
          <span data-line="3" className="block" aria-hidden="true">
            <SplitText text="that grow" by="words" /> <SplitText text="businesses." by="words" className="text-white/40" />
          </span>
        </h1>

        <div className="mt-14 grid lg:grid-cols-[1fr_minmax(340px,420px)] gap-12 items-end">
          <div>
            <p data-fade className="max-w-xl text-lg md:text-xl text-white/60 leading-relaxed">
              Full-stack developer with 3+ years shipping production apps. I take you from first idea to launch, and stay on for what comes after.
            </p>
            <div data-fade className="mt-9 flex flex-wrap items-center gap-3">
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
                  See selected work
                </button>
              </Magnetic>
            </div>
          </div>
          <StatusCard />
        </div>
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
