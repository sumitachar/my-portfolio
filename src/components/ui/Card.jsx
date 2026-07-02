import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Card({ children, className, hover = true, ...props }) {
  return (
    <motion.div
      className={cn(
        'glass rounded-2xl p-6',
        hover && 'hover:border-white/20 hover:bg-white/5 transition-all duration-300',
        className
      )}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
