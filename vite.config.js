import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three") || id.includes("three-mesh-bvh")) {
            return "vendor-three";
          }
          if (id.includes("node_modules/@react-three")) {
            return "vendor-r3f";
          }
          if (id.includes("node_modules/firebase")) {
            return "vendor-firebase";
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200
  }
});
