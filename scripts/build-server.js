import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgPath = path.resolve(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

// Sadece external olmasını istediğimiz paketler (dependencies altındakiler)
const external = Object.keys(pkg.dependencies || {});

console.log("[Build Server] Derleme başlatılıyor...");
console.log("[Build Server] Harici paketler:", external);

esbuild.build({
  entryPoints: ["server.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  external: external,
  sourcemap: true,
  outfile: "dist/server.cjs",
}).then(() => {
  console.log("[Build Server] Derleme başarıyla tamamlandı: dist/server.cjs");
}).catch((err) => {
  console.error("[Build Server] Derleme hatası:", err);
  process.exit(1);
});
