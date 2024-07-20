[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/benjypng) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

> Important! ⚠: This plugin will send your mermaid code to an [external server](https://mermaid.ink) **if** you do not set up your own local mermaid.ink server. Instructions for setting up your own local mermaid.ink server can be found [below](https://github.com/hkgnp/logseq-mermaid-plugin#using-with-your-own-local-mermaidink-server).

> The amazing xyhp915 built a local-only plugin that supports drawing of mermaid diagrams. Implentation is a lot smoother. [Link to the plugin](https://github.com/xyhp915/logseq-fenced-code-plus)

# Overview

Create mermaid diagrams in image or PDF using mermaid.ink or your own local mermaid.ink server. 

## Why does it need to be sent to an external server

Unlike `xyhp915`'s plugin, this plugin generates an image that can be saved or exported. If you don't need this function, I recommend you check out [logseq-fenced-code-plus](https://github.com/xyhp915/logseq-fenced-code-plus).

# Usage

1. Read the disclaimers above.
2. Type `/Draw mermaid diagram`.
3. Modify the renderer with your choice of background colour and theme. E.g. `{{renderer :mermaid_669bd857-4324-4238-9bc3-930cf8bcca62 #FFFFFF forest}}`
    - The available themes are `default`, `neutral`, `dark` and `forest`.
4. Enter your mermaid code into the code block.
5. Click `Render Inline` to render the mermaid diagram in Logseq, or click `PDF` to open the diagram in a PDF file.

# Installation

Recommend to install from the marketplace. If not, download a release and manually load it in Logseq.

# Using with your own local mermaid.ink server

1. Go to your terminal and navigate to where you would like to save the server files to, e.g. `cd ~/My\ Documents`
2. Enter `git clone https://github.com/jihchi/mermaid.ink && cd mermaid.ink && npm i && npm start` (This assumes that you already have NodeJS installed).
3. By default, your local mermaid.ink server will be running on port `3000`. This can be changed if you know what you are doing.
4. In Logseq, go to your plugin settings, and enter the full path to your server, e.g. `http://localhost:3000`. *It is important to include the port number*.
5. Proceed to draw your mermaid diagrams as per the [instructions above](https://github.com/hkgnp/logseq-mermaid-plugin#usage), and the images will be generated locally.

# Credits

[mermaid.ink](https://github.com/jihchi/mermaid.ink)
