import React from 'react'

interface Tech {
  value: string
  id: string
}

interface Achievement {
  value: string
  id: string
}

interface Project {
  id: string
  title: string
  role?: string | null
  techStack?: Tech[]
  achievements?: Achievement[]
  link?: string | null
}

interface SectionHeading {
  title?: string | null
  description?: string | null
}

interface ProjectsProps {
  projects: Project[]
  heading?: SectionHeading
}

export function Projects({ projects, heading }: ProjectsProps) {
  return (
    <section id="projects" className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {heading?.title || 'Featured Projects'}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {heading?.description || 'Notable projects and contributions across e-commerce platforms'}
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
              >
                {/* Project number badge */}
                <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-lg">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                      {project.title}
                    </h3>
                    {project.role && (
                      <p className="mt-2 text-sm font-medium text-slate-600">{project.role}</p>
                    )}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <span>Visit Site</span>
                      <svg 
                        className="h-4 w-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                
                {project.techStack && project.techStack.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech.id}
                          className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 transition-colors"
                        >
                          {tech.value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {project.achievements && project.achievements.length > 0 && (
                  <div className="space-y-3">
                    {project.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                            <svg
                              className="h-3 w-3 text-slate-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed flex-1">
                          {achievement.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
