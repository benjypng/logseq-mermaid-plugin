import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

export const getMermaidString = async (uuid: string) => {
  const mermaidBlock = await logseq.Editor.getBlock(uuid, {
    includeChildren: true,
  })
  if (!mermaidBlock) return

  const mermaidChildBlocks = mermaidBlock.children as BlockEntity[]
  if (!mermaidChildBlocks || mermaidChildBlocks.length == 0) return

  const [codeBlock] = mermaidChildBlocks
  if (!codeBlock) return
  if(codeBlock.content == null) return 
    
  const codeBlockContent = codeBlock.content
    .replace('```mermaid', '')
    .replace('```', '')
    .replace('\n', ' ')
  
  if (!codeBlockContent || codeBlockContent.length == 0) return

  return codeBlockContent
}
