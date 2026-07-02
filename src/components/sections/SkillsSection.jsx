import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { skills, techStack } from '../../data/portfolio';
import SectionTitle from '../ui/SectionTitle';
import RevealOnScroll from '../animations/RevealOnScroll';

function SkillBar({ skill, index }) {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/80 text-sm font-medium">{skill.name}</span>
        <span className="text-white/40 text-xs font-mono">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${skill.color}aa, ${skill.color})` }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionTitle
            eyebrow="Expertise"
            title="Skills & Technologies"
            subtitle="Tools and technologies I use to bring ideas to life."
            center
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Skill bars */}
          <RevealOnScroll direction="left">
            <div className="glass rounded-2xl p-8 border border-white/5">
              <h3 className="font-display font-semibold text-white text-xl mb-8">Proficiency</h3>
              {skills.map((skill, i) => (
                <SkillBar key={skill.name} skill={skill} index={i} />
              ))}
            </div>
          </RevealOnScroll>

          {/* Tech stack grid */}
          <RevealOnScroll direction="right">
            <div className="glass rounded-2xl p-8 border border-white/5">
              <h3 className="font-display font-semibold text-white text-xl mb-8">Tech Stack</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/15 transition-all cursor-default"
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <span className="text-white/50 text-xs text-center font-mono">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
