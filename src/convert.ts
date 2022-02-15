export const convert = async (data: string) => {
  const matchData = data.match(/```mermaid(.|\n)*?```/gm);

  let toDecode = matchData[0];
  toDecode = toDecode.replace('```mermaid', '').replace('```', '');
  toDecode = toDecode.replace('\n', ' ');

  const jsonString = btoa(toDecode);

  let status = '';
  await fetch(`https://mermaid.ink/img/${jsonString}`, { method: 'GET' })
    .then((res) => {
      if (res.ok) {
        status = `<img src="https://mermaid.ink/img/${jsonString}" />`;
      } else {
        status = `<p>There is an error with your mermaid syntax. Please rectify and render again.</p>`;
      }
    })
    .catch((err) => console.log('Error:', err));

  const outcome = status;

  return outcome;
};
