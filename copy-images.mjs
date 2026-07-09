import fs from 'fs';
import path from 'path';

if (!fs.existsSync('public/images')) {
  fs.mkdirSync('public/images', { recursive: true });
}

const srcDir = 'src/assets/images';
const files = fs.readdirSync(srcDir);

for (const file of files) {
  if (file.startsWith('tvs_apache_oil_')) {
    fs.copyFileSync(path.join(srcDir, file), path.join('public/images', 'tvs-apache-draft.png'));
  }
  if (file.startsWith('hero_dash_battery_')) {
    fs.copyFileSync(path.join(srcDir, file), path.join('public/images', 'hero-dash-draft.png'));
  }
  if (file.startsWith('falcon_freedom_carb_')) {
    fs.copyFileSync(path.join(srcDir, file), path.join('public/images', 'falcon-draft.png'));
  }
  if (file.startsWith('isildar_battery_')) {
    fs.copyFileSync(path.join(srcDir, file), path.join('public/images', 'isildar-draft.png'));
  }
  if (file.startsWith('scooter_belt_')) {
    fs.copyFileSync(path.join(srcDir, file), path.join('public/images', 'scooter-belt-draft.png'));
  }
}
console.log("Images copied to public/images/");
