-- | This file is auto-generated. Do not edit manually.
module Storage.Client where

import Prelude

import Data.Generic.Rep (class Generic)
import Data.Show.Generic (genericShow)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.:), (.:?))
import Data.Argonaut.Encode (class EncodeJson, encodeJson, (:=), (~>))
import Data.Maybe (Maybe)
import Data.Either (Either)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff, throwError)
import Effect.Class (liftEffect)
import Foreign.Object (Object)
import Web.File.Blob (Blob)
import Data.Argonaut.Parser (jsonParser)

-- | Date in RFC 2822 format
type RFC2822Date = String
-- | Error details.
-- |
-- | * `message`: `String` -
-- | Human-readable error message.
-- | Example: `"File not found"`
-- | * `data_` (Optional): `Object` -
-- | Additional data related to the error, if any.
type ErrorResponseError =
  { message :: String --
  -- | Human-readable error message.
  -- | Example: `"File not found"`
  , data_ :: Maybe (Object) --
  -- | Additional data related to the error, if any.
  }

-- JSON instances for ErrorResponseError
instance encodeJsonErrorResponseError :: EncodeJson ErrorResponseError where
  encodeJson record =
    "message" := record.message
      ~> "data_" := record.data_
      ~> jsonEmptyObject

instance decodeJsonErrorResponseError :: DecodeJson ErrorResponseError where
  decodeJson json = do
    obj <- decodeJson json
    message <- obj .: "message"
    data_ <- obj .:? "data_"
    pure { message, data_ }

-- | Error information returned by the API.
-- |
-- | * `error` (Optional): `ErrorResponseError` -
-- | Error details.
type ErrorResponse =
  { error :: Maybe (ErrorResponseError) --
  -- | Error details.
  }

-- JSON instances for ErrorResponse
instance encodeJsonErrorResponse :: EncodeJson ErrorResponse where
  encodeJson record =
    "error" := record.error
      ~> jsonEmptyObject

instance decodeJsonErrorResponse :: DecodeJson ErrorResponse where
  decodeJson json = do
    obj <- decodeJson json
    error <- obj .:? "error"
    pure { error }

-- | Error details.
-- |
-- | * `message`: `String` -
-- | Human-readable error message.
-- | Example: `"File not found"`
-- | * `data_` (Optional): `Object` -
-- | Additional data related to the error, if any.
type ErrorResponseWithProcessedFilesError =
  { message :: String --
  -- | Human-readable error message.
  -- | Example: `"File not found"`
  , data_ :: Maybe (Object) --
  -- | Additional data related to the error, if any.
  }

-- JSON instances for ErrorResponseWithProcessedFilesError
instance encodeJsonErrorResponseWithProcessedFilesError :: EncodeJson ErrorResponseWithProcessedFilesError where
  encodeJson record =
    "message" := record.message
      ~> "data_" := record.data_
      ~> jsonEmptyObject

instance decodeJsonErrorResponseWithProcessedFilesError :: DecodeJson ErrorResponseWithProcessedFilesError where
  decodeJson json = do
    obj <- decodeJson json
    message <- obj .: "message"
    data_ <- obj .:? "data_"
    pure { message, data_ }

-- | Error information returned by the API.
-- |
-- | * `processedfiles` (Optional): `Array FileMetadata` -
-- | List of files that were successfully processed before the error occurred.
-- | * `error` (Optional): `ErrorResponseWithProcessedFilesError` -
-- | Error details.
type ErrorResponseWithProcessedFiles =
  { processedfiles :: Maybe (Array FileMetadata) --
  -- | List of files that were successfully processed before the error occurred.
  , error :: Maybe (ErrorResponseWithProcessedFilesError) --
  -- | Error details.
  }

-- JSON instances for ErrorResponseWithProcessedFiles
instance encodeJsonErrorResponseWithProcessedFiles :: EncodeJson ErrorResponseWithProcessedFiles where
  encodeJson record =
    "processedfiles" := record.processedfiles
      ~> "error" := record.error
      ~> jsonEmptyObject

