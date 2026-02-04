import { Base64 } from 'js-base64'

export const getImgFromSvg = (
  svg: string,
  mermaidId: string,
  scale: number,
) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  if (!ctx || !img) return

  // Get device pixel ratio for high-DPI displays (e.g., Retina)
  const dpr = window.devicePixelRatio || 1

  img.onload = () => {
    // Calculate display size (CSS pixels)
    const displayWidth = img.width * scale
    const displayHeight = img.height * scale

    // Calculate actual canvas size (physical pixels) for crisp rendering
    const canvasWidth = displayWidth * dpr
    const canvasHeight = displayHeight * dpr

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Scale the context to account for device pixel ratio
    ctx.scale(dpr, dpr)
    ctx.drawImage(img, 0, 0, displayWidth, displayHeight)

    const dataUrl = canvas.toDataURL('image/png')

    const targetImg = parent.document.getElementById(
      mermaidId,
    ) as HTMLImageElement

    if (!targetImg) {
      throw new Error(`Element '${mermaidId}' not found`)
    }

    targetImg.src = dataUrl
    // Set CSS size to maintain proper display dimensions
    targetImg.style.width = `${displayWidth}px`
    targetImg.style.height = `${displayHeight}px`
  }

  img.onerror = () => {
    throw new Error('Unable to load SVG')
  }

  img.src = 'data:image/svg+xml;base64,' + Base64.encode(svg)
}
