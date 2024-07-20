import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

export const settings: SettingSchemaDesc[] = [
  {
    key: 'title',
    type: 'heading',
    default: '',
    title: 'Important',
    description:
      'If https://mermaid.ink is used, please note that your diagrams are being sent to the https://mermaid.ink server for the image to be generated. If you are uncomfortable with this, please use your own local server or another plugin. The source code for mermaid.ink can be found at https://github.com/jihchi/mermaid.ink',
  },
  {
    key: 'pathToMermaidServer',
    type: 'string',
    default: 'https://mermaid.ink',
    title: '(Optional) Path to mermaid.ink Server',
    description:
      'Change to your local default server path (including port number). E.g. http://localhost:3000',
  },
]
