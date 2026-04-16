import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  addons: ["@storybook/addon-essentials"],
  viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.push(tailwindcss());
    // Disable Vite's built-in CSS postcss to avoid conflicts with Tailwind v4
    config.css = {
      ...config.css,
      postcss: {
        plugins: [],
      },
    };
    // Resolve @uswds-tailwind/theme to the local tokens directory
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        "@uswds-tailwind/theme": path.resolve(
          __dirname,
          "../src/lib/tokens",
        ),
      },
    };
    return config;
  },
};

export default config;