instance decodeJsonErrorResponseWithProcessedFiles :: DecodeJson ErrorResponseWithProcessedFiles where
  decodeJson json = do
    obj <- decodeJson json
    processedfiles <- obj .:? "processedfiles"
    error <- obj .:? "error"
    pure { processedfiles, error }

-- | Comprehensive metadata information about a file in storage.
-- |
-- | * `id`: `String` -
-- | Unique identifier for the file.
-- | Example: `"d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"`
-- | * `name`: `String` -
-- | Name of the file including extension.
-- | Example: `"profile-picture.jpg"`
-- | * `size`: `Int` -
-- | Size of the file in bytes.
-- | Example: `245678`
-- | Format: int64
-- | * `bucketid`: `String` -
-- | ID of the bucket containing the file.
-- | Example: `"users-bucket"`
-- | * `etag`: `String` -
-- | Entity tag for cache validation.
-- | Example: `"\"a1b2c3d4e5f6\""`
-- | * `createdat`: `String` -
-- | Timestamp when the file was created.
-- | Example: `"2023-01-15T12:34:56Z"`
-- | Format: date-time
-- | * `updatedat`: `String` -
-- | Timestamp when the file was last updated.
-- | Example: `"2023-01-16T09:45:32Z"`
-- | Format: date-time
-- | * `isuploaded`: `Boolean` -
-- | Whether the file has been successfully uploaded.
-- | Example: `true`
-- | * `mimetype`: `String` -
-- | MIME type of the file.
-- | Example: `"image/jpeg"`
-- | * `uploadedbyuserid` (Optional): `String` -
-- | ID of the user who uploaded the file.
-- | Example: `"abc123def456"`
-- | * `metadata` (Optional): `Object` -
-- | Custom metadata associated with the file.
-- | Example: `{"alt":"Profile picture","category":"avatar"}`
type FileMetadata =
  { id :: String --
  -- | Unique identifier for the file.
  -- | Example: `"d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"`
  , name :: String --
  -- | Name of the file including extension.
  -- | Example: `"profile-picture.jpg"`
  , size :: Int --
  -- | Size of the file in bytes.
  -- | Example: `245678`
  -- | Format: int64
  , bucketid :: String --
  -- | ID of the bucket containing the file.
  -- | Example: `"users-bucket"`
  , etag :: String --
  -- | Entity tag for cache validation.
  -- | Example: `"\"a1b2c3d4e5f6\""`
  , createdat :: String --
  -- | Timestamp when the file was created.
  -- | Example: `"2023-01-15T12:34:56Z"`
  -- | Format: date-time
  , updatedat :: String --
  -- | Timestamp when the file was last updated.
  -- | Example: `"2023-01-16T09:45:32Z"`
  -- | Format: date-time
  , isuploaded :: Boolean --
  -- | Whether the file has been successfully uploaded.
  -- | Example: `true`
  , mimetype :: String --
  -- | MIME type of the file.
  -- | Example: `"image/jpeg"`
  , uploadedbyuserid :: Maybe (String) --
  -- | ID of the user who uploaded the file.
  -- | Example: `"abc123def456"`
  , metadata :: Maybe (Object) --
  -- | Custom metadata associated with the file.
  -- | Example: `{"alt":"Profile picture","category":"avatar"}`
  }

-- JSON instances for FileMetadata
instance encodeJsonFileMetadata :: EncodeJson FileMetadata where
  encodeJson record =
    "id" := record.id
      ~> "name" := record.name

      ~> "size" := record.size

      ~> "bucketid" := record.bucketid

      ~> "etag" := record.etag

      ~> "createdat" := record.createdat

      ~> "updatedat" := record.updatedat

      ~> "isuploaded" := record.isuploaded

      ~> "mimetype" := record.mimetype

      ~> "uploadedbyuserid" := record.uploadedbyuserid

      ~> "metadata" := record.metadata
      ~> jsonEmptyObject

instance decodeJsonFileMetadata :: DecodeJson FileMetadata where
  decodeJson json = do
    obj <- decodeJson json
    id <- obj .: "id"
    name <- obj .: "name"
    size <- obj .: "size"
    bucketid <- obj .: "bucketid"
    etag <- obj .: "etag"
    createdat <- obj .: "createdat"
    updatedat <- obj .: "updatedat"
    isuploaded <- obj .: "isuploaded"
    mimetype <- obj .: "mimetype"
    uploadedbyuserid <- obj .:? "uploadedbyuserid"
    metadata <- obj .:? "metadata"
    pure { id, name, size, bucketid, etag, createdat, updatedat, isuploaded, mimetype, uploadedbyuserid, metadata }

