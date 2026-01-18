'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getClientLocale, setClientLocale, isValidLocale, type Locale } from '@/utilities/locale/client'
import './styles.css'

const locales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

export function FloatingLanguageSelector() {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<Locale>('en')
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const savedLocale = getClientLocale()
    if (isValidLocale(savedLocale)) {
      setCurrentLocale(savedLocale)
    }

    // Handle scroll to auto-hide
    let lastScrollY = window.scrollY
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 100)
      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLocale = (locale: Locale) => {
    if (!isValidLocale(locale)) return
    setClientLocale(locale)
    setCurrentLocale(locale)
    setIsOpen(false)

    // Reload to fetch content in new locale
    router.refresh()
  }

  const currentLocaleData = locales.find((l) => l.code === currentLocale) || locales[0]

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="floating-dropdown-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Select Dropdown */}
      <div className={`floating-select-container ${isVisible ? 'visible' : 'hidden'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="floating-select-button"
          aria-label="Select language"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="select-flag">{currentLocaleData.flag}</span>
          <span className="select-label">{currentLocaleData.label}</span>
          <svg
            className={`select-chevron ${isOpen ? 'open' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="floating-select-dropdown" role="listbox">
            {locales.map((locale) => (
              <button
                key={locale.code}
                onClick={() => changeLocale(locale.code as Locale)}
                className={`dropdown-option ${currentLocale === locale.code ? 'active' : ''}`}
                role="option"
                aria-selected={currentLocale === locale.code}
              >
                <span className="option-flag">{locale.flag}</span>
                <span className="option-label">{locale.label}</span>
                {currentLocale === locale.code && (
                  <svg className="option-check" viewBox="0 0 20 20" fill="currentColor">
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
        )}
      </div>
    </>
  )
}
