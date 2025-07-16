import '@logseq/libs'

import { getImgFromSvg } from './services/get-img-from-svg'
import { getMermaidString } from './services/get-mermaid-string'

const main = async () => {
  console.log('logseq-mermaid-plugin loaded')
  const host = logseq.Experiments.ensureHostScope()
  await logseq.Experiments.loadScripts('../mermaid/mermaid.min.js')
  setTimeout(() => {
    host.mermaid.initialize({ startOnLoad: false })
  }, 1000)

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
        template: `
          <img id="${mermaidId}" style="cursor: zoom-in; max-width: 100%; vertical-align: top; display: inline; margin: 0; padding: 0; border: 0;" />
          <div id="modal-${mermaidId}" style="display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8);">
            <span id="close-${mermaidId}" style="position: fixed; top: 60px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer; z-index: 1001; background: rgba(0,0,0,0.5); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">&times;</span>
            <div id="save-menu-${mermaidId}" style="position: fixed; top: 60px; left: 35px; z-index: 1001; display: flex; gap: 10px;">
              <button id="save-png-${mermaidId}" style="background: rgba(0,0,0,0.7); color: #f1f1f1; border: 1px solid #444; min-width: 110px; min-height: 38px; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.2s; display: flex; align-items: center; justify-content: center; line-height: 1; text-align: center; box-sizing: border-box;" onmouseover="this.style.background='rgba(0,0,0,0.9)'" onmouseout="this.style.background='rgba(0,0,0,0.7)'">Save as PNG</button>
              <button id="save-svg-${mermaidId}" style="background: rgba(0,0,0,0.7); color: #f1f1f1; border: 1px solid #444; min-width: 110px; min-height: 38px; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 14px; transition: background 0.2s; display: flex; align-items: center; justify-content: center; line-height: 1; text-align: center; box-sizing: border-box;" onmouseover="this.style.background='rgba(0,0,0,0.9)'" onmouseout="this.style.background='rgba(0,0,0,0.7)'">Save as SVG</button>
            </div>
            <div id="modal-container-${mermaidId}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: auto; cursor: grab; box-sizing: border-box;">
              <img id="modal-img-${mermaidId}" style="display: block; margin: 20px auto; max-width: none; max-height: none; cursor: grab;">
            </div>
          </div>
        `,
      })

      const mermaidString = await getMermaidString(uuid)
      if (!mermaidString || mermaidString.length < 2) return

      try {
        const { svg } = await host.mermaid.render(
          'mermaid-diagram',
          mermaidString,
        )

        setTimeout(async () => {
          getImgFromSvg(svg, mermaidId, scale) // Use default modalScale from the function
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