-- | Basic information about a file in storage.
-- |
-- | * `id`: `String` -
-- | Unique identifier for the file.
-- | Example: `"d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"`
-- | * `name`: `String` -
-- | Name of the file including extension.
-- | Example: `"profile-picture.jpg"`
-- | * `bucketid`: `String` -
-- | ID of the bucket containing the file.
-- | Example: `"users-bucket"`
-- | * `isuploaded`: `Boolean` -
-- | Whether the file has been successfully uploaded.
-- | Example: `true`
type FileSummary =
  { id :: String --
  -- | Unique identifier for the file.
  -- | Example: `"d5e76ceb-77a2-4153-b7da-1f7c115b2ff2"`
  , name :: String --
  -- | Name of the file including extension.
  -- | Example: `"profile-picture.jpg"`
  , bucketid :: String --
  -- | ID of the bucket containing the file.
  -- | Example: `"users-bucket"`
  , isuploaded :: Boolean --
  -- | Whether the file has been successfully uploaded.
  -- | Example: `true`
  }

-- JSON instances for FileSummary
instance encodeJsonFileSummary :: EncodeJson FileSummary where
  encodeJson record =
    "id" := record.id
      ~> "name" := record.name

      ~> "bucketid" := record.bucketid

      ~> "isuploaded" := record.isuploaded
      ~> jsonEmptyObject

instance decodeJsonFileSummary :: DecodeJson FileSummary where
  decodeJson json = do
    obj <- decodeJson json
    id <- obj .: "id"
    name <- obj .: "name"
    bucketid <- obj .: "bucketid"
    isuploaded <- obj .: "isuploaded"
    pure { id, name, bucketid, isuploaded }

-- | Contains a presigned URL for direct file operations.
-- |
-- | * `url`: `String` -
-- | The presigned URL for file operations.
-- | Example: `"https://storage.example.com/files/abc123?signature=xyz"`
-- | * `expiration`: `Int` -
-- | The time in seconds until the URL expires.
-- | Example: `3600`
type PresignedURLResponse =
  { url :: String --
  -- | The presigned URL for file operations.
  -- | Example: `"https://storage.example.com/files/abc123?signature=xyz"`
  , expiration :: Int --
  -- | The time in seconds until the URL expires.
  -- | Example: `3600`
  }

-- JSON instances for PresignedURLResponse
instance encodeJsonPresignedURLResponse :: EncodeJson PresignedURLResponse where
  encodeJson record =
    "url" := record.url
      ~> "expiration" := record.expiration
      ~> jsonEmptyObject

instance decodeJsonPresignedURLResponse :: DecodeJson PresignedURLResponse where
  decodeJson json = do
    obj <- decodeJson json
    url <- obj .: "url"
    expiration <- obj .: "expiration"
    pure { url, expiration }

-- | Metadata that can be updated for an existing file.
-- |
-- | * `name` (Optional): `String` -
-- | New name to assign to the file.
-- | Example: `"renamed-file.jpg"`
-- | * `metadata` (Optional): `Object` -
-- | Updated custom metadata to associate with the file.
-- | Example: `{"alt":"Updated image description","category":"profile"}`
type UpdateFileMetadata =
  { name :: Maybe (String) --
  -- | New name to assign to the file.
  -- | Example: `"renamed-file.jpg"`
  , metadata :: Maybe (Object) --
  -- | Updated custom metadata to associate with the file.
  -- | Example: `{"alt":"Updated image description","category":"profile"}`
  }

-- JSON instances for UpdateFileMetadata
instance encodeJsonUpdateFileMetadata :: EncodeJson UpdateFileMetadata where
  encodeJson record =
    "name" := record.name
      ~> "metadata" := record.metadata
      ~> jsonEmptyObject

