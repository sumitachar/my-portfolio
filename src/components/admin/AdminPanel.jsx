import { useEffect, useMemo, useState } from 'react';
import {
  X, LogOut, Lock, PenSquare, Search, Download, Inbox, Mail, Phone, MessageCircle, Copy, Check, Trash2, ArrowLeft, Bot, FileText, AlertTriangle,
} from 'lucide-react';
import { getAuthApi, getFirestoreApi, isFirebaseConfigured } from '../../lib/firebase';
import { LEAD_STATUSES, leadToText } from '../../lib/leads';
import ContentEditor from './ContentEditor';

const STATUS_STYLE = {
  new: 'bg-sky-400/15 text-sky-300 border-sky-400/30',
  contacted: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  proposal: 'bg-violet-400/15 text-violet-300 border-violet-400/30',
  won: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  lost: 'bg-rose-400/15 text-rose-300 border-rose-400/30',
};

const toDate = (ts) => (ts?.toDate ? ts.toDate() : null);
const fmt = (d) => (d ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(d) : 'Just now');
const ago = (d) => {
  if (!d) return 'now';
  const s = (Date.now() - d.getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m`;
  if (s < 86400) return `${Math.round(s / 3600)}h`;
  return `${Math.round(s / 86400)}d`;
};

export default function AdminPanel({ onClose }) {
  const [user, setUser] = useState(isFirebaseConfigured ? undefined : null); // undefined = checking

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let unsub = () => {};
    getAuthApi().then(({ auth, api }) => { unsub = api.onAuthStateChanged(auth, setUser); });
    return () => unsub();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-[var(--color-surface)] text-white" role="dialog" aria-label="Admin panel">
      {!isFirebaseConfigured ? (
        <Shell onClose={onClose}><NotConfigured /></Shell>
      ) : user === undefined ? (
        <Shell onClose={onClose}><p className="text-white/50 text-sm">Checking session…</p></Shell>
      ) : user ? (
        <Dashboard user={user} onClose={onClose} />
      ) : (
        <Shell onClose={onClose}><Login /></Shell>
      )}
    </div>
  );
}

function Shell({ children, onClose }) {
  return (
    <div className="relative flex-1 grid place-items-center p-6">
      <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5" aria-label="Close admin">
        <X size={20} />
      </button>
      {children}
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="max-w-md text-center">
      <AlertTriangle className="mx-auto text-amber-400" size={28} />
      <h2 className="mt-4 font-display text-2xl font-semibold">Firebase isn’t connected yet</h2>
      <p className="mt-3 text-white/55 leading-relaxed text-sm">
        Add your Firebase web config to <code className="text-white/80">.env.local</code> (see <code className="text-white/80">.env.example</code>), then restart the dev server.
      </p>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { auth, api } = await getAuthApi();
      await api.signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      const code = err?.code || '';
      setError(
        code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')
          ? 'Wrong email or password.'
          : code.includes('too-many-requests') ? 'Too many attempts. Try again in a few minutes.' : 'Sign-in failed. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const field = 'w-full rounded-xl bg-white/[0.05] border border-[var(--line)] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary-500';
  return (
    <form onSubmit={submit} className="w-full max-w-sm glass-pearl rounded-3xl p-7">
      <span className="grid place-items-center w-12 h-12 rounded-2xl bg-primary-500/15 text-primary-400"><Lock size={20} /></span>
      <h2 className="mt-5 font-display text-2xl font-semibold">Admin sign in</h2>
      <p className="mt-1 text-sm text-white/50">View and manage project enquiries.</p>
      <div className="mt-6 space-y-3">
        <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={field} />
        <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className={field} />
      </div>
      {error && <p className="mt-3 text-sm text-rose-400" role="alert">{error}</p>}
      <button disabled={loading} className="mt-6 w-full rounded-full bg-primary-500 py-3 text-sm font-medium text-on-primary hover:bg-primary-600 disabled:opacity-50 transition-colors">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

function Dashboard({ user, onClose }) {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState('leads'); // leads | content
  const [loadedAt, setLoadedAt] = useState(0);

  // live subscription to the leads collection
  useEffect(() => {
    let unsub = () => {};
    getFirestoreApi().then(({ db, fs }) => {
      const q = fs.query(fs.collection(db, 'leads'), fs.orderBy('createdAt', 'desc'), fs.limit(500));
      unsub = fs.onSnapshot(
        q,
        (snap) => {
          setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setLoadedAt(Date.now());
          setLoading(false);
        },
        (err) => {
          setError(err.code === 'permission-denied'
            ? 'This account isn’t allowed to read leads. Check that its UID is set in firestore.rules and the rules are published.'
            : 'Could not load leads. Check your connection.');
          setLoading(false);
        },
      );
    });
    return () => unsub();
  }, []);

  const signOut = async () => {
    const { auth, api } = await getAuthApi();
    await api.signOut(auth);
  };

  const counts = useMemo(() => {
    const week = loadedAt - 7 * 86400000;
    return {
      all: leads.length,
      ...Object.fromEntries(LEAD_STATUSES.map((s) => [s, leads.filter((l) => (l.status || 'new') === s).length])),
      week: leads.filter((l) => (toDate(l.createdAt)?.getTime() ?? loadedAt) > week).length,
    };
  }, [leads, loadedAt]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => (filter === 'all' || (l.status || 'new') === filter)
      && (!q || [l.name, l.email, l.phone, l.service, l.message].some((v) => v?.toLowerCase().includes(q))));
  }, [leads, filter, query]);

  const selected = leads.find((l) => l.id === selectedId);

  const exportCsv = () => {
    const cols = ['createdAt', 'status', 'source', 'name', 'email', 'phone', 'service', 'budget', 'timeline', 'design', 'features', 'message', 'notes'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = visible.map((l) => cols.map((c) => esc(c === 'createdAt' ? toDate(l.createdAt)?.toISOString() : c === 'features' ? (l.features || []).join('; ') : l[c])).join(','));
    const blob = new Blob([[cols.join(','), ...rows].join('\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `leads-${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      {/* top bar */}
      <header className="shrink-0 flex flex-wrap items-center gap-3 border-b border-[var(--line)] px-5 py-4">
        <div className="flex items-center gap-3 mr-auto">
          <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-500/15 text-primary-400">{tab === 'leads' ? <Inbox size={18} /> : <PenSquare size={18} />}</span>
          <div>
            <h1 className="font-display text-lg font-semibold leading-tight">Admin</h1>
            <p className="text-xs text-white/45">{user.email}</p>
          </div>
          <div className="ml-4 flex rounded-full border border-[var(--line)] p-1" role="tablist" aria-label="Admin sections">
            {[['leads', 'Leads'], ['content', 'Content']].map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${tab === id ? 'bg-primary-500 text-on-primary' : 'text-white/60 hover:text-white'}`}
              >
                {label}{id === 'leads' && counts.new ? <span className="ml-1.5 opacity-70">{counts.new}</span> : null}
              </button>
            ))}
          </div>
        </div>
        {tab === 'leads' && (
          <button onClick={exportCsv} disabled={!visible.length} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-white/70 hover:text-white disabled:opacity-40">
            <Download size={15} /> Export CSV
          </button>
        )}
        <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-white/70 hover:text-white">
          <LogOut size={15} /> Sign out
        </button>
        <button onClick={onClose} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5" aria-label="Close admin"><X size={20} /></button>
      </header>

      {tab === 'content' ? <ContentEditor /> : (<>
      {/* stats */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-4 gap-3 px-5 pt-4">
        {[['Total leads', counts.all], ['New', counts.new], ['This week', counts.week], ['Won', counts.won]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[var(--line)] bg-white/[0.03] px-4 py-3">
            <p className="text-xs text-white/45">{label}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="shrink-0 flex flex-wrap items-center gap-2 px-5 py-4">
        {['all', ...LEAD_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs capitalize border transition-colors ${filter === s ? 'bg-primary-500 border-primary-500 text-on-primary' : 'border-[var(--line)] text-white/60 hover:text-white'}`}
          >
            {s} <span className="opacity-60">{counts[s] ?? 0}</span>
          </button>
        ))}
        <label className="relative ml-auto w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, project…" className="w-full rounded-full bg-white/[0.05] border border-[var(--line)] pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary-500" />
        </label>
      </div>

      {error && <p className="mx-5 mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300" role="alert">{error}</p>}

      {/* list + detail */}
      <div className="flex-1 min-h-0 grid md:grid-cols-[minmax(300px,420px)_1fr] border-t border-[var(--line)]">
        <ul data-lenis-prevent className={`overflow-y-auto border-r border-[var(--line)] ${selected ? 'hidden md:block' : ''}`}>
          {loading && <li className="p-5 text-sm text-white/50">Loading leads…</li>}
          {!loading && !visible.length && !error && <li className="p-5 text-sm text-white/50">No leads here yet.</li>}
          {visible.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => setSelectedId(l.id)}
                className={`w-full text-left px-5 py-4 border-b border-[var(--line)] transition-colors ${selectedId === l.id ? 'bg-primary-500/10' : 'hover:bg-white/[0.03]'}`}
              >
                <div className="flex items-center gap-2">
                  {(l.status || 'new') === 'new' && <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />}
                  <span className="font-medium truncate">{l.name || 'Unknown'}</span>
                  <span className="ml-auto text-xs text-white/40 shrink-0">{ago(toDate(l.createdAt))}</span>
                </div>
                <p className="mt-1 text-sm text-white/60 truncate">{l.service || 'General enquiry'}{l.budget ? ` · ${l.budget}` : ''}</p>
                <p className="mt-1 text-xs text-white/40 truncate">{l.message}</p>
              </button>
            </li>
          ))}
        </ul>

        <div data-lenis-prevent className={`overflow-y-auto ${selected ? '' : 'hidden md:grid place-items-center'}`}>
          {selected ? <LeadDetail key={selected.id} lead={selected} onBack={() => setSelectedId(null)} /> : <p className="text-sm text-white/40">Select a lead to see the details.</p>}
        </div>
      </div>
      </>)}
    </>
  );
}

