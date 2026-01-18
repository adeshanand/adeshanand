import React from 'react'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  description?: string | null
}

interface SectionHeading {
  title?: string | null
  description?: string | null
}

interface SkillsProps {
  skills: Skill[]
  heading?: SectionHeading
}

const categoryIcons: Record<string, string> = {
  Frontend: '🎨',
  Backend: '⚙️',
  Cloud: '☁️',
  Commerce: '🛍️',
  Architecture: '🏗️',
  Productivity: '⚡',
}

export function Skills({ skills, heading }: SkillsProps) {
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const categories = Object.keys(groupedSkills).sort((a, b) => a.localeCompare(b))

  return (
    <section id="skills" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {heading?.title || 'Skills & Expertise'}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {heading?.description || 'Technologies and tools I work with to build scalable solutions'}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div 
                key={category} 
                className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-2xl" aria-label={category}>
                    {categoryIcons[category] || '📦'}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">{category}</h3>
                </div>
                
                <ul className="space-y-4">
                  {groupedSkills[category].map((skill) => (
                    <li key={skill.id} className="group/item">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-slate-700 leading-relaxed">
                          {skill.name}
                        </span>
                        <div className="flex gap-1 mt-0.5">
                          {[...new Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                                i < skill.proficiency 
                                  ? 'bg-slate-900 group-hover/item:bg-slate-700' 
                                  : 'bg-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {skill.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {skill.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
