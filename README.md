[[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/hkgnp) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

> Important! ⚠: This plugin will send your mermaid code to an [ external server ](https://mermaid.ink) **if** you do not set up your own local mermaid.ink server. Instructions for setting up your own local mermaid.ink server can be found below.

# Overviewr

This simple plugin allows you to quickly insert mermaid diagrams in your notes, using either an external server or you have the option of setting up your own local one.

![](/screenshots/demo.gif)

# Installation

If not available in the marketplace, [download the latest release](https://github.com/hkgnp/logseq-mermaid-plugin/releases) and manually load it into Logseq after unzipping.

# Usage

To start, simply trigger it using `/Draw mermaid diagram`. Then add your mermaid syntax in the code block and click `Render`.

## Changing background colour

### Option 1

Same steps as above, but before clicking `Render`, include the colour inside the renderer, e.g.

```
{{renderer :mermaid_abc123, purple}}

or

{{renderer :mermaid_abc123, #000000}}
```

### Option 2

Define in your plugin settings file. This will apply to **all** mermaid diagrams that you render.

```
{
    "config": {
        "theme": "dark",
        "colour": "#2f3437"
    }
}

or

{
    "config": {
        "theme": "dark",
        "colour": "gray"
    }
}
```

# Using with your own local mermaid.ink server

1. Go to your terminal and navigate to where you would like to save the server files to, e.g. `cd ~/My\ Documents`
2. Enter `git clone https://github.com/jihchi/mermaid.ink && cd mermaid.ink && npm i && npm start` (This assumes that you already have NodeJS installed).
3. By default, your local mermaid.ink server will be running on port `3000`. This can be changed if you know what you are doing.
4. In Logseq, go to your plugin settings, and enter `3000`. Close the settings box.
   ![](/screenshots/mermaid-settings.png)
5. Proceed to draw your mermaid diagrams as per the [instructions above](https://github.com/hkgnp/logseq-mermaid-plugin#usage), and the images will be generated locally.

# Credits

[mermaid.ink](https://github.com/jihchi/mermaid.ink)

[mermaid-js-converter](https://github.com/superj80820/mermaid-js-converter) for the idea.
