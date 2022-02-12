export const convert = (data: string) => {
  const matchData = data.match(/```mermaid(.|\n)*?```/gm);

  let toDecode = matchData[0];
  toDecode = toDecode.replace('```mermaid', '').replace('```', '');
  toDecode = toDecode.replace('\n', ' ');

  const jsonString = btoa(toDecode);
  return `<img src="https://mermaid.ink/img/${jsonString}" />`;
};
