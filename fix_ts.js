const fs = require('fs');
let code = fs.readFileSync('src/hooks/useMotorcycles.ts', 'utf8');

const lines = code.split('\n');
const newLines = [];
let skip = false;
for(let line of lines) {
  if (line.includes('images: sanitizeUrl(bike.images) || bike.images,')) {
    // skip
    continue;
  }
  newLines.push(line);
}
fs.writeFileSync('src/hooks/useMotorcycles.ts', newLines.join('\n'));
