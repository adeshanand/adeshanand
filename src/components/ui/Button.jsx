import { motion, useReducedMotion } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-accent-strong text-white shadow-[0_8px_24px_var(--btn-glow)] hover:bg-accent-strong-hover',
  secondary:
    'border border-ink/15 bg-card text-ink hover:border-ink/30 hover:bg-cloud',
  ghost: 'text-ink hover:text-accent',
};

export default function Button({
  as = 'a',
  variant = 'primary',
  href,
  external = false,
  download = false,
  className = '',
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const Tag = as === 'button' ? motion.button : motion.a;

  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Tag
      href={as === 'button' ? undefined : href}
      download={download || undefined}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${VARIANTS[variant]} ${className}`}
      {...externalProps}
      {...rest}
    >
      {children}
    </Tag>
  );
}
