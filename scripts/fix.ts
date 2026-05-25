import fs from 'fs';

function replaceInFile(path: string, from: RegExp, to: string) {
  const content = fs.readFileSync(path, 'utf8');
  fs.writeFileSync(path, content.replace(from, to));
}

replaceInFile('src/pages/admin/AdminProducts.tsx', /dbClient/g, 'supabase');
replaceInFile('src/pages/admin/AdminDatabase.tsx', /db/g, 'supabase');
replaceInFile('src/pages/admin/AdminDatabase.tsx', /getDocs/g, '(() => { throw new Error("Firebase SDK specific call removed"); })');
replaceInFile('src/pages/admin/AdminDatabase.tsx', /collection/g, '((_) => _)');
replaceInFile('src/pages/admin/AdminDatabase.tsx', /setDoc/g, '(() => { throw new Error("Firebase SDK specific call removed"); })');
replaceInFile('src/pages/admin/AdminDatabase.tsx', /deleteDoc/g, '(() => { throw new Error("Firebase SDK specific call removed"); })');
replaceInFile('src/pages/admin/AdminDatabase.tsx', /doc/g, '((_) => _)');

console.log("Fixes applied!");
