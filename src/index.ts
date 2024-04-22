import { fileTypeFromBuffer } from "file-type";
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { __dirname } from "./utils/dirname";

const mimeCache = new Map();

export const fileFixturePlugin = (): Plugin => {
  return {
    name: "vite-plugin-file-fixture",
    async transform(_src, id) {
      if (id.endsWith("?file")) {
        const filePath = id.slice(0, -5); // Remove the `?file` part to get the real path
        const fileName = filePath.split("/").pop();
        const resolvedPath = path.resolve(__dirname, filePath);

        // Read file as a binary buffer
        const buffer = fs.readFileSync(resolvedPath);
        // Get mime type from the buffer and cache it
        if (!mimeCache.has(filePath)) {
          const fileType = await fileTypeFromBuffer(buffer);
          mimeCache.set(filePath, fileType?.mime ?? "application/octet-stream");
        }
        const mimeType = mimeCache.get(filePath);
        const blob = `const blob = new Blob([new Uint8Array(Buffer.from("${buffer.toString("base64")}", "base64"))], { type: "${mimeType}" })`;
        const code = `${blob}\nexport default new File([blob], "${fileName}", { type: "${mimeType}" });`;

        return {
          code,
          map: null,
        };
      }
      return null;
    },
  };
};
