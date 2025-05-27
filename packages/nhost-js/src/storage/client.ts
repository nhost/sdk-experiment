/**
 * This file is auto-generated. Do not edit manually.
 */

import { FetchError, createEnhancedFetch } from "../fetch";
import type { ChainFunction, FetchResponse } from "../fetch";

import type { Client } from "./interface";

/**
 * Contains version information about the storage service.
 */
export interface VersionInformation {
  /**
   * The version number of the storage service build.
   *    Example - "1.2.3"
   */
  buildVersion?: string;
}

/**
 * Basic information about a file in storage.
 */
export interface FileSummary {
  /**
   * Unique identifier for the file.
   *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
   */
  id?: string;
  /**
   * Name of the file including extension.
   *    Example - "profile-picture.jpg"
   */
  name?: string;
  /**
   * ID of the bucket containing the file.
   *    Example - "users-bucket"
   */
  bucketId?: string;
  /**
   * Whether the file has been successfully uploaded.
   *    Example - true
   */
  isUploaded?: boolean;
}

/**
 * Comprehensive metadata information about a file in storage.
 */
export interface FileMetadata {
  /**
   * Unique identifier for the file.
   *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
   */
  id?: string;
  /**
   * Name of the file including extension.
   *    Example - "profile-picture.jpg"
   */
  name?: string;
  /**
   * Size of the file in bytes.
   *    Example - 245678
   */
  size?: number;
  /**
   * ID of the bucket containing the file.
   *    Example - "users-bucket"
   */
  bucketId?: string;
  /**
   * Entity tag for cache validation.
   *    Example - "\"a1b2c3d4e5f6\""
   */
  etag?: string;
  /**
   * Timestamp when the file was created.
   *    Example - "2023-01-15T12:34:56Z"
   *    Format - date-time
   */
  createdAt?: string;
  /**
   * Timestamp when the file was last updated.
   *    Example - "2023-01-16T09:45:32Z"
   *    Format - date-time
   */
  updatedAt?: string;
  /**
   * Whether the file has been successfully uploaded.
   *    Example - true
   */
  isUploaded?: boolean;
  /**
   * MIME type of the file.
   *    Example - "image/jpeg"
   */
  mimeType?: string;
  /**
   * ID of the user who uploaded the file.
   *    Example - "abc123def456"
   */
  uploadedByUserId?: string;
  /**
   * Custom metadata associated with the file.
   *    Example - {"alt":"Profile picture","category":"avatar"}
   */
  metadata?: Record<string, unknown>;
}

/**
 * Metadata provided when uploading a new file.
 */
export interface UploadFileMetadata {
  /**
   * Optional custom ID for the file. If not provided, a UUID will be generated.
   *    Example - "custom-id-123"
   */
  id?: string;
  /**
   * Name to assign to the file. If not provided, the original filename will be used.
   *    Example - "custom-filename.png"
   */
  name?: string;
  /**
   * Custom metadata to associate with the file.
   *    Example - {"alt":"Custom image","category":"document"}
   */
  metadata?: Record<string, unknown>;
}

/**
 * Metadata that can be updated for an existing file.
 */
export interface UpdateFileMetadata {
  /**
   * New name to assign to the file.
   *    Example - "renamed-file.jpg"
   */
  name?: string;
  /**
   * Updated custom metadata to associate with the file.
   *    Example - {"alt":"Updated image description","category":"profile"}
   */
  metadata?: Record<string, unknown>;
}

/**
 * Contains a presigned URL for direct file operations.
 */
export interface PresignedURLResponse {
  /**
   * The presigned URL for file operations.
   *    Example - "https://storage.example.com/files/abc123?signature=xyz"
   */
  url?: string;
  /**
   * The time in seconds until the URL expires.
   *    Example - 3600
   */
  expiration?: number;
}

/**
 * Error details.
 */
export interface ErrorResponseError {
  /**
   * Human-readable error message.
   *    Example - "File not found"
   */
  message: string;
}

/**
 * Error information returned by the API.
 */
export interface ErrorResponse {
  /**
   * Error details.
   */
  error?: ErrorResponseError;
}

/**
 *
 */
export interface UploadFilesBody {
  /**
   * Target bucket identifier where files will be stored.
   *    Example - "user-uploads"
   */
  "bucket-id"?: string;
  /**
   * Optional custom metadata for each uploaded file. Must match the order of the file[] array.
   */
  "metadata[]"?: UploadFileMetadata[];
  /**
   * Array of files to upload.
   */
  "file[]": Blob[];
}

/**
 *
 */
export interface UploadFilesResponse201 {
  /**
   * List of successfully processed files with their metadata.
   */
  processedFiles?: FileMetadata[];
}

/**
 *
 */
export type HeadF = "auto" | "same" | "jpeg" | "webp" | "png" | "avif";

/**
 *
 */
export type GetF = "auto" | "same" | "jpeg" | "webp" | "png" | "avif";

/**
 *
 */
export interface ReplaceFileBody {
  /**
   * Metadata that can be updated for an existing file.
   */
  metadata?: UpdateFileMetadata;
  /**
   * New file content to replace the existing file
   *    Format - binary
   */
  file?: Blob;
}

/**
 * Parameters for the getFileMetadataHeaders method.
    * @param q - Image quality (1-100). Only applies to JPEG, WebP and PNG files

    * @param h - Maximum height to resize image to while maintaining aspect ratio. Only applies to image files

    * @param w - Maximum width to resize image to while maintaining aspect ratio. Only applies to image files

    * @param b - Blur the image using this sigma value. Only applies to image files

    * @param f - Output format for image files. Use 'auto' for content negotiation based on Accept header
  */
