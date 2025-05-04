const { builder, generateAxiosFooter } = require('@orval/axios');

const createAxiosClient = () => {
    const axiosBuilder = builder({ type: 'axios' })();
    return {
        ...axiosBuilder,
        dependencies: () => {
            // https://github.com/orval-labs/orval/blob/a154264719ccc49b3ab95dadbb3d62513110d8c3/packages/axios/src/index.ts#L22
            return [
                {
                    exports: [
                        {
                            name: 'Axios',
                            default: true,
                            values: true,
                            syntheticDefaultImport: true,
                        },
                        { name: 'AxiosRequestConfig' },
                        { name: 'AxiosResponse' },
                        { name: 'CreateAxiosDefaults' },
                    ],
                    dependency: 'axios',
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
                (_, captured) => `return {${captured}, axios}`
            );
        },
    };
};

module.exports = {
    'auth': {
        input: {
            target: '../api/auth.yaml',
        },
        output: {
            target: '../src/auth/client.ts',
            client: createAxiosClient,
        },
    },
    'storage': {
        input: {
            target: '../api/storage.yaml',
        },
        output: {
            target: '../src/storage/client.ts',
            client: createAxiosClient,
        },
    },
};
