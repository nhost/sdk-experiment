import { defineConfig } from "orval";
import fetchClient from "./custom-fetch";

function createClient() {
  const builder = fetchClient()();
  return {
    client: builder.client,
    header: builder.header,
    dependencies: () => {
      return [
        {
          exports: [
            {
              name: "createEnhancedFetch",
              values: true,
            },
            { name: "Interceptor" },
          ],
          dependency: "../fetch",
        },
      ];
    },
    footer: builder.footer,
    title: builder.title,
    extraFiles: builder.extraFiles,
  };
}

export default defineConfig({
  auth: {
    input: {
      target: "../api/auth.yaml",
    },
    output: {
      target: "../src/auth/client.ts",
      client: createClient,
    },
    hooks: {
      afterAllFilesWrite: {
        command: "bunx prettier -w .",
      },
    },
  },
  storage: {
    input: {
      target: "../api/storage.yaml",
    },
    output: {
      target: "../src/storage/client.ts",
      client: createClient,
    },
    hooks: {
      afterAllFilesWrite: {
        command: "bunx prettier -w .",
      },
    },
  },
});
