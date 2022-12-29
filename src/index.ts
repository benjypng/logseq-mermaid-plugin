import "@logseq/libs";
import { callSettings } from "./callSettings";
import { renderMermaid } from "./convert";

const uniqueIdentifier = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "");

const main = () => {
  console.log("logseq-mermaid-plugin loaded");

  callSettings();

  logseq.Editor.registerSlashCommand("Draw mermaid diagram", async () => {
    await logseq.Editor.insertAtEditingCursor(
      `{{renderer :mermaid_${uniqueIdentifier()}}}`
    );

    const currBlock = await logseq.Editor.getCurrentBlock();

    await logseq.Editor.insertBlock(
      currBlock.uuid,
      `\`\`\`mermaid
\`\`\``,
      {
        sibling: false,
        before: false,
      }
    );
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const [type, colour] = payload.arguments;
    const id = type.split("_")[1]?.trim();
    const mermaidId = `mermaid_${id}_${slot}`;

    if (!type.startsWith(":mermaid_")) return;

    const dataBlock = await logseq.Editor.getBlock(payload.uuid, {
      includeChildren: true,
    });

    const mermaidUUID = dataBlock.children[0]["uuid"];

    logseq.provideModel({
      async show() {
        renderMermaid(type, payload, colour, mermaidUUID);
      },
    });

    logseq.provideStyle(`
      .renderBtn {
        border: 1px solid black;
        border-radius: 8px;
        padding: 3px;
        font-size: 80%;
        background-color: white;
        color: black;
      }

      .renderBtn:hover {
        background-color: black;
        color: white;
      }
    `);

    logseq.provideUI({
      key: `${mermaidId}`,
      slot,
      reset: true,
      template: `<button data-on-click="show" class="renderBtn">Render</button>`,
    });
  });
};

logseq.ready(main).catch(console.error);
