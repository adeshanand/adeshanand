import { motion, useReducedMotion } from 'framer-motion';

/*
 * Numbered editorial section heading: a mono index + label line, then an
 * oversized title that reveals through a scanline sweep (clip-path with an
 * accent line riding the reveal edge). Reduced motion renders static.
 */
const SWEEP = { duration: 0.9, ease: [0.22, 0.61, 0.27, 0.98] };

export default function SectionHeading({ id, index, eyebrow, title, lede, align = 'left' }) {
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
        className="relative mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance text-ink md:text-6xl"
      >
        {reduced ? (
          title
        ) : (
          <>
            <motion.span
              className="block"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={SWEEP}
            >
              {title}
            </motion.span>
            <motion.span
              aria-hidden
              className="absolute inset-y-0 w-0.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent-glow)]"
              initial={{ left: '0%', opacity: 1 }}
              whileInView={{ left: '100%', opacity: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ ...SWEEP, opacity: { delay: 0.72, duration: 0.18 } }}
            />
          </>
        )}
      </h2>
      {lede ? <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">{lede}</p> : null}
    </div>
  );
}
