import React from 'react'

interface Highlight {
  value: string
  id: string
}

interface Experience {
  id: string
  company: string
  role: string
  location?: string | null
  startDate: string
  endDate?: string | null
  highlights?: Highlight[]
}

interface SectionHeading {
  title?: string | null
  description?: string | null
}

interface ExperienceProps {
  experiences: Experience[]
  heading?: SectionHeading
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function calculateDuration(startDate: string, endDate?: string | null): string {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`
  }
  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? '' : 's'}`
  }
  return `${years} year${years === 1 ? '' : 's'}, ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`
}

export function Experience({ experiences, heading }: ExperienceProps) {
  // Sort by start date (most recent first)
  const sortedExperiences = [...experiences].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  return (
    <section id="experience" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {heading?.title || 'Work Experience'}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {heading?.description || 'Professional journey building scalable web applications'}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="space-y-8">
            {sortedExperiences.map((exp, index) => (
              <div
                key={exp.id}
                className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow"
              >
                {index < sortedExperiences.length - 1 && (
                  <div className="absolute left-4 top-full h-8 w-0.5 bg-slate-200" />
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900">{exp.role}</h3>
                    <p className="mt-1 text-lg text-slate-700">{exp.company}</p>
                    {exp.location && (
                      <p className="mt-1 text-sm text-slate-500">{exp.location}</p>
                    )}
                  </div>
                  
                  <div className="text-sm text-slate-600 sm:text-right">
                    <p className="font-medium">
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </p>
                    <p className="mt-1 text-slate-500">
                      {calculateDuration(exp.startDate, exp.endDate)}
                    </p>
                  </div>
                </div>
                
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="mt-6 space-y-2">
                    {exp.highlights.map((highlight) => (
                      <li key={highlight.id} className="flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                        <span className="text-sm text-slate-600 leading-relaxed">
                          {highlight.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
