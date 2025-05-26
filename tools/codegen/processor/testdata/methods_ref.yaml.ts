/**
 * This file is auto-generated. Do not edit manually.
 */

/**
 * Contains version information about the storage service.
 * @property (string) buildVersion - The version number of the storage service build.
    *    Example - "1.2.3"*/
export interface VersionInformation {
  /**
   * The version number of the storage service build.
    *    Example - "1.2.3"
   */
  buildVersion?: string,
};


/**
 * Basic information about a file in storage.
 * @property (string) id - Unique identifier for the file.
    *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
 * @property (string) name - Name of the file including extension.
    *    Example - "profile-picture.jpg"
 * @property (string) bucketId - ID of the bucket containing the file.
    *    Example - "users-bucket"
 * @property (boolean) isUploaded - Whether the file has been successfully uploaded.
    *    Example - true*/
export interface FileSummary {
  /**
   * Unique identifier for the file.
    *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
   */
  id?: string,
  /**
   * Name of the file including extension.
    *    Example - "profile-picture.jpg"
   */
  name?: string,
  /**
   * ID of the bucket containing the file.
    *    Example - "users-bucket"
   */
  bucketId?: string,
  /**
   * Whether the file has been successfully uploaded.
    *    Example - true
   */
  isUploaded?: boolean,
};


/**
 * Comprehensive metadata information about a file in storage.
 * @property (string) id - Unique identifier for the file.
    *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
 * @property (string) name - Name of the file including extension.
    *    Example - "profile-picture.jpg"
 * @property (number) size - Size of the file in bytes.
    *    Example - 245678
 * @property (string) bucketId - ID of the bucket containing the file.
    *    Example - "users-bucket"
 * @property (string) etag - Entity tag for cache validation.
    *    Example - "\"a1b2c3d4e5f6\""
 * @property (string) createdAt - Timestamp when the file was created.
    *    Example - "2023-01-15T12:34:56Z"
    *    Format - date-time
 * @property (string) updatedAt - Timestamp when the file was last updated.
    *    Example - "2023-01-16T09:45:32Z"
    *    Format - date-time
 * @property (boolean) isUploaded - Whether the file has been successfully uploaded.
    *    Example - true
 * @property (string) mimeType - MIME type of the file.
    *    Example - "image/jpeg"
 * @property (string) uploadedByUserId - ID of the user who uploaded the file.
    *    Example - "abc123def456"
 * @property (Record<string, unknown>) metadata - Custom metadata associated with the file.
    *    Example - {"alt":"Profile picture","category":"avatar"}*/
export interface FileMetadata {
  /**
   * Unique identifier for the file.
    *    Example - "d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"
   */
  id?: string,
  /**
   * Name of the file including extension.
    *    Example - "profile-picture.jpg"
   */
  name?: string,
  /**
   * Size of the file in bytes.
    *    Example - 245678
   */
  size?: number,
  /**
   * ID of the bucket containing the file.
    *    Example - "users-bucket"
   */
  bucketId?: string,
  /**
   * Entity tag for cache validation.
    *    Example - "\"a1b2c3d4e5f6\""
   */
  etag?: string,
  /**
   * Timestamp when the file was created.
    *    Example - "2023-01-15T12:34:56Z"
    *    Format - date-time
   */
  createdAt?: string,
  /**
   * Timestamp when the file was last updated.
    *    Example - "2023-01-16T09:45:32Z"
    *    Format - date-time
   */
  updatedAt?: string,
  /**
   * Whether the file has been successfully uploaded.
    *    Example - true
   */
  isUploaded?: boolean,
  /**
   * MIME type of the file.
    *    Example - "image/jpeg"
   */
  mimeType?: string,
  /**
   * ID of the user who uploaded the file.
    *    Example - "abc123def456"
   */
  uploadedByUserId?: string,
  /**
   * Custom metadata associated with the file.
    *    Example - {"alt":"Profile picture","category":"avatar"}
   */
  metadata?: Record<string, unknown>,
};


/**
 * Metadata provided when uploading a new file.
 * @property (string) id - Optional custom ID for the file. If not provided, a UUID will be generated.
    *    Example - "custom-id-123"
 * @property (string) name - Name to assign to the file. If not provided, the original filename will be used.
    *    Example - "custom-filename.png"
 * @property (Record<string, unknown>) metadata - Custom metadata to associate with the file.
    *    Example - {"alt":"Custom image","category":"document"}*/
export interface UploadFileMetadata {
  /**
   * Optional custom ID for the file. If not provided, a UUID will be generated.
    *    Example - "custom-id-123"
   */
  id?: string,
  /**
   * Name to assign to the file. If not provided, the original filename will be used.
    *    Example - "custom-filename.png"
   */
  name?: string,
  /**
   * Custom metadata to associate with the file.
    *    Example - {"alt":"Custom image","category":"document"}
   */
  metadata?: Record<string, unknown>,
};


