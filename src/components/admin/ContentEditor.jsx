import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Plus, RotateCcw, Trash2, X, Check, RefreshCw, AlertTriangle } from 'lucide-react';
import { getDefaultSection } from '../../data/portfolio';
import { getEditableContent, saveContent, contentStatus } from '../../lib/content';

const when = (iso) => (iso ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)) : '');

/* ---------------- schema: what can be edited, and how ---------------- */
const text = (label, hint) => ({ type: 'text', label, hint });
const area = (label, hint) => ({ type: 'textarea', label, hint });
const list = (label, hint) => ({ type: 'list', label, hint });
const obj = (fields) => ({ type: 'object', fields });
const arr = (item, itemLabel) => ({ type: 'array', item, itemLabel });

const SECTIONS = [
  {
    key: 'personalInfo', label: 'Profile', hint: 'Your name, headline, bio and contact details, used across the site.',
    schema: obj({
      name: text('Name'),
      role: text('Role / headline', 'Shown in the hero and the page title area.'),
      tagline: text('Tagline'),
      bio: area('Bio', 'The paragraph in the About section.'),
      email: text('Email', 'Used for contact buttons and the email fallback.'),
      location: text('Location', 'City first, e.g. "Kolkata, West Bengal, India".'),
      availability: text('Availability line'),
      currentWork: text('Currently building', 'Shown in the hero status card and the About "Now" pill.'),
      coreStack: list('Core stack', 'Shown in the hero status card.'),
    }),
  },
  {
    key: 'stats', label: 'Stats', hint: 'The four numbers in the About section.',
    schema: arr(obj({ value: { type: 'number', label: 'Number' }, suffix: text('Suffix', 'e.g. +, %'), label: text('Label') }), (v) => `${v.value ?? ''}${v.suffix ?? ''} · ${v.label ?? ''}`),
  },
  {
    key: 'trustPoints', label: 'Trust points', hint: 'The four reassurance cards under the hero.',
    schema: arr(obj({ title: text('Title'), text: text('Text') }), (v) => v.title),
  },
  {
    key: 'services', label: 'Services', hint: 'The expandable rows in the Services section (also used by the contact form).',
    schema: arr(obj({ title: text('Title'), text: area('Description'), tags: list('Deliverables') }), (v) => v.title),
  },
  {
    key: 'projects', label: 'Projects', hint: 'Live projects with a screenshot appear as large panels; the rest appear in the private index.',
    schema: arr(obj({
      title: text('Title'),
      slug: text('Slug', 'Short id, e.g. "animora". A screenshot file with this name in src/assets/projects is used automatically.'),
      category: text('Category'),
      description: area('Description'),
      tags: list('Built with'),
      live: text('Live URL', 'Leave empty (or "#") for private projects.'),
      imageUrl: text('Screenshot URL', 'Optional: a link to an image. Overrides the bundled screenshot.'),
      private: { type: 'bool', label: 'Private client project' },
    }), (v) => v.title),
  },
  {
    key: 'processSteps', label: 'Process', hint: 'The steps of the pinned Process walkthrough.',
    schema: arr(obj({ step: text('Step number', 'e.g. 01'), title: text('Title'), time: text('Time label', 'e.g. "Within 24–48h"'), text: area('Description') }), (v) => `${v.step ?? ''} ${v.title ?? ''}`),
  },
  {
    key: 'experience', label: 'Experience', hint: 'Your timeline, newest first. Add several roles to show a promotion at the same company.',
    schema: arr(obj({
      role: text('Current title'),
      company: text('Company'),
      period: text('Period', 'e.g. "Dec 2023 - Aug 2026"'),
      description: area('Description'),
      highlights: list('Highlights'),
      roles: { ...arr(obj({ title: text('Title'), period: text('Period') }), (v) => `${v.title ?? ''} · ${v.period ?? ''}`), label: 'Promotions at this company (newest first, optional)' },
    }), (v) => `${v.role ?? ''} · ${v.company ?? ''}`),
  },
  {
    key: 'stackLayers', label: 'Stack', hint: 'The layered tech stack section.',
    schema: arr(obj({ layer: text('Layer'), note: text('Note'), items: list('Technologies') }), (v) => v.layer),
  },
  {
    key: 'techStack', label: 'Tech ticker', hint: 'The scrolling technology names under the hero.',
    schema: arr(obj({ name: text('Name') }), (v) => v.name),
  },
  {
    key: 'faqs', label: 'FAQ', hint: 'Questions and answers in the FAQ section.',
    schema: arr(obj({ q: text('Question'), a: area('Answer') }), (v) => v.q),
  },
];

const blank = (s) => {
  switch (s.type) {
    case 'number': return 0;
    case 'bool': return false;
    case 'list': case 'array': return [];
    case 'object': return Object.fromEntries(Object.entries(s.fields).map(([k, f]) => [k, blank(f)]));
    default: return '';
  }
};

