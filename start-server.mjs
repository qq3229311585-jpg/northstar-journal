import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Define __filename and __dirname for ESM (required by vinext ISR cache)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
globalThis.__filename = __filename;
globalThis.__dirname = __dirname;

const vinextDir = path.join(__dirname, "node_modules/vinext/dist");
const { startProdServer } = await import(
  pathToFileURL(path.join(vinextDir, "server/prod-server.js")).href
);

await startProdServer({
  port: parseInt(process.env.PORT ?? "8091"),
  host: "0.0.0.0",
  outDir: path.resolve(__dirname, "dist"),
});
