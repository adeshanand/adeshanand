import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Download, Linkedin, Mail, MapPin } from 'lucide-react';
import Container from '../ui/Container.jsx';
import Button from '../ui/Button.jsx';
import { hero, identity } from '../../data/profile.js';
import { useRevealedContact } from '../../hooks/useRevealedContact.js';

export default function Hero() {
  const reduced = useReducedMotion();
  const { emailHref } = useRevealedContact();

  const stagger = (i) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: 0.12 * i, ease: [0.21, 0.47, 0.32, 0.98] },
        };

  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
      {/* Decorative backdrop: drifting aurora glows + fine grid fading from the top + indigo wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
        <div className="aurora aurora-c" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,var(--hero-wash),transparent)]" />
      </div>

      <Container>
        <motion.p
          {...stagger(0)}
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card px-4 py-1.5 text-xs font-medium text-muted shadow-sm"
        >
          <MapPin size={13} className="text-accent" aria-hidden />
          {identity.location} · {identity.role}
        </motion.p>

        <motion.h1
          {...stagger(1)}
          className="mt-7 max-w-4xl font-display text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[1.05] tracking-tight text-balance text-ink"
        >
          {hero.headline[0]}
          <br />
          <span className="bg-[linear-gradient(92deg,var(--grad-accent-from),var(--grad-accent-to))] bg-clip-text text-transparent">
            {hero.headline[1]}
          </span>
        </motion.h1>

        <motion.p {...stagger(2)} className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {hero.sub}
        </motion.p>

        <motion.div {...stagger(3)} className="mt-9 flex flex-wrap items-center gap-3">
          <Button href={emailHref} variant="primary" className="group">
            <Mail size={16} aria-hidden />
            Email me
            <ArrowUpRight
              size={15}
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Button>
          <Button href={identity.resumeFile} variant="secondary" download>
            <Download size={16} aria-hidden />
            Download resume
          </Button>
          <Button href={identity.linkedin} variant="secondary" external aria-label="LinkedIn profile (opens in a new tab)">
            <Linkedin size={16} aria-hidden />
            LinkedIn
          </Button>
        </motion.div>

        <motion.div {...stagger(4)} className="mt-16 border-t border-ink/8 pt-6 md:mt-20">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            Platforms shipped for
          </p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
            {hero.brands.map((brand) => (
              <li
                key={brand}
                className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-ink/60"
              >
                {brand}
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
