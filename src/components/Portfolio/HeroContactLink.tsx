'use client'

import React, { useEffect, useState } from 'react'

export function HeroContactLink() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        })
        setIsAuthenticated(response.ok)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const href = isAuthenticated ? '/contact-us' : '/admin/login?redirect=/contact-us'

  return (
    <a
      href={href}
      className="group text-sm font-semibold leading-6 text-white hover:text-slate-200 transition-colors flex items-center gap-2"
    >
      Get in touch
      <svg
        className="h-4 w-4 group-hover:translate-x-1 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </a>
  )
}
