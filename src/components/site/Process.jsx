import { useRef } from 'react';
import { MessagesSquare, FileCheck2, Hammer, Rocket, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap';
import { scramble } from '../../lib/scramble';
import { processSteps } from '../../data/portfolio';
import SectionLabel from './SectionLabel';
import Magnetic from './Magnetic';
import { openAssistant } from '../../lib/assistant';

const ICONS = [MessagesSquare, FileCheck2, Hammer, Rocket];
const pad = (n) => String(n).padStart(2, '0');

/** Redraw an icon stroke by stroke. */
function drawIcon(svg) {
  svg?.querySelectorAll('path, circle, rect, line, polyline, polygon').forEach((el) => {
    const len = el.getTotalLength?.() || 0;
    if (!len) return;
    gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', overwrite: true,
      onComplete: () => gsap.set(el, { clearProps: 'strokeDasharray,strokeDashoffset' }),
    });
  });
}

export default function Process() {
  const root = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const steps = q('[data-step]');
    const total = steps.length;

    let current = -1;
    // step states: done (passed, stays lit) · current (in focus) · todo (dimmed)
    const activate = (i, animate = true) => {
      if (i === current) return;
      current = i;
      steps.forEach((el, j) => el.setAttribute('data-state', j < i ? 'done' : j === i ? 'current' : 'todo'));
      const readout = q('[data-readout]')[0];
      if (readout) readout.textContent = `${pad(i + 1)} / ${pad(total)}`;
      if (!animate) return;
      const step = steps[i];
      drawIcon(step.querySelector('svg'));
      const time = step.querySelector('[data-time]');
      scramble(time, time.dataset.text, { speed: 1.3 });
      scramble(q('[data-ghost]')[0], pad(i + 1), { speed: 0.9 });
    };

    if (prefersReducedMotion()) {
      steps.forEach((el) => el.setAttribute('data-state', 'done'));
      return;
    }

    // heading words rise from a mask
    gsap.from(q('[data-head] .split-inner'), {
      yPercent: 115, duration: 1.1, stagger: 0.05, ease: 'expo.out',
      scrollTrigger: { trigger: q('[data-head]')[0], start: 'top 85%' },
    });

    const mm = gsap.matchMedia();

    // desktop: pin the section and walk through the steps as you scroll
    mm.add('(min-width: 1024px)', () => {
      activate(0, false);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: q('[data-pin]')[0],
          start: 'top top',
          end: `+=${total * 420}`,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => activate(Math.min(total - 1, Math.floor(self.progress * total))),
        },
      });
      tl.fromTo(q('[data-track]'), { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
        .fromTo(q('[data-comet]'), { left: '0%' }, { left: '100%', ease: 'none' }, 0);

      gsap.from(steps, {
        y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: q('[data-steps]')[0], start: 'top 85%' },
      });
    });

    // tablet / phone: each step lights up as it crosses the middle of the screen
    mm.add('(max-width: 1023px)', () => {
      steps.forEach((el, i) => {
        gsap.from(el, { y: 50, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
        ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 40%', onToggle: (self) => self.isActive && activate(i) });
      });
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} id="process" className="relative">
      <div data-pin className="relative overflow-hidden px-5 md:px-6 py-28 md:py-32 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
        {/* giant step number decoding behind the content */}
        <span
          data-ghost
          className="pointer-events-none select-none absolute right-4 md:right-10 top-16 lg:top-1/2 lg:-translate-y-1/2 font-display font-semibold leading-none tracking-tight text-outline text-[34vw] lg:text-[22vw]"
          aria-hidden="true"
        >
          01
        </span>

        <div className="relative max-w-7xl mx-auto w-full">
          <SectionLabel index="03" label="Process" />
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14 md:mb-16">
            <h2 data-head className="font-display text-white text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl">
              {['From', 'idea', 'to', 'launch', 'in'].map((w) => (
                <span key={w} className="split-mask mr-[0.25em]"><span className="split-inner">{w}</span></span>
              ))}
              <span className="split-mask mr-[0.25em]"><span className="split-inner text-gradient">four</span></span>
              <span className="split-mask"><span className="split-inner text-gradient">steps.</span></span>
            </h2>
            <div className="max-w-sm">
              <p className="text-white/50">A simple, transparent process, so you always know what’s happening, what it costs and what comes next.</p>
              <p className="mt-4 hidden lg:flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                Step <span data-readout className="text-primary-400">01 / 04</span>
                <span className="text-white/25">· scroll to continue</span>
              </p>
            </div>
          </div>

          <ol data-steps className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* track: base line, fill and a glowing comet riding its tip */}
            <span className="hidden lg:block absolute left-[38px] right-0 top-[38px] h-px bg-white/10" aria-hidden="true" />
            <span data-track className="hidden lg:block absolute left-[38px] right-0 top-[38px] h-px origin-left bg-gradient-to-r from-primary-500 via-accent to-primary-400" aria-hidden="true" />
            <span className="hidden lg:block absolute left-[38px] right-0 top-[38px] h-px" aria-hidden="true">
              <span data-comet className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary-400 shadow-[0_0_14px_4px_rgb(var(--primary-500)/0.7),0_0_40px_10px_rgb(var(--primary-500)/0.25)]" />
            </span>

            {processSteps.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <li key={s.step} data-step data-state="todo" className="group relative">
                  <div className="relative z-[1] mb-6 flex items-center gap-3">
                    <span className="relative grid place-items-center w-[76px] h-[76px] rounded-full border transition-all duration-500 bg-[var(--color-surface)] border-primary-500/30 text-primary-400/60 shadow-[0_0_0_8px_rgb(var(--primary-500)/0.05)] group-data-[state=done]:border-primary-500/60 group-data-[state=done]:text-primary-400 group-data-[state=current]:bg-primary-500 group-data-[state=current]:border-primary-500 group-data-[state=current]:text-on-primary group-data-[state=current]:scale-110 group-data-[state=current]:shadow-[0_0_0_10px_rgb(var(--primary-500)/0.15),0_0_40px_rgb(var(--primary-500)/0.35)]">
                      <span className="absolute inset-0 rounded-full border border-primary-500 opacity-0 group-data-[state=current]:animate-ping group-data-[state=current]:opacity-40" aria-hidden="true" />
                      <Icon size={26} />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/35 transition-colors duration-500 group-data-[state=current]:text-white/80 group-data-[state=done]:text-white/55">
                      Step {s.step}
                    </span>
                  </div>
                  <div className="glass-pearl rounded-3xl p-6 md:p-7 h-[calc(100%-100px)] transition-all duration-700 opacity-45 translate-y-3 group-data-[state=done]:opacity-80 group-data-[state=done]:translate-y-0 group-data-[state=current]:opacity-100 group-data-[state=current]:-translate-y-1 group-data-[state=current]:border-primary-500/40">
                    <p data-time data-text={s.time} className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-400">{s.time}</p>
                    <h3 className="mt-3 font-display text-2xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-3 text-white/55 leading-relaxed">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-14 flex flex-wrap items-center gap-4">
            <Magnetic>
              <button onClick={() => openAssistant('project')} className="group inline-flex items-center gap-2 rounded-full bg-primary-500 px-7 py-4 text-sm font-medium text-on-primary hover:bg-primary-600 transition-colors">
                Start with a free consultation
                <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
              </button>
            </Magnetic>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">Takes about 2 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
