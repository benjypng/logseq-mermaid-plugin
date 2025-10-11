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

      // Get user language preference
      let buttonText = 'Click to render Mermaid diagram'
      try {
        const userConfigs = await logseq.App.getUserConfigs()
        const preferredLanguage = userConfigs.preferredLanguage || 'en'
        
        if (preferredLanguage.startsWith('zh')) {
          buttonText = '点击此处绘制Mermaid图形'
        } else if (preferredLanguage === 'ja') {
          buttonText = 'クリックしてMermaid図を描画'
        } else if (preferredLanguage === 'ko') {
          buttonText = '클릭하여 Mermaid 다이어그램 렌더링'
        } else if (preferredLanguage === 'de') {
          buttonText = 'Klicken Sie hier, um Mermaid-Diagramm zu rendern'
        } else if (preferredLanguage === 'fr') {
          buttonText = 'Cliquez ici pour rendre le diagramme Mermaid'
        } else if (preferredLanguage === 'es') {
          buttonText = 'Haga clic aquí para renderizar el diagrama Mermaid'
        } else if (preferredLanguage === 'pt') {
          buttonText = 'Clique aqui para renderizar o diagrama Mermaid'
        } else if (preferredLanguage === 'ru') {
          buttonText = 'Нажмите здесь, чтобы отобразить диаграмму Mermaid'
        }
      } catch (error) {
        console.log('Warning: Could not retrieve user language preference, using default English text:', error)
      }

      logseq.provideUI({
        key: mermaidId,
        slot,
        reset: true,
        template: `
          <div id="container-${mermaidId}" style="display: flex; align-items: center; justify-content: center; height: 40px;">
            <button id="render-btn-${mermaidId}" style="background: #f0f0f0; border: 1px solid #ccc; padding: 4px 16px; border-radius: 3px; cursor: pointer; font-size: 13px; color: #333; transition: background 0.2s; height: 36px; display: flex; align-items: center; justify-content: center; line-height: 1; white-space: nowrap;" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">
              ${buttonText}
            </button>
            <div id="loading-${mermaidId}" style="display: none; margin-left: 8px; color: #666; font-size: 13px;">Rendering...</div>
          </div>
          <img id="${mermaidId}" style="cursor: zoom-in; max-width: 100%; vertical-align: top; display: none; margin: 0; padding: 0; border: 0;" />
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

      // Add click handler for the render button
      setTimeout(() => {
        const renderBtn = parent.document.getElementById(`render-btn-${mermaidId}`)
        if (renderBtn) {
          renderBtn.onclick = async () => {
            const container = parent.document.getElementById(`container-${mermaidId}`)
            const loading = parent.document.getElementById(`loading-${mermaidId}`)
            const img = parent.document.getElementById(mermaidId)
            
            if (container && loading && img) {
              // Show loading state
              renderBtn.style.display = 'none'
              loading.style.display = 'inline'
              
              try {
                const mermaidString = await getMermaidString(uuid)
                if (!mermaidString || mermaidString.length < 2) {
                  loading.textContent = 'No mermaid code found'
                  return
                }

                const { svg } = await host.mermaid.render(
                  'mermaid-diagram',
                  mermaidString,
                )

                setTimeout(async () => {
                  getImgFromSvg(svg, mermaidId, scale)
                  // Hide loading and show image
                  loading.style.display = 'none'
                  img.style.display = 'inline'
                  container.style.minHeight = 'auto'
                }, 100)
              } catch (error) {
                console.log(error)
                loading.textContent = 'Error rendering diagram'
                await logseq.UI.showMsg(
                  'Unable to generate mermaid diagram. There may be a typo somewhere.',
                  'error',
                )
              }
            }
          }
        }
      }, 100)
    },
  )
}

logseq.ready(main).catch(console.error)
