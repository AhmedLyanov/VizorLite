import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  define: {
    global: "window",
    "process.env": {},
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),

      events: "events/",
      util: "util/",
      buffer: "buffer/",
      process: "process/browser",
      stream: "stream-browserify",
    },
  },

  optimizeDeps: {
    include: ["simple-peer"],
  },
});
