import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import path from 'node:path'
import { buildConfig } from 'payload'
import type { PayloadRequest } from 'payload'
import { fileURLToPath } from 'node:url'

import { Categories } from './collections/Categories.ts'
import { Certifications } from './collections/Certifications.ts'
import { Experiences } from './collections/Experiences.ts'
import { Media } from './collections/Media.ts'
import { Pages } from './collections/Pages/index.ts'
import { Posts } from './collections/Posts/index.ts'
import { Projects } from './collections/Projects.ts'
import { Skills } from './collections/Skills.ts'
import { Testimonials } from './collections/Testimonials.ts'
import { Users } from './collections/Users/index.ts'
import { Footer } from './Footer/config.ts'
import { Header } from './Header/config.ts'
import { SiteSettings } from './globals/SiteSettings.ts'
import { plugins } from './plugins/index.ts'
import { defaultLexical } from './fields/defaultLexical.ts'
import { getServerSideURL } from './utilities/getURL.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    autoLogin:
      process.env.NEXT_PUBLIC_ENABLE_AUTOLOGIN === 'true'
        ? {
            email: 'dev@payloadcms.com',
            password: 'test',
            prefillOnly: true,
          }
        : false,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [
    Pages,
    Posts,
    Projects,
    Skills,
    Experiences,
    Testimonials,
    Certifications,
    Media,
    Categories,
    Users,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteSettings, Header, Footer],
  localization: {
    locales: [
      {
        code: 'en',
        label: 'English',
      },
      {
        code: 'es',
        label: 'Spanish',
      },
      {
        code: 'fr',
        label: 'French',
      },
      {
        code: 'de',
        label: 'German',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins,
  secret: '8ef2c743a2597736c74829bf63d081212f4bb7edac2be541447a1d22fd9fa7a7',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