/**
 * Metadata that can be updated for an existing file.
 * @property (string) name - New name to assign to the file.
    *    Example - "renamed-file.jpg"
 * @property (Record<string, unknown>) metadata - Updated custom metadata to associate with the file.
    *    Example - {"alt":"Updated image description","category":"profile"}*/
export interface UpdateFileMetadata {
  /**
   * New name to assign to the file.
    *    Example - "renamed-file.jpg"
   */
  name?: string,
  /**
   * Updated custom metadata to associate with the file.
    *    Example - {"alt":"Updated image description","category":"profile"}
   */
  metadata?: Record<string, unknown>,
};


/**
 * Error details.
 * @property (string) message - Human-readable error message.
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
 * @property (ErrorResponseError) error - Error details.*/
export interface ErrorResponse {
  /**
   * Error details.
   */
  error?: ErrorResponseError,
};


/**
 * Request to refresh an access token
 * @property (string) refreshToken - Refresh token used to generate a new access token
    *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b*/
export interface RefreshTokenRequest {
  /**
   * Refresh token used to generate a new access token
    *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string,
};


/**
 * User authentication session containing tokens and user information
 * @property (string) accessToken - JWT token for authenticating API requests
    *    Example - "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * @property (number) accessTokenExpiresIn - Expiration time of the access token in seconds
    *    Example - 900
    *    Format - int64
 * @property (string) refreshTokenId - Identifier for the refresh token
    *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property (string) refreshToken - Token used to refresh the access token
    *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property (User) user - User profile and account information*/
export interface Session {
  /**
   * JWT token for authenticating API requests
    *    Example - "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string,
  /**
   * Expiration time of the access token in seconds
    *    Example - 900
    *    Format - int64
   */
  accessTokenExpiresIn: number,
  /**
   * Identifier for the refresh token
    *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshTokenId: string,
  /**
   * Token used to refresh the access token
    *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  refreshToken: string,
  /**
   * User profile and account information
   */
  user?: User,
};


/**
 * User profile and account information
 * @property (string) avatarUrl - URL to the user's profile picture
    *    Example - "https://myapp.com/avatars/user123.jpg"
 * @property (string) createdAt - Timestamp when the user account was created
    *    Example - "2023-01-15T12:34:56Z"
    *    Format - date-time
 * @property (string) defaultRole - Default authorization role for the user
    *    Example - "user"
 * @property (string) displayName - User's display name
    *    Example - "John Smith"
 * @property (string) email - User's email address
    *    Example - "john.smith@nhost.io"
    *    Format - email
 * @property (boolean) emailVerified - Whether the user's email has been verified
    *    Example - true
 * @property (string) id - Unique identifier for the user
    *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
 * @property (boolean) isAnonymous - Whether this is an anonymous user account
    *    Example - false
 * @property (string) locale - User's preferred locale (language code)
    *    Example - "en"
    *    MinLength - 2
    *    MaxLength - 2
 * @property (Record<string, unknown>) metadata - Custom metadata associated with the user
    *    Example - {"firstName":"John","lastName":"Smith"}
 * @property (string) phoneNumber - User's phone number
    *    Example - "+12025550123"
 * @property (boolean) phoneNumberVerified - Whether the user's phone number has been verified
    *    Example - false
 * @property (string[]) roles - List of roles assigned to the user
    *    Example - ["user","customer"]*/
export interface User {
  /**
   * URL to the user's profile picture
    *    Example - "https://myapp.com/avatars/user123.jpg"
   */
  avatarUrl: string,
  /**
   * Timestamp when the user account was created
    *    Example - "2023-01-15T12:34:56Z"
    *    Format - date-time
   */
  createdAt: string,
  /**
   * Default authorization role for the user
    *    Example - "user"
   */
  defaultRole: string,
  /**
   * User's display name
    *    Example - "John Smith"
   */
  displayName: string,
  /**
   * User's email address
    *    Example - "john.smith@nhost.io"
    *    Format - email
   */
  email?: string,
  /**
   * Whether the user's email has been verified
    *    Example - true
   */
  emailVerified: boolean,
  /**
   * Unique identifier for the user
    *    Example - "2c35b6f3-c4b9-48e3-978a-d4d0f1d42e24"
    *    Pattern - \b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b
   */
  id: string,
  /**
   * Whether this is an anonymous user account
    *    Example - false
   */
  isAnonymous: boolean,
  /**
   * User's preferred locale (language code)
    *    Example - "en"
    *    MinLength - 2
    *    MaxLength - 2
   */
  locale: string,
  /**
   * Custom metadata associated with the user
    *    Example - {"firstName":"John","lastName":"Smith"}
   */
  metadata: Record<string, unknown>,
  /**
   * User's phone number
    *    Example - "+12025550123"
   */
  phoneNumber?: string,
  /**
   * Whether the user's phone number has been verified
    *    Example - false
   */
  phoneNumberVerified: boolean,
  /**
   * List of roles assigned to the user
    *    Example - ["user","customer"]
   */
  roles: string[],
};


/**
 * Unique identifier of the file
 */
export type FileId = string;


/**
 * Only return the file if the current ETag matches one of the values provided
 */
export type IfMatch = string;


/**
 * Only return the file if the current ETag does not match any of the values provided
 */
export type IfNoneMatch = string;


/**
 * Only return the file if it has been modified after the given date
 */
export type IfModifiedSince = string;


/**
 * Only return the file if it has not been modified after the given date
 */
export type IfUnmodifiedSince = string;


/**
 * Image quality (1-100). Only applies to JPEG, WebP and PNG files
 */
export type ImageQuality = number;


/**
 * Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
 */
export type MaxHeight = number;


/**
 * Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
 */
export type MaxWidth = number;


/**
 * Blur the image using this sigma value. Only applies to image files
 */
export type BlurSigma = number;


/**
 * Format to convert the image to. If 'auto', the format is determined based on the Accept header.
 */
export type OutputFormat = "auto" | "same" | "jpeg" | "webp" | "png" | "avif";


/**
 * 
 * @property (string) "bucket-id" - Target bucket identifier where files will be stored.
    *    Example - "user-uploads"
 * @property (FileMetadata[]) "metadata[]" - Optional custom metadata for each uploaded file. Must match the order of the file[] array.
 * @property (Blob[]) "file[]" - Array of files to upload.*/
export interface UploadFilesBody {
  /**
   * Target bucket identifier where files will be stored.
    *    Example - "user-uploads"
   */
  "bucket-id"?: string,
  /**
   * Optional custom metadata for each uploaded file. Must match the order of the file[] array.
   */
  "metadata[]"?: FileMetadata[],
  /**
   * Array of files to upload.
   */
  "file[]": Blob[],
};


/**
 * 
 * @property (FileMetadata[]) processedFiles - List of successfully processed files with their metadata.*/
export interface UploadFilesResponse201 {
  /**
   * List of successfully processed files with their metadata.
   */
  processedFiles?: FileMetadata[],
};


/**
 * 
 * @property (UpdateFileMetadata) metadata - Metadata that can be updated for an existing file.
 * @property (Blob) file - New file content to replace the existing file
    *    Format - binary*/
export interface ReplaceFileBody {
  /**
   * Metadata that can be updated for an existing file.
   */
  metadata?: UpdateFileMetadata,
  /**
   * New file content to replace the existing file
    *    Format - binary
   */
  file: Blob,
};

/**
 * Parameters for the getFileMetadataHeaders method.
    * @param q - 
    *    Image quality (1-100). Only applies to JPEG, WebP and PNG files
    * @param h - 
    *    Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
    * @param w - 
    *    Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
    * @param b - 
    *    Blur the image using this sigma value. Only applies to image files
    * @param f - 
    *    Format to convert the image to. If 'auto', the format is determined based on the Accept header.*/
export interface GetFileMetadataHeadersParams {
  /**
   * 
    *    Image quality (1-100). Only applies to JPEG, WebP and PNG files
   */
  q: ImageQuality;
  /**
   * 
    *    Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
   */
  h: MaxHeight;
  /**
   * 
    *    Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
   */
  w: MaxWidth;
  /**
   * 
    *    Blur the image using this sigma value. Only applies to image files
   */
  b: BlurSigma;
  /**
   * 
    *    Format to convert the image to. If 'auto', the format is determined based on the Accept header.
   */
  f: OutputFormat;
}
/**
 * Parameters for the getFile method.
    * @param q - 
    *    Image quality (1-100). Only applies to JPEG, WebP and PNG files
    * @param h - 
    *    Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
    * @param w - 
    *    Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
    * @param b - 
    *    Blur the image using this sigma value. Only applies to image files
    * @param f - 
    *    Format to convert the image to. If 'auto', the format is determined based on the Accept header.*/
export interface GetFileParams {
  /**
   * 
    *    Image quality (1-100). Only applies to JPEG, WebP and PNG files
   */
  q: ImageQuality;
  /**
   * 
    *    Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
   */
  h: MaxHeight;
  /**
   * 
    *    Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
   */
  w: MaxWidth;
  /**
   * 
    *    Blur the image using this sigma value. Only applies to image files
   */
  b: BlurSigma;
  /**
   * 
    *    Format to convert the image to. If 'auto', the format is determined based on the Accept header.
   */
  f: OutputFormat;
}


export interface Client {
  refreshToken(
    body: RefreshTokenRequest,
    options?: RequestInit,
  ): Promise<Session>;

  uploadFiles(
    body: UploadFilesBody,
    options?: RequestInit,
  ): Promise<UploadFilesResponse201>;

  getFileMetadataHeaders(
    id: FileId,
    params?: GetFileMetadataHeadersParams,
    options?: RequestInit,
  ): Promise<void>;

  getFile(
    id: FileId,
    params?: GetFileParams,
    options?: RequestInit,
  ): Promise<Blob | void>;

  replaceFile(
    id: FileId,
    body?: ReplaceFileBody,
    options?: RequestInit,
  ): Promise<FileMetadata>;

  deleteFile(
    id: FileId,
    options?: RequestInit,
  ): Promise<void>;
};
