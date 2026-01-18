import { HeaderClient } from './Component.client.tsx'
import { getCachedGlobal } from '@/utilities/getGlobals.ts'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const headerData: Header = await getCachedGlobal('header', 1)()

  return <HeaderClient data={headerData} />
}
