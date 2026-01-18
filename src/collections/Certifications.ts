import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone.ts'
import { authenticated } from '../access/authenticated.ts'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'issuer', 'dateIssued', 'expirationDate'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Certification Title',
      localized: true,
    },
    {
      name: 'issuer',
      type: 'text',
      required: true,
      label: 'Issuing Organization',
      admin: {
        description: 'Name of the organization that issued the certification',
      },
    },
    {
      name: 'dateIssued',
      type: 'date',
      label: 'Issue Date',
      admin: {
        description: 'When the certification was issued',
      },
    },
    {
      name: 'expirationDate',
      type: 'date',
      label: 'Expiration Date',
      admin: {
        description: 'Leave empty if the certification does not expire',
      },
    },
    {
      name: 'credentialId',
      type: 'text',
      label: 'Credential ID',
      admin: {
        description: 'Unique identifier for the certification',
      },
    },
    {
      name: 'credentialUrl',
      type: 'text',
      label: 'Credential URL',
      admin: {
        description: 'Link to verify the certification online',
        placeholder: 'https://...',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Issuer Logo',
      admin: {
        description: 'Logo of the issuing organization',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
      admin: {
        description: 'Brief description of what this certification covers',
      },
    },
    {
      name: 'skills',
      type: 'array',
      label: 'Skills Covered',
      localized: true,
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Key skills or technologies covered by this certification',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        description: 'Display this certification prominently',
      },
    },
  ],
  timestamps: true,
}
