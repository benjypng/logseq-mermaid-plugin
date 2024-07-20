import '@logseq/libs'
import { handlePopup } from './handle-popup'
import { settings } from './settings'

const main = async () => {
  console.log('logseq-mermaid-plugin loaded')

  // Add disclaimer
  await logseq.UI.showMsg(
    'Please review the plugin settings before using the plugin.',
    'warning',
  )

  // Used to handle any popups
  handlePopup()
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error)
