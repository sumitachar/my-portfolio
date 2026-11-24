import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, X, Send, RotateCcw, Check, Mail, Sparkles } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';
import {
  SERVICE_OPTIONS, FEATURE_OPTIONS, DESIGN_OPTIONS, BUDGET_OPTIONS, TIMELINE_OPTIONS, MENU_OPTIONS, matchFaq,
} from '../../data/assistant';
import { saveLead, leadMailto, isFirebaseConfigured } from '../../lib/leads';
import { OPEN_ASSISTANT_EVENT } from '../../lib/assistant';

const STORAGE_KEY = 'project-assistant-v1';
const FLOW = ['service', 'idea', 'features', 'design', 'budget', 'timeline', 'name', 'email', 'phone', 'summary'];
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{6,19}$/;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const firstName = (name = '') => name.trim().split(/\s+/)[0] || '';

function prompts(step, data) {
  switch (step) {
    case 'service': return ['What would you like to build?'];
    case 'idea': return [`Great choice! Tell me a little about your idea: what does your business do, and what should the ${data.service?.toLowerCase() || 'project'} help you achieve?`];
    case 'features': return ['Which features do you need? Tap all that apply, then press Continue. You can also type your own.'];
    case 'design': return ['Do you already have designs or an existing product?'];
    case 'budget': return ['What budget range do you have in mind? It just helps Sumit suggest the right approach.'];
    case 'timeline': return ['And when would you like to launch?'];
    case 'name': return ['Almost done! What’s your name?'];
    case 'email': return [`Thanks, ${firstName(data.name)}! Which email should Sumit send your estimate to?`];
    case 'phone': return ['Prefer a quick call or WhatsApp chat? Share your number with country code, or tap Skip.'];
    case 'summary': return ['Here’s your project summary. Look good?'];
    default: return [];
  }
}

function chipsFor(step, data) {
  switch (step) {
    case 'menu': case 'done': return MENU_OPTIONS;
    case 'service': return SERVICE_OPTIONS;
    case 'features': return FEATURE_OPTIONS[data.service] || FEATURE_OPTIONS.default;
    case 'design': return DESIGN_OPTIONS;
    case 'budget': return BUDGET_OPTIONS;
    case 'timeline': return TIMELINE_OPTIONS;
    case 'phone': return ['Skip'];
    default: return [];
  }
}

const placeholderFor = {
  idea: 'e.g. A booking website for my clinic…',
  name: 'Your name',
  email: 'you@company.com',
  phone: '+91 98765 43210',
  features: 'Add another feature…',
};

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.messages?.length) return saved;
  } catch { /* ignore */ }
  return null;
}

