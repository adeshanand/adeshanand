import { useSyncExternalStore } from 'react';

/*
 * Theme store shared by every useTheme() consumer (the nav renders two
 * ThemeToggles — desktop and mobile — and both must stay in sync).
 *
 * Single source of truth: the data-theme attribute on <html> (set before
 * first paint by public/theme-init.js). LIGHT IS THE DEFAULT — when the
 * attribute is absent the site is light; the OS preference is deliberately
 * not consulted. React state derives via useSyncExternalStore, so no hook
 * instance can hold a stale copy.
 */
const listeners = new Set();
const notify = () => listeners.forEach((l) => l());

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function syncThemeColorMeta(theme) {
  const color = theme === 'dark' ? '#060a0f' : '#eef3f5';
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute('content', color));
}

function subscribe(listener) {
  listeners.add(listener);
  // Another tab changed the stored choice: mirror it here
  const onStorage = (e) => {
    if (e.key !== 'theme') return;
    if (e.newValue === 'light' || e.newValue === 'dark') {
      document.documentElement.dataset.theme = e.newValue;
    } else {
      delete document.documentElement.dataset.theme; // back to the light default
    }
    syncThemeColorMeta(currentTheme());
    notify();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function setTheme(next, event) {
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode — theme still applies for this visit */
    }
    syncThemeColorMeta(next);
    notify();
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (document.startViewTransition && !reduced) {
    if (event?.currentTarget) {
      const r = event.currentTarget.getBoundingClientRect();
      document.documentElement.style.setProperty('--vt-x', `${r.left + r.width / 2}px`);
      document.documentElement.style.setProperty('--vt-y', `${r.top + r.height / 2}px`);
    }
    // Pause the body's color transition so the circular reveal stays crisp
    // (the "new" view is a live capture, not a static snapshot)
    document.documentElement.classList.add('vt-active');
    const vt = document.startViewTransition(apply);
    vt.finished.finally(() => document.documentElement.classList.remove('vt-active'));
  } else {
    apply();
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, currentTheme);
  const toggle = (event) => setTheme(theme === 'dark' ? 'light' : 'dark', event);
  return { theme, toggle };
}
