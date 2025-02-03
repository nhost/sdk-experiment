import { defaultPlugins } from '@hey-api/openapi-ts';
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: {
        path: './storage.yaml',
    },
    output: 'storage',
    plugins: [
        ...defaultPlugins,
        '@hey-api/client-fetch',
        {
            asClass: true,
            name: '@hey-api/sdk',
        }
    ],
});