export interface GetFileMetadataHeadersParams {
  /**
   * Image quality (1-100). Only applies to JPEG, WebP and PNG files

   */
  q?: number;
  /**
   * Maximum height to resize image to while maintaining aspect ratio. Only applies to image files

   */
  h?: number;
  /**
   * Maximum width to resize image to while maintaining aspect ratio. Only applies to image files

   */
  w?: number;
  /**
   * Blur the image using this sigma value. Only applies to image files

   */
  b?: number;
  /**
   * Output format for image files. Use 'auto' for content negotiation based on Accept header

   */
  f?: HeadF;
}
/**
 * Parameters for the getFile method.
    * @param q - Image quality (1-100). Only applies to JPEG, WebP and PNG files

    * @param h - Maximum height to resize image to while maintaining aspect ratio. Only applies to image files

    * @param w - Maximum width to resize image to while maintaining aspect ratio. Only applies to image files

    * @param b - Blur the image using this sigma value. Only applies to image files

    * @param f - Output format for image files. Use 'auto' for content negotiation based on Accept header
  */
export interface GetFileParams {
  /**
   * Image quality (1-100). Only applies to JPEG, WebP and PNG files

   */
  q?: number;
  /**
   * Maximum height to resize image to while maintaining aspect ratio. Only applies to image files

   */
  h?: number;
  /**
   * Maximum width to resize image to while maintaining aspect ratio. Only applies to image files

   */
  w?: number;
  /**
   * Blur the image using this sigma value. Only applies to image files

   */
  b?: number;
  /**
   * Output format for image files. Use 'auto' for content negotiation based on Accept header

   */
  f?: GetF;
}

export const createAPIClient = (
  baseURL: string,
  chainFunctions: ChainFunction[] = [],
): Client => {
  let fetch = createEnhancedFetch(chainFunctions);

  const pushChainFunction = (chainFunction: ChainFunction) => {
    chainFunctions.push(chainFunction);
    fetch = createEnhancedFetch(chainFunctions);
  };
  const getVersion = async (
    options?: RequestInit,
  ): Promise<FetchResponse<VersionInformation>> => {
    const url = baseURL + `/version`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options?.headers,
      },
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: VersionInformation = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<VersionInformation>;
  };

  const uploadFiles = async (
    body: UploadFilesBody,
    options?: RequestInit,
  ): Promise<FetchResponse<UploadFilesResponse201>> => {
    const url = baseURL + `/files/`;
    const formData = new FormData();
    if (body["bucket-id"] !== undefined) {
      formData.append("bucket-id", body["bucket-id"]);
    }
    if (body["metadata[]"] !== undefined) {
      body["metadata[]"].forEach((value) =>
        formData.append("metadata[]", JSON.stringify(value)),
      );
    }
    if (body["file[]"] !== undefined) {
      body["file[]"].forEach((value) => formData.append("file[]", value));
    }

    const res = await fetch(url, {
      ...options,
      method: "POST",
      body: formData,
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: UploadFilesResponse201 = responseBody
      ? JSON.parse(responseBody)
      : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<UploadFilesResponse201>;
  };

  const getFileMetadataHeaders = async (
    id: string,
    params?: GetFileMetadataHeadersParams,
    options?: RequestInit,
  ): Promise<FetchResponse<void>> => {
    const normalizedParams = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        normalizedParams.append(
          key,
          value === null ? "null" : value.toString(),
        );
      }
    });

    const stringifiedParams = normalizedParams.toString();

    const url =
      stringifiedParams.length > 0
        ? baseURL + `/files/${id}?${stringifiedParams}`
        : baseURL + `/files/${id}`;
    const res = await fetch(url, {
      ...options,
      method: "HEAD",
      headers: {
        ...options?.headers,
      },
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const payload: void = undefined;

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<void>;
  };

  const getFile = async (
    id: string,
    params?: GetFileParams,
    options?: RequestInit,
  ): Promise<FetchResponse<Blob>> => {
    const normalizedParams = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        normalizedParams.append(
          key,
          value === null ? "null" : value.toString(),
        );
      }
    });

    const stringifiedParams = normalizedParams.toString();

    const url =
      stringifiedParams.length > 0
        ? baseURL + `/files/${id}?${stringifiedParams}`
        : baseURL + `/files/${id}`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
      headers: {
        ...options?.headers,
      },
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const payload: Blob = await res.blob();

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<Blob>;
  };

  const replaceFile = async (
    id: string,
    body: ReplaceFileBody,
    options?: RequestInit,
  ): Promise<FetchResponse<FileMetadata>> => {
    const url = baseURL + `/files/${id}`;
    const formData = new FormData();
    if (body["metadata"] !== undefined) {
      formData.append("metadata", JSON.stringify(body["metadata"]));
    }
    if (body["file"] !== undefined) {
      formData.append("file", body["file"]);
    }

    const res = await fetch(url, {
      ...options,
      method: "PUT",
      body: formData,
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const responseBody = [204, 205, 304].includes(res.status)
      ? null
      : await res.text();
    const payload: FileMetadata = responseBody ? JSON.parse(responseBody) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<FileMetadata>;
  };

  const deleteFile = async (
    id: string,
    options?: RequestInit,
  ): Promise<FetchResponse<void>> => {
    const url = baseURL + `/files/${id}`;
    const res = await fetch(url, {
      ...options,
      method: "DELETE",
      headers: {
        ...options?.headers,
      },
    });

    if (res.status >= 300) {
      const responseBody = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = responseBody ? JSON.parse(responseBody) : {};
      throw new FetchError(payload, res.status, res.headers);
    }

    const payload: void = undefined;

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<void>;
  };

  return {
    baseURL,
    pushChainFunction,
    getVersion,
    uploadFiles,
    getFileMetadataHeaders,
    getFile,
    replaceFile,
    deleteFile,
  };
};
