import { motion } from "framer-motion";
import { MapPin, Calendar, Coffee, Zap } from "lucide-react";
import SectionTitle from "../components/ui/SectionTitle";
import ExperienceSection from "../components/sections/ExperienceSection";
import RevealOnScroll from "../components/animations/RevealOnScroll";
import { personalInfo } from "../data/portfolio";

const interests = [
  { icon: '⚛️', label: 'React Ecosystem' },
  { icon: '🎨', label: 'UI/UX Design' },
  { icon: '⚡', label: 'Performance' },
  { icon: '📱', label: 'Responsive Design' },
  { icon: '🚀', label: 'Next.js' },
  { icon: '🌍', label: 'Open Source' },
];

export default function AboutPage() {
  return (
    <div className="pt-32">
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <RevealOnScroll direction="left">
            <div>
              <SectionTitle
                eyebrow="About Me"
                title="The Developer Behind the Code"
                subtitle="I'm a passionate developer who loves turning complex problems into elegant, performant solutions."
              />
              <p className="text-white/40 leading-relaxed mt-6 mb-8">
                Frontend Developer with 2+ years of professional experience
                building scalable and responsive web applications using
                React.js, Next.js and TypeScript. I enjoy creating reusable
                component architectures, modern UI experiences, API integrations
                and performance-optimized interfaces that solve real business
                problems, I've worked with startups and enterprises alike,
                always with a focus on developer experience, end-user delight,
                and code quality that stands the test of time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: personalInfo.location },
                  { icon: Calendar, label: "2+ Years Professional Experience" },
                  { icon: Coffee, label: "Frontend Development" },
                  { icon: Zap, label: "Performance Optimization" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-white/40 text-sm"
                  >
                    <Icon size={14} className="text-primary-400" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="right">
            <div className="glass rounded-3xl p-8 border border-white/5">
              <h3 className="font-display font-semibold text-white text-xl mb-6">
                Interests
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {interests.map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/15 transition-all cursor-default"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-white/40 text-xs text-center">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <ExperienceSection />
    </div>
  );
}
