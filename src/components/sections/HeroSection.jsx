
import { motion } from 'framer-motion';
import { ArrowRight, Download, Code2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function HeroSection() {
  const socials = [
    {
      name: 'GitHub',
      url: 'https://github.com/sumitachar',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/sumit-achar',
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center relative px-6 pt-24">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm mb-8 border border-emerald-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-mono text-xs">
              Open to Software Development Opportunities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
          >
            <span className="text-white">
              Software Developer
            </span>

            <br />

            <span className="text-gradient">
              Sumit Achar
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-xl md:text-2xl text-white/70 font-light">
              React.js • Next.js • TypeScript
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl"
          >
            Frontend Developer with 2+ years of experience building scalable,
            responsive web applications using React.js, Next.js and TypeScript.

            Passionate about creating modern user experiences, reusable
            component architectures, REST API integrations and
            performance-optimized interfaces.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link to="/projects">
              <Button size="lg">
                View Projects
                <ArrowRight size={18} />
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.open('/Sumit_Achar_Resume.pdf')}
            >
              <Download size={18} />
              Download Resume
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4"
          >
            <span className="text-white/20 text-sm">
              Connect
            </span>

            {socials.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 glass rounded-lg text-white/60 hover:text-white text-xs font-mono hover:border-white/20 transition-all"
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
              >
                {social.name}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* RIGHT SIDE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex justify-center items-center"
        >
          <div className="relative">

            <div className="w-80 h-80 rounded-3xl glass border border-white/10 overflow-hidden relative glow">

              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-accent/20" />

              <div className="absolute inset-0 p-8 flex flex-col justify-center">

                <div className="font-mono text-xs space-y-2">

                  <p>
                    <span className="text-pink-400">const</span>{' '}
                    <span className="text-cyan-400">developer</span> = {'{'}
                  </p>

                  <p className="pl-4">
                    <span className="text-yellow-300">name</span>:
                    <span className="text-green-400"> "Sumit Achar"</span>,
                  </p>

                  <p className="pl-4">
                    <span className="text-yellow-300">role</span>:
                    <span className="text-green-400">
                      {' '} "Frontend Developer"
                    </span>,
                  </p>

                  <p className="pl-4">
                    <span className="text-yellow-300">skills</span>: [
                    <span className="text-green-400">"React"</span>,
                    <span className="text-green-400"> "Next.js"</span>,
                    <span className="text-green-400"> "TypeScript"</span>
                    ],
                  </p>

                  <p className="pl-4">
                    <span className="text-yellow-300">experience</span>:
                    <span className="text-blue-400"> "2+ Years"</span>,
                  </p>

                  <p className="pl-4">
                    <span className="text-yellow-300">available</span>:
                    <span className="text-blue-400"> true</span>,
                  </p>

                  <p>{'}'}</p>

                  <p className="mt-4 text-white/30">
                    // Building scalable web experiences
                  </p>

                  <p className="text-white/30">
                    // Open to React / Next.js opportunities 🚀
                  </p>

                </div>
              </div>
            </div>

            {/* TOP BADGE */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-6 -right-6 glass rounded-2xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-2">
                <Star
                  size={14}
                  className="text-yellow-400 fill-yellow-400"
                />
                <span className="text-white text-sm font-medium">
                  2+ Years Experience
                </span>
              </div>
            </motion.div>

            {/* BOTTOM BADGE */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-4 -left-8 glass rounded-2xl p-4 border border-white/10"
            >
              <div className="flex items-center gap-2">
                <Code2
                  size={14}
                  className="text-emerald-400"
                />
                <span className="text-white text-sm font-medium">
                  React • Next.js • TypeScript
                </span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>

      
    </section>
  );
}
