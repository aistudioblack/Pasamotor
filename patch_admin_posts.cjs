const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminPosts.tsx', 'utf8');
code = code.replace(
  '<p className="text-xs text-muted-foreground truncate">{p.excerpt || p.slug}</p>',
  `<div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground truncate">{p.excerpt || p.slug}</p>
                    {p.created_at && <p className="text-[10px] text-muted-foreground/70">Tarih: {new Date(p.created_at).toLocaleString('tr-TR')}</p>}
                  </div>`
);
fs.writeFileSync('src/pages/admin/AdminPosts.tsx', code);
