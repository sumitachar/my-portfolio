import { lazy, Suspense, useEffect, useState } from 'react';
import { useLenis } from '../site/SmoothScroll';

const AdminPanel = lazy(() => import('./AdminPanel'));
const ADMIN_KEY = (import.meta.env.VITE_ADMIN_KEY || '').trim().toLowerCase();

const isTypingTarget = (el) => el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

/**
 * Hidden entry to the admin panel. Two ways in:
 *  1. type the secret key anywhere on the page (not inside a text field)
 *  2. open the site with #<key> in the URL (works on mobile)
 * The key only reveals the login screen. The real protection is Firebase Auth
 * plus firestore.rules, which only let the admin UID read leads.
 */
export default function AdminGate() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!ADMIN_KEY) return;
    let buffer = '';
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTypingTarget(e.target) || e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-ADMIN_KEY.length);
      if (buffer === ADMIN_KEY) {
        buffer = '';
        setOpen(true);
      }
    };
    const checkHash = () => {
      if (decodeURIComponent(window.location.hash.slice(1)).toLowerCase() === ADMIN_KEY) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
        setOpen(true);
      }
    };
    checkHash();
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', checkHash);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  // freeze page scrolling behind the panel
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [open, lenis]);

  if (!open) return null;
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[150] grid place-items-center bg-[var(--color-surface)] text-white/60 text-sm">Loading admin…</div>}>
      <AdminPanel onClose={() => setOpen(false)} />
    </Suspense>
  );
}
