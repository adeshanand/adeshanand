import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone.ts'
import { authenticated } from '../access/authenticated.ts'

export const Skills: CollectionConfig = {
  slug: 'skills',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Frontend', value: 'Frontend' },
        { label: 'Backend', value: 'Backend' },
        { label: 'Cloud', value: 'Cloud' },
        { label: 'Commerce', value: 'Commerce' },
        { label: 'Architecture', value: 'Architecture' },
        { label: 'Productivity', value: 'Productivity' },
      ],
    },
    {
      name: 'proficiency',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
}
