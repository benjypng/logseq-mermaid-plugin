type Theme = 'default' | 'neutral' | 'dark' | 'forest'

export const checkValidTheme = (theme: unknown): Theme => {
  const validThemes: Theme[] = ['default', 'neutral', 'dark', 'forest']
  if (typeof theme === 'string' && validThemes.includes(theme as Theme)) {
    return theme as Theme
  }
  return 'default'
}
