import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, MessageSquare, Sparkles } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import Button from '../ui/Button';
import { personalInfo } from '../../data/portfolio';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionTitle
            eyebrow="Contact"
            title="Let's Work Together"
            subtitle="Have a project in mind? Let's create something extraordinary."
            center
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Info */}
          <div>
            <div className="glass rounded-2xl p-8 border border-white/5 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Sparkles size={18} className="text-primary-400" />
                </div>
                <h3 className="font-display font-semibold text-white text-xl">What I offer</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Full-stack web application development",
                  "UI/UX design and prototyping",
                  "Performance optimization",
                  "Technical consulting & code review",
                  "API design and integration",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <span className="text-white/60 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: personalInfo.email },
                { icon: MapPin, label: "Location", value: personalInfo.location },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 glass rounded-xl p-4 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white/30 text-xs font-mono mb-0.5">{label}</p>
                    <p className="text-white/80 text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="glass rounded-2xl p-8 border border-white/5">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-white/40">I'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <MessageSquare size={20} className="text-primary-400" />
                  <h3 className="font-display font-semibold text-white text-xl">Send a message</h3>
                </div>

                {[
                  { name: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-white/40 text-xs font-mono mb-2 tracking-wider uppercase">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.name]}
                      onChange={e => setForm(f => ({ ...f, [field.name]: e.target.value }))}
                      placeholder={field.placeholder}
                      required
                      className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary-500/50 focus:bg-white/8 transition-all"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-white/40 text-xs font-mono mb-2 tracking-wider uppercase">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell me about your project..."
                    required
                    rows={5}
                    className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-primary-500/50 focus:bg-white/8 transition-all resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
