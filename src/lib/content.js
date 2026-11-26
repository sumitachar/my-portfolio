import { applyContent, getEditableContent } from '../data/portfolio';
import { getFirestoreApi, isFirebaseConfigured } from './firebase';

const CACHE_KEY = 'site-content-v1';

/** Where the content on screen came from, and when it was last published (for the editor's status line). */
export const contentStatus = { source: 'defaults', updatedAt: null }; // source: defaults | saved | cache
const PROJECT = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

/**
 * Load the content saved from the admin panel (Firestore doc content/site, field `json`)
 * and apply it over the built-in defaults. Uses Firestore's REST endpoint so visitors don't
 * download the Firebase SDK. Falls back to the last cached copy, then to the defaults.
 */
export async function loadContent({ timeout = 2500 } = {}) {
  if (!isFirebaseConfigured) return;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/content/site?key=${API_KEY}`;
    const res = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
    if (res.status === 404) { // nothing saved yet: use the defaults
      try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
      return;
    }
    if (!res.ok) throw new Error(`content ${res.status}`);
    const doc = await res.json();
    const json = doc?.fields?.json?.stringValue;
    if (!json) return;
    applyContent(JSON.parse(json));
    contentStatus.source = 'saved';
    contentStatus.updatedAt = doc.updateTime || null;
    try { localStorage.setItem(CACHE_KEY, json); } catch { /* ignore */ }
  } catch {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) { applyContent(JSON.parse(cached)); contentStatus.source = 'cache'; }
    } catch { /* ignore */ }
  } finally {
    clearTimeout(timer);
  }
}

/** Save all editable content (admin only; enforced by firestore.rules). */
export async function saveContent(content) {
  const json = JSON.stringify(content);
  if (json.length > 900_000) throw new Error('Content is too large to save (limit ~900 KB).');
  const { db, fs } = await getFirestoreApi();
  await fs.setDoc(fs.doc(db, 'content', 'site'), { json, updatedAt: fs.serverTimestamp() });
  applyContent(content);
  contentStatus.source = 'saved';
  contentStatus.updatedAt = new Date().toISOString();
  try { localStorage.setItem(CACHE_KEY, json); } catch { /* ignore */ }
}

export { getEditableContent };
