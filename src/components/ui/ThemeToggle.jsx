import { useEffect, useId, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const THEMES = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
];

function getInitialTheme() {
  try {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  const pillId = useId();

  useEffect(() => {
    const root = document.documentElement;
        root.classList.toggle('light', theme === 'light');
    try { localStorage.setItem('theme', theme); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  }, [theme]);

  // Keep every toggle instance (desktop + mobile) in sync
  useEffect(() => {
    const onChange = e => setTheme(e.detail);
    window.addEventListener('themechange', onChange);
    return () => window.removeEventListener('themechange', onChange);
  }, []);

  return (
    <div className="flex items-center p-1 rounded-xl glass-pearl" role="radiogroup" aria-label="Theme">
      {THEMES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          role="radio"
          aria-checked={theme === id}
          title={`${label} theme`}
          aria-label={`${label} theme`}
          onClick={() => setTheme(id)}
          className={`relative px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
            theme === id ? 'text-white' : 'text-white/50 hover:text-white'
          }`}
        >
          {theme === id && (
            <motion.span layoutId={`theme-pill-${pillId}`} className="absolute inset-0 bg-primary-500/25 rounded-lg border border-primary-500/40" />
          )}
          <Icon size={14} className="relative z-10" />
          <span className="relative z-10 hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
