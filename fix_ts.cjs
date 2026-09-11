const fs = require('fs');

let code = fs.readFileSync('src/data/motorcycles.ts', 'utf8');

const specRegex = /export interface MotorcycleSpecs \{([\s\S]*?)\}/;
code = code.replace(specRegex, (match, p1) => {
  return `export interface MotorcycleSpecs {${p1}  extraFeatures?: string;
  inputVoltage?: string;
  range?: string;
}`;
});

const bikeRegex = /export interface Motorcycle \{([\s\S]*?)\}/;
code = code.replace(bikeRegex, (match, p1) => {
  return `export interface Motorcycle {${p1}  image?: string;
}`;
});

fs.writeFileSync('src/data/motorcycles.ts', code);
console.log("Fixed interfaces.");
