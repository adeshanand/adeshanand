import { isValidLocale, type Locale } from './shared'

/** Client-side locale helpers */
export function getClientLocale(): Locale {
  if (!globalThis.window) return 'en'

  const locale = document.cookie
    .split('; ')
    .find((row) => row.startsWith('NEXT_LOCALE='))
    ?.split('=')[1]

  if (locale && isValidLocale(locale)) {
    return locale
  }

  return 'en'
}

export function setClientLocale(locale: Locale): void {
  if (typeof document === 'undefined') return
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`
}

// Re-export for convenience in client code
export { isValidLocale } from './shared'
export type { Locale } from './shared'
