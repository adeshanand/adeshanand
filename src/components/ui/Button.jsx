import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const VARIANTS = {
  primary:
    'bg-accent-strong text-on-accent shadow-[0_8px_24px_var(--btn-glow)] hover:bg-accent-strong-hover',
  secondary:
    'border border-ink/15 bg-card text-ink hover:border-ink/30 hover:bg-cloud',
  ghost: 'text-ink hover:text-accent',
};

/*
 * Buttons are magnetic (the Lusion hover grammar): within the button they
 * lean toward the pointer on springs and snap back on leave. Hover-capable
 * pointers only; reduced motion keeps them still.
 */
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
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 20 });
  const y = useSpring(my, { stiffness: 260, damping: 20 });
  const Tag = as === 'button' ? motion.button : motion.a;

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return; // touch scroll must not wobble CTAs
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };
  const magnetic = !reduced
    ? { onPointerMove, onPointerLeave, style: { x, y } }
    : {};

  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Tag
      ref={ref}
      href={as === 'button' ? undefined : href}
      download={download || undefined}
      whileHover={reduced ? undefined : { scale: 1.03 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${VARIANTS[variant]} ${className}`}
      {...magnetic}
      {...externalProps}
      {...rest}
    >
      {children}
    </Tag>
  );
}
