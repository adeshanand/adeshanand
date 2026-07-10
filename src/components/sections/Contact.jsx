import { ArrowUpRight, Download, Linkedin, Mail, Phone } from 'lucide-react';
import Container from '../ui/Container.jsx';
import Reveal from '../ui/Reveal.jsx';
import Button from '../ui/Button.jsx';
import { identity } from '../../data/profile.js';
import { useRevealedContact } from '../../hooks/useRevealedContact.js';

export default function Contact() {
  const { email, emailHref, phone, phoneHref } = useRevealedContact();

  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-cloud py-24 md:py-32">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Contact</p>
          <h2
            id="contact-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance text-ink md:text-5xl"
          >
            Let&rsquo;s build something resilient.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Open to senior full-stack and composable commerce roles. The fastest way to reach me is
            email.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
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
          </div>

          <ul className="mt-12 flex flex-col items-center justify-center gap-x-10 gap-y-4 text-sm sm:flex-row">
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
              </a>
            </li>
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
