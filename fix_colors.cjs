const fs = require('fs');

let code = fs.readFileSync('src/data/motorcycles.ts', 'utf8');

// Macchiato 125 (Hex: #66806f and #7588a1)
code = code.replace(/"name": "Nardo Gri",\s*"hex": "#66806f"/g, '"name": "Açık Yeşil",\n        "hex": "#66806f"');
code = code.replace(/"name": "Nardo Gri",\s*"hex": "#7588a1"/g, '"name": "Mavi",\n        "hex": "#7588a1"');

// Fayton FX 25 / FX 24 (Hex: #7a72c0 and #477b90)
code = code.replace(/"name": "Nardo Gri",\s*"hex": "#7a72c0"/g, '"name": "Mor",\n        "hex": "#7a72c0"');
code = code.replace(/"name": "Nardo Gri",\s*"hex": "#477b90"/g, '"name": "Mavi",\n        "hex": "#477b90"');

// Other #7D896D
code = code.replace(/"name": "Nardo Gri",\s*"hex": "#7D896D"/g, '"name": "Yeşil",\n        "hex": "#7D896D"');

fs.writeFileSync('src/data/motorcycles.ts', code);
console.log("Colors fixed.");
