import type { NextConfig } from "next";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// @trussworks/react-uswds v8 dropped ./lib/uswds.css from exports map; bypass via fs path
const trussworksRoot = path.dirname(
  path.dirname(require.resolve("@trussworks/react-uswds"))
);

const nextConfig: NextConfig = {
  transpilePackages: ["@oddball/json-render-uswds"],
  webpack(config) {
    config.resolve.alias["@trussworks/react-uswds/lib/uswds.css"] = path.join(
      trussworksRoot,
      "lib/uswds.css"
    );
    return config;
  },
};

export default nextConfig;
