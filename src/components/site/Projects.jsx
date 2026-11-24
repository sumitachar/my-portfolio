import { useRef, useState } from 'react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { projects } from '../../data/portfolio';
import SectionLabel from './SectionLabel';

const host = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const isLive = (p) => p.live && p.live !== '#';
const pad = (n) => String(n).padStart(2, '0');

const featured = projects.filter((p) => p.image && isLive(p));
const others = projects.filter((p) => !featured.includes(p));

/** Abstract "app window" artwork for private work without public screenshots. */
function MockArt({ project }) {
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br ${project.gradient}`}>
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: 'linear-gradient(#fff3 1px, transparent 1px), linear-gradient(90deg, #fff3 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div className="absolute left-[9%] top-[16%] w-[82%] rounded-xl bg-[#1c1c1f] border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="w-2 h-2 rounded-full bg-white/15" />
          <span className="ml-3 h-2.5 flex-1 rounded bg-white/[0.06]" />
        </div>
        <div className="grid grid-cols-[30%_1fr] gap-3 p-3">
          <div className="space-y-2">{[0, 1, 2, 3].map((i) => <div key={i} className={`h-2 rounded ${i === 0 ? 'bg-primary-500/70' : 'bg-white/10'}`} />)}</div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">{[0, 1, 2].map((i) => <div key={i} className="h-8 rounded-md bg-white/[0.06]" />)}</div>
            <div className="h-14 rounded-md bg-white/[0.04] flex items-end gap-1 p-2">
              {[40, 65, 50, 80, 60, 95, 70].map((h, i) => <span key={i} className="flex-1 rounded-sm bg-primary-500/60" style={{ height: `${h}%` }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Full-height panel for a live project; panels stack over each other while scrolling. */
function FeatureCard({ project, index, total }) {
  return (
    <article data-feature className="lg:sticky lg:top-[12vh] mb-6 lg:mb-[10vh]">
      <div data-feature-inner className="relative h-full overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--color-surface-2)] grid lg:grid-cols-[0.8fr_1.6fr] items-center origin-top will-change-transform">
        {/* info */}
        <div className="relative flex flex-col justify-between gap-10 p-7 md:p-10 lg:p-12 order-2 lg:order-1">
          <div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              <span className="text-primary-400">{pad(index + 1)}</span>
              <span className="h-px w-8 bg-white/20" />
              <span>{pad(total)}</span>
              <span className="ml-auto">{project.category}</span>
            </div>
            <h3 className="mt-8 font-display text-4xl md:text-5xl xl:text-6xl font-semibold tracking-[-0.035em] text-white leading-[0.95]">{project.title}</h3>
            <p className="mt-6 max-w-md text-white/60 leading-relaxed md:text-lg">{project.description}</p>
          </div>

          <div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--line)] pt-6 font-mono text-[12px]">
              <div>
                <dt className="uppercase tracking-[0.15em] text-white/35">Built with</dt>
                <dd className="mt-1.5 text-white/80">{project.tags.join(' · ')}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.15em] text-white/35">Status</dt>
                <dd className="mt-1.5 inline-flex items-center gap-2 text-white/80"><span className="w-1.5 h-1.5 rounded-full bg-primary-500" />Live in production</dd>
              </div>
            </dl>
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              data-cursor="Visit"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--line-strong)] pl-5 pr-2 py-2 text-sm text-white hover:border-primary-500 transition-colors"
            >
              {host(project.live)}
              <span className="grid place-items-center w-8 h-8 rounded-full bg-primary-500 text-on-primary transition-transform group-hover:rotate-45">
                <ArrowUpRight size={15} />
              </span>
            </a>
          </div>
        </div>

        {/* visual */}
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer"
          data-cursor="Visit"
          aria-label={`Visit ${project.title}`}
          className="group relative order-1 lg:order-2 block p-3 md:p-4 lg:pl-0"
        >
          <div data-reveal className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113] flex flex-col">
            <div className="relative z-[1] flex items-center gap-2 h-8 px-3 bg-[#18181b] border-b border-white/[0.06] shrink-0">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span className="w-2 h-2 rounded-full bg-white/15" />
                <span className="w-2 h-2 rounded-full bg-white/15" />
              </span>
              <span className="mx-auto max-w-[60%] truncate rounded-md bg-white/[0.06] px-3 py-0.5 font-mono text-[10px] text-white/55">{host(project.live)}</span>
            </div>
            <div className="relative overflow-hidden aspect-[1424/769]">
              <img
                data-parallax
                src={project.image}
                alt={`${project.title} homepage`}
                loading="eager"
                fetchPriority="low"
                decoding="async"
                className="absolute inset-x-0 -top-[4%] h-[108%] w-full object-cover object-top transition-[filter] duration-500 group-hover:brightness-110"
              />
            </div>
          </div>
        </a>
      </div>
    </article>
  );
}

/** Typographic index of private work; a preview card follows the cursor on hover. */
function PrivateIndex() {
  const wrap = useRef(null);
  const preview = useRef(null);
  const [active, setActive] = useState(null);

  useGSAP(() => {
    const el = preview.current;
    const box = wrap.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e) => {
      const r = box.getBoundingClientRect();
      x(e.clientX - r.left + 28);
      y(e.clientY - r.top - 120);
    };
    box.addEventListener('mousemove', move);
    return () => box.removeEventListener('mousemove', move);
  }, { scope: wrap });

  const current = others.find((p) => p.id === active);

  return (
    <div ref={wrap} className="relative mt-24 md:mt-32" onMouseLeave={() => setActive(null)}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45"><Lock size={12} /> Private client systems</p>
        <p className="text-sm text-white/45 max-w-sm">Internal tools and dashboards built for clients and employers. No public link, but here is what they do.</p>
      </div>

      <ul className="border-t border-[var(--line)]">
        {others.map((p, i) => (
          <li key={p.id} data-index-row className="border-b border-[var(--line)]" onMouseEnter={() => setActive(p.id)}>
            <div className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[60px_1.4fr_1fr_auto] items-center gap-4 md:gap-8 py-6 md:py-8">
              <span className="font-mono text-xs text-white/35">{pad(featured.length + i + 1)}</span>
              <div>
                <h4 className={`font-display text-2xl md:text-4xl font-semibold tracking-[-0.03em] transition-all duration-500 ${active === p.id ? 'text-white translate-x-2' : active ? 'text-white/30' : 'text-white/85'}`}>
                  {p.title}
                </h4>
                <p className="mt-2 text-sm text-white/50 leading-relaxed lg:hidden">{p.description}</p>
              </div>
              <ul className="hidden md:flex flex-wrap gap-2">
                {p.tags.map((t) => <li key={t} className="rounded-full border border-[var(--line)] px-3 py-1 font-mono text-[11px] text-white/55">{t}</li>)}
              </ul>
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/40 text-right">{p.category}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* cursor-following preview (desktop) */}
      <div
        ref={preview}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-10 hidden lg:block w-[360px] transition-opacity duration-300 ${current ? 'opacity-100' : 'opacity-0'}`}
      >
        {current && (
          <div className="rounded-2xl border border-[var(--line-strong)] bg-[var(--color-surface-2)] p-2.5 shadow-2xl shadow-black/50">
            <div className="h-[190px]"><MockArt project={current} /></div>
            <p className="px-2 pt-3 pb-1 text-[13px] leading-relaxed text-white/65">{current.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const root = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    // screenshots: clip-path reveal on enter + gentle parallax inside the frame
    q('[data-reveal]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(12% 10% 12% 10% round 24px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
    q('[data-parallax]').forEach((img) => {
      gsap.fromTo(img, { yPercent: -3 }, {
        yPercent: 3, ease: 'none',
        scrollTrigger: { trigger: img.closest('[data-feature]'), start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // desktop: each panel shrinks and dims as the next one slides over it
    mm.add('(min-width: 1024px)', () => {
      const cards = q('[data-feature]');
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector('[data-feature-inner]'), {
          scale: 0.92, opacity: 0.35, ease: 'none',
          scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 12%', scrub: true },
        });
      });
    });

    gsap.from(q('[data-index-row]'), {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: q('[data-index-row]')[0], start: 'top 85%' },
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} id="work" className="relative px-5 md:px-6 py-28 md:py-40">
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="02" label="Selected work" />
        <div className="flex flex-wrap items-end justify-between gap-8 mb-14 md:mb-20">
          <h2 className="font-display text-white text-5xl md:text-7xl xl:text-8xl font-semibold tracking-[-0.045em] leading-[0.9]">
            Selected <span className="text-gradient">work</span>
            <sup className="ml-2 align-top font-mono text-sm md:text-base font-normal tracking-normal text-white/40">({pad(projects.length)})</sup>
          </h2>
          <p className="max-w-sm text-white/50 leading-relaxed">
            Live products shipped for real businesses, followed by private systems: ERP, analytics dashboards and pharmacy management.
          </p>
        </div>

        <div>
          {featured.map((p, i) => <FeatureCard key={p.id} project={p} index={i} total={projects.length} />)}
        </div>

        <PrivateIndex />
      </div>
    </section>
  );
}