function LeadDetail({ lead, onBack }) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const update = async (patch) => {
    const { db, fs } = await getFirestoreApi();
    await fs.updateDoc(fs.doc(db, 'leads', lead.id), { ...patch, updatedAt: fs.serverTimestamp() });
  };
  const saveNotes = async () => {
    setBusy(true);
    try { await update({ notes: notes.slice(0, 5000) }); setSaved(true); setTimeout(() => setSaved(false), 1500); } finally { setBusy(false); }
  };
  const remove = async () => {
    const { db, fs } = await getFirestoreApi();
    await fs.deleteDoc(fs.doc(db, 'leads', lead.id));
    onBack();
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(leadToText(lead)); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ }
  };

  const digits = (lead.phone || '').replace(/[^\d]/g, '');
  const subject = encodeURIComponent(`Re: your ${lead.service ? lead.service.toLowerCase() : 'project'} enquiry`);
  const status = lead.status || 'new';
  const rows = [
    ['Project', lead.service], ['Budget', lead.budget], ['Timeline', lead.timeline], ['Designs', lead.design],
    ['Features', lead.features?.length ? lead.features.join(', ') : ''], ['Email', lead.email], ['Phone', lead.phone], ['Page', lead.page],
  ].filter(([, v]) => v);

  return (
    <article className="p-5 md:p-8 max-w-3xl">
      <button onClick={onBack} className="md:hidden mb-4 inline-flex items-center gap-1.5 text-sm text-white/60"><ArrowLeft size={15} /> All leads</button>

      <div className="flex flex-wrap items-start gap-3">
        <div className="mr-auto">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">{lead.name}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-white/50">
            {lead.source === 'chatbot' ? <Bot size={14} /> : <FileText size={14} />}
            {lead.source === 'chatbot' ? 'Project assistant' : 'Contact form'} · {fmt(toDate(lead.createdAt))}
          </p>
        </div>
        <select
          value={status}
          onChange={(e) => update({ status: e.target.value })}
          aria-label="Lead status"
          className={`rounded-full border px-4 py-2 text-sm capitalize outline-none ${STATUS_STYLE[status]} [&>option]:bg-[var(--color-surface-2)] [&>option]:text-white`}
        >
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* quick actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <a href={`mailto:${lead.email}?subject=${subject}`} className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-600"><Mail size={15} /> Reply by email</a>
        {digits && <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-400/10"><MessageCircle size={15} /> WhatsApp</a>}
        {digits && <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-white/70 hover:text-white"><Phone size={15} /> Call</a>}
        <button onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-white/70 hover:text-white">
          {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy details'}
        </button>
      </div>

      <section className="mt-8">
        <h3 className="text-xs uppercase tracking-[0.2em] text-white/40">Project details</h3>
        <p className="mt-3 whitespace-pre-line leading-relaxed text-white/85">{lead.message}</p>
      </section>

      <dl className="mt-8 grid sm:grid-cols-2 gap-3">
        {rows.map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-[var(--line)] bg-white/[0.03] px-4 py-3">
            <dt className="text-xs text-white/40">{k}</dt>
            <dd className="mt-1 text-sm text-white/85 break-words">{v}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-8">
        <h3 className="text-xs uppercase tracking-[0.2em] text-white/40">Private notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Call notes, quote sent, follow-up date…"
          className="mt-3 w-full rounded-2xl bg-white/[0.05] border border-[var(--line)] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary-500 resize-y"
        />
        <button onClick={saveNotes} disabled={busy || notes === (lead.notes || '')} className="mt-2 inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-white/70 hover:text-white disabled:opacity-40">
          {saved ? <><Check size={15} className="text-emerald-400" /> Saved</> : 'Save notes'}
        </button>
      </section>

      <div className="mt-10 pt-6 border-t border-[var(--line)]">
        {confirmDelete ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-rose-300">Delete this lead permanently? This can’t be undone.</p>
            <button onClick={remove} className="rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-[#fff]">Delete</button>
            <button onClick={() => setConfirmDelete(false)} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-white/70">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-sm text-rose-400/80 hover:text-rose-300"><Trash2 size={15} /> Delete lead</button>
        )}
      </div>
    </article>
  );
}
