import { motion, useReducedMotion } from 'framer-motion';

/*
 * Numbered editorial section heading: a mono index + label line, then an
 * oversized title that reveals through a scanline sweep (clip-path with an
 * accent line riding the reveal edge). Reduced motion renders static.
 *
 * Sweep rules, learned the hard way:
 * - The viewport trigger must sit on a full-width in-flow wrapper. The
 *   '-80px' viewport margin becomes an IntersectionObserver rootMargin on
 *   all four sides, so a skinny bar in the container's left gutter (or a
 *   carrier pre-translated offscreen) never intersects on narrow viewports
 *   and the sweep deadlocks at its initial frame — the stuck-line bug on
 *   phones. Both spans therefore animate as variant children of the
 *   wrapper that owns whileInView.
 * - Animate only WAAPI-accelerated values (opacity / clipPath / the
 *   `transform` string — not the `x` shorthand, which runs on the JS
 *   frameloop) so the sweep is compositor-driven and cannot stall with
 *   the main thread.
 */
const SWEEP = { duration: 0.9, ease: [0.22, 0.61, 0.27, 0.98] };

const titleVariants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  shown: { clipPath: 'inset(0 0% 0 0)', transition: SWEEP },
};

/* Full-width carrier slides -100% -> 0 so the bar anchored to its right
   edge rides the clip reveal edge using transform only. */
const carrierVariants = {
  hidden: { transform: 'translateX(-100%)', opacity: 1 },
  shown: {
    transform: 'translateX(0%)',
    opacity: 0,
    transition: { ...SWEEP, opacity: { delay: 0.72, duration: 0.18 } },
  },
};

export default function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  lede,
  align = 'left',
  size = 'text-4xl md:text-6xl',
}) {
  const reduced = useReducedMotion();
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-3xl ${alignment}`}>
      <p className="flex items-baseline gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        {index ? (
          <span className="font-mono text-sm tabular-nums text-muted">{index}</span>
        ) : null}
        {eyebrow}
      </p>
      <h2
        id={id}
        className={`relative mt-4 font-display font-semibold leading-[1.05] tracking-tight text-balance text-ink ${size}`}
      >
        {reduced ? (
          title
        ) : (
          <motion.span
            className="relative block"
            initial="hidden"
            whileInView="shown"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.span className="block" variants={titleVariants}>
              {title}
            </motion.span>
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              variants={carrierVariants}
            >
              <span className="absolute inset-y-0 right-0 w-0.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)]" />
            </motion.span>
          </motion.span>
        )}
      </h2>
      {lede ? <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">{lede}</p> : null}
    </div>
  );
}
