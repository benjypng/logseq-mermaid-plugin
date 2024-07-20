export const handlePopup = () => {
  // Hit 'Esc' to close pop-up
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        logseq.hideMainUI({ restoreEditingCursor: true })
      }
      e.stopPropagation()
    },
    false,
  )
  // Click outside to close pop-up
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('body')) {
      logseq.hideMainUI({ restoreEditingCursor: true })
    }
    e.stopPropagation()
  })
}
