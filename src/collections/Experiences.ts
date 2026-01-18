import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone.ts'
import { authenticated } from '../access/authenticated.ts'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'company',
  },
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        description: 'Leave empty if current role',
      },
    },
    {
      name: 'highlights',
      type: 'array',
      localized: true,
      labels: {
        singular: 'Highlight',
        plural: 'Highlights',
      },
      required: true,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
