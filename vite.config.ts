import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Hier definierst du den Alias
    },
  },
  server: {
    strictPort: true,
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://app_backend:8000", // Weiterleitung an Nginx, der Docker-Container managed
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/ws": {
        target: "ws://localhost", // WebSocket über Nginx
        ws: true,
      },
    },
  },
});
