import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";
import { loadEnv } from "vite";
import path from "node:path";

export default defineConfig(({ mode }) => {
  // Load server env vars (SUPABASE_SERVICE_ROLE_KEY, LOVABLE_API_KEY, etc.)
  // so server routes can read them via process.env.
  const env = loadEnv(mode ?? "development", process.cwd(), "");
  for (const key of Object.keys(env)) {
    if (process.env[key] === undefined) {
      process.env[key] = env[key];
    }
  }

  const entitiesDir = path.resolve(process.cwd(), "node_modules/entities");

  return {
    tanstackStart: {
      server: { entry: "server" },
    },
    vite: {
      plugins: [mcpPlugin()],
      resolve: {
        alias: [
          {
            find: /^entities\/lib\/decode\.js$/,
            replacement: path.join(entitiesDir, "lib/decode.js"),
          },
          {
            find: /^entities\/lib\/encode\.js$/,
            replacement: path.join(entitiesDir, "lib/encode.js"),
          },
          { find: /^entities$/, replacement: entitiesDir },
        ],
      },
    },
  };
});
