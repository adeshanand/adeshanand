import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode, cookies } from 'next/headers'
import React, { cache } from 'react'
import { getLocale } from '@/utilities/locale/server'
import { homeStatic } from '@/endpoints/seed/home-static'
import { redirect } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Contact } from '@/components/Portfolio/Contact'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: true, // Override access to include all pages in static generation
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug && doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug: slug as string }
    })

  return params || []
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  // Check if page requires authentication
  if (page.requiresAuth) {
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value

    if (!token) {
      // No token, redirect to login
      redirect(`/admin/login?redirect=${encodeURIComponent(url)}`)
    }

    // Verify token is valid
    try {
      const meUserReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/users/me`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
        cache: 'no-store',
      })

      if (!meUserReq.ok) {
        // Invalid token, redirect to login
        redirect(`/admin/login?redirect=${encodeURIComponent(url)}`)
      }

      const { user } = await meUserReq.json()

      if (!user) {
        // No user, redirect to login
        redirect(`/admin/login?redirect=${encodeURIComponent(url)}`)
      }
    } catch (error) {
      // Error checking auth, redirect to login
      redirect(`/admin/login?redirect=${encodeURIComponent(url)}`)
    }
  }

  const { hero, layout } = page
  const isContactPage = decodedSlug === 'contact-us'

  return (
    <article className={`pt-16 pb-24 ${isContactPage ? 'relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen' : ''}`}>
      {isContactPage && (
        <>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </>
      )}
      <div className={`relative z-10 ${isContactPage ? 'text-white' : ''}`}>
        <PageClient />
        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

        <RenderHero {...hero} />
        <RenderBlocks blocks={layout} disableGradient={isContactPage} />
      </div>
      
      {/* Add Contact section specifically for contact-us page */}
      {isContactPage && (
        <div className="relative z-10">
          <Contact transparent={true} hideHeader={true} />
        </div>
      )}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const locale = await getLocale()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: true, // Override access - authentication check happens in Page component
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
