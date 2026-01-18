import { cn } from '../../utilities/ui.ts'
import React from 'react'
import RichText from '../../components/RichText'

import type { ContentBlock as ContentBlockProps } from '../../payload-types.ts'

import { CMSLink } from '../../components/Link'

type ContentBlockComponentProps = ContentBlockProps & {
  backgroundColor?: 'default' | 'gradient'
}

export const ContentBlock: React.FC<ContentBlockComponentProps> = (props) => {
  const { columns, backgroundColor = 'default' } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  const containerClasses = cn('my-16', {
    'relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24':
      backgroundColor === 'gradient',
    'container': backgroundColor === 'default',
  })

  return (
    <div className={containerClasses}>
      {backgroundColor === 'gradient' && (
        <>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </>
      )}
      <div className={cn('grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16', {
        'relative z-10 container': backgroundColor === 'gradient',
      })}>
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
