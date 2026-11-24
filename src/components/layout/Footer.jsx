import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';
import { socials } from '../site/Contact';
import { useLenis, scrollToId } from '../site/SmoothScroll';

function useKolkataTime() {
  const fmt = () => new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

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

        <p className="mt-12 font-display font-bold leading-none tracking-[-0.05em] text-[22vw] md:text-[17vw] text-outline select-none text-center" aria-hidden="true">
          {personalInfo.name.split(' ')[0]}
        </p>

        <p className="mt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} {personalInfo.name}. Designed &amp; built in Kolkata.
        </p>
      </div>
    </footer>
  );
}
