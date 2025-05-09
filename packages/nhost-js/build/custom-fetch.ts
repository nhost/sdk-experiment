// borrowed from:
// https://github.com/orval-labs/orval/blob/58ce90762c5d7170a3624f05972f934db7acac9c/packages/fetch/src/index.ts
import {
  type ClientFooterBuilder,
  type ClientHeaderBuilder,
} from "@orval/core";
import {
  camel,
  type ClientBuilder,
  type ClientGeneratorsBuilder,
  generateFormDataAndUrlEncodedFunction,
  generateVerbImports,
  type GeneratorOptions,
  type GeneratorVerbOptions,
  GetterPropType,
  stringify,
  toObjectString,
  generateBodyOptions,
  isObject,
  resolveRef,
} from "@orval/core";
import {
  type PathItemObject,
  type ParameterObject,
  type ReferenceObject,
} from "openapi3-ts/oas30";

export const generateRequestFunction = (
  {
    queryParams,
    headers,
    operationName,
    response,
    mutator,
    body,
    props,
    verb,
    formData,
    formUrlEncoded,
    override,
  }: GeneratorVerbOptions,
  { route, context, pathRoute }: GeneratorOptions,
) => {
  const isRequestOptions = override?.requestOptions !== false;
  const isFormData = override?.formData.disabled === false;
  const isFormUrlEncoded = override?.formUrlEncoded !== false;

  const getUrlFnName = camel(`get-${operationName}-url`);
  const getUrlFnProps = toObjectString(
    props.filter(
      (prop) =>
        prop.type === GetterPropType.PARAM ||
        prop.type === GetterPropType.NAMED_PATH_PARAMS ||
        prop.type === GetterPropType.QUERY_PARAM,
    ),
    "implementation",
  );

  const spec = context.specs[context.specKey].paths[pathRoute] as
    | PathItemObject
    | undefined;
  const parameters =
    spec?.[verb]?.parameters || ([] as (ParameterObject | ReferenceObject)[]);

  const explodeParameters = parameters.filter((parameter) => {
    const { schema } = resolveRef<ParameterObject>(parameter, context);

    return schema.in === "query" && schema.explode;
  });

  const explodeParametersNames = explodeParameters.map((parameter) => {
    const { schema } = resolveRef<ParameterObject>(parameter, context);

    return schema.name;
  });

  const explodeArrayImplementation =
    explodeParameters.length > 0
      ? `const explodeParameters = ${JSON.stringify(explodeParametersNames)};

    if (value instanceof Array && explodeParameters.includes(key)) {
      value.forEach((v) => normalizedParams.append(key, v === null ? 'null' : v.toString()));
      return;
    }
      `
      : "";

  const isExplodeParametersOnly =
    explodeParameters.length === parameters.length;

  const nomalParamsImplementation = `if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : value.toString())
    }`;

  const getUrlFnImplementation = `const ${getUrlFnName} = (${getUrlFnProps}) => {
${
  queryParams
    ? `  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    ${explodeArrayImplementation}
    ${!isExplodeParametersOnly ? nomalParamsImplementation : ""}
  });`
    : ""
}

  ${queryParams ? `const stringifiedParams = normalizedParams.toString();` : ``}

  ${
    queryParams
      ? `return stringifiedParams.length > 0 ? baseURL + \`${route}${"?${stringifiedParams}"}\` : baseURL + \`${route}\``
      : `return baseURL + \`${route}\``
  }
}\n`;

  const isContentTypeNdJson = (contentType: string) =>
    contentType === "application/nd-json" ||
    contentType === "application/x-ndjson";

  const isNdJson = response.contentTypes.some(isContentTypeNdJson);
  const allResponses = [...response.types.success];
  const allErrors = [...response.types.errors];
  if (allResponses.length === 0) {
    allResponses.push({
      contentType: "",
      hasReadonlyProps: false,
      imports: [],
      isEnum: false,
      isRef: false,
      key: "default",
      schemas: [],
      type: "unknown",
      value: "unknown",
    });
  }
  const responseTypeName = allResponses
    .map((response) => {
      const { value, type, schemas } = response;
      if (type === "unknown") {
        return value;
      }
      if (schemas.length > 0) {
        return schemas[0]?.name;
      }
      return value;
    })
    .join(" | ");

  const errorTypeName = allErrors
    .map((response) => {
      const { value, type, schemas } = response;
      if (type === "unknown") {
        return value;
      }
      if (schemas.length > 0) {
        return schemas[0]?.name;
      }
      return value;
    })
    .join(" | ");

  const getUrlFnProperties = props
    .filter(
      (prop) =>
        prop.type === GetterPropType.PARAM ||
        prop.type === GetterPropType.QUERY_PARAM ||
        prop.type === GetterPropType.NAMED_PATH_PARAMS,
    )
    .map((param) => {
      if (param.type === GetterPropType.NAMED_PATH_PARAMS) {
        return param.destructured;
      } else {
        return param.name;
      }
    })
    .join(",");

  const args = `${toObjectString(props, "implementation")} ${isRequestOptions ? `options?: RequestInit` : ""}`;
  const returnType = `Promise<FetchResponse<${responseTypeName}>>`;

  const globalFetchOptions = isObject(override?.requestOptions)
    ? `${stringify(override?.requestOptions)?.slice(1, -1)?.trim()}`
    : "";
  const fetchMethodOption = `method: '${verb.toUpperCase()}'`;
  const ignoreContentTypes = ["multipart/form-data"];
  const fetchHeadersOption =
    body.contentType && !ignoreContentTypes.includes(body.contentType)
      ? `headers: { 'Content-Type': '${body.contentType}',${headers ? "...headers," : ""} ...options?.headers }`
      : headers
        ? "headers: {...headers, ...options?.headers}"
        : "";
  const requestBodyParams = generateBodyOptions(
    body,
    isFormData,
    isFormUrlEncoded,
  );
  const fetchBodyOption = requestBodyParams
    ? (isFormData && body.formData) || (isFormUrlEncoded && body.formUrlEncoded)
      ? `body: ${requestBodyParams}`
      : `body: JSON.stringify(${requestBodyParams})`
    : "";

  const fetchFnOptions = `${getUrlFnName}(${getUrlFnProperties}),
  {${globalFetchOptions ? "\n" : ""}      ${globalFetchOptions}
    ${isRequestOptions ? "...options," : ""}
    ${fetchMethodOption}${fetchHeadersOption ? "," : ""}
    ${fetchHeadersOption}${fetchBodyOption ? "," : ""}
    ${fetchBodyOption}
  }
