/**
 * This file is auto-generated. Do not edit manually.
 */
import { FetchError, createEnhancedFetch } from "../fetch";
import type { ChainFunction, FetchResponse } from "../fetch";

import type { Client } from "./interface";

function objectToFormData(obj?: Record<string, any>): FormData {
  const formData = new FormData();

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Check if the value is undefined
      if (value !== undefined) {
        if (Array.isArray(value)) {
          // Handle arrays by appending each item
          value.forEach((item) => {
            if (item instanceof Blob || item instanceof File) {
              // Append Blob or File directly
              formData.append(key, item);
            } else if (typeof item === "object" && item !== null) {
              // Serialize object to JSON string
              formData.append(key, JSON.stringify(item));
            } else {
              // Append primitive values directly
              formData.append(key, item);
            }
          });
        } else if (value instanceof Blob || value instanceof File) {
          // Append Blob or File directly
          formData.append(key, value);
        } else if (typeof value === "object" && value !== null) {
          // Serialize single object to JSON string
          formData.append(key, JSON.stringify(value));
        } else {
          // Append primitive values directly
          formData.append(key, value);
        }
      }
    }
  }

  return formData;
}

/**
 * Contains version information about the storage service.
 * @property buildVersion - The version number of the storage service build.
 *    Example - 1.2.3*/
export interface VersionInformation {
  /**
   *The version number of the storage service build.
   *    Example - 1.2.3
   */
  buildVersion?: string;
}

/**
 * Basic information about a file in storage.
 * @property id - Unique identifier for the file.
 *    Example - d5e76ceb-77a2-4153-b7da-1f7c115b2ff2
 * @property name - Name of the file including extension.
 *    Example - profile-picture.jpg
 * @property bucketId - ID of the bucket containing the file.
 *    Example - users-bucket
 * @property isUploaded - Whether the file has been successfully uploaded.
 *    Example - true*/
export interface FileSummary {
  /**
   *Unique identifier for the file.
   *    Example - d5e76ceb-77a2-4153-b7da-1f7c115b2ff2
   */
  id?: string;
  /**
   *Name of the file including extension.
   *    Example - profile-picture.jpg
   */
  name?: string;
  /**
   *ID of the bucket containing the file.
   *    Example - users-bucket
   */
  bucketId?: string;
  /**
   *Whether the file has been successfully uploaded.
   *    Example - true
   */
  isUploaded?: boolean;
}

/**
 * Comprehensive metadata information about a file in storage.
 * @property id - Unique identifier for the file.
 *    Example - d5e76ceb-77a2-4153-b7da-1f7c115b2ff2
 * @property name - Name of the file including extension.
 *    Example - profile-picture.jpg
 * @property size - Size of the file in bytes.
 *    Example - 245678
 * @property bucketId - ID of the bucket containing the file.
 *    Example - users-bucket
 * @property etag - Entity tag for cache validation.
 *    Example - "a1b2c3d4e5f6"
 * @property createdAt - Timestamp when the file was created.
 *    Example - 2023-01-15T12:34:56Z
 *    Format - date-time
 * @property updatedAt - Timestamp when the file was last updated.
 *    Example - 2023-01-16T09:45:32Z
 *    Format - date-time
 * @property isUploaded - Whether the file has been successfully uploaded.
 *    Example - true
 * @property mimeType - MIME type of the file.
 *    Example - image/jpeg
 * @property uploadedByUserId - ID of the user who uploaded the file.
 *    Example - abc123def456
 * @property metadata - Custom metadata associated with the file.*/
export interface FileMetadata {
  /**
   *Unique identifier for the file.
   *    Example - d5e76ceb-77a2-4153-b7da-1f7c115b2ff2
   */
  id?: string;
  /**
   *Name of the file including extension.
   *    Example - profile-picture.jpg
   */
  name?: string;
  /**
   *Size of the file in bytes.
   *    Example - 245678
   */
  size?: number;
  /**
   *ID of the bucket containing the file.
   *    Example - users-bucket
   */
  bucketId?: string;
  /**
   *Entity tag for cache validation.
   *    Example - "a1b2c3d4e5f6"
   */
  etag?: string;
  /**
   *Timestamp when the file was created.
   *    Example - 2023-01-15T12:34:56Z
   *    Format - date-time
   */
  createdAt?: string;
  /**
   *Timestamp when the file was last updated.
   *    Example - 2023-01-16T09:45:32Z
   *    Format - date-time
   */
  updatedAt?: string;
  /**
   *Whether the file has been successfully uploaded.
   *    Example - true
   */
  isUploaded?: boolean;
  /**
   *MIME type of the file.
   *    Example - image/jpeg
   */
  mimeType?: string;
  /**
   *ID of the user who uploaded the file.
   *    Example - abc123def456
   */
  uploadedByUserId?: string;
  /**
   *Custom metadata associated with the file.
   */
  metadata?: Record<string, any>;
}

