import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      // 👇 add this line to redirect any existing imports
      "@shared/schema": path.resolve(__dirname, "../shared/types"),
    },
  },
  server: { port: 5173, fs: { allow: [path.resolve(__dirname, "..")] } },
  build: { outDir: "dist", emptyOutDir: true },
});
