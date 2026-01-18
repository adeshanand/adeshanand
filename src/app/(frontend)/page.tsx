import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { PortfolioHero, Skills, Experience, Projects, Contact } from '@/components/Portfolio'
import { getLocale } from '@/utilities/locale/server'

// Force dynamic rendering to respect locale cookie
export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const payload = await getPayload({ config: configPromise })
  const locale = await getLocale()

  // Fetch all portfolio data with locale support
  const [skillsData, experiencesData, projectsData, siteSettings] = await Promise.all([
    payload.find({
      collection: 'skills',
      locale,
      limit: 100,
      sort: '-proficiency',
    }),
    payload.find({
      collection: 'experiences',
      locale,
      limit: 100,
      sort: '-startDate',
    }),
    payload.find({
      collection: 'projects',
      locale,
      limit: 100,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      locale,
      depth: 0,
    }),
  ])

  return (
    <main className="min-h-screen">
      <PortfolioHero />
      <Skills skills={skillsData.docs} heading={siteSettings?.skillsSection} />
      <Experience experiences={experiencesData.docs} heading={siteSettings?.experienceSection} />
      <Projects projects={projectsData.docs} heading={siteSettings?.projectsSection} />
      <Contact />
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const locale = await getLocale()

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale,
    depth: 1,
  })

  return {
    title: siteSettings?.siteTitle || 'Adesh Anand - Senior Software Engineer',
    description:
      siteSettings?.siteDescription ||
      'Full-stack developer specializing in headless commerce, composable architectures, and high-performance web applications.',
  }
}
