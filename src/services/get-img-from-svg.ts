import { Base64 } from 'js-base64'

export const getImgFromSvg = (
  svg: string,
  mermaidId: string,
  scale: number,
  onError: (error: unknown) => void,
) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  if (!ctx || !img) return

  img.onload = () => {
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const targetImg = parent.document.getElementById(
          mermaidId,
        ) as HTMLImageElement
        if (!targetImg) {
          onError( new Error(`Element '${mermaidId}' not found`))
        }

        targetImg.src = url
        targetImg.onload = () => {
          URL.revokeObjectURL(url)
        }
      } else {
        onError( new Error('Unable to create blob'))
      }
    }, 'image/png')
  }

  img.onerror = () => {
    onError("Image rendering failed")
  }

  img.src = 'data:image/svg+xml;base64,' + Base64.encode(svg)
}