instance decodeJsonUpdateFileMetadata :: DecodeJson UpdateFileMetadata where
  decodeJson json = do
    obj <- decodeJson json
    name <- obj .:? "name"
    metadata <- obj .:? "metadata"
    pure { name, metadata }

-- | Metadata provided when uploading a new file.
-- |
-- | * `id` (Optional): `String` -
-- | Optional custom ID for the file. If not provided, a UUID will be generated.
-- | Example: `"custom-id-123"`
-- | * `name` (Optional): `String` -
-- | Name to assign to the file. If not provided, the original filename will be used.
-- | Example: `"custom-filename.png"`
-- | * `metadata` (Optional): `Object` -
-- | Custom metadata to associate with the file.
-- | Example: `{"alt":"Custom image","category":"document"}`
type UploadFileMetadata =
  { id :: Maybe (String) --
  -- | Optional custom ID for the file. If not provided, a UUID will be generated.
  -- | Example: `"custom-id-123"`
  , name :: Maybe (String) --
  -- | Name to assign to the file. If not provided, the original filename will be used.
  -- | Example: `"custom-filename.png"`
  , metadata :: Maybe (Object) --
  -- | Custom metadata to associate with the file.
  -- | Example: `{"alt":"Custom image","category":"document"}`
  }

-- JSON instances for UploadFileMetadata
instance encodeJsonUploadFileMetadata :: EncodeJson UploadFileMetadata where
  encodeJson record =
    "id" := record.id
      ~> "name" := record.name

      ~> "metadata" := record.metadata
      ~> jsonEmptyObject

instance decodeJsonUploadFileMetadata :: DecodeJson UploadFileMetadata where
  decodeJson json = do
    obj <- decodeJson json
    id <- obj .:? "id"
    name <- obj .:? "name"
    metadata <- obj .:? "metadata"
    pure { id, name, metadata }

-- | Contains version information about the storage service.
-- |
-- | * `buildversion`: `String` -
-- | The version number of the storage service build.
-- | Example: `"1.2.3"`
type VersionInformation =
  { buildversion :: String --
  -- | The version number of the storage service build.
  -- | Example: `"1.2.3"`
  }

-- JSON instances for VersionInformation
instance encodeJsonVersionInformation :: EncodeJson VersionInformation where
  encodeJson record =
    "buildversion" := record.buildversion
      ~> jsonEmptyObject

instance decodeJsonVersionInformation :: DecodeJson VersionInformation where
  decodeJson json = do
    obj <- decodeJson json
    buildversion <- obj .: "buildversion"
    pure { buildversion }

-- | Output format for image files. Use 'auto' for content negotiation based on Accept header
data OutputImageFormat
  = Auto
  | Same
  | Jpeg
  | Webp
  | Png
  | Avif

derive instance genericOutputImageFormat :: Generic OutputImageFormat _
derive instance eqOutputImageFormat :: Eq OutputImageFormat
derive instance ordOutputImageFormat :: Ord OutputImageFormat

instance showOutputImageFormat :: Show OutputImageFormat where
  show = genericShow

instance encodeJsonOutputImageFormat :: EncodeJson OutputImageFormat where
  encodeJson = case _ of
    Auto -> encodeJson "Auto"
    Same -> encodeJson "Same"
    Jpeg -> encodeJson "Jpeg"
    Webp -> encodeJson "Webp"
    Png -> encodeJson "Png"
    Avif -> encodeJson "Avif"

instance decodeJsonOutputImageFormat :: DecodeJson OutputImageFormat where
  decodeJson json = do
    str <- decodeJson json
    case str of
      "Auto" -> pure Auto
      "Same" -> pure Same
      "Jpeg" -> pure Jpeg
      "Webp" -> pure Webp
      "Png" -> pure Png
      "Avif" -> pure Avif
      _ -> Left $ "Invalid OutputImageFormat: " <> str

-- |
-- |
-- | * `bucketid` (Optional): `String` -
-- | Target bucket identifier where files will be stored.
-- | Example: `"user-uploads"`
-- | * `metadataarray` (Optional): `Array UploadFileMetadata` -
-- | Optional custom metadata for each uploaded file. Must match the order of the file[] array.
-- | * `filearray`: `Array Blob` -
-- | Array of files to upload.
type UploadFilesBody =
  { bucketid :: Maybe (String) --
  -- | Target bucket identifier where files will be stored.
  -- | Example: `"user-uploads"`
  , metadataarray :: Maybe (Array UploadFileMetadata) --
  -- | Optional custom metadata for each uploaded file. Must match the order of the file[] array.
  , filearray :: Array Blob --
  -- | Array of files to upload.
  }

