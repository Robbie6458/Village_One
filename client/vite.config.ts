import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // Add bundle analyzer for development builds
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      // 👇 add this line to redirect any existing imports
      "@shared/schema": path.resolve(__dirname, "../shared/types"),
    },
  },
  server: { port: 5173, fs: { allow: [path.resolve(__dirname, "..")] } },
  build: { 
    outDir: "dist", 
    emptyOutDir: true,
    // Increase chunk size warning limit to be more realistic
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-aspect-ratio',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
          'vendor-charts': ['recharts'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react', 'react-icons'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers'],
          'vendor-animation': ['framer-motion'],
          'vendor-utils': ['clsx', 'class-variance-authority', 'tailwind-merge', 'date-fns', 'zod'],
          // Heavy pages that are rarely accessed together
          'page-profile': ['./src/pages/profile-working.tsx', './src/pages/profile-edit.tsx'],
          'page-forum': ['./src/pages/forum.tsx', './src/pages/operations.tsx', './src/pages/ownership.tsx'],
        }
      }
    },
    // Enable source maps for better debugging but only in development
    sourcemap: false,
    // Minimize CSS
    cssMinify: true,
    // Target modern browsers for smaller bundles
    target: 'es2020'
  },
});
