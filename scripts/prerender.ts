import fs from "node:fs";
import path from "node:path";

const toAbsolute = (p: string) => path.resolve(process.cwd(), p);

const templatePath = toAbsolute("dist/index.html");
const template = fs.readFileSync(templatePath, "utf-8");

const routesToPrerender = [
  "/",
  "/hakkimizda",
  "/hizmetler",
  "/galeri",
  "/iletisim",
  "/yedek-parca",
  "/blog"
];

async function prerender() {
  const { render } = await import(toAbsolute("dist/server/entry-server.cjs"));

  for (const url of routesToPrerender) {
    try {
      const { html, headTags } = render(url);

      if (!html) {
        console.warn(`Skipping ${url} due to error or empty html.`);
        continue;
      }

      const htmlWithApp = template
        .replace("<!--app-head-->", headTags || "")
        .replace("<!--app-html-->", html);

      const isIndex = url === "/";
      const filePath = isIndex ? "dist/index.html" : `dist${url}/index.html`;
      const absoluteFilePath = toAbsolute(filePath);
      
      const dir = path.dirname(absoluteFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(absoluteFilePath, htmlWithApp);
      console.log(`Prerendered ${filePath}`);
    } catch (e) {
      console.error(`Error prerendering ${url}:`, e);
    }
  }
}

prerender().catch(e => {
  console.error("Prerender error:", e);
  process.exit(1);
});
