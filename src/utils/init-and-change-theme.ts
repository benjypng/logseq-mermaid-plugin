enum Theme {
  default = 'default',
  dark = 'dark',
  neutral = 'neutral',
  forest = 'forest',
  base = 'base',
}

export const mermaidInitAndChangeTheme = (
  // biome-ignore lint/suspicious/noExplicitAny: host type is complex/unknown coming from library
  host: any,
  theme: 'dark' | 'light',
) => {
  setTimeout(() => {
    host.mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? Theme.dark : Theme.default,
    })
  }, 10)
}
