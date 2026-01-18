import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'profilePicture',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'Profile Picture',
              admin: {
                description: 'Upload your profile picture for the hero section',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
              defaultValue: 'Adesh Anand',
              label: 'Name',
              localized: true,
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'Senior Software Engineer',
              label: 'Job Title',
              localized: true,
            },
            {
              name: 'bio',
              type: 'textarea',
              required: true,
              defaultValue:
                'Full-stack developer with 5+ years of experience specializing in headless commerce, composable architectures, and high-performance web applications. Expert in React, Next.js, Node.js, and cloud infrastructure.',
              label: 'Bio',
              localized: true,
            },
            {
              name: 'location',
              type: 'text',
              defaultValue: 'Bengaluru, India',
              label: 'Location',
              localized: true,
            },
            {
              name: 'availableForWork',
              type: 'checkbox',
              defaultValue: true,
              label: 'Available for Opportunities',
            },
            {
              name: 'heroButtons',
              type: 'array',
              label: 'Hero Call-to-Action Buttons',
              maxRows: 3,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: 'Button Text',
                },
                {
                  name: 'link',
                  type: 'text',
                  required: true,
                  label: 'Link (URL or #anchor)',
                  admin: {
                    description: 'Use #section-id for anchor links or full URL for external links',
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  required: true,
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                  ],
                },
              ],
              defaultValue: [
                { label: 'View Experience', link: '#experience', style: 'primary' },
                { label: 'Get in Touch', link: '/contact-us', style: 'secondary' },
              ],
            },
          ],
        },
        {
          label: 'Social Links',
          fields: [
            {
              name: 'linkedinUrl',
              type: 'text',
              label: 'LinkedIn Profile URL',
              defaultValue: 'https://www.linkedin.com/in/adeshanand',
              admin: {
                description: 'Your LinkedIn profile URL',
                placeholder: 'https://www.linkedin.com/in/username',
              },
            },
            {
              name: 'githubUrl',
              type: 'text',
              label: 'GitHub Profile URL',
              defaultValue: 'https://github.com/adeshanand',
              admin: {
                description: 'Your GitHub profile URL',
                placeholder: 'https://github.com/username',
              },
            },
            {
              name: 'twitterUrl',
              type: 'text',
              label: 'Twitter/X Profile URL',
              admin: {
                description: 'Your Twitter/X profile URL (optional)',
                placeholder: 'https://twitter.com/username',
              },
            },
            {
              name: 'email',
              type: 'email',
              label: 'Contact Email',
              defaultValue: 'adeshanand.official@gmail.com',
              required: true,
              admin: {
                description: 'Primary email for contact',
              },
            },
          ],
        },
        {
          label: 'Contact Section',
          fields: [
            {
              name: 'contactTitle',
              type: 'text',
              label: 'Section Title',
              defaultValue: '✉️ Contact Me',
              localized: true,
            },
            {
              name: 'contactDescription',
              type: 'textarea',
              label: 'Section Description',
              defaultValue: 'Interested in collaboration or have a project in mind? Let\'s connect.',
              localized: true,
            },
            {
              name: 'alternativeContactText',
              type: 'text',
              label: 'Alternative Contact Text',
              defaultValue: 'Or reach out directly:',
              localized: true,
            },
            {
              name: 'contactFooterText',
              type: 'text',
              label: 'Contact Footer Text',
              defaultValue: 'Based in Bengaluru, India • Open to remote opportunities',
              localized: true,
            },
            {
              name: 'formLabels',
              type: 'group',
              label: 'Contact Form Labels',
              fields: [
                {
                  name: 'nameLabel',
                  type: 'text',
                  defaultValue: 'Name',
                  localized: true,
                },
                {
                  name: 'namePlaceholder',
                  type: 'text',
                  defaultValue: 'Your name',
                  localized: true,
                },
                {
                  name: 'emailLabel',
                  type: 'text',
                  defaultValue: 'Email',
                  localized: true,
                },
                {
                  name: 'emailPlaceholder',
                  type: 'text',
                  defaultValue: 'your.email@example.com',
                  localized: true,
                },
                {
                  name: 'subjectLabel',
                  type: 'text',
                  defaultValue: 'Subject',
                  localized: true,
                },
                {
                  name: 'subjectPlaceholder',
                  type: 'text',
                  defaultValue: 'What\'s this about?',
                  localized: true,
                },
                {
                  name: 'messageLabel',
                  type: 'text',
                  defaultValue: 'Message',
                  localized: true,
                },
                {
                  name: 'messagePlaceholder',
                  type: 'text',
                  defaultValue: 'Tell me about your project or idea...',
                  localized: true,
                },
                {
                  name: 'submitButtonText',
                  type: 'text',
                  defaultValue: 'Send Message',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Section Headings',
          fields: [
            {
              name: 'skillsSection',
              type: 'group',
              label: 'Skills Section',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Skills & Expertise',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  defaultValue: 'Technologies and tools I work with to build scalable solutions',
                  localized: true,
                },
              ],
            },
            {
              name: 'experienceSection',
              type: 'group',
              label: 'Experience Section',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Work Experience',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  defaultValue: 'Professional journey building scalable web applications',
                  localized: true,
                },
              ],
            },
            {
              name: 'projectsSection',
              type: 'group',
              label: 'Projects Section',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Featured Projects',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  defaultValue: 'Notable projects and contributions across e-commerce platforms',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & Metadata',
          fields: [
            {
              name: 'siteTitle',
              type: 'text',
              label: 'Site Title',
              defaultValue: 'Adesh Anand - Senior Software Engineer',
              localized: true,
              admin: {
                description: 'Default page title for the homepage',
              },
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Site Description',
              defaultValue:
                'Full-stack developer specializing in headless commerce, composable architectures, and high-performance web applications.',
              localized: true,
              admin: {
                description: 'Default meta description for the homepage',
              },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Open Graph Image',
              admin: {
                description: 'Default social sharing image (1200x630px recommended)',
              },
            },
            {
              name: 'twitterHandle',
              type: 'text',
              label: 'Twitter Handle',
              admin: {
                description: 'Your Twitter handle (without @)',
                placeholder: 'username',
              },
            },
          ],
        },
      ],
    },
  ],
}
