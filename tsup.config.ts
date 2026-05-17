import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: [
      "src/index.ts",
    ],
    format: [ "esm", "cjs" ],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
  },
  {
    entry: {
      "air-css": "src/global.ts",
    },
    format: [ "iife" ],
    sourcemap: true,
    minify: true,
    outExtension: () => ({
      js: ".global.js",
    }),
  },
]);
