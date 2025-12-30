import '@logseq/libs'

import { getImgFromSvg } from './utils/get-img-from-svg'
import { getMermaidString } from './utils/get-mermaid-string'

const main = async () => {
  const host = logseq.Experiments.ensureHostScope()
  await logseq.Experiments.loadScripts('../mermaid/mermaid.min.js')
  setTimeout(() => {
    host.mermaid.initialize({ startOnLoad: false })
    logseq.UI.showMsg('logseq-mermaid-plugin loaded')
  }, 50)

  logseq.Editor.registerSlashCommand(
    'Mermaid: Draw mermaid diagram',
    async (e) => {
      await logseq.Editor.insertAtEditingCursor(
        `{{renderer :mermaid_${e.uuid}, 3}}`,
      )
      await logseq.Editor.insertBlock(
        e.uuid,
        `\`\`\`mermaid
\`\`\``,
        {
          sibling: false,
        },
      )
      await logseq.Editor.exitEditingMode(false)
    },
  )

  logseq.App.onMacroRendererSlotted(
    async ({ slot, payload: { uuid, arguments: args } }) => {
      const [type, scaleArg] = args
      if (!type || !type.startsWith(':mermaid_')) return

      const scale = scaleArg ? parseFloat(scaleArg) : 3

      const mermaidId = `mermaid_${uuid}`
      const existingEl = parent.document.getElementById(mermaidId)

      if (!existingEl) {
        logseq.provideUI({
          key: mermaidId,
          slot,
          reset: true,
          template: `<img id="${mermaidId}" style="cursor: pointer"/>`,
        })
      }

      const mermaidString = await getMermaidString(uuid)
      if (!mermaidString || mermaidString.length < 2) return

      try {
        const { svg } = await host.mermaid.render(
          'mermaid-diagram',
          mermaidString,
        )

        setTimeout(async () => {
          getImgFromSvg(svg, mermaidId, scale)
        }, 0)
      } catch (error) {
        logseq.UI.showMsg(
          'Unable to generate mermaid diagram. There may be a typo somewhere.',
          'error',
        )
        throw new Error(String(error))
      }
    },
  )
}

logseq.ready(main).catch(console.error)
