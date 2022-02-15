export const convert = async (data: string, colour: string) => {
  const matchData = data.match(/```mermaid(.|\n)*?```/gm);

  console.log(colour);

  let toDecode = matchData[0];
  toDecode = toDecode.replace('```mermaid', '').replace('```', '');
  toDecode = toDecode.replace('\n', ' ');

  const jsonString = btoa(toDecode);

  let status = '';
  await fetch(`https://mermaid.ink/img/${jsonString}`, { method: 'GET' })
    .then((res) => {
      if (res.ok) {
        if (colour === undefined) {
          status = `<img src="https://mermaid.ink/img/${jsonString}" />`;
        } else if (colour.startsWith('#')) {
          status = `<img src="https://mermaid.ink/img/${jsonString}?bgColor=${colour.substring(
            1
          )}" />`;
        } else if (!colour.startsWith('#')) {
          status = `<img src="https://mermaid.ink/img/${jsonString}?bgColor=!${colour}" />`;
        } else {
          status = `<img src="https://mermaid.ink/img/${jsonString}" />`;
        }
      } else {
        status = `<p>There is an error with your mermaid syntax. Please rectify and render again.</p>`;
      }
    })
    .catch((err) => console.log('Error:', err));

  const outcome = status;

  return outcome;
};
