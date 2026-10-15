import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version } = require("./package.json");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the workspace root so a lockfile in a parent folder isn't picked up.
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
  env: {
    // Shown in the sidebar footer and on the login screen.
    NEXT_PUBLIC_APP_VERSION: version,
  },
};

export default nextConfig;
