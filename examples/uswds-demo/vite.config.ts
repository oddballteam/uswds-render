import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@uswds-tailwind/theme": path.resolve(
        __dirname,
        "../../packages/uswds/src/lib/tokens",
      ),
    },
  },
});
