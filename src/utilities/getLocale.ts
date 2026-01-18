import { cookies } from 'next/headers'

/**
 * Supported locales - must match payload.config.ts
 */
export const supportedLocales = ['en', 'es', 'fr', 'de'] as const
export type Locale = (typeof supportedLocales)[number]

/**
 * Get the current locale from cookies or default to 'en'
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value
  
  if (locale && isValidLocale(locale)) {
    return locale
  }
  
  return 'en'
}

/**
 * Get locale for client-side
 */
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

/**
 * Validate locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale)
}

/**
 * Set locale on the client (persists in cookie for 1 year)
 */
export function setClientLocale(locale: Locale): void {
  if (typeof document === 'undefined') return
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`
}
