import { useRef, useState } from 'react';
import { ArrowUpRight, Copy, Check, Send, Loader2, CheckCircle2, Bot } from 'lucide-react';
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap';
import { personalInfo, services } from '../../data/portfolio';
import SplitText from './SplitText';
import SectionLabel from './SectionLabel';
import Magnetic from './Magnetic';
import { openAssistant } from '../../lib/assistant';
import { saveLead, leadMailto, isFirebaseConfigured } from '../../lib/leads';

export const socials = [
  { label: 'GitHub', href: 'https://github.com/sumitachar' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/sumit-achar' },
];

export default function Contact() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', type: '', message: '', website: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap.from(q('[data-big] .split-inner'), {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.04,
      ease: 'expo.out',
      scrollTrigger: { trigger: q('[data-big]')[0], start: 'top 80%' },
    });
    gsap.from(q('[data-up]'), {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: q('[data-up]')[0], start: 'top 85%' },
    });
  }, { scope: root });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const send = async (e) => {
    e.preventDefault();
    if (form.website) return setStatus('sent'); // honeypot: bots fill hidden fields
    const lead = { name: form.name, email: form.email, service: form.type, message: form.message, source: 'contact' };
    if (!isFirebaseConfigured) {
      window.location.href = leadMailto(lead);
      return;
    }
    setStatus('sending');
    try {
      await saveLead(lead);
      setStatus('sent');
      setForm({ name: '', email: '', type: '', message: '', website: '' });
    } catch {
      setStatus('error');
    }
  };

  const field = 'w-full bg-transparent border-b border-white/15 py-4 text-white placeholder:text-white/30 outline-none focus:border-primary-500 transition-colors';

  return (
    <section ref={root} id="contact" className="relative px-5 md:px-6 pt-28 md:pt-40 pb-16 overflow-hidden">
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[60rem] h-[30rem] rounded-full bg-primary-500/[0.07] blur-[140px] -z-10" aria-hidden="true" />
      <div className="max-w-7xl mx-auto">
        <SectionLabel index="08" label="Contact" />

        <h2 data-big className="font-display font-bold text-white leading-[0.9] tracking-[-0.04em] text-[clamp(3.5rem,12vw,11rem)]">
          <SplitText text="Have a project" className="block" />
          <SplitText text="in mind?" className="block text-gradient" />
        </h2>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 mt-16 md:mt-24">
          <div data-up className="flex flex-col gap-8">
            <p className="text-lg text-white/55 max-w-md leading-relaxed">
              Tell me what you’re building and I’ll reply within 24 hours with next steps, a rough timeline and a cost estimate.
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-400">{personalInfo.availability}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href={`mailto:${personalInfo.email}`} className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 font-medium text-[var(--color-surface)] hover:bg-primary-500 hover:text-on-primary transition-colors">
                  {personalInfo.email}
                  <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
                </a>
              </Magnetic>
              <button onClick={copy} className="glass-pearl grid place-items-center w-14 h-14 rounded-full text-white" aria-label="Copy email address">
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
            <button onClick={() => openAssistant('project')} className="group w-fit inline-flex items-center gap-3 rounded-2xl border border-[var(--line)] px-5 py-4 text-left hover:border-primary-500/60 transition-colors">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-500/15 text-primary-400"><Bot size={18} /></span>
              <span>
                <span className="block text-sm font-medium text-white">Prefer a guided chat?</span>
                <span className="block text-xs text-white/50">Plan your project in 2 minutes with the assistant</span>
              </span>
              <ArrowUpRight size={16} className="ml-2 text-white/50 transition-transform group-hover:rotate-45" />
            </button>
            <div className="flex gap-6 font-mono text-sm">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="group relative text-white/60 hover:text-white transition-colors">
                  {s.label} ↗
                  <span className="absolute left-0 -bottom-1 h-px w-full origin-left scale-x-0 bg-white transition-transform group-hover:scale-x-100" />
                </a>
              ))}
            </div>
          </div>

          {status === 'sent' ? (
          <div data-up className="glass-pearl rounded-3xl p-8 md:p-12 flex flex-col items-start justify-center" role="status">
            <CheckCircle2 size={36} className="text-emerald-400" />
            <h3 className="mt-5 font-display text-3xl font-semibold text-white">Message received!</h3>
            <p className="mt-3 text-white/55 leading-relaxed max-w-md">Thanks for reaching out. I’ll reply within 24 hours with next steps.</p>
            <button onClick={() => setStatus('idle')} className="mt-8 text-sm text-white/60 hover:text-white underline underline-offset-4">Send another message</button>
          </div>
          ) : (
          <form data-up onSubmit={send} className="glass-pearl rounded-3xl p-6 md:p-10">
            <input type="text" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
            <div className="grid sm:grid-cols-2 gap-x-8">
              <label className="block">
                <span className="sr-only">Name</span>
                <input required name="name" value={form.name} onChange={update} placeholder="Your name" className={field} />
              </label>
              <label className="block">
                <span className="sr-only">Email</span>
                <input required type="email" name="email" value={form.email} onChange={update} placeholder="Email address" className={field} />
              </label>
            </div>
            <label className="block mt-2">
              <span className="sr-only">Project type</span>
              <select name="type" value={form.type} onChange={update} className={`${field} ${form.type ? '' : 'text-white/30'} [&>option]:bg-[var(--color-surface-2)] [&>option]:text-white`}>
                <option value="">What do you need? (optional)</option>
                {services.map((s) => <option key={s.title} value={s.title}>{s.title}</option>)}
                <option value="Something else">Something else</option>
              </select>
            </label>
            <label className="block mt-2">
              <span className="sr-only">Message</span>
              <textarea required name="message" rows={4} value={form.message} onChange={update} placeholder="Tell me about your project: goals, timeline, budget" className={`${field} resize-none`} />
            </label>
            {status === 'error' && (
              <p className="mt-6 text-sm text-rose-400" role="alert">
                Couldn’t send right now. <a href={leadMailto({ name: form.name, email: form.email, service: form.type, message: form.message })} className="underline underline-offset-4">Email it instead</a>.
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="submit" disabled={status === 'sending'} className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-7 py-4 text-sm font-medium text-on-primary hover:bg-primary-600 disabled:opacity-60 transition-colors">
                {status === 'sending' ? <>Sending <Loader2 size={15} className="animate-spin" /></> : <>Send message <Send size={15} /></>}
              </button>
              <span className="text-xs text-white/40">Reply within 24 hours · No spam, ever</span>
            </div>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}
