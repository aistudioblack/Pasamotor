const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.post\("\/api\/admin\/site-content\/:page_key", requireAdmin, async \(req, res\) => \{[\s\S]*?\}\);/m;
const match = code.match(regex);
if (match) {
  const insertIndex = match.index + match[0].length;
  const deleteRoute = `

  app.delete("/api/admin/site-content/:page_key", requireAdmin, async (req, res) => {
    try {
      const { page_key } = req.params;
      const adminClient = getSupabaseAdmin();
      if (!adminClient) {
        return res.status(500).json({ error: "Database client not initialized" });
      }
      const { error } = await adminClient.from("site_content").delete().eq("page_key", page_key);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });
`;
  code = code.slice(0, insertIndex) + deleteRoute + code.slice(insertIndex);
  fs.writeFileSync('server.ts', code);
}
