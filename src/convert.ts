export const renderMermaid = async (type, payload, colour, mermaidUUID) => {
  await logseq.Editor.editBlock(payload.uuid);
  await logseq.Editor.exitEditingMode();

  const mermaidBlock = await logseq.Editor.getBlock(mermaidUUID);
  const matchData = mermaidBlock.content.match(/```mermaid(.|\n)*?```/gm);

  let toDecode = matchData[0];
  toDecode = toDecode.replace('```mermaid', '').replace('```', '');
  toDecode = toDecode.replace('\n', ' ');

  const jsonString = btoa(toDecode);

  const renderBlock = async (str: string) => {
    await logseq.Editor.updateBlock(
      payload.uuid,
      `${str}
{{renderer ${type}}}`
    );
  };

  // const handleEvent = async (e) => {
  // if (e.currentTarget.response !== 'invalid encoded code') {
  if (colour === undefined) {
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
  // } else {
  // renderBlock(
  // '<p>There is an error with your mermaid syntax. Please rectify and render again.</p>'
  // );
  // }
  // };

  // let req = new XMLHttpRequest();
  // req.open('GET', `https://mermaid.ink/img/${jsonString}`, true);
  // req.send();
  // req.onload = handleEvent;
};
