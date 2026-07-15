import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ command, isSsrBuild }) => ({
  optimizeDeps: {
    include: ['lucide-react/dynamicIconImports']
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: process.env.DISABLE_HMR !== "true" ? { overlay: false } : false,
  },
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
    'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || ''),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "../../firebase-applet-config.json": fs.existsSync(path.resolve(__dirname, "./firebase-applet-config.json"))
        ? path.resolve(__dirname, "./firebase-applet-config.json")
        : path.resolve(__dirname, "./src/lib/firebase-config-fallback.json")
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    target: "esnext",
    minify: "esbuild" as const,
    outDir: isSsrBuild ? "dist/server" : "dist",
    ssr: isSsrBuild,
    rollupOptions: isSsrBuild ? {
      input: "./src/entry-server.tsx",
      output: {
        format: "cjs"
      }
    } : {
      output: {
        manualChunks: (id) => {
          // Admin — tamamen ayrı bundle (ziyaretçi indirmez)
          if (id.includes('/pages/admin/')) return 'admin';
          if (id.includes('@google/genai')) return 'admin';
          if (id.includes('recharts')) return 'charts';
          
          // Icons
          if (id.includes('lucide-react')) return 'icons';

          // Supabase — ayrı chunk
          if (id.includes('@supabase')) return 'supabase';

          // Animasyon — ihtiyaçta yüklensin
          if (id.includes('framer-motion') ||
              id.includes('/motion/')) return 'animation';

          // UI kütüphaneleri
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('@tanstack')) return 'query';

          // React core
          if (id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('node_modules/react/')) return 'react-vendor';
        }
      }
    },
    cssCodeSplit: true,
    assetsInlineLimit: 5120, // 5KB altındaki küçük varlıkları inline yap (base64)
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  }
}));