/**
 * Metadata provided when uploading a new file.
 * @property id - Optional custom ID for the file. If not provided, a UUID will be generated.
 *    Example - custom-id-123
 * @property name - Name to assign to the file. If not provided, the original filename will be used.
 *    Example - custom-filename.png
 * @property metadata - Custom metadata to associate with the file.*/
export interface UploadFileMetadata {
  /**
   *Optional custom ID for the file. If not provided, a UUID will be generated.
   *    Example - custom-id-123
   */
  id?: string;
  /**
   *Name to assign to the file. If not provided, the original filename will be used.
   *    Example - custom-filename.png
   */
  name?: string;
  /**
   *Custom metadata to associate with the file.
   */
  metadata?: Record<string, any>;
}

/**
 * Metadata that can be updated for an existing file.
 * @property name - New name to assign to the file.
 *    Example - renamed-file.jpg
 * @property metadata - Updated custom metadata to associate with the file.*/
export interface UpdateFileMetadata {
  /**
   *New name to assign to the file.
   *    Example - renamed-file.jpg
   */
  name?: string;
  /**
   *Updated custom metadata to associate with the file.
   */
  metadata?: Record<string, any>;
}

/**
 * Contains a presigned URL for direct file operations.
 * @property url - The presigned URL for file operations.
 *    Example - https://storage.example.com/files/abc123?signature=xyz
 * @property expiration - The time in seconds until the URL expires.
 *    Example - 3600*/
export interface PresignedURLResponse {
  /**
   *The presigned URL for file operations.
   *    Example - https://storage.example.com/files/abc123?signature=xyz
   */
  url?: string;
  /**
   *The time in seconds until the URL expires.
   *    Example - 3600
   */
  expiration?: number;
}

/**
 * Error information returned by the API.
 * @property error - Error details.*/
export interface ErrorResponse {
  /**
   *Error details.
   */
  error?: ErrorResponseError;
}

/**
 * Error details.
 * @property message - Human-readable error message.
 *    Example - File not found*/
export interface ErrorResponseError {
  /**
   *Human-readable error message.
   *    Example - File not found
   */
  message: string;
}

/**
 *
 * @property "bucket-id" - Target bucket identifier where files will be stored.
 *    Example - user-uploads
 * @property "metadata[]" - Optional custom metadata for each uploaded file. Must match the order of the file[] array.
 * @property "file[]" - Array of files to upload.*/
export interface UploadFilesBody {
  /**
   *Target bucket identifier where files will be stored.
   *    Example - user-uploads
   */
  "bucket-id"?: string;
  /**
   *Optional custom metadata for each uploaded file. Must match the order of the file[] array.
   */
  "metadata[]"?: UploadFileMetadata[];
  /**
   *Array of files to upload.
   */
  "file[]": Blob[];
}

/**
 *
 * @property processedFiles - List of successfully processed files with their metadata.*/
export interface UploadFiles201 {
  /**
   *List of successfully processed files with their metadata.
   */
  processedFiles?: FileMetadata[];
}

/**
 *
 */
export enum F {
  Auto = "auto",
  Same = "same",
  Jpeg = "jpeg",
  Webp = "webp",
  Png = "png",
  Avif = "avif",
}

/**
 *
 * @property metadata - Metadata that can be updated for an existing file.
 * @property file - New file content to replace the existing file
 *    Format - binary*/
export interface ReplaceFileBody {
  /**
   *Metadata that can be updated for an existing file.
   */
  metadata?: UpdateFileMetadata;
  /**
   *New file content to replace the existing file
   *    Format - binary
   */
  file?: Blob;
}

