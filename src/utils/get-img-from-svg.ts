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

  img.onload = () => {
    const scaledWidth = img.width * scale
    const scaledHeight = img.height * scale
    canvas.width = scaledWidth
    canvas.height = scaledHeight

    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight)

    const dataUrl = canvas.toDataURL('image/png')

    const targetImg = parent.document.getElementById(
      mermaidId,
    ) as HTMLImageElement

    if (!targetImg) {
      throw new Error(`Element '${mermaidId}' not found`)
    }

    targetImg.src = dataUrl
  }

  img.onerror = () => {
    throw new Error('Unable to load SVG')
  }

  img.src = 'data:image/svg+xml;base64,' + Base64.encode(svg)
}
