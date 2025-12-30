# logseq-mermaid-plugin
![Version](https://img.shields.io/github/v/release/benjypng/logseq-mermaid-plugin?style=flat-square&color=0969da) ![Downloads](https://img.shields.io/github/downloads/benjypng/logseq-mermaid-plugin/total?style=flat-square&color=orange) ![License](https://img.shields.io/github/license/benjypng/logseq-mermaid-plugin?style=flat-square)

> Create Mermaid diagrams in image format on-the-fly and save them.

---

## ✨ Features
- **Static Image Generation**: Renders Mermaid diagrams as standard PNG images directly in your blocks, ensuring they are portable and easy to export.
- **High Resolution**: Configurable scaling factor (default 3x) ensures your diagrams look crisp on all displays.
- **Theme Aware**: Automatically detects your Logseq theme (Light/Dark) and adjusts the Mermaid colors to match.
- **Easy Export**: Because diagrams are rendered as standard images, you can simply right-click and "Save Image As" to use them elsewhere.

## 📸 Screenshots / Demo
![](./screenshots/demo.gif)

## ⚙️ Installation
1. Open Logseq.
2. Go to the **Marketplace** (Plugins > Marketplace).
3. Search for **logseq-mermaid-plugin**.
4. Click **Install**.

## 🛠 Usage & Settings
1. Type `/Draw mermaid diagram`.
2. Modify the renderer with the desired scaling factor (default is 3).
   * Example: `{{renderer :mermaid_66b0fcff-ea9e-4909-9aab-554186001e73, 3}}`
   * Increasing the number increases the image resolution.
3. Enter your mermaid code into the code block.

#### ⚠️ Known Limitations
To enable "Save as Image" functionality, this plugin converts the raw SVG into a standard PNG. Browser security restrictions prevent this conversion if the SVG contains HTML code (known as `foreignObject` tags).

The following diagram types rely on `foreignObject` and will not render with this plugin:
- ❌ Mindmaps
- ❌ Timelines
- ❌ Class Diagrams (if they use complex text wrapping)
- ❌ Flowcharts using HTML labels (e.g., `<b>Bold Text</b>`)

## ☕️ Support
If you enjoy this plugin, please consider supporting the development!

<div align="center">
  <a href="https://github.com/sponsors/benjypng"><img src="https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=for-the-badge&logo=github" alt="Sponsor on Github" /></a>&nbsp;<a href="https://www.buymeacoffee.com/hkgnp.dev"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee" /></a>
</div>

## 🤝 Contributing
Issues are welcome. If you find a bug, please open an issue. Pull requests are not accepted at the moment as I am not able to commit to reviewing them in a timely fashion.

## ❤️ Credits
- [Mermaid.js](https://mermaid.js.org/) for the incredible diagramming and charting tool.
