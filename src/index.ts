import '@logseq/libs'

import {
  getImgFromSvg,
  getMermaidString,
  mermaidInitAndChangeTheme,
} from './utils'

const main = async () => {
  logseq.UI.showMsg('logseq-mermaid-plugin loaded')

  const host = logseq.Experiments.ensureHostScope()
  await logseq.Experiments.loadScripts('../mermaid/mermaid.min.js')

  const userConfigs = await logseq.App.getUserConfigs()
  mermaidInitAndChangeTheme(host, userConfigs.preferredThemeMode)

  logseq.Editor.registerSlashCommand(
    'Mermaid: Draw mermaid diagram',
    async (e) => {
      await logseq.Editor.insertAtEditingCursor(
        `{{renderer :mermaid_${e.uuid}, 3}}`,
      )
      setTimeout(async () => {
        await logseq.Editor.insertBlock(
          e.uuid,
          `\`\`\`mermaid
\`\`\``,
          {
            sibling: false,
          },
        )
      }, 10)
    },
  )

  logseq.App.onThemeModeChanged(({ mode }) => {
    mermaidInitAndChangeTheme(host, mode)
  })

  logseq.App.onMacroRendererSlotted(
    async ({ slot, payload: { uuid, arguments: args } }) => {
      const [type, scaleArg] = args
      if (!type || !type.startsWith(':mermaid_')) return

      const scale = scaleArg ? parseFloat(scaleArg) : 3

      const userConfigs = await logseq.App.getUserConfigs()
      mermaidInitAndChangeTheme(host, userConfigs.preferredThemeMode)

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
