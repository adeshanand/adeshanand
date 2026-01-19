import type { Config } from '../payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache.js'
import { getLocale } from './getLocale'

type Collection = keyof Config['collections']

async function getDocument(collection: Collection, slug: string, depth = 0) {
  const locale = await getLocale()

  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    locale,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0]
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = (collection: Collection, slug: string) => {
  return async () => {
    const locale = await getLocale()

    const getByLocale = unstable_cache(
      async () => getDocument(collection, slug),
      [collection, slug, locale],
      {
        tags: [`${collection}_${slug}_${locale}`],
      },
    )

    return getByLocale()
  }
}