`;
  const fetchResponseImplementation = isNdJson
    ? `const stream = await fetch(${fetchFnOptions})

  ${override.fetch.includeHttpResponseReturnType ? "return { status: stream.status, stream, headers: stream.headers }" : `return stream`}
  `
    : `const res = await fetch(${fetchFnOptions})

  ${
    response.isBlob
      ? `const data: ${responseTypeName} = await res.blob()`
      : `  const body = [204, 205, 304, 412].includes(res.status) ? null : await res.text()
  const data: ${responseTypeName} = body ? JSON.parse(body) : {}
    `
  }

  const response = ${
    override.fetch.includeHttpResponseReturnType
      ? `{ data, status: res.status,
          headers: Object.fromEntries(Array.from((res.headers as any).entries())),
      } as FetchResponse<${responseTypeName}>

    if (!res.ok) {
            throw response;
    }

    return response;`
      : "return data"
  }
`;
  const customFetchResponseImplementation = `return ${mutator?.name}<${responseTypeName}>(${fetchFnOptions});`;

  const bodyForm = generateFormDataAndUrlEncodedFunction({
    formData,
    formUrlEncoded,
    body,
    isFormData,
    isFormUrlEncoded,
  });

  const fetchImplementationBody = mutator
    ? customFetchResponseImplementation
    : fetchResponseImplementation;

  const fetchImplementation = `const ${operationName} = async (${args}): ${returnType} => {
  ${bodyForm ? `  ${bodyForm}` : ""}
  ${fetchImplementationBody}}
`;

  const implementation = `${fetchImplementation}\n ${getUrlFnImplementation}\n`;

  return implementation;
};

export const generateClient: ClientBuilder = (verbOptions, options) => {
  const imports = generateVerbImports(verbOptions);
  const functionImplementation = generateRequestFunction(verbOptions, options);

  return {
    implementation: `${functionImplementation}\n`,
    imports,
  };
};

const getHTTPStatusCodes = () => `
export type HTTPStatusCode1xx = 100 | 101 | 102 | 103;
export type HTTPStatusCode2xx = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207;
export type HTTPStatusCode3xx = 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308;
export type HTTPStatusCode4xx = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 419 | 420 | 421 | 422 | 423 | 424 | 426 | 428 | 429 | 431 | 451;
export type HTTPStatusCode5xx = 500 | 501 | 502 | 503 | 504 | 505 | 507 | 511;
export type HTTPStatusCodes = HTTPStatusCode1xx | HTTPStatusCode2xx | HTTPStatusCode3xx | HTTPStatusCode4xx | HTTPStatusCode5xx;

`;

export const generateFetchHeader: ClientHeaderBuilder = ({
  clientImplementation,
}) => {
  return clientImplementation.includes("<HTTPStatusCodes,")
    ? getHTTPStatusCodes()
    : "" +
        `
      export type FetchResponse<T> = {
          data: T;
          status: number;
          headers: Record<string, string>;
      };

      export const createAPIClient = (
        baseURL: string,
        chainFunctions: ChainFunction[] = [],
      ): Client => {
        let fetch = createEnhancedFetch(chainFunctions);

        const pushChainFunction = (chainFunction: ChainFunction) => {
          chainFunctions.push(chainFunction);
          fetch = createEnhancedFetch(chainFunctions);
        }

      `;
};

const returnTypesToWrite: Map<string, (title?: string) => string> = new Map();

export const generateFetchFooter: ClientFooterBuilder = ({
  operationNames,
  title,
  noFunction,
  hasMutator,
  hasAwaitedType,
}) => {
  let footer = "";

  if (!noFunction) {
    footer += `return {${operationNames.join(",")}, pushChainFunction, baseURL}};\n`;
  }

  if (hasMutator && !hasAwaitedType) {
    footer += `\ntype AwaitedInput<T> = PromiseLike<T> | T;\n
    type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
\n`;
  }

  operationNames.forEach((operationName) => {
    if (returnTypesToWrite.has(operationName)) {
      const func = returnTypesToWrite.get(operationName)!;
      footer += func(!noFunction ? title : undefined) + "\n";
    }
  });

  return footer;
};

const fetchClientBuilder: ClientGeneratorsBuilder = {
  client: generateClient,
  header: generateFetchHeader,
  footer: generateFetchFooter,
  dependencies: () => [],
};

export const builder = () => () => fetchClientBuilder;

export default builder;