/**
 * Metadata that can be updated for an existing file.
 * @property name - New name to assign to the file.
 *    Example - renamed-file.jpg
 * @property metadata - Updated custom metadata to associate with the file.*/
export interface ReplaceFileBodyMetadata {
  /**
   *New name to assign to the file.
   *    Example - renamed-file.jpg
   */
  name?: string;
  /**
   *Updated custom metadata to associate with the file.
   */
  metadata?: Record<string, any>;
}

export interface GetFileMetadataHeadersParams {
  "if-match"?: string;
  "if-none-match"?: string;
  "if-modified-since"?: string;
  "if-unmodified-since"?: string;
  q?: number;
  h?: number;
  w?: number;
  b?: number;
  f?: F;
}

export interface GetFileParams {
  "if-match"?: string;
  "if-none-match"?: string;
  "if-modified-since"?: string;
  "if-unmodified-since"?: string;
  q?: number;
  h?: number;
  w?: number;
  b?: number;
  f?: F;
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

  /**
   * Get service version information
   *
   * Retrieves build and version information about the storage service. Useful for monitoring and debugging.
   */
  const getVersion = async (
    options?: RequestInit,
  ): Promise<FetchResponse<VersionInformation>> => {
    const url = baseURL + `/version`;
    const res = await fetch(url, {
      ...options,
      method: "GET",
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: VersionInformation = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<VersionInformation>;
  };

  /**
   * Upload files
   *
   * Upload one or more files to a specified bucket. Supports batch uploading with optional custom metadata for each file. If uploading multiple files, either provide metadata for all files or none.
   */
  const uploadFiles = async (
    uploadFilesBody: UploadFilesBody,
    options?: RequestInit,
  ): Promise<FetchResponse<UploadFiles201>> => {
    const url = baseURL + `/files/`;
    const res = await fetch(url, {
      ...options,
      method: "POST",
      body: objectToFormData(uploadFilesBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: UploadFiles201 = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<UploadFiles201>;
  };

  /**
   * Check file information
   *
   * Retrieve file metadata headers without downloading the file content. Supports conditional requests and provides caching information.
   */
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
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: void = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<void>;
  };

  /**
   * Download file
   *
   * Retrieve and download the complete file content. Supports conditional requests, image transformations, and range requests for partial downloads.
   */
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
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const payload: Blob = await res.blob();

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<Blob>;
  };

  /**
   * Replace file
   *
   * Replace an existing file with new content while preserving the file ID. The operation follows these steps:
1. The isUploaded flag is set to false to mark the file as being updated
2. The file content is replaced in the storage backend
3. File metadata is updated (size, mime-type, isUploaded, etc.)

Each step is atomic, but if a step fails, previous steps will not be automatically rolled back.

   */
  const replaceFile = async (
    id: string,
    replaceFileBody?: ReplaceFileBody,
    options?: RequestInit,
  ): Promise<FetchResponse<FileMetadata>> => {
    const url = baseURL + `/files/${id}`;
    const res = await fetch(url, {
      ...options,
      method: "PUT",
      body: objectToFormData(replaceFileBody),
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: FileMetadata = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<FileMetadata>;
  };

  /**
   * Delete file
   *
   * Permanently delete a file from storage. This removes both the file content and its associated metadata.
   */
  const deleteFile = async (
    id: string,
    options?: RequestInit,
  ): Promise<FetchResponse<void>> => {
    const url = baseURL + `/files/${id}`;
    const res = await fetch(url, {
      ...options,
      method: "DELETE",
    });

    if (res.status >= 400) {
      const body = [412].includes(res.status) ? null : await res.text();
      const payload: unknown = body ? JSON.parse(body) : {};
      throw new FetchError(payload, res.status, res.headers);
    }
    const body = [204, 205, 304].includes(res.status) ? null : await res.text();
    const payload: void = body ? JSON.parse(body) : {};

    return {
      body: payload,
      status: res.status,
      headers: res.headers,
    } as FetchResponse<void>;
  };

  return {
    getVersion,
    uploadFiles,
    getFileMetadataHeaders,
    getFile,
    replaceFile,
    deleteFile,
    baseURL,
    pushChainFunction,
  };
};
