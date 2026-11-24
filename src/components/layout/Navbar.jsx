import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { navLinks, personalInfo } from '../../data/portfolio';
import { gsap, useGSAP, ScrollTrigger } from '../../lib/gsap';
import { useLenis, scrollToId } from '../site/SmoothScroll';
import ThemeToggle from '../ui/ThemeToggle';
import Magnetic from '../site/Magnetic';

export default function Navbar({ ready }) {
  const bar = useRef(null);
  const menu = useRef(null);
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const openRef = useRef(open);
  openRef.current = open;

  // entrance once the preloader finishes, then hide on scroll down / show on scroll up
  useGSAP(() => {
    if (!ready) return;
    gsap.fromTo(bar.current, { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.4 });
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setScrolled(self.scroll() > 40);
        if (openRef.current) return;
        gsap.to(bar.current, { yPercent: self.direction === 1 && self.scroll() > 400 ? -120 : 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
      },
    });
  }, { dependencies: [ready] });

  // highlight the section currently in view
  useEffect(() => {
    const triggers = navLinks.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => self.isActive && setActive(id),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [ready]);

  // full-screen mobile menu
  useGSAP(() => {
    if (!menu.current) return;
    if (open) {
      gsap.set(menu.current, { display: 'flex' });
      gsap.fromTo(menu.current, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.8, ease: 'expo.inOut' });
      gsap.fromTo('[data-mlink]', { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.7, ease: 'expo.out', delay: 0.3 });
    } else {
      gsap.to(menu.current, { clipPath: 'circle(0% at 100% 0%)', duration: 0.6, ease: 'expo.inOut', onComplete: () => gsap.set(menu.current, { display: 'none' }) });
    }
  }, { dependencies: [open] });

  const go = (id) => {
    setOpen(false);
    scrollToId(lenis, id);
  };

  return (
    <>
      <header ref={bar} className="fixed top-0 inset-x-0 z-50 opacity-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
          <div className={`flex items-center justify-between rounded-2xl px-4 md:px-5 py-3 transition-all duration-500 ${scrolled ? 'glass-pearl' : ''}`}>
            <button onClick={() => go('top')} className="font-display font-bold text-white text-lg tracking-tight" data-cursor="Top">
              {personalInfo.name.split(' ')[0]}<span className="text-primary-500">.</span>
            </button>

            <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className={`relative px-4 py-2 text-sm rounded-full transition-colors ${active === l.id ? 'text-white' : 'text-white/50 hover:text-white'}`}
                >
                  {active === l.id && <span className="absolute inset-0 rounded-full bg-white/[0.07] border border-white/10" />}
                  <span className="relative">{l.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              <Magnetic className="hidden md:inline-block">
                <button
                  onClick={() => go('contact')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-[var(--color-surface)] px-4 py-2 text-sm font-medium hover:bg-primary-500 hover:text-on-primary transition-colors"
                >
                  Let’s talk <ArrowUpRight size={15} />
                </button>
              </Magnetic>
              <button className="md:hidden p-2 rounded-xl glass text-white" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div ref={menu} className="fixed inset-0 z-40 hidden flex-col justify-center gap-2 px-8 bg-[var(--color-surface-2)] md:hidden">
        {navLinks.map((l, i) => (
          <div key={l.id} className="overflow-hidden">
            <button data-mlink onClick={() => go(l.id)} className="flex items-baseline gap-4 font-display text-5xl font-semibold text-white">
              <span className="font-mono text-sm text-primary-400">0{i + 1}</span>
              {l.label}
            </button>
          </div>
        ))}
        <p className="mt-10 font-mono text-xs text-white/40">{personalInfo.email}</p>
      </div>
    </>
  );
}
