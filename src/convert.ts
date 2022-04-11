import { BlockUUID } from "@logseq/libs/dist/LSPlugin.user";
import { toBase64 } from "js-base64";

export const renderMermaid = async (
  type: string,
  payload: { uuid: string },
  colour: string,
  mermaidUUID: BlockUUID
) => {
  await logseq.Editor.editBlock(payload.uuid);
  await logseq.Editor.exitEditingMode();

  const mermaidBlock = await logseq.Editor.getBlock(mermaidUUID);
  const matchData = mermaidBlock.content.match(/```mermaid(.|\n)*?```/gm);

  let toDecode = matchData[0];

  if (logseq.settings.config) {
    const initStr = `\n%%{init: {'theme': '${logseq.settings.config.theme}'}}%%`;
    toDecode = toDecode.slice(0, 10) + initStr + toDecode.slice(10);
  }

  toDecode = toDecode.replace("```mermaid", "").replace("```", "");

  toDecode = toDecode.replace("\n", " ");

  const jsonString = toBase64(toDecode, true);

  const renderBlock = async (str: string) => {
    await logseq.Editor.updateBlock(
      payload.uuid,
      `${str}
{{renderer ${type}}}`
    );
  };

  const handleEvent = async () => {
    const handlePort = () => {
      const { port } = logseq.settings;
      if (port) {
        return `http://localhost:${port}`;
      } else {
        return `https://mermaid.ink`;
      }
    };

    if (logseq.settings.config) {
      const { colour } = logseq.settings.config;
      // If mermaid config exists
      if (colour.startsWith("#")) {
        // If colour is a hexadecimal colour
        renderBlock(
          `<img src="${handlePort()}/img/${jsonString}?bgColor=${colour.substring(
            1
          )}" />`
        );
      } else if (!colour.startsWith("#")) {
        // If colour is a plain colour description, e.g. blue
        renderBlock(
          `<img src="${handlePort()}/img/${jsonString}?bgColor=!${colour}" />`
        );
      } else {
        // If error in config
        renderBlock(`<img src="${handlePort()}/img/${jsonString}" />`);
      }
    } else if (colour) {
      // If it is a local change of colour
      if (colour.startsWith("#")) {
        // If colour is a hexadecimal colour
        renderBlock(
          `<img src="${handlePort()}/img/${jsonString}?bgColor=${colour.substring(
            1
          )}" />`
        );
      } else if (!colour.startsWith("#")) {
        // If colour is a plain colour description, e.g. blue
        renderBlock(
          `<img src="${handlePort()}/img/${jsonString}?bgColor=!${colour}" />`
        );
      } else {
        // If error in config
        renderBlock(`<img src="${handlePort()}/img/${jsonString}" />`);
      }
    } else {
      // If mermaid config does not exist
      renderBlock(`<img src="${handlePort()}/img/${jsonString}" />`);
    }
  };

  const handleError = () => {
    renderBlock(
      "<p>There is an error with your mermaid syntax. Please rectify and render again.</p>"
    );
  };

  const image = new Image();
  image.onload = handleEvent;
  image.onerror = handleError;
  image.src = `https://mermaid.ink/img/${jsonString}`;
};
