import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');

const targetStr = `      if ((dbUser.email === "ahmetcafoglu@hotmail.com" || dbUser.email === process.env.ADMIN_EMAIL) && req.user.email !== dbUser.email) {
        return res.status(403).json({ error: "Süper Admin şifresi sadece kendisi tarafından değiştirilebilir!" });
      }`;

const replacementStr = `      const requesterEmail = req.user.email;
      const targetEmail = dbUser.email;
      const isRequesterSuperAdmin = requesterEmail === "ahmetcafoglu@hotmail.com";
      const isTargetSuperAdmin = targetEmail === "ahmetcafoglu@hotmail.com";

      if (isTargetSuperAdmin && !isRequesterSuperAdmin) {
        return res.status(403).json({ error: "Süper Admin şifresi sadece kendisi tarafından değiştirilebilir!" });
      }`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync('server.ts', content);
  console.log('Fixed server.ts successfully');
} else {
  console.log('Target string not found in server.ts');
}
