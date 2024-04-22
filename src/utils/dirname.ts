import path from "node:path";
import { fileURLToPath } from "node:url";

let dirname: string;

if (typeof __filename === "undefined") {
  const __filename = fileURLToPath(import.meta.url);
  dirname = path.dirname(__filename);
} else {
  dirname = __dirname;
}

export { dirname as __dirname };
