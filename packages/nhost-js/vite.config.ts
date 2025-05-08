import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

export default defineConfig({
  build: {
    lib: {
      entry: {
        "nhost-js": resolve(__dirname, "src/index.ts"),
        "nhost-js/auth": resolve(__dirname, "src/auth/index.ts"),
        "nhost-js/storage": resolve(__dirname, "src/storage/index.ts"),
        "nhost-js/graphql": resolve(__dirname, "src/graphql/index.ts"),
      },
      name: "NhostJs",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        // Only generate UMD for the main entry
        if (format === "umd" && entryName !== "nhost-js") {
          return null;
        }

        if (entryName === "nhost-js") {
          return `nhost-js.${format}.js`;
        }

        return `${entryName}.${format}.js`;
      },
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    target: ["es2022"],
    outDir: "dist",
    sourcemap: true,
    minify: "terser",
    cssCodeSplit: true,
  },
  plugins: [
    peerDepsExternal(),
    nodeResolve({
      browser: true,
      preferBuiltins: true,
    }),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
});
