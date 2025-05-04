import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NhostJs',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `nhost-js.${format}.js`,
    },
    rollupOptions: {
      external: ['axios', 'uuid'],
      output: {
        globals: {
          axios: 'axios',
          uuid: 'uuid',
        },
      },
    },
    target: ['es2018', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
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