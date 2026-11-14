import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

/**
 * Local development middleware for the Groq AI proxy.
 * Serves /api/chat during `npm run dev` using api/chat.js and the local GROQ_API_KEY.
 * On Vercel (Preview and Production), Vercel natively routes /api/chat to api/chat.js.
 */
function groqDevApiPlugin(env) {
  return {
    name: "groq-dev-api-middleware",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        // Ensure GROQ_API_KEY from .env is available in process.env for local development
        if (!process.env.GROQ_API_KEY && env.GROQ_API_KEY) {
          process.env.GROQ_API_KEY = env.GROQ_API_KEY;
        }

        try {
          const { default: handler } = await import("./api/chat.js");
          await handler(req, res);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: { message: err.message || "Internal server error" } }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), groqDevApiPlugin(env)],
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
  };
});
