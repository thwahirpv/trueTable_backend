import { startDevServer } from "convex/dev";

async function main() {
  await startDevServer();
}

main().catch((error) => {
  console.error("Error starting the development server:", error);
  process.exit(1);
});