const inputCls = 'w-full rounded-xl bg-white/[0.04] border border-[var(--line)] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary-500 transition-colors';

/* ---------------- field editors ---------------- */
function Label({ s }) {
  return (
    <span className="block mb-1.5">
      <span className="text-xs font-medium text-white/70">{s.label}</span>
      {s.hint && <span className="block text-[11px] text-white/35 leading-snug mt-0.5">{s.hint}</span>}
    </span>
  );
}

function ListField({ value = [], onChange }) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft('');
  };
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/[0.02] p-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map((t, i) => (
          <span key={`${t}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-white/[0.07] pl-3 pr-1 py-1 text-xs text-white/80">
            {t}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="grid place-items-center w-5 h-5 rounded-full hover:bg-white/10" aria-label={`Remove ${t}`}><X size={12} /></button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          onBlur={add}
          placeholder="Type and press Enter"
          className="flex-1 min-w-[140px] bg-transparent px-2 py-1 text-xs text-white placeholder:text-white/30 outline-none"
        />
      </div>
    </div>
  );
}

function Field({ s, value, onChange }) {
  switch (s.type) {
    case 'textarea':
      return <label className="block"><Label s={s} /><textarea rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-y leading-relaxed`} /></label>;
    case 'number':
      return <label className="block"><Label s={s} /><input type="number" value={value ?? 0} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} className={inputCls} /></label>;
    case 'bool':
      return (
        <label className="flex items-center gap-3 py-1 cursor-pointer">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-[rgb(var(--primary-500))]" />
          <span className="text-sm text-white/75">{s.label}</span>
        </label>
      );
    case 'list':
      return <div><Label s={s} /><ListField value={value} onChange={onChange} /></div>;
    case 'object':
      return (
        <div className="grid gap-4">
          {Object.entries(s.fields).map(([k, f]) => (
            <Field key={k} s={f} value={value?.[k]} onChange={(v) => onChange({ ...value, [k]: v })} />
          ))}
        </div>
      );
    case 'array':
      return <ArrayField s={s} value={value} onChange={onChange} />;
    default:
      return <label className="block"><Label s={s} /><input value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls} /></label>;
  }
}

