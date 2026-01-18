import React from 'react'
import Image from 'next/image'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Media } from '@/payload-types'
import { HeroContactLink } from './HeroContactLink'
import { getLocale } from '@/utilities/locale/server'

export async function PortfolioHero() {
  const payload = await getPayload({ config: configPromise })
  const locale = await getLocale()
  
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
    locale,
  })

  const profilePic = siteSettings?.profilePicture as Media | undefined
  const profileImageUrl = profilePic?.url || '/profilepicture.png'
  const heroButtons = siteSettings?.heroButtons || []

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-6xl relative">
          {/* Profile Picture as Background Element */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40vw] max-w-[500px] h-auto opacity-20 lg:opacity-30 pointer-events-none z-0">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50 blur-3xl"></div>
              <div className="relative">
                <Image
                  src={profileImageUrl}
                  alt={`${siteSettings?.name || 'Profile'} - Profile Picture`}
                  width={500}
                  height={500}
                  className="rounded-full object-cover"
                  priority
                />
              </div>
            </div>
            {/* Gradient overlay to blend with background */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-900/30 to-slate-900/80 rounded-full"></div>
          </div>

          {/* Text Content */}
          <div className="relative z-10 text-center lg:text-left max-w-3xl">
            {siteSettings?.availableForWork && (
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm border border-white/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-slate-200">Available for opportunities</span>
              </div>
            )}
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
              {siteSettings?.name || 'Adesh Anand'}
            </h1>
            
            <p className="mt-6 text-xl leading-8 text-slate-300 font-medium">
              {siteSettings?.title || 'Senior Software Engineer'}
            </p>
            
            <p className="mt-6 text-base leading-7 text-slate-400 max-w-2xl lg:max-w-none">
              {siteSettings?.bio ||
                'Full-stack developer with 5+ years of experience specializing in headless commerce, composable architectures, and high-performance web applications. Expert in React, Next.js, Node.js, and cloud infrastructure.'}
            </p>
            
            {siteSettings?.location && (
              <div className="mt-4 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{siteSettings.location}</span>
                </div>
              </div>
            )}
            
            {heroButtons.length > 0 && (
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                {heroButtons.map((button: any, index: number) => {
                  const isPrimary = button.style === 'primary'
                  const isSecondary = button.style === 'secondary'
                  
                  // Render secondary as text link
                  if (isSecondary) {
                    return (
                      <a
                        key={index}
                        href={button.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group text-sm font-semibold leading-6 text-white hover:text-slate-200 transition-colors flex items-center gap-2"
                      >
                        {button.label}
                        <svg
                          className="h-4 w-4 group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )
                  }
                  
                  // Render primary as button
                  return (
                    <a
                      key={index}
                      href={button.link}
                      className="group rounded-lg px-4 py-3 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 bg-white text-slate-900"
                    >
                      <span className="flex items-center gap-2">
                        {button.label}
                        <svg
                          className="h-4 w-4 group-hover:translate-y-0.5 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </span>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { label: 'Years Experience', value: '5+' },
              { label: 'Projects Delivered', value: '20+' },
              { label: 'Technologies', value: '15+' },
              { label: 'Companies', value: '4' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/5 p-6 text-center backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
