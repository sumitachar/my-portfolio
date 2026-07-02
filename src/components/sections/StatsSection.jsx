import { motion } from 'framer-motion';
import { stats } from '../../data/portfolio';

export default function StatsSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-3xl p-10 border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
              }}
              className="text-center"
            >
              <div className="font-display font-bold text-4xl md:text-5xl text-white mb-2">
                {stat.value}
                <span className="text-gradient">
                  {stat.suffix}
                </span>
              </div>

              <p className="text-white/40 text-sm font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}