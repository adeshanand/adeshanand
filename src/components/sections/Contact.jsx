import { ArrowUpRight, Download, Linkedin, Mail, Phone } from 'lucide-react';
import Container from '../ui/Container.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import { identity } from '../../data/profile.js';
import { useRevealedContact } from '../../hooks/useRevealedContact.js';

/* Full-viewport closer; the footer line lives here too. */
export default function Contact() {
  const { email, emailHref, phone, phoneHref } = useRevealedContact();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative flex min-h-[85svh] flex-col overflow-hidden bg-cloud"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,var(--hero-wash),transparent)]"
      />
      <Container className="relative flex flex-1 flex-col justify-center py-24 md:py-32">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="flex items-baseline justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <span aria-hidden className="font-mono text-sm tabular-nums text-muted">06</span>
            Contact
          </p>
          <h2
            id="contact-heading"
            className="mt-5 font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[1.04] tracking-tight text-balance text-ink"
          >
            Let&rsquo;s build something{' '}
            <span className="bg-[linear-gradient(92deg,var(--grad-accent-from),var(--grad-accent-to))] bg-clip-text text-transparent">
              resilient.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Open to senior engineering and composable commerce roles. The fastest way to reach me is
            email.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href={emailHref} variant="primary" className="group px-8 py-4 text-base">
              <Mail size={17} aria-hidden />
              Email me
              <ArrowUpRight
                size={16}
                aria-hidden
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Button>
            <Button href={identity.resumeFile} variant="secondary" download className="px-8 py-4 text-base">
              <Download size={17} aria-hidden />
              Download resume
            </Button>
          </div>

          <ul className="mt-14 flex flex-col items-center justify-center gap-x-10 gap-y-4 text-sm sm:flex-row">
            <li>
              <a
                href={emailHref}
                className="inline-flex items-center gap-2 font-medium text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <Mail size={15} className="text-accent" aria-hidden />
                {email ?? 'Email available on request'}
              </a>
            </li>
            <li>
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 font-medium text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <Phone size={15} className="text-accent" aria-hidden />
                {phone ?? 'Phone available on request'}
              </a>
            </li>
            <li>
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <Linkedin size={15} className="text-accent" aria-hidden />
                linkedin.com/in/adeshanand
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </Reveal>
      </Container>

      {/* role restores the contentinfo landmark a <footer> loses when nested
          inside section/main */}
      <footer role="contentinfo" className="relative border-t border-ink/8 py-6">
        <Container className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {identity.name} · {identity.location}
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Composable commerce · engineered to scale
          </p>
        </Container>
      </footer>
    </section>
  );
}