function ArrayField({ s, value = [], onChange }) {
  const [open, setOpen] = useState(() => new Set());
  const toggle = (i) => setOpen((o) => { const n = new Set(o); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen((o) => { const n = new Set(); o.forEach((k) => n.add(k === i ? j : k === j ? i : k)); return n; });
  };
  const remove = (i) => { onChange(value.filter((_, k) => k !== i)); setOpen(new Set()); };
  const duplicate = (i) => { const next = [...value]; next.splice(i + 1, 0, JSON.parse(JSON.stringify(value[i]))); onChange(next); setOpen(new Set([i + 1])); };
  const add = () => { onChange([...value, blank(s.item)]); setOpen(new Set([value.length])); };
  const iconBtn = 'grid place-items-center w-8 h-8 rounded-lg text-white/45 hover:text-white hover:bg-white/[0.06] disabled:opacity-25 disabled:pointer-events-none';

  return (
    <div>
      {s.label && <Label s={s} />}
      <ul className="space-y-2">
        {value.map((item, i) => {
          const isOpen = open.has(i);
          const title = (s.itemLabel?.(item) || '').trim() || `Item ${i + 1}`;
          return (
            <li key={i} className="rounded-2xl border border-[var(--line)] bg-white/[0.02]">
              <div className="flex items-center gap-2 pl-4 pr-2 py-2">
                <button type="button" onClick={() => toggle(i)} className="flex-1 min-w-0 flex items-center gap-3 text-left py-1">
                  <span className="font-mono text-[11px] text-white/35">{String(i + 1).padStart(2, '0')}</span>
                  <span className="truncate text-sm text-white/85">{title}</span>
                  <ChevronDown size={15} className={`ml-auto shrink-0 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={iconBtn} aria-label="Move up"><ChevronUp size={15} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className={iconBtn} aria-label="Move down"><ChevronDown size={15} /></button>
                <button type="button" onClick={() => duplicate(i)} className={iconBtn} aria-label="Duplicate"><Copy size={14} /></button>
                <button type="button" onClick={() => remove(i)} className={`${iconBtn} hover:text-rose-300`} aria-label="Delete"><Trash2 size={14} /></button>
              </div>
              {isOpen && (
                <div className="border-t border-[var(--line)] p-4">
                  <Field s={s.item} value={item} onChange={(v) => onChange(value.map((x, k) => (k === i ? v : x)))} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={add} className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--line-strong)] px-4 py-2 text-xs text-white/70 hover:text-white hover:border-primary-500/60">
        <Plus size={14} /> Add {s.label ? 'role' : 'item'}
      </button>
    </div>
  );
}

/* ---------------- the editor ---------------- */
export default function ContentEditor() {
  const [saved, setSaved] = useState(getEditableContent);
  const [draft, setDraft] = useState(getEditableContent);
  const [active, setActive] = useState(SECTIONS[0].key);
  const [status, setStatus] = useState({ kind: 'idle' }); // idle | saving | saved | error
  const [confirmReset, setConfirmReset] = useState(false);

  const dirtyKeys = useMemo(
    () => new Set(SECTIONS.filter((s) => JSON.stringify(draft[s.key]) !== JSON.stringify(saved[s.key])).map((s) => s.key)),
    [draft, saved],
  );
  const section = SECTIONS.find((s) => s.key === active);

  const update = (key, value) => { setDraft((d) => ({ ...d, [key]: value })); setStatus({ kind: 'idle' }); };

  const publish = async () => {
    setStatus({ kind: 'saving' });
    try {
      await saveContent(draft);
      setSaved(draft);
      setStatus({ kind: 'saved' });
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err?.code === 'permission-denied'
          ? 'Not allowed to save. Make sure you are signed in as the admin and the content rules in firestore.rules are published.'
          : err?.message || 'Could not save. Check your connection and try again.',
      });
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* action bar */}
      <div className="shrink-0 flex flex-wrap items-center gap-3 border-b border-[var(--line)] px-5 py-3">
        <p className="mr-auto text-sm">
          {status.kind === 'saving' && <span className="text-white/60">Publishing…</span>}
          {status.kind === 'saved' && (
            <span className="inline-flex items-center gap-2 text-emerald-300">
              <Check size={15} /> Published. Reload the site to see your changes.
              <button type="button" onClick={() => window.location.reload()} className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 px-2.5 py-0.5 text-xs hover:bg-emerald-400/10"><RefreshCw size={12} /> Reload now</button>
            </span>
          )}
          {status.kind === 'error' && <span className="inline-flex items-center gap-2 text-rose-300"><AlertTriangle size={15} /> {status.message}</span>}
          {status.kind === 'idle' && (dirtyKeys.size
            ? <span className="text-amber-300">Unsaved changes in {dirtyKeys.size} section{dirtyKeys.size > 1 ? 's' : ''}. Press Save &amp; publish to put them live.</span>
            : contentStatus.source === 'saved'
              ? <span className="text-white/45">No unsaved changes · live version published {when(contentStatus.updatedAt)}</span>
              : <span className="text-white/55">The site is showing its built-in content. Edit any field, then press <span className="text-white">Save &amp; publish</span>.</span>)}
        </p>
        <button type="button" onClick={() => { setDraft(saved); setStatus({ kind: 'idle' }); }} disabled={!dirtyKeys.size} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-white/70 hover:text-white disabled:opacity-35">Discard</button>
        <button type="button" onClick={publish} disabled={!dirtyKeys.size || status.kind === 'saving'} className="rounded-full bg-primary-500 px-5 py-2 text-sm font-medium text-on-primary hover:bg-primary-600 disabled:opacity-40">Save &amp; publish</button>
      </div>

      <div className="flex-1 min-h-0 grid md:grid-cols-[220px_1fr]">
        {/* sections */}
        <nav data-lenis-prevent className="overflow-y-auto border-b md:border-b-0 md:border-r border-[var(--line)] p-3 flex md:block gap-1 overflow-x-auto" aria-label="Content sections">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => { setActive(s.key); setConfirmReset(false); }}
              className={`shrink-0 w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${active === s.key ? 'bg-primary-500/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/[0.04]'}`}
            >
              {s.label}
              {dirtyKeys.has(s.key) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-300" aria-label="unsaved" />}
            </button>
          ))}
        </nav>

        {/* editor */}
        <div data-lenis-prevent className="overflow-y-auto p-5 md:p-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-start gap-3 mb-6">
              <div className="mr-auto">
                <h2 className="font-display text-2xl font-semibold text-white">{section.label}</h2>
                <p className="mt-1 text-sm text-white/45">{section.hint}</p>
              </div>
              {confirmReset ? (
                <span className="inline-flex items-center gap-2 text-xs">
                  <span className="text-white/60">Reset this section to the original content?</span>
                  <button type="button" onClick={() => { update(section.key, getDefaultSection(section.key)); setConfirmReset(false); }} className="rounded-full bg-rose-500/80 px-3 py-1.5 text-[#fff]">Reset</button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-white/70">Cancel</button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-white/55 hover:text-white">
                  <RotateCcw size={12} /> Reset section
                </button>
              )}
            </div>
            <Field s={section.schema} value={draft[section.key]} onChange={(v) => update(section.key, v)} />
          </div>
        </div>
      </div>
    </div>
  );
}
