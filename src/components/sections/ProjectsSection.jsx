import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitBranch, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import { projects } from '../../data/portfolio';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import RevealOnScroll from '../animations/RevealOnScroll';

const categories = ['All', 'Full Stack', 'UI/UX', 'Backend', 'Tools', 'Creative'];

export default function ProjectsSection({ limit }) {
  const [active, setActive] = useState('All');
  const filtered = (active === 'All' ? projects : projects.filter(p => p.category === active))
    .slice(0, limit);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionTitle
            eyebrow="Portfolio"
            title="Selected Works"
            subtitle="A curated collection of projects I've built and shipped."
          />
          {!limit && (
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active === cat
                      ? 'bg-primary-500 text-white'
                      : 'glass text-white/50 hover:text-white border border-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {filtered.map((project, i) => (
              <RevealOnScroll key={project.id} delay={i * 0.07}>
                <ProjectCard project={project} />
              </RevealOnScroll>
            ))}
          </AnimatePresence>
        </div>

        {limit && (
          <div className="text-center mt-12">
            <Link to="/projects">
              <Button variant="secondary" size="lg">
                View All Projects
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <motion.div
      layout
      className="glass rounded-2xl overflow-hidden border border-white/5 group hover:border-white/15 transition-all duration-300"
      whileHover={{ y: -6 }}
    >
      {/* Gradient header */}
      <div className={`h-36 bg-gradient-to-br ${project.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <span className="text-2xl">{project.category === 'Full Stack' ? '⚡' : project.category === 'UI/UX' ? '🎨' : project.category === 'Backend' ? '🔧' : '🛠️'}</span>
          </div>
        </div>
        {/* Hover links */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.a
            href={project.github}
            className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/20"
            whileHover={{ scale: 1.1 }}
          >
            <GitBranch size={14} />
          </motion.a>
          <motion.a
            href={project.live}
            className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/20"
            whileHover={{ scale: 1.1 }}
          >
            <ExternalLink size={14} />
          </motion.a>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-white text-lg group-hover:text-primary-400 transition-colors">
            {project.title}
          </h3>
          <Badge>{project.category}</Badge>
        </div>
        <p className="text-white/40 text-sm leading-relaxed mb-5">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs font-mono">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
