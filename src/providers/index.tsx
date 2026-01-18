import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme/index.tsx'
import { ThemeProvider } from './Theme/index.tsx'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  )
}
