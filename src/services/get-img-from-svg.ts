import { Base64 } from 'js-base64'

export const getImgFromSvg = (
  svg: string,
  mermaidId: string,
  scale: number,
  modalScale: number = 10,
) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  if (!ctx || !img) return

  img.onload = () => {
    // Generate low-res for inline display
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const inlineDataUrl = canvas.toDataURL('image/png')
    
    const targetImg = parent.document.getElementById(
      mermaidId,
    ) as HTMLImageElement
    
    if (!targetImg) {
      throw new Error(`Element '${mermaidId}' not found`)
    }

    targetImg.src = inlineDataUrl

    // Generate high-res for modal
    canvas.width = img.width * modalScale
    canvas.height = img.height * modalScale
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const modalDataUrl = canvas.toDataURL('image/png')

    // Helper function to download file
    const downloadFile = (dataUrl: string, filename: string) => {
      const link = parent.document.createElement('a')
      link.href = dataUrl
      link.download = filename
      parent.document.body.appendChild(link)
      link.click()
      parent.document.body.removeChild(link)
    }

    // Helper function to generate filename with timestamp
    const generateFilename = (extension: string) => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      return `mermaid-diagram-${timestamp}.${extension}`
    }

    targetImg.onclick = () => {
      const modal = parent.document.getElementById(`modal-${mermaidId}`)
      const modalImg = parent.document.getElementById(`modal-img-${mermaidId}`) as HTMLImageElement
      const modalContainer = parent.document.getElementById(`modal-container-${mermaidId}`)
      const closeBtn = parent.document.getElementById(`close-${mermaidId}`)
      const savePngBtn = parent.document.getElementById(`save-png-${mermaidId}`)
      const saveSvgBtn = parent.document.getElementById(`save-svg-${mermaidId}`)

      if (modal && modalImg && modalContainer && closeBtn && savePngBtn && saveSvgBtn) {
        modal.style.display = 'block'
        modalImg.src = modalDataUrl

        // Add save functionality
        savePngBtn.onclick = (e) => {
          e.stopPropagation()
          downloadFile(modalDataUrl, generateFilename('png'))
        }

        saveSvgBtn.onclick = (e) => {
          e.stopPropagation()
          const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
          const svgUrl = URL.createObjectURL(svgBlob)
          downloadFile(svgUrl, generateFilename('svg'))
          // Clean up the object URL
          setTimeout(() => URL.revokeObjectURL(svgUrl), 100)
        }

        // Add drag functionality
        let isDragging = false
        let startX = 0
        let startY = 0
        let scrollLeft = 0
        let scrollTop = 0

        const handleMouseDown = (e: MouseEvent) => {
          // Don't start dragging if clicking on buttons or their children
          const target = e.target as HTMLElement
          if (target.id.includes('save-png-') || target.id.includes('save-svg-') || 
              target.closest('button') || target.tagName === 'BUTTON') {
            return
          }
          
          isDragging = true
          modalContainer.style.cursor = 'grabbing'
          startX = e.clientX
          startY = e.clientY
          scrollLeft = modalContainer.scrollLeft
          scrollTop = modalContainer.scrollTop
          e.preventDefault()
        }

        const handleMouseMove = (e: MouseEvent) => {
          if (!isDragging) return
          e.preventDefault()
          const x = e.clientX
          const y = e.clientY
          const walkX = startX - x
          const walkY = startY - y
          modalContainer.scrollLeft = scrollLeft + walkX
          modalContainer.scrollTop = scrollTop + walkY
        }

        const handleMouseUp = () => {
          isDragging = false
          modalContainer.style.cursor = 'grab'
        }

        // Add mouse wheel support for both vertical and horizontal scrolling
        const handleWheel = (e: WheelEvent) => {
          e.preventDefault()
          const scrollAmount = e.deltaY * 0.5 // Reduce scroll sensitivity
          if (e.shiftKey) {
            // Shift + wheel for horizontal scrolling
            modalContainer.scrollLeft += scrollAmount
          } else {
            // Normal wheel for vertical scrolling
            modalContainer.scrollTop += scrollAmount
          }
        }

        modalContainer.addEventListener('mousedown', handleMouseDown)
        modalContainer.addEventListener('mousemove', handleMouseMove)
        modalContainer.addEventListener('mouseup', handleMouseUp)
        modalContainer.addEventListener('mouseleave', handleMouseUp)
        modalContainer.addEventListener('wheel', handleWheel)

        closeBtn.onclick = () => {
          modal.style.display = 'none'
          // Clean up event listeners
          modalContainer.removeEventListener('mousedown', handleMouseDown)
          modalContainer.removeEventListener('mousemove', handleMouseMove)
          modalContainer.removeEventListener('mouseup', handleMouseUp)
          modalContainer.removeEventListener('mouseleave', handleMouseUp)
          modalContainer.removeEventListener('wheel', handleWheel)
          // Clean up save button listeners
          savePngBtn.onclick = null
          saveSvgBtn.onclick = null
        }

        modal.onclick = (e) => {
          if (e.target === modal) {
            modal.style.display = 'none'
            // Clean up event listeners
            modalContainer.removeEventListener('mousedown', handleMouseDown)
            modalContainer.removeEventListener('mousemove', handleMouseMove)
            modalContainer.removeEventListener('mouseup', handleMouseUp)
            modalContainer.removeEventListener('mouseleave', handleMouseUp)
            modalContainer.removeEventListener('wheel', handleWheel)
            // Clean up save button listeners
            savePngBtn.onclick = null
            saveSvgBtn.onclick = null
          }
        }
      }
    }
  }

  img.onerror = () => {
    throw new Error('Unable to load SVG')
  }

  img.src = 'data:image/svg+xml;base64,' + Base64.encode(svg)
}
