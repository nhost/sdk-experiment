/**
 * This file is auto-generated. Do not edit manually.
 */

/**
 * Contains version information about the storage service.
 * @property buildVersion - The version number of the storage service build.
    *    Example - "1.2.3"*/
export interface VersionInformation {
  /**
   * The version number of the storage service build.
    *    Example - "1.2.3"
   */
  buildVersion: string,
};


/**
 * Basic information about a file in storage.
 * @property id - Unique identifier for the file.
    *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
 * @property name - Name of the file including extension.
    *    Example - "profile-picture.jpg"
 * @property bucketId - ID of the bucket containing the file.
    *    Example - "users-bucket"
 * @property isUploaded - Whether the file has been successfully uploaded.
    *    Example - true*/
export interface FileSummary {
  /**
   * Unique identifier for the file.
    *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
   */
  id: string,
  /**
   * Name of the file including extension.
    *    Example - "profile-picture.jpg"
   */
  name: string,
  /**
   * ID of the bucket containing the file.
    *    Example - "users-bucket"
   */
  bucketId: string,
  /**
   * Whether the file has been successfully uploaded.
    *    Example - true
   */
  isUploaded: boolean,
};


/**
 * Comprehensive metadata information about a file in storage.
 * @property id - Unique identifier for the file.
    *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
 * @property name - Name of the file including extension.
    *    Example - "profile-picture.jpg"
 * @property size - Size of the file in bytes.
    *    Example - 245678
 * @property bucketId - ID of the bucket containing the file.
    *    Example - "users-bucket"
 * @property etag - Entity tag for cache validation.
    *    Example - "\"a1b2c3d4e5f6\""
 * @property createdAt - Timestamp when the file was created.
    *    Example - "2023-01-15T12:34:56Z"
    *    Format - date-time
 * @property updatedAt - Timestamp when the file was last updated.
    *    Example - "2023-01-16T09:45:32Z"
    *    Format - date-time
 * @property isUploaded - Whether the file has been successfully uploaded.
    *    Example - true
 * @property mimeType - MIME type of the file.
    *    Example - "image/jpeg"
 * @property uploadedByUserId - ID of the user who uploaded the file.
    *    Example - "abc123def456"
 * @property metadata - Custom metadata associated with the file.
    *    Example - {"alt":"Profile picture","category":"avatar"}*/
export interface FileMetadata {
  /**
   * Unique identifier for the file.
    *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
   */
  id: string,
  /**
   * Name of the file including extension.
    *    Example - "profile-picture.jpg"
   */
  name: string,
  /**
   * Size of the file in bytes.
    *    Example - 245678
   */
  size: number,
  /**
   * ID of the bucket containing the file.
    *    Example - "users-bucket"
   */
  bucketId: string,
  /**
   * Entity tag for cache validation.
    *    Example - "\"a1b2c3d4e5f6\""
   */
  etag: string,
  /**
   * Timestamp when the file was created.
    *    Example - "2023-01-15T12:34:56Z"
    *    Format - date-time
   */
  createdAt: string,
  /**
   * Timestamp when the file was last updated.
    *    Example - "2023-01-16T09:45:32Z"
    *    Format - date-time
   */
  updatedAt: string,
  /**
   * Whether the file has been successfully uploaded.
    *    Example - true
   */
  isUploaded: boolean,
  /**
   * MIME type of the file.
    *    Example - "image/jpeg"
   */
  mimeType: string,
  /**
   * ID of the user who uploaded the file.
    *    Example - "abc123def456"
   */
  uploadedByUserId: string,
  /**
   * Custom metadata associated with the file.
    *    Example - {"alt":"Profile picture","category":"avatar"}
   */
  metadata: Record<string, unknown>,
};


/**
 * Metadata provided when uploading a new file.
 * @property id - Optional custom ID for the file. If not provided, a UUID will be generated.
    *    Example - "custom-id-123"
 * @property name - Name to assign to the file. If not provided, the original filename will be used.
    *    Example - "custom-filename.png"
 * @property metadata - Custom metadata to associate with the file.
    *    Example - {"alt":"Custom image","category":"document"}*/
export interface UploadFileMetadata {
  /**
   * Optional custom ID for the file. If not provided, a UUID will be generated.
    *    Example - "custom-id-123"
   */
  id: string,
  /**
   * Name to assign to the file. If not provided, the original filename will be used.
    *    Example - "custom-filename.png"
   */
  name: string,
  /**
   * Custom metadata to associate with the file.
    *    Example - {"alt":"Custom image","category":"document"}
   */
  metadata: Record<string, unknown>,
};


/**
 * Metadata that can be updated for an existing file.
 * @property name - New name to assign to the file.
    *    Example - "renamed-file.jpg"
 * @property metadata - Updated custom metadata to associate with the file.
    *    Example - {"alt":"Updated image description","category":"profile"}*/
export interface UpdateFileMetadata {
  /**
   * New name to assign to the file.
    *    Example - "renamed-file.jpg"
   */
  name: string,
  /**
   * Updated custom metadata to associate with the file.
    *    Example - {"alt":"Updated image description","category":"profile"}
   */
  metadata: Record<string, unknown>,
};


/**
 * Error details.
 * @property message - Human-readable error message.
    *    Example - "File not found"*/
export interface ErrorResponseError {
  /**
   * Human-readable error message.
    *    Example - "File not found"
   */
  message: string,
};


/**
 * Error information returned by the API.
 * @property error - Error details.*/
export interface ErrorResponse {
  /**
   * Error details.
   */
  error: ErrorResponseError,
};


/**
 * Format to convert the image to. If 'auto', the format is determined based on the Accept header.
 */
export type OutputFormat = "auto" | "same" | "jpeg" | "webp" | "png" | "avif";


/**
 * Format to convert the image to. If 'auto', the format is determined based on the Accept header.
 */
export type HeadF = "auto" | "same" | "jpeg" | "webp" | "png" | "avif";


/**
 * Format to convert the image to. If 'auto', the format is determined based on the Accept header.
 */
export type GetF = "auto" | "same" | "jpeg" | "webp" | "png" | "avif";

export interface GetFileMetadataHeadersParams {
  /**
   * Image quality (1-100). Only applies to JPEG, WebP and PNG files
   */
  q: number;
  /**
   * Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
   */
  h: number;
  /**
   * Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
   */
  w: number;
  /**
   * Blur the image using this sigma value. Only applies to image files
   */
  b: number;
  /**
   * Output format for image files. Use 'auto' for content negotiation based on Accept header
   */
  f: HeadF;
}
export interface GetFileParams {
  /**
   * Image quality (1-100). Only applies to JPEG, WebP and PNG files
   */
  q: number;
  /**
   * Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
   */
  h: number;
  /**
   * Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
   */
  w: number;
  /**
   * Blur the image using this sigma value. Only applies to image files
   */
  b: number;
  /**
   * Output format for image files. Use 'auto' for content negotiation based on Accept header
   */
  f: GetF;
}


export interface Client {
  getFileMetadataHeaders(
    id: string,
    // body
    params?: GetFileMetadataHeadersParams,
    options?: RequestInit,
  ): Promise<fixme>;

  getFile(
    id: string,
    // body
    params?: GetFileParams,
    options?: RequestInit,
  ): Promise<fixme>;

  replaceFile(
    id: string,
    // body
    options?: RequestInit,
  ): Promise<fixme>;

  deleteFile(
    id: string,
    // body
    options?: RequestInit,
  ): Promise<fixme>;
};