-- JSON instances for UploadFilesBody
instance encodeJsonUploadFilesBody :: EncodeJson UploadFilesBody where
  encodeJson record =
    "bucketId" := record.bucketid
      ~> "metadataArray" := record.metadataarray

      ~> "fileArray" := record.filearray
      ~> jsonEmptyObject

instance decodeJsonUploadFilesBody :: DecodeJson UploadFilesBody where
  decodeJson json = do
    obj <- decodeJson json
    bucketid <- obj .:? "bucketId"
    metadataarray <- obj .:? "metadataArray"
    filearray <- obj .: "fileArray"
    pure { bucketid, metadataarray, filearray }

-- |
-- |
-- | * `processedfiles`: `Array FileMetadata` -
-- | List of successfully processed files with their metadata.
type UploadFilesResponse201 =
  { processedfiles :: Array FileMetadata --
  -- | List of successfully processed files with their metadata.
  }

-- JSON instances for UploadFilesResponse201
instance encodeJsonUploadFilesResponse201 :: EncodeJson UploadFilesResponse201 where
  encodeJson record =
    "processedfiles" := record.processedfiles
      ~> jsonEmptyObject

instance decodeJsonUploadFilesResponse201 :: DecodeJson UploadFilesResponse201 where
  decodeJson json = do
    obj <- decodeJson json
    processedfiles <- obj .: "processedfiles"
    pure { processedfiles }

-- |
-- |
-- | * `metadata` (Optional): `UpdateFileMetadata` -
-- | Metadata that can be updated for an existing file.
-- | * `file` (Optional): `Blob` -
-- | New file content to replace the existing file
-- | Format: binary
type ReplaceFileBody =
  { metadata :: Maybe (UpdateFileMetadata) --
  -- | Metadata that can be updated for an existing file.
  , file :: Maybe (Blob) --
  -- | New file content to replace the existing file
  -- | Format: binary
  }

-- JSON instances for ReplaceFileBody
instance encodeJsonReplaceFileBody :: EncodeJson ReplaceFileBody where
  encodeJson record =
    "metadata" := record.metadata
      ~> "file" := record.file
      ~> jsonEmptyObject

instance decodeJsonReplaceFileBody :: DecodeJson ReplaceFileBody where
  decodeJson json = do
    obj <- decodeJson json
    metadata <- obj .:? "metadata"
    file <- obj .:? "file"
    pure { metadata, file }

-- |
-- |
-- | * `metadata` (Optional): `Array FileSummary` -
type DeleteBrokenMetadataResponse200 =
  { metadata :: Maybe (Array FileSummary) --
  }

-- JSON instances for DeleteBrokenMetadataResponse200
instance encodeJsonDeleteBrokenMetadataResponse200 :: EncodeJson DeleteBrokenMetadataResponse200 where
  encodeJson record =
    "metadata" := record.metadata
      ~> jsonEmptyObject

instance decodeJsonDeleteBrokenMetadataResponse200 :: DecodeJson DeleteBrokenMetadataResponse200 where
  decodeJson json = do
    obj <- decodeJson json
    metadata <- obj .:? "metadata"
    pure { metadata }

-- |
-- |
-- | * `files` (Optional): `Array String` -
type DeleteOrphanedFilesResponse200 =
  { files :: Maybe (Array String) --
  }

-- JSON instances for DeleteOrphanedFilesResponse200
instance encodeJsonDeleteOrphanedFilesResponse200 :: EncodeJson DeleteOrphanedFilesResponse200 where
  encodeJson record =
    "files" := record.files
      ~> jsonEmptyObject

instance decodeJsonDeleteOrphanedFilesResponse200 :: DecodeJson DeleteOrphanedFilesResponse200 where
  decodeJson json = do
    obj <- decodeJson json
    files <- obj .:? "files"
    pure { files }

