import { Linkedin } from 'lucide-react';
import Container from '../ui/Container.jsx';
import { identity } from '../../data/profile.js';

export default function Footer() {
  return (
    <footer className="border-t border-ink/8 bg-cloud py-8">
      <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {identity.name} · {identity.location}
        </p>
        <a
          href={identity.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profile (opens in a new tab)"
          className="inline-flex size-9 items-center justify-center rounded-full border border-ink/10 text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Linkedin size={16} aria-hidden />
        </a>
      </Container>
    </footer>
  );
}
