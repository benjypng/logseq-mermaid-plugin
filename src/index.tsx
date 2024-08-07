import '@logseq/libs'

import { getImgFromSvg } from './services/get-img-from-svg'
import { getMermaidString } from './services/get-mermaid-string'

const main = async () => {
  console.log('logseq-mermaid-plugin loaded')
  const host = logseq.Experiments.ensureHostScope()
  await logseq.Experiments.loadScripts('../mermaid/mermaid.min.js')
  host.mermaid.initialize({ startOnLoad: false })

  logseq.Editor.registerSlashCommand('Draw mermaid diagram', async (e) => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :mermaid_${e.uuid}, 3}}`,
    )
    // Create mermaid code block
    await logseq.Editor.insertBlock(
      e.uuid,
      `\`\`\`mermaid
\`\`\``,
      {
        sibling: false,
        before: false,
      },
    )
    logseq.Editor.exitEditingMode(true)
  })

  logseq.App.onMacroRendererSlotted(
    async ({ slot, payload: { uuid, arguments: args } }) => {
      const mermaidId = `mermaid_${uuid}_${slot}`
      const [type, scaleArg] = args
      if (!type || !type.startsWith(':mermaid_')) return

      const scale = scaleArg ? parseFloat(scaleArg) : 3

      logseq.provideUI({
        key: mermaidId,
        slot,
        reset: true,
        template: `<img id="${mermaidId}" />`,
      })

      const mermaidString = await getMermaidString(uuid)
      if (!mermaidString || mermaidString.length < 2) return

      try {
        const { svg } = await host.mermaid.render(
          'mermaid-diagram',
          mermaidString,
        )

        setTimeout(async () => {
          getImgFromSvg(svg, mermaidId, scale)
        }, 100)
      } catch (error) {
        console.log(error)
        await logseq.UI.showMsg(
          'Unable to generate mermaid diagram. There may be a typo somewhere.',
          'error',
        )
        throw new Error(
          'Unable to generate mermaid diagram. There may be a typo somewhere.',
        )
      }
    },
  )
}

logseq.ready(main).catch(console.error)
