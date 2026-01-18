import * as React from 'react'
import { cn } from '../../../utilities/ui'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  // Convert width to Tailwind classes for better responsiveness
  const widthClass = React.useMemo(() => {
    if (!width) return 'w-full'
    
    const numWidth = typeof width === 'string' ? parseFloat(width) : width
    
    if (numWidth <= 25) return 'w-full md:w-[calc(25%-0.75rem)]'
    if (numWidth <= 33) return 'w-full md:w-[calc(33.333%-0.75rem)]'
    if (numWidth <= 50) return 'w-full md:w-[calc(50%-0.5rem)]'
    if (numWidth <= 66) return 'w-full md:w-[calc(66.666%-0.5rem)]'
    if (numWidth <= 75) return 'w-full md:w-[calc(75%-0.5rem)]'
    
    return 'w-full'
  }, [width])

  return (
    <div className={cn('flex flex-col gap-2', widthClass, className)}>
      {children}
    </div>
  )
}
