import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Injected at build time only — a meta CSP in dev would block Vite's HMR runtime.
// frame-ancestors is not valid in a meta tag; it ships via vercel.json / _headers.
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

function injectCsp() {
  return {
    name: 'inject-csp-meta',
    apply: 'build',
    // Tag-descriptor form: Vite injects the meta structurally, so the CSP
    // cannot silently vanish if index.html is ever reformatted.
    transformIndexHtml() {
      return [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), injectCsp()],
});
