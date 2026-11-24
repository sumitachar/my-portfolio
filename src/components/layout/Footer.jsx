import { ArrowUp } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';
import { socials } from '../site/Contact';
import { useLenis, scrollToId } from '../site/SmoothScroll';
import { useKolkataTime } from '../../lib/time';
import HexName from '../site/HexName';

export default function Footer() {
  const lenis = useLenis();
  const time = useKolkataTime();

  return (
    <footer className="relative px-5 md:px-6 pt-10 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
          <span>Local time · Kolkata {time}</span>
          <div className="flex gap-6">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{s.label}</a>
            ))}
            <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors">Email</a>
          </div>
          <button onClick={() => scrollToId(lenis, 'top')} className="inline-flex items-center gap-2 hover:text-white transition-colors">
            Back to top <ArrowUp size={14} />
          </button>
        </div>

        {/* my name, drawn in coloured hexagons: click one to theme the site */}
        <div className="mt-14">
          <HexName text={personalInfo.name.split(' ')[0]} />
        </div>

        <p className="mt-10 text-center text-xs text-white/30">
          © {new Date().getFullYear()} {personalInfo.name}. Designed &amp; built in Kolkata.
        </p>
      </div>
    </footer>
  );
}
