import { spawn } from "node:child_process";
import { createRequire } from "node:module";

function readPort(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

const [mode, ...restArgs] = process.argv.slice(2);

if (mode !== "dev" && mode !== "start") {
  console.error(`Usage: node scripts/next-server.mjs <dev|start> [next args...]`);
  process.exit(1);
}

const host = process.env.APP_HOST ?? "localhost";
const port = readPort(process.env.APP_PORT, 3000);

const child = spawn(
  process.execPath,
  [nextBin, mode, "--hostname", host, "--port", String(port), ...restArgs],
  {
    stdio: "inherit",
    env: process.env,
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});