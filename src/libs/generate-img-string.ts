import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { toBase64 } from 'js-base64'

export const generateImgString = async (uuid: string) => {
  const mermaidBlock = await logseq.Editor.getBlock(uuid, {
    includeChildren: true,
  })
  const mermaidChildBlocks = mermaidBlock!.children
  if (!mermaidChildBlocks || mermaidChildBlocks.length == 0) return
  const [codeBlock] = mermaidChildBlocks
  const codeBlockContent = (codeBlock as BlockEntity).content
    .replace('```mermaid', '')
    .replace('```', '')
    .replace('\n', ' ')
  const jsonString = toBase64(codeBlockContent, true)
  if (jsonString == 'IA') return

  return jsonString
}
