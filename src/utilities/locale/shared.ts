/** Shared locale types and validation */
export const supportedLocales = ['en', 'es', 'fr', 'de'] as const
export type Locale = (typeof supportedLocales)[number]

export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale)
}
