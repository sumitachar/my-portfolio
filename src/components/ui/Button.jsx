import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25',
  secondary: 'glass text-white hover:bg-white/10 border border-white/10',
  ghost: 'text-white/70 hover:text-white hover:bg-white/5',
  outline: 'border border-primary-500 text-primary-500 hover:bg-primary-500/10',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export default function Button({ children, variant = 'primary', size = 'md', className, onClick, href, ...props }) {
  const classes = cn(
    'inline-flex items-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer font-body',
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
