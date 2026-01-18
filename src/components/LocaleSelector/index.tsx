'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getClientLocale, setClientLocale, isValidLocale, type Locale } from '@/utilities/locale/client'

const locales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

export function LocaleSelector() {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedLocale = getClientLocale()
    if (isValidLocale(savedLocale)) {
      setCurrentLocale(savedLocale)
    }
  }, [])

  const changeLocale = (locale: Locale) => {
    if (!isValidLocale(locale)) return
    setClientLocale(locale)
    setCurrentLocale(locale)
    setIsOpen(false)
    router.refresh()
  }

  const currentLocaleData = locales.find((l) => l.code === currentLocale) || locales[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label="Select language"
      >
        <span className="text-xl">{currentLocaleData.flag}</span>
        <span className="text-sm font-medium">{currentLocaleData.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-10"
            aria-label="Close language menu"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setIsOpen(false)
            }}
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 z-20">
            {locales.map((locale) => (
              <button
                key={locale.code}
                onClick={() => changeLocale(locale.code as Locale)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                  currentLocale === locale.code
                    ? 'bg-gray-50 dark:bg-gray-700 font-medium'
                    : ''
                }`}
              >
                <span className="text-xl">{locale.flag}</span>
                <span>{locale.label}</span>
                {currentLocale === locale.code && (
                  <svg
                    className="w-4 h-4 ml-auto text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
