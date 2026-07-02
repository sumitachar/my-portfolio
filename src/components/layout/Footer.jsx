import { motion } from "framer-motion";
import { Mail, Heart, Code2 } from "lucide-react";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/sumitachar",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sumit-achar",
  },
  {
    label: "Email",
    href: "mailto:sumitachar1997@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white">
                Sumit<span className="text-primary-500">.</span>dev
              </p>

              <p className="text-white/30 text-xs">Software Developer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {socials.map(({ label, href }) => (
              <motion.a
                key={label}
                href={href}
                className="px-3 py-1.5 glass rounded-lg text-white/40 hover:text-white text-xs font-mono hover:border-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                {label}
              </motion.a>
            ))}
          </div>

          <p className="text-white/25 text-sm flex items-center gap-1.5">
            Made with{" "}
            <Heart size={12} className="text-rose-400 fill-rose-400" /> in Kolkata, India          </p>
        </div>
      </div>

      <p className="text-white/25 text-xs text-center mt-6">
        &copy; {new Date().getFullYear()} Sumit Achar. All rights reserved.
      </p>
    </footer>
  );
}   
 