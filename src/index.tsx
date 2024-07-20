import '@logseq/libs'
import { handlePopup } from './handle-popup'
import { settings } from './settings'
import { BlockEntity } from '@logseq/libs/dist/LSPlugin.user'
import { toBase64 } from 'js-base64'

const main = async () => {
  console.log('logseq-mermaid-plugin loaded')
  // Used to handle any popups
  handlePopup()

  // Add disclaimer
  await logseq.UI.showMsg(
    'Please review the plugin settings before using the plugin.',
    'warning',
  )

  logseq.Editor.registerSlashCommand('Draw mermaid diagram', async (e) => {
    await logseq.Editor.insertAtEditingCursor(`{{renderer :mermaid_${e.uuid}}}`)
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

      const [type, colour] = args

      if (!type.startsWith(':mermaid_')) return

      let loading = false
      logseq.provideModel({
        async render() {
          loading = true

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

          fetch(`https://mermaid.ink/img/${jsonString}`)
            .then((res) => {
              logseq.Editor.updateBlock(
                uuid,
                `<img src="${res.url}" />{{renderer ${type}}}`,
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
      })
      logseq.provideUI({
        key: mermaidId,
        slot,
        reset: true,
        template: loading
          ? `Loading...`
          : `<button id="${mermaidId}" data-on-click="render">Render Mermaid<button>`,
      })
    },
  )
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)