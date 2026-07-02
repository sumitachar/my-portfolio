import { cn } from '../../lib/utils';

export default function Badge({ children, className, color }) {
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-mono',
      'bg-white/5 text-white/70 border border-white/10',
      className
    )}>
      {children}
    </span>
  );
}
