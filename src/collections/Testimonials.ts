import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone.ts'
import { authenticated } from '../access/authenticated.ts'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'rating', 'featured'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Job Title',
      localized: true,
    },
    {
      name: 'company',
      type: 'text',
      label: 'Company',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo',
      admin: {
        description: 'Profile photo of the person giving the testimonial',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Testimonial Quote',
      localized: true,
      admin: {
        description: 'The testimonial text',
      },
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Rating',
      min: 1,
      max: 5,
      admin: {
        description: 'Rating out of 5 stars',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Testimonial',
      defaultValue: false,
      admin: {
        description: 'Display this testimonial prominently on the homepage',
      },
    },
    {
      name: 'relationship',
      type: 'select',
      label: 'Professional Relationship',
      options: [
        { label: 'Client', value: 'client' },
        { label: 'Colleague', value: 'colleague' },
        { label: 'Manager', value: 'manager' },
        { label: 'Team Member', value: 'team-member' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Your professional relationship with this person',
      },
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      label: 'LinkedIn Profile',
      admin: {
        description: 'Link to their LinkedIn profile (optional)',
      },
    },
  ],
  timestamps: true,
}
