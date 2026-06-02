import type { NextConfig } from "next";

const projectRoot = new URL(".", import.meta.url).pathname;

const nextConfig: NextConfig = {
  // Avoid Next/Turbopack inferring a parent directory as the workspace root
  // when there are unrelated lockfiles elsewhere on the machine.
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
