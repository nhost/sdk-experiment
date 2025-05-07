import { defineConfig } from "orval";
import fetchClient from "./custom-fetch";
import { builder, generateAxiosFooter } from "@orval/axios";

const createAxiosClient = () => {
  const axiosBuilder = builder({ type: "axios" })();
  return {
    ...axiosBuilder,
    dependencies: () => {
      // https://github.com/orval-labs/orval/blob/a154264719ccc49b3ab95dadbb3d62513110d8c3/packages/axios/src/index.ts#L22
      return [
        {
          exports: [
            {
              name: "Axios",
              default: true,
              values: true,
              syntheticDefaultImport: true,
            },
            { name: "AxiosRequestConfig" },
            { name: "AxiosResponse" },
            { name: "CreateAxiosDefaults" },
          ],
          dependency: "axios",
        },
      ];
    },
    header: () => {
      return `export const createApiClient = (config?: CreateAxiosDefaults) => {
  const axios = Axios.create(config);
`;
    },
    footer: (params) => {
      const result = generateAxiosFooter(params);
      return result.replace(
        /return {(.+?)}/,
        (_, captured) => `return {${captured}, axios}`,
      );
    },
  };
};

function createClient() {
  const builder = fetchClient()();
  return {
    client: builder.client,
    header: builder.header,
    dependencies: builder.dependencies,
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
        injectGeneratedDirsAndFiles: false,
      },
    },
  },
  storage: {
    input: {
      target: "../api/storage.yaml",
    },
    output: {
      target: "../src/storage/client.ts",
      client: createAxiosClient,
    },
  },
});
