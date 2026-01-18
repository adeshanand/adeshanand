import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone.ts'
import { authenticated } from '../access/authenticated.ts'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
    },
    {
      name: 'techStack',
      type: 'array',
      localized: true,
      labels: {
        singular: 'Tech',
        plural: 'Tech Stack',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'achievements',
      type: 'array',
      localized: true,
      labels: {
        singular: 'Achievement',
        plural: 'Achievements',
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Project URL (https://...)',
      },
    },
  ],
}
