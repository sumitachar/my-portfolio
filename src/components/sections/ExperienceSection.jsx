import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2 } from 'lucide-react';
import { experience } from '../../data/portfolio';
import SectionTitle from '../ui/SectionTitle';
import RevealOnScroll from '../animations/RevealOnScroll';

export default function ExperienceSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <SectionTitle
            eyebrow="Journey"
            title="Work Experience"
            subtitle="Where I've worked and what I've built."
            center
          />
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-accent/30 to-transparent hidden md:block" />

          <div className="space-y-8">
            {experience.map((job, i) => (
              <RevealOnScroll key={i} delay={i * 0.1} direction="left">
                <div className="flex gap-6 md:gap-10">
                  {/* Dot */}
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl glass border border-primary-500/30 flex items-center justify-center flex-shrink-0 glow-sm">
                      <Briefcase size={20} className="text-primary-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 glass rounded-2xl p-8 border border-white/5 hover:border-white/15 transition-all duration-300 group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="font-display font-bold text-white text-xl group-hover:text-primary-400 transition-colors">
                          {job.role}
                        </h3>
                        <p className="text-primary-400 font-medium">{job.company}</p>
                      </div>
                      <span className="font-mono text-white/30 text-sm whitespace-nowrap">{job.period}</span>
                    </div>

                    <p className="text-white/40 leading-relaxed mb-5">{job.description}</p>

                    <div className="flex flex-wrap gap-3">
                      {job.highlights.map((h, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-sm text-white/60">
                          <CheckCircle2 size={14} className="text-emerald-400" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
