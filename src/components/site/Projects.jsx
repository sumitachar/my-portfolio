import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { projects } from '../../data/portfolio';
import SectionLabel from './SectionLabel';

/** Abstract "app window" artwork so each card has a visual without screenshots. */
function Preview({ project, index }) {
  if (project.image) {
    return (
      <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient}`}>
        <img
          src={project.image}
          alt={`${project.title} website screenshot`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute -bottom-6 -right-2 font-display text-[6rem] md:text-[8rem] font-bold leading-none text-white/15 select-none">
          0{index + 1}
        </span>
      </div>
    );
  }
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br ${project.gradient}`}>
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: 'linear-gradient(#fff3 1px, transparent 1px), linear-gradient(90deg, #fff3 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />
      <span className="absolute -bottom-6 -right-2 font-display text-[6rem] md:text-[8rem] font-bold leading-none text-white/15 select-none">
        0{index + 1}
      </span>
      <div data-window className="absolute left-[8%] top-[14%] w-[72%] rounded-xl bg-[rgb(255_255_255/0.92)] shadow-2xl shadow-black/30 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-black/5">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="ml-3 h-3 flex-1 rounded bg-black/10" />
        </div>
        <div className="p-4 space-y-2.5">
          <div className="h-3 w-1/2 rounded bg-black/20" />
          <div className="h-2 w-5/6 rounded bg-black/10" />
          <div className="h-2 w-2/3 rounded bg-black/10" />
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[0, 1, 2].map((i) => <div key={i} className={`h-12 rounded-lg ${i === 0 ? 'bg-[rgb(197_232_108)]' : 'bg-black/10'}`} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const live = project.live && project.live !== '#';
  const Tag = live ? 'a' : 'div';
  return (
    <Tag
      {...(live ? { href: project.live, target: '_blank', rel: 'noreferrer', 'data-cursor': 'Visit' } : {})}
      data-card
      className="glass-pearl group flex h-full w-full flex-col rounded-3xl p-3 md:p-4"
    >
      <div className={`relative ${project.image ? 'aspect-[1990/1075]' : 'h-[30vh] md:h-[34vh] max-h-[320px]'}`}>
        <Preview project={project} index={index} />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4 px-2 pt-4 pb-1">
        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">{project.category}</p>
          <h3 className="mt-2 font-display text-xl md:text-2xl font-semibold text-white">{project.title}</h3>
          <p className="mt-2 text-white/55 leading-relaxed">{project.description}</p>
        </div>
        {live && (
          <span className="grid place-items-center w-12 h-12 rounded-full border border-white/15 text-white transition-all group-hover:bg-primary-500 group-hover:text-on-primary group-hover:border-primary-500 group-hover:rotate-45">
            <ArrowUpRight size={18} />
          </span>
        )}
      </div>
      <ul className="flex flex-wrap gap-2 px-2 pt-2">
        {project.tags.map((t) => (
          <li key={t} className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-white/60">{t}</li>
        ))}
      </ul>
    </Tag>
  );
}

export default function Projects() {
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(() => {
    const reduced = prefersReducedMotion();
    const mm = gsap.matchMedia();

    // desktop: pin the section and scroll the track horizontally
    mm.add('(min-width: 1024px)', () => {
      if (reduced) return;
      const distance = () => track.current.scrollWidth - window.innerWidth + 48;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set('[data-progress-bar]', { scaleX: self.progress }),
        },
      });
      // parallax the mock window inside each card while it travels
      gsap.utils.toArray('[data-window]', root.current).forEach((w) => {
        gsap.fromTo(w, { xPercent: 12 }, {
          xPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: w.closest('[data-card]'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
      });
    });

    // mobile/tablet: simple reveal
    mm.add('(max-width: 1023px)', () => {
      if (reduced) return;
      gsap.utils.toArray('[data-card]', root.current).forEach((card) => {
        gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
      });
    });

    // 3D tilt on hover (fine pointers)
    if (!reduced && window.matchMedia('(pointer: fine)').matches) {
      gsap.utils.toArray('[data-card]', root.current).forEach((card) => {
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        gsap.set(card, { transformPerspective: 1200 });
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 8);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
        });
        card.addEventListener('mouseleave', () => { rx(0); ry(0); });
      });
    }
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} id="work" className="relative overflow-hidden lg:h-screen lg:flex lg:flex-col lg:justify-center py-28 lg:py-0">
      <div className="px-5 md:px-6 max-w-7xl mx-auto w-full lg:hidden">
        <SectionLabel index="02" label="Selected work" />
      </div>

      <div ref={track} className="flex flex-col lg:flex-row gap-6 lg:gap-8 px-5 md:px-6 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:w-max">
        {/* intro panel */}
        <div className="hidden lg:flex flex-col justify-center w-[30vw] max-w-md shrink-0 pr-8">
          <SectionLabel index="02" label="Selected work" className="!mb-8" />
          <h2 className="font-display text-white text-6xl xl:text-7xl font-semibold tracking-tight leading-[0.95]">
            Things I’ve <span className="text-gradient">shipped.</span>
          </h2>
          <p className="mt-6 text-white/50 leading-relaxed">
            Products I've built for real businesses: ERP, analytics dashboards, healthcare, pharmacy, interiors and corporate sites.
          </p>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.25em] text-white/40">Scroll to explore →</p>
        </div>

        {projects.map((p, i) => (
          <div key={p.id} className="lg:w-[min(46vw,620px)] shrink-0">
            <ProjectCard project={p} index={i} />
          </div>
        ))}
      </div>

      <div className="hidden lg:block absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-px bg-white/10" aria-hidden="true">
        <div data-progress-bar className="h-full origin-left scale-x-0 bg-gradient-to-r from-primary-500 to-primary-400" />
      </div>
    </section>
  );
}
