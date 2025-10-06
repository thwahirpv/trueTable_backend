import { ConvexHttpClient } from "convex/browser";
import { ConvexDevServer } from "convex/dev";
import { createServer } from "http";
import { resolve } from "path";
import { readFileSync } from "fs";

const convexUrl = process.env.CONVEX_URL || "http://localhost:3000";

async function deploy() {
  const client = new ConvexHttpClient(convexUrl);
  
  // Load the schema and functions
  const schema = readFileSync(resolve(__dirname, "../../convex/schema.ts"), "utf-8");
  
  // Deploy the schema
  await client.deploy(schema);
  
  console.log("Deployment successful!");
}

if (require.main === module) {
  deploy().catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
}