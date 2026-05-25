import fs from 'fs';

async function test() {
  const res = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Say hi.' }],
      jsonMode: true,
      model: 'openai'
    })
  });
  console.log(await res.text());
}
test();
