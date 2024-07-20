import '@logseq/libs'

import { handlePopup } from './handle-popup'
import css from './index.css?raw'
import { generateImgString } from './libs/generate-img-string'
import { checkValidTheme } from './services/check-if-theme'
import { settings } from './settings'

const main = async () => {
  console.log('logseq-mermaid-plugin loaded')
  // Used to handle any popups
  handlePopup()
  logseq.provideStyle(css)

  // Add disclaimer
  await logseq.UI.showMsg(
    'Please review the plugin settings before using the plugin.',
    'warning',
  )

  logseq.Editor.registerSlashCommand('Draw mermaid diagram', async (e) => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :mermaid_${e.uuid} #FFFFFF default}}`,
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
      const [type, colour, theme] = args![0]!.split(' ')
      if (!type || !type.startsWith(':mermaid_')) return

      const bgColour = colour?.startsWith('#')
        ? colour.replace('#', '')
        : `!${colour}`

      const validTheme = checkValidTheme(theme)

      let loading = false
      logseq.provideModel({
        async render() {
          loading = true
          const jsonString = await generateImgString(uuid)

          fetch(
            `${logseq.settings!.pathToMermaidServer}/img/${jsonString}?bgColor=${bgColour}&theme=${validTheme}`,
          )
            .then((res) => {
              logseq.Editor.updateBlock(
                uuid,
                `<img src="${res.url}" />{{renderer ${type} ${colour} ${theme}}}`,
              )
            })
            .then(() => {
              loading = false
            })
            .catch((error) => {
              loading = false
              throw new Error(error)
            })
        },
        async generatePdf() {
          loading = true
          const jsonString = await generateImgString(uuid)
          await logseq.App.openExternalLink(
            `https://mermaid.ink/pdf/${jsonString}`,
          )
        },
      })
      logseq.provideUI({
        key: mermaidId,
        slot,
        reset: true,
        template: loading
          ? `Loading...`
          : `<button class="mermaid-btn" id="render-${mermaidId}" data-on-click="render">Render Inline<button><button class="mermaid-btn" id="pdf-${mermaidId}" data-on-click="generatePdf">PDF</button>`,
      })
    },
  )
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
