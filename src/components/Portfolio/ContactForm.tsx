'use client'
import React, { useState } from 'react'

interface FormLabels {
  nameLabel?: string | null
  namePlaceholder?: string | null
  emailLabel?: string | null
  emailPlaceholder?: string | null
  subjectLabel?: string | null
  subjectPlaceholder?: string | null
  messageLabel?: string | null
  messagePlaceholder?: string | null
  submitButtonText?: string | null
}

interface ContactFormProps {
  formLabels: FormLabels
}

export function ContactForm({ formLabels }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const {
    nameLabel = 'Name',
    namePlaceholder = 'Your name',
    emailLabel = 'Email',
    emailPlaceholder = 'your.email@example.com',
    subjectLabel = 'Subject',
    subjectPlaceholder = "What's this about?",
    messageLabel = 'Message',
    messagePlaceholder = 'Tell me about your project or idea...',
    submitButtonText = 'Send Message',
  } = formLabels

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for your message! (This is a demo form)')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            {nameLabel}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all"
            placeholder={namePlaceholder || undefined}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            {emailLabel}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all"
            placeholder={emailPlaceholder || undefined}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
          {subjectLabel}
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all"
          placeholder={subjectPlaceholder || undefined}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
          {messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm transition-all resize-none"
          placeholder={messagePlaceholder || undefined}
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full rounded-lg bg-white text-slate-900 px-6 py-3 text-base font-semibold hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  )
}
