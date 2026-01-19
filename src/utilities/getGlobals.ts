import type { Config } from '../payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache.js'
import { getLocale } from './getLocale'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
  const locale = await getLocale()

  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = (slug: Global, depth = 0) => {
  return async () => {
    const locale = await getLocale()

    const getByLocale = unstable_cache(async () => getGlobal(slug, depth), [slug, locale], {
      tags: [`global_${slug}_${locale}`],
    })

    return getByLocale()
  }
}
