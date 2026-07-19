import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Download, Mail, Menu, Phone, X } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import { identity } from '../../data/profile.js';
import { useHireContact } from '../../hooks/useHireContact.js';

const LINKS = [
  { label: 'AWS', num: '01', href: '#aws', id: 'aws' },
  { label: 'Work', num: '02', href: '#experience', id: 'experience' },
  { label: 'Stack', num: '03', href: '#skills', id: 'skills' },
  { label: 'Credentials', num: '04', href: '#credentials', id: 'credentials' },
  { label: 'Testimonials', num: '05', href: '#testimonials', id: 'testimonials' },
  { label: 'Contact', num: '06', href: '#contact', id: 'contact' },
];

const SECTION_IDS = LINKS.map((l) => l.id);

/* Highlights the nav link of whichever section crosses the viewport's middle band */
function useActiveSection(ids) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          setActive(visible[0].target.id);
          return;
        }
        // Nothing in the band and a section exited downward: the user
        // scrolled up into unobserved space — clear the stale highlight
        if (entries.some((e) => e.boundingClientRect.top > 0)) setActive(null);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    // 'top' (the hero) is observed so scrolling back up clears the highlight
    ['top', ...ids].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active === 'top' ? null : active;
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const active = useActiveSection(SECTION_IDS);
  // Below lg the Hire Me pill moves into the hero, so the menu offers
  // Email me instead — exactly one of each is reachable per viewport
  const { hireHref, isPhone, emailHref } = useHireContact();
  const HireIcon = isPhone ? Phone : Mail;

  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  const progress = reduced ? scrollYProgress : smoothed;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-ink/8 bg-paper/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-[linear-gradient(to_right,var(--grad-accent-from),var(--grad-accent-to))]"
      />
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 md:px-10"
      >
        <a
          href="#top"
          className="group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          aria-label="Adesh Anand — back to top"
        >
          <img
            src="/avatar.png"
            alt=""
            width={36}
            height={36}
            loading="eager"
            className="size-9 rounded-full object-cover ring-1 ring-ink/10 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-display text-base font-semibold tracking-tight text-ink">
            Adesh Anand
          </span>
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={active === link.id ? 'true' : undefined}
              className={`group/nav inline-flex items-baseline gap-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                active === link.id ? 'text-accent' : 'text-muted hover:text-ink'
              }`}
            >
              <span aria-hidden className="font-mono text-[0.65rem] tabular-nums text-accent-deep">
                {link.num}
              </span>
              {link.label}
            </a>
          ))}
          <ThemeToggle />
          <a
            href={hireHref}
            className="inline-flex items-center gap-2 rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-on-accent shadow-[0_6px_20px_var(--btn-glow)] transition-colors hover:bg-accent-strong-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <HireIcon size={15} aria-hidden />
            Hire Me
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            ref={toggleRef}
            className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cloud focus-visible:outline-2 focus-visible:outline-accent"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-ink/8 bg-paper/95 px-6 pb-6 pt-2 backdrop-blur-md lg:hidden">
          <ul className="flex flex-col">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-2.5 py-3 text-base font-medium text-ink focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <span aria-hidden className="font-mono text-xs tabular-nums text-accent">
                    {link.num}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href={emailHref}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full bg-accent-strong px-5 py-2.5 text-sm font-semibold text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Mail size={15} aria-hidden />
              Email me
            </a>
            <a
              href={identity.resumeFile}
              download
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-5 py-2.5 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Download size={15} aria-hidden />
              Download resume
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
