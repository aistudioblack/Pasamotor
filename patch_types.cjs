const fs = require('fs');
let code = fs.readFileSync('src/data/motorcycles.ts', 'utf8');

code = code.replace(
  'export interface MotorcycleSpecs {',
  'export interface MotorcycleSpecs {\n  licenseRequirement?: string;\n  inputVoltage?: string;\n  range?: string;'
);

fs.writeFileSync('src/data/motorcycles.ts', code);
