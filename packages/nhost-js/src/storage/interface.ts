import type { ChainFunction } from "../fetch";
import type {
  FetchResponse,
  GetOpenAPISpec200,
  VersionInformation,
  UploadFilesBody,
  UploadFiles201,
  GetFileMetadataHeadersParams,
  GetFileParams,
  ReplaceFileBody,
  FileMetadata,
} from "./client";

/**
 * Storage client interface providing methods for file operations
 */
export interface Client {
  /**
   * Base URL for the storage service
   */
  baseURL: string;

  /**
   * Add a middleware function to the request chain
   * @param chainFunction - Middleware function to add
   */
  pushChainFunction: (chainFunction: ChainFunction) => void;

  /**
   * Returns the OpenAPI schema definition for this API
   * @summary Get OpenAPI specification
   */
  getOpenAPISpec: (
    options?: RequestInit,
  ) => Promise<FetchResponse<GetOpenAPISpec200>>;

  /**
   * Retrieves build and version information about the storage service
   * @summary Get service version information
   */
  getVersion: (
    options?: RequestInit,
  ) => Promise<FetchResponse<VersionInformation>>;

  /**
   * Upload one or more files to storage
   * @summary Upload files
   */
  uploadFiles: (
    uploadFilesBody: UploadFilesBody,
    options?: RequestInit,
  ) => Promise<FetchResponse<UploadFiles201>>;

  /**
   * Retrieve file metadata using HTTP HEAD method
   * @summary Get file metadata (HEAD)
   */
  getFileMetadataHeaders: (
    id: string,
    params?: GetFileMetadataHeadersParams,
    options?: RequestInit,
  ) => Promise<FetchResponse<void>>;

  /**
   * Download a file
   * @summary Get file
   */
  getFile: (
    id: string,
    params?: GetFileParams,
    options?: RequestInit,
  ) => Promise<FetchResponse<Blob>>;

  /**
   * Replace an existing file
   * @summary Replace file
   */
  replaceFile: (
    id: string,
    replaceFileBody: ReplaceFileBody,
    options?: RequestInit,
  ) => Promise<FetchResponse<FileMetadata>>;

  /**
   * Delete a file
   * @summary Delete file
   */
  deleteFile: (
    id: string,
    options?: RequestInit,
  ) => Promise<FetchResponse<void>>;
}
