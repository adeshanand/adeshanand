import { Suspense, lazy, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, BadgeCheck, Download, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import Container from '../ui/Container.jsx';
import Button from '../ui/Button.jsx';
import Marquee from '../ui/Marquee.jsx';
import { hero, identity } from '../../data/profile.js';
import { useHireContact } from '../../hooks/useHireContact.js';

// Separate chunk: WebGL code stays off the critical path
const HeroField = lazy(() => import('../effects/HeroField.jsx'));

export default function Hero() {
  const reduced = useReducedMotion();
  const { hireHref, isPhone, emailHref } = useHireContact();
  const HireIcon = isPhone ? Phone : Mail;
  // Defer the field chunk until the browser is idle; the CSS aurora is the
  // first-paint backdrop and remains the fallback when the field never mounts
  const [wantField, setWantField] = useState(false);
  const [fieldLive, setFieldLive] = useState(false);
  useEffect(() => {
    if (reduced) {
      // Honor a mid-session switch too: drop the field, restore the aurora
      setWantField(false);
      setFieldLive(false);
      return undefined;
    }
    const arm = () => setWantField(true);
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(arm, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(arm, 350);
    return () => clearTimeout(id);
  }, [reduced]);

  const stagger = (i) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: 0.12 * i, ease: [0.21, 0.47, 0.32, 0.98] },
        };

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex flex-col overflow-hidden pt-24 md:min-h-[min(100svh,64rem)] md:pt-28"
    >
      {/* Backdrop: grid + wash always; aurora glows hand off to the WebGL
          field (particles + cursor distortion + AA monogram) once it's live */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            fieldLive ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="aurora aurora-a" />
          <div className="aurora aurora-b" />
          <div className="aurora aurora-c" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-line)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,black,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,var(--hero-wash),transparent)]" />
        {wantField ? (
          <Suspense fallback={null}>
            <HeroField
              onReady={() => setFieldLive(true)}
              onLost={() => {
                setFieldLive(false);
                setWantField(false);
              }}
            />
          </Suspense>
        ) : null}
      </div>

      <Container className="flex flex-1 flex-col justify-center pb-10">
        <motion.p
          {...stagger(0)}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-card/80 px-4 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur-sm"
        >
          <MapPin size={13} className="shrink-0 text-accent" aria-hidden />
          {identity.location}
          {/* The role repeats in the summary below — drop it from the chip on
              phones so the badge stays a clean single line */}
          <span className="max-sm:hidden"> · {identity.role}</span>
        </motion.p>

        <motion.h1
          {...stagger(1)}
          className="mt-6 max-w-5xl font-display text-[clamp(2.5rem,min(6.5vw,8.5svh),5.5rem)] font-semibold leading-[1.04] tracking-tight text-balance text-ink"
        >
          {hero.headline[0]}
          <br />
          <span className="bg-[linear-gradient(92deg,var(--grad-accent-from),var(--grad-accent-to))] bg-clip-text text-transparent">
            {hero.headline[1]}
          </span>
        </motion.h1>

        <motion.div {...stagger(2)} className="mt-5 flex flex-wrap items-center gap-2.5">
          {hero.chips.map((chip, i) => (
            <span
              key={chip}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                i === 0
                  ? 'bg-accent-soft text-accent ring-1 ring-accent/30'
                  : 'border border-ink/10 bg-card/80 text-muted backdrop-blur-sm'
              }`}
            >
              {i === 0 ? <BadgeCheck size={13} aria-hidden /> : null}
              {chip}
            </span>
          ))}
        </motion.div>

        <motion.p {...stagger(3)} className="mt-5 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
          {hero.sub}
        </motion.p>

        <motion.div {...stagger(4)} className="mt-7 flex flex-wrap items-center gap-3">
          {/* Below lg the nav's Hire Me pill lives inside the hamburger menu,
              so the hero leads with Hire Me (dials on phones) and the menu
              offers Email me; at lg+ the roles swap back. */}
          <div className="lg:hidden">
            <Button href={hireHref} variant="primary" className="group">
              <HireIcon size={16} aria-hidden />
              Hire Me
              <ArrowUpRight
                size={15}
                aria-hidden
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Button>
          </div>
          <div className="hidden lg:block">
            <Button href={emailHref} variant="primary" className="group">
              <Mail size={16} aria-hidden />
              Email me
              <ArrowUpRight
                size={15}
                aria-hidden
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Button>
          </div>
          <Button href={identity.resumeFile} variant="secondary" download>
            <Download size={16} aria-hidden />
            Download resume
          </Button>
          <Button href={identity.linkedin} variant="secondary" external aria-label="LinkedIn profile (opens in a new tab)">
            <Linkedin size={16} aria-hidden />
            LinkedIn
          </Button>
        </motion.div>
      </Container>

      <motion.div {...stagger(5)} className="border-t border-ink/8 py-4">
        <p className="sr-only">Platforms shipped for</p>
        <Marquee items={hero.brands} />
      </motion.div>
    </section>
  );
}
