[[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/hkgnp) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

# Overview

This simple plugin allows you to quickly insert mermaid diagrams in your notes.

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
%%{init: {'theme': 'dark'}}%%
flowchart LR
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Three| E[Result 2]
```

```
%%{init: {'theme': 'dark'}}%%
flowchart LR
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Three| E[Result 2]
```

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

# Credits

[mermaid.ink](https://github.com/jihchi/mermaid.ink)

[mermaid-js-converter](https://github.com/superj80820/mermaid-js-converter) for the idea.