-- |
-- |
-- | * `metadata` (Optional): `Array FileSummary` -
type ListBrokenMetadataResponse200 =
  { metadata :: Maybe (Array FileSummary) --
  }

-- JSON instances for ListBrokenMetadataResponse200
instance encodeJsonListBrokenMetadataResponse200 :: EncodeJson ListBrokenMetadataResponse200 where
  encodeJson record =
    "metadata" := record.metadata
      ~> jsonEmptyObject

instance decodeJsonListBrokenMetadataResponse200 :: DecodeJson ListBrokenMetadataResponse200 where
  decodeJson json = do
    obj <- decodeJson json
    metadata <- obj .:? "metadata"
    pure { metadata }

-- |
-- |
-- | * `metadata` (Optional): `Array FileSummary` -
type ListFilesNotUploadedResponse200 =
  { metadata :: Maybe (Array FileSummary) --
  }

-- JSON instances for ListFilesNotUploadedResponse200
instance encodeJsonListFilesNotUploadedResponse200 :: EncodeJson ListFilesNotUploadedResponse200 where
  encodeJson record =
    "metadata" := record.metadata
      ~> jsonEmptyObject

instance decodeJsonListFilesNotUploadedResponse200 :: DecodeJson ListFilesNotUploadedResponse200 where
  decodeJson json = do
    obj <- decodeJson json
    metadata <- obj .:? "metadata"
    pure { metadata }

-- |
-- |
-- | * `files` (Optional): `Array String` -
type ListOrphanedFilesResponse200 =
  { files :: Maybe (Array String) --
  }

-- JSON instances for ListOrphanedFilesResponse200
instance encodeJsonListOrphanedFilesResponse200 :: EncodeJson ListOrphanedFilesResponse200 where
  encodeJson record =
    "files" := record.files
      ~> jsonEmptyObject

instance decodeJsonListOrphanedFilesResponse200 :: DecodeJson ListOrphanedFilesResponse200 where
  decodeJson json = do
    obj <- decodeJson json
    files <- obj .:? "files"
    pure { files }

-- | Parameters for the getFile method.
type GetFileParams =
  { q :: Maybe Int -- Image quality (1-100). Only applies to JPEG, WebP and PNG files
  , h :: Maybe Int -- Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
  , w :: Maybe Int -- Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
  , b :: Maybe Number -- Blur the image using this sigma value. Only applies to image files
  , f :: Maybe OutputImageFormat -- Output format for image files. Use 'auto' for content negotiation based on Accept header
  }

-- | Parameters for the getFileMetadataHeaders method.
type GetFileMetadataHeadersParams =
  { q :: Maybe Int -- Image quality (1-100). Only applies to JPEG, WebP and PNG files
  , h :: Maybe Int -- Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
  , w :: Maybe Int -- Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
  , b :: Maybe Number -- Blur the image using this sigma value. Only applies to image files
  , f :: Maybe OutputImageFormat -- Output format for image files. Use 'auto' for content negotiation based on Accept header
  }

-- | API Client type
-- uploadFiles :: UploadFilesBody -> Aff (FetchResponse UploadFilesResponse201)
-- deleteFile :: String -> Aff (FetchResponse void)
-- getFile :: String -> Maybe GetFileParams -> Aff (FetchResponse Blob)
-- getFileMetadataHeaders :: String -> Maybe GetFileMetadataHeadersParams -> Aff (FetchResponse void)
-- replaceFile :: String -> ReplaceFileBody -> Aff (FetchResponse FileMetadata)
-- getFilePresignedURL :: String -> Aff (FetchResponse PresignedURLResponse)
-- deleteBrokenMetadata :: Aff (FetchResponse DeleteBrokenMetadataResponse200)
-- deleteOrphanedFiles :: Aff (FetchResponse DeleteOrphanedFilesResponse200)
-- listBrokenMetadata :: Aff (FetchResponse ListBrokenMetadataResponse200)
-- listFilesNotUploaded :: Aff (FetchResponse ListFilesNotUploadedResponse200)
-- listOrphanedFiles :: Aff (FetchResponse ListOrphanedFilesResponse200)
-- getVersion :: Aff (FetchResponse VersionInformation)