export default function ChatAssistant() {
  const [saved] = useState(loadSaved);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(saved?.messages || []);
  const [step, setStep] = useState(saved?.step || 'menu');
  const [data, setData] = useState(saved?.data || {});
  const [picked, setPicked] = useState([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [teaser, setTeaser] = useState(false);
  const scroller = useRef(null);
  const inputRef = useRef(null);
  const busy = useRef(false);
  const started = useRef(Boolean(saved));
  const stepRef = useRef(step);
  useEffect(() => { stepRef.current = step; }, [step]);

  // persist the conversation so a refresh doesn't lose it
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, step, data })); } catch { /* ignore */ }
  }, [messages, step, data]);

  // keep the newest message in view
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open, step]);

  const push = (msg) => setMessages((m) => [...m, { id: `${Date.now()}-${Math.random()}`, ...msg }]);

  /** Bot "types" each line, then moves to the next step. */
  const say = useCallback(async (lines, nextStep, extra) => {
    busy.current = true;
    for (const text of lines) {
      setTyping(true);
      await sleep(Math.min(1100, 350 + text.length * 9));
      setTyping(false);
      setMessages((m) => [...m, { id: `${Date.now()}-${Math.random()}`, from: 'bot', text }]);
      await sleep(120);
    }
    if (extra) setMessages((m) => [...m, { id: `${Date.now()}-x`, from: 'bot', ...extra }]);
    if (nextStep) setStep(nextStep);
    busy.current = false;
  }, []);

  const greet = useCallback(() => {
    started.current = true;
    say([
      `Hi! I’m ${firstName(personalInfo.name)}’s project assistant 👋`,
      'I can help you plan your website or app and get a free estimate within 24 hours. What would you like to do?',
    ], 'menu');
  }, [say]);

  const goTo = useCallback((next, d) => say(prompts(next, d), next), [say]);

  // open from anywhere on the page
  useEffect(() => {
    const onOpen = (e) => {
      setOpen(true);
      setTeaser(false);
      const s = stepRef.current;
      if (e.detail === 'project' && !busy.current && (s === 'menu' || s === 'done')) {
        started.current = true;
        setData({});
        say(['Let’s plan your project! It takes about 2 minutes.', ...prompts('service', {})], 'service');
      }
    };
    window.addEventListener(OPEN_ASSISTANT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, onOpen);
  }, [say]);

  // greet on first open
  useEffect(() => {
    if (open && !started.current) greet();
    if (open) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 300);
  }, [open, greet]);

  // gentle teaser bubble once per session
  useEffect(() => {
    try { if (sessionStorage.getItem('assistant-teaser')) return; } catch { /* ignore */ }
    const id = setTimeout(() => setTeaser(true), 9000);
    return () => clearTimeout(id);
  }, []);
  const dismissTeaser = () => {
    setTeaser(false);
    try { sessionStorage.setItem('assistant-teaser', '1'); } catch { /* ignore */ }
  };

  // Escape closes the panel
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const restart = () => {
    setMessages([]);
    setData({});
    setPicked([]);
    setStep('menu');
    started.current = false;
    greet();
  };

  const nextAfter = (s) => FLOW[FLOW.indexOf(s) + 1];

  const submit = async () => {
    const lead = { ...data, message: data.idea, source: 'chatbot' };
    if (!isFirebaseConfigured) {
      await say(['I couldn’t send this automatically, but you can email it to Sumit in one tap:'], 'done', { kind: 'mailto', href: leadMailto(lead) });
      return;
    }
    setStep('sending');
    try {
      await saveLead(lead);
      await say([
        `Thank you, ${firstName(data.name)}! 🎉 Your project request is with Sumit.`,
        `He’ll review it personally and reply to ${data.email} within 24 hours with next steps and an estimate.`,
        'Anything else you’d like to know meanwhile?',
      ], 'done');
    } catch {
      await say(['Hmm, something went wrong sending your request. You can email it to Sumit in one tap instead:'], 'done', { kind: 'mailto', href: leadMailto(lead) });
    }
  };

  /** Handle a tapped chip or typed text for the current step. */
  const answer = async (raw, { typed = false } = {}) => {
    const value = raw.trim();
    if (!value || busy.current) return;

    // menu / done: questions or start
    if (step === 'menu' || step === 'done') {
      push({ from: 'user', text: value });
      if (/start|project|build|new|hire|quote|estimate/i.test(value) && !matchFaq(value)?.label?.includes('cost')) {
        setData({});
        setPicked([]);
        return goTo('service', {});
      }
      const faq = matchFaq(value);
      if (faq) return say([faq.answer, 'Want to start your project now?'], step);
      return say([
        'Good question! I’m a simple assistant, so Sumit will answer that one personally.',
        'The fastest way is to start a project request. You can add your question in the details.',
      ], step);
    }

    if (step === 'features') {
      if (typed) {
        const custom = value.split(',').map((v) => v.trim()).filter(Boolean);
        setPicked((p) => [...new Set([...p, ...custom])]);
        return;
      }
      return;
    }

    if (step === 'summary') return;

    push({ from: 'user', text: value });

    // validation for free-text steps
    if (step === 'idea' && value.length < 8) return say(['Could you add a little more detail? Even one or two sentences helps.'], step);
    if (step === 'name' && value.length < 2) return say(['What should I call you?'], step);
    if (step === 'email' && !EMAIL_RE.test(value)) return say(['That email doesn’t look quite right. Could you check it?'], step);
    if (step === 'phone' && value !== 'Skip' && !PHONE_RE.test(value)) return say(['Please enter a valid number with country code, or tap Skip.'], step);

    const key = step === 'idea' ? 'idea' : step;
    const nextData = { ...data, [key]: step === 'phone' && value === 'Skip' ? '' : value };
    setData(nextData);
    const next = nextAfter(step);
    if (next === 'summary') {
      return say(prompts('summary', nextData), 'summary', { kind: 'summary', data: nextData });
    }
    return goTo(next, nextData);
  };

  const confirmFeatures = (skip = false) => {
    if (busy.current) return;
    const features = skip ? [] : picked;
    push({ from: 'user', text: features.length ? features.join(', ') : 'Not sure yet' });
    const nextData = { ...data, features };
    setData(nextData);
    setPicked([]);
    goTo('design', nextData);
  };

  const onSend = (e) => {
    e.preventDefault();
    if (busy.current || typing || !input.trim()) return; // keep the text until the bot has finished
    const v = input;
    setInput('');
    answer(v, { typed: true });
  };

  const textSteps = ['menu', 'done', 'idea', 'name', 'email', 'phone', 'features', 'service', 'design', 'budget', 'timeline'];
  const inputEnabled = textSteps.includes(step);
  const chips = typing ? [] : chipsFor(step, data);
  const progress = Math.max(0, FLOW.indexOf(step)) / (FLOW.length - 1);
  const inFlow = FLOW.includes(step) || step === 'sending';

  return (
    <>
      {/* launcher */}
      <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
        <AnimatePresence>
          {teaser && !open && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="relative max-w-[260px] rounded-2xl rounded-br-md bg-[var(--color-surface-2)] border border-[var(--line)] p-4 pr-8 shadow-2xl shadow-black/30"
            >
              <button onClick={dismissTeaser} className="absolute top-2 right-2 p-1 text-white/40 hover:text-white" aria-label="Dismiss">
                <X size={14} />
              </button>
              <button onClick={() => { dismissTeaser(); setOpen(true); }} className="text-left text-sm text-white/80 leading-relaxed">
                Hi 👋 Planning a website or app? Get a <span className="text-white font-medium">free estimate in 2 minutes.</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => { setOpen((v) => !v); dismissTeaser(); }}
          aria-label={open ? 'Close project assistant' : 'Open project assistant'}
          aria-expanded={open}
          className="group relative flex items-center gap-2.5 rounded-full bg-primary-500 pl-3 pr-5 py-3 text-white shadow-[0_12px_40px_-8px_rgb(var(--primary-500)/0.8)] hover:bg-primary-600 transition-colors"
          data-cursor={open ? '' : 'Chat'}
        >
          <span className="relative grid place-items-center w-8 h-8 rounded-full bg-white/20">
            {open ? <X size={17} /> : <Bot size={17} />}
            {!open && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-primary-500" />}
          </span>
          <span className="text-sm font-medium">{open ? 'Close' : 'Plan your project'}</span>
        </button>
      </div>

      {/* panel */}
      <AnimatePresence>
        {open && (
          <motion.section
            role="dialog"
            aria-label="Project assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed z-[95] inset-0 sm:inset-auto sm:bottom-24 sm:right-5 sm:w-[400px] sm:h-[min(640px,calc(100svh-8rem))] flex flex-col overflow-hidden sm:rounded-3xl bg-[var(--color-surface-2)] border border-[var(--line)] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)]"
          >
            {/* header */}
            <header className="relative shrink-0 px-5 pt-5 pb-4 border-b border-[var(--line)]">
              <div className="flex items-center gap-3">
                <span className="relative grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-sky-400 text-white">
                  <Sparkles size={19} className="text-white" style={{ color: '#fff' }} />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[var(--color-surface-2)]" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-white">Project assistant</p>
                  <p className="text-xs text-white/50">Free estimate · Sumit replies within 24h</p>
                </div>
                <button onClick={restart} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5" aria-label="Start over" title="Start over">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              {inFlow && (
                <div className="absolute left-0 bottom-0 h-0.5 w-full bg-white/5">
                  <motion.div className="h-full bg-gradient-to-r from-primary-500 to-sky-400" animate={{ width: `${Math.max(6, progress * 100)}%` }} />
                </div>
              )}
            </header>

            {/* messages */}
            <div ref={scroller} data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-3" aria-live="polite">
              {messages.map((m) => <Message key={m.id} m={m} onSend={submit} onEdit={restart} step={step} />)}
              {typing && (
                <div className="flex items-center gap-1.5 w-fit rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3.5" aria-label="Assistant is typing">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-white/50" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              )}
              {step === 'sending' && <p className="text-xs text-white/50 px-1">Sending your request…</p>}
            </div>

            {/* quick replies */}
            {chips.length > 0 && (
              <div data-lenis-prevent className="shrink-0 max-h-44 overflow-y-auto px-4 pb-3 flex flex-wrap gap-2">
                {chips.map((c) => {
                  const active = step === 'features' && picked.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => (step === 'features' ? setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c])) : answer(c))}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] transition-colors ${
                        active ? 'border-primary-500 bg-primary-500 text-white' : 'border-primary-500/40 text-white/85 hover:bg-primary-500/15 hover:border-primary-500'
                      }`}
                    >
                      {active && <Check size={13} />}
                      {c}
                    </button>
                  );
                })}
                {step === 'features' && picked.filter((p) => !chips.includes(p)).map((c) => (
                  <button key={c} onClick={() => setPicked((p) => p.filter((x) => x !== c))} className="inline-flex items-center gap-1.5 rounded-full border border-primary-500 bg-primary-500 text-white px-3.5 py-2 text-[13px]">
                    <Check size={13} /> {c}
                  </button>
                ))}
              </div>
            )}
            {step === 'features' && !typing && (
              <div className="shrink-0 px-4 pb-3 flex gap-2">
                <button onClick={() => confirmFeatures(false)} disabled={!picked.length} className="flex-1 rounded-full bg-primary-500 py-2.5 text-sm font-medium text-white disabled:opacity-40 hover:bg-primary-600 transition-colors">
                  Continue{picked.length ? ` (${picked.length})` : ''}
                </button>
                <button onClick={() => confirmFeatures(true)} className="rounded-full border border-[var(--line)] px-4 py-2.5 text-sm text-white/70 hover:text-white">
                  Not sure yet
                </button>
              </div>
            )}

            {/* input */}
            <form onSubmit={onSend} noValidate className="shrink-0 flex items-center gap-2 border-t border-[var(--line)] p-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!inputEnabled}
                type={step === 'email' ? 'email' : step === 'phone' ? 'tel' : 'text'}
                inputMode={step === 'phone' ? 'tel' : undefined}
                maxLength={step === 'idea' ? 2000 : 200}
                placeholder={!inputEnabled ? '' : placeholderFor[step] || 'Type a message or question…'}
                aria-label="Message"
                className="flex-1 min-w-0 rounded-full bg-white/[0.05] border border-[var(--line)] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-primary-500 disabled:opacity-50"
              />
              <button type="submit" disabled={!inputEnabled || typing || !input.trim()} className="grid place-items-center w-11 h-11 rounded-full bg-primary-500 text-white disabled:opacity-40 hover:bg-primary-600 transition-colors" aria-label="Send">
                <Send size={16} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}

function Message({ m, onSend, onEdit, step }) {
  if (m.kind === 'summary') {
    const d = m.data;
    const rows = [
      ['Project', d.service], ['Details', d.idea], ['Features', d.features?.length ? d.features.join(', ') : 'Not sure yet'],
      ['Designs', d.design], ['Budget', d.budget], ['Timeline', d.timeline], ['Name', d.name], ['Email', d.email], ['Phone', d.phone || '—'],
    ];
    return (
      <div className="rounded-2xl border border-primary-500/30 bg-primary-500/[0.07] p-4">
        <dl className="space-y-2 text-[13px]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[72px_1fr] gap-2">
              <dt className="text-white/45">{k}</dt>
              <dd className="text-white/90 break-words">{v}</dd>
            </div>
          ))}
        </dl>
        {step === 'summary' && (
          <div className="mt-4 flex gap-2">
            <button onClick={onSend} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors">
              <Send size={14} /> Send to Sumit
            </button>
            <button onClick={onEdit} className="rounded-full border border-[var(--line)] px-4 py-2.5 text-sm text-white/70 hover:text-white">Start over</button>
          </div>
        )}
      </div>
    );
  }
  if (m.kind === 'mailto') {
    return (
      <a href={m.href} className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors">
        <Mail size={15} /> Email my request to Sumit
      </a>
    );
  }
  const bot = m.from === 'bot';
  return (
    <div className={`flex ${bot ? 'justify-start' : 'justify-end'}`}>
      <p
        className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
          bot ? 'rounded-bl-md bg-white/[0.06] text-white/90' : 'rounded-br-md bg-primary-500 text-[#fff]'
        }`}
      >
        {m.text}
      </p>
    </div>
  );
}
