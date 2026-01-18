import { cookies } from 'next/headers'
import { isValidLocale, type Locale } from './shared'

/** Server-side locale helper */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value

  if (locale && isValidLocale(locale)) {
    return locale
  }

  return 'en'
}

export type { Locale } from './shared'
