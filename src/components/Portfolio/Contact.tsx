import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { StyledFormBlock } from '@/blocks/Form/StyledFormBlock'
import type { Form } from '@payloadcms/plugin-form-builder/types'
import { getLocale } from '@/utilities/locale/server'

export async function Contact({ transparent = false, hideHeader = false }: { transparent?: boolean; hideHeader?: boolean }) {
  const payload = await getPayload({ config: configPromise })
  const locale = await getLocale()

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
    locale,
  })

  // Fetch the Contact Form from Payload CMS
  const contactFormResult = await payload.find({
    collection: 'forms',
    where: {
      title: {
        equals: 'Contact Form',
      },
    },
    limit: 1,
  })

  const contactForm = contactFormResult.docs[0] as Form | undefined

  const {
    contactTitle = '✉️ Contact Me',
    contactDescription = 'Interested in collaboration or have a project in mind? Let\'s connect.',
    alternativeContactText = 'Or reach out directly:',
    contactFooterText = 'Based in Bengaluru, India • Open to remote opportunities',
    linkedinUrl,
    githubUrl,
    twitterUrl,
    email = 'adeshanand.official@gmail.com',
  } = siteSettings || {}

  return (
    <section id="contact" className={`py-24 text-white ${transparent ? 'bg-transparent' : 'bg-slate-900'}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {!hideHeader && (
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {contactTitle}
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              {contactDescription}
            </p>
          </div>
        )}

        {/* Contact Form */}
        <div className="mx-auto max-w-2xl">
          {contactForm ? (
            <StyledFormBlock
              enableIntro={false}
              form={contactForm}
              blockType="formBlock"
            />
          ) : (
            <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-6 backdrop-blur-sm">
              <p className="text-yellow-400">
                Contact form is not available. Please ensure the "Contact Form" exists in your Forms collection.
              </p>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="mx-auto max-w-2xl mt-16">
          <p className="text-center text-slate-400 mb-6">{alternativeContactText}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg bg-white/10 px-6 py-3 text-base font-medium hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
            )}
            
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg bg-white/10 px-6 py-3 text-base font-medium hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>GitHub</span>
              </a>
            )}

            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg bg-white/10 px-6 py-3 text-base font-medium hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Twitter</span>
              </a>
            )}
            
            <a
              href={`mailto:${email}`}
              className="group flex items-center gap-3 rounded-lg bg-white/10 px-6 py-3 text-base font-medium hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email</span>
            </a>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-slate-400">
            {contactFooterText}
          </p>
        </div>
      </div>
    </section>
  )
}
