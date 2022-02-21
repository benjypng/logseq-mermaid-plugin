import { Base64 } from 'js-base64';

export const renderMermaid = async (type, payload, colour, mermaidUUID) => {
  await logseq.Editor.editBlock(payload.uuid);
  await logseq.Editor.exitEditingMode();

  const mermaidBlock = await logseq.Editor.getBlock(mermaidUUID);
  const matchData = mermaidBlock.content.match(/```mermaid(.|\n)*?```/gm);

  let toDecode = matchData[0];

  if (logseq.settings.config) {
    const initStr = `\n%%{init: {'theme': '${logseq.settings.config.theme}'}}%%`;
    toDecode = toDecode.slice(0, 10) + initStr + toDecode.slice(10);
  }

  toDecode = toDecode.replace('```mermaid', '').replace('```', '');

  toDecode = toDecode.replace('\n', ' ');

  // const jsonString = btoa(toDecode);
  const jsonString = Base64.encode(toDecode, true);

  const renderBlock = async (str: string) => {
    await logseq.Editor.updateBlock(
      payload.uuid,
      `${str}
{{renderer ${type}}}`
    );
  };

  const handleEvent = async () => {
    if (logseq.settings.config) {
      const { colour } = logseq.settings.config;

      if (colour.startsWith('#')) {
        renderBlock(
          `<img src="https://mermaid.ink/img/${jsonString}?bgColor=${colour.substring(
            1
          )}" />`
        );
      } else if (!logseq.settings.colour.startsWith('#')) {
        renderBlock(
          `<img src="https://mermaid.ink/img/${jsonString}?bgColor=!${colour}" />`
        );
      }
    } else if (colour === undefined) {
      renderBlock(`<img src="https://mermaid.ink/img/${jsonString}" />`);
    } else if (colour.startsWith('#')) {
      renderBlock(
        `<img src="https://mermaid.ink/img/${jsonString}?bgColor=${colour.substring(
          1
        )}" />`
      );
    } else if (!colour.startsWith('#')) {
      renderBlock(
        `<img src="https://mermaid.ink/img/${jsonString}?bgColor=!${colour}" />`
      );
    } else {
      renderBlock(`<img src="https://mermaid.ink/img/${jsonString}" />`);
    }
  };

  const handleError = () => {
    renderBlock(
      '<p>There is an error with your mermaid syntax. Please rectify and render again.</p>'
    );
  };

  const image = new Image();
  image.onload = handleEvent;
  image.onerror = handleError;
  image.src = `https://mermaid.ink/img/${jsonString}`;
};
