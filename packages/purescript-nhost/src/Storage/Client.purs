-- | This file is auto-generated. Do not edit manually.
module Storage.Client where

import Prelude

import Data.Generic.Rep (class Generic)
import Data.Show.Generic (genericShow)
import Data.Maybe (Maybe(..))
import Data.Either (Either(..))
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff, throwError)
import Effect.Class (liftEffect)
import Foreign.Object (Object)
import Web.File.Blob (Blob)
import JSON as J
import JSON.Object as JO
import Data.Codec.JSON.Common as CJ
import Data.Codec.JSON.Record as CJR
import Data.Codec.JSON.Strict as CJS
import Data.Newtype (class Newtype, unwrap, wrap)
import Data.Profunctor (dimap)

-- | Date in RFC 2822 format
newtype RFC2822Date = RFC2822Date String

derive instance Newtype RFC2822Date _
derive instance Generic RFC2822Date _
derive instance Eq RFC2822Date

instance Show RFC2822Date where
  show x = genericShow x

rFC2822DateCodec :: CJ.Codec RFC2822Date
rFC2822DateCodec = dimap unwrap wrap CJ.string

-- | Error details.
-- |
-- | * `Message`: `String` - Human-readable error message.
-- | * `Data` (Optional): `Maybe J.JObject` - Additional data related to the error, if any.
type ErrorResponseError =
  { "message" :: String -- Human-readable error message.
  , "data" :: Maybe J.JObject -- Additional data related to the error, if any.
  }

errorResponseErrorCodec :: CJ.Codec ErrorResponseError
errorResponseErrorCodec =
  CJR.objectStrict
    { "message": CJ.string
    , "data": CJR.optional CJ.jobject
    }

-- | Error information returned by the API.
-- |
-- | * `Error` (Optional): `Maybe ErrorResponseError` - Error details.
type ErrorResponse =
  { "error" :: Maybe ErrorResponseError -- Error details.
  }

errorResponseCodec :: CJ.Codec ErrorResponse
errorResponseCodec =
  CJR.objectStrict
    { "error": CJR.optional errorResponseErrorCodec
    }

-- | Error details.
-- |
-- | * `Message`: `String` - Human-readable error message.
-- | * `Data` (Optional): `Maybe J.JObject` - Additional data related to the error, if any.
type ErrorResponseWithProcessedFilesError =
  { "message" :: String -- Human-readable error message.
  , "data" :: Maybe J.JObject -- Additional data related to the error, if any.
  }

errorResponseWithProcessedFilesErrorCodec :: CJ.Codec ErrorResponseWithProcessedFilesError
errorResponseWithProcessedFilesErrorCodec =
  CJR.objectStrict
    { "message": CJ.string
    , "data": CJR.optional CJ.jobject
    }

-- | Error information returned by the API.
-- |
-- | * `ProcessedFiles` (Optional): `Maybe (Array FileMetadata)` - List of files that were successfully processed before the error occurred.
-- | * `Error` (Optional): `Maybe ErrorResponseWithProcessedFilesError` - Error details.
type ErrorResponseWithProcessedFiles =
  { "processedFiles" :: Maybe (Array FileMetadata) -- List of files that were successfully processed before the error occurred.
  , "error" :: Maybe ErrorResponseWithProcessedFilesError -- Error details.
  }

errorResponseWithProcessedFilesCodec :: CJ.Codec ErrorResponseWithProcessedFiles
errorResponseWithProcessedFilesCodec =
  CJR.objectStrict
    { "processedFiles": CJR.optional (CJ.array fileMetadataCodec)
    , "error": CJR.optional errorResponseWithProcessedFilesErrorCodec
    }

-- | Comprehensive metadata information about a file in storage.
-- |
-- | * `Id`: `String` - Unique identifier for the file.
-- | * `Name`: `String` - Name of the file including extension.
-- | * `Size`: `Int` - Size of the file in bytes.
-- | * `BucketId`: `String` - ID of the bucket containing the file.
-- | * `Etag`: `String` - Entity tag for cache validation.
-- | * `CreatedAt`: `String` - Timestamp when the file was created.
-- | * `UpdatedAt`: `String` - Timestamp when the file was last updated.
-- | * `IsUploaded`: `Boolean` - Whether the file has been successfully uploaded.
-- | * `MimeType`: `String` - MIME type of the file.
-- | * `UploadedByUserId` (Optional): `Maybe String` - ID of the user who uploaded the file.
-- | * `Metadata` (Optional): `Maybe J.JObject` - Custom metadata associated with the file.
type FileMetadata =
  { "id" :: String -- Unique identifier for the file.
  , "name" :: String -- Name of the file including extension.
  , "size" :: Int -- Size of the file in bytes.
  , "bucketId" :: String -- ID of the bucket containing the file.
  , "etag" :: String -- Entity tag for cache validation.
  , "createdAt" :: String -- Timestamp when the file was created.
  , "updatedAt" :: String -- Timestamp when the file was last updated.
  , "isUploaded" :: Boolean -- Whether the file has been successfully uploaded.
  , "mimeType" :: String -- MIME type of the file.
  , "uploadedByUserId" :: Maybe String -- ID of the user who uploaded the file.
  , "metadata" :: Maybe J.JObject -- Custom metadata associated with the file.
  }

fileMetadataCodec :: CJ.Codec FileMetadata
fileMetadataCodec =
  CJR.objectStrict
    { "id": CJ.string
    , "name": CJ.string
    , "size": CJ.int
    , "bucketId": CJ.string
    , "etag": CJ.string
    , "createdAt": CJ.string
    , "updatedAt": CJ.string
    , "isUploaded": CJ.boolean
    , "mimeType": CJ.string
    , "uploadedByUserId": CJR.optional CJ.string
    , "metadata": CJR.optional CJ.jobject
    }

-- | Basic information about a file in storage.
-- |
-- | * `Id`: `String` - Unique identifier for the file.
-- | * `Name`: `String` - Name of the file including extension.
-- | * `BucketId`: `String` - ID of the bucket containing the file.
-- | * `IsUploaded`: `Boolean` - Whether the file has been successfully uploaded.
type FileSummary =
  { "id" :: String -- Unique identifier for the file.
  , "name" :: String -- Name of the file including extension.
  , "bucketId" :: String -- ID of the bucket containing the file.
  , "isUploaded" :: Boolean -- Whether the file has been successfully uploaded.
  }

fileSummaryCodec :: CJ.Codec FileSummary
fileSummaryCodec =
  CJR.objectStrict
    { "id": CJ.string
    , "name": CJ.string
    , "bucketId": CJ.string
    , "isUploaded": CJ.boolean
    }

-- | Contains a presigned URL for direct file operations.
-- |
-- | * `Url`: `String` - The presigned URL for file operations.
-- | * `Expiration`: `Int` - The time in seconds until the URL expires.
type PresignedURLResponse =
  { "url" :: String -- The presigned URL for file operations.
  , "expiration" :: Int -- The time in seconds until the URL expires.
  }

presignedURLResponseCodec :: CJ.Codec PresignedURLResponse
presignedURLResponseCodec =
  CJR.objectStrict
    { "url": CJ.string
    , "expiration": CJ.int
    }

-- | Metadata that can be updated for an existing file.
-- |
-- | * `Name` (Optional): `Maybe String` - New name to assign to the file.
-- | * `Metadata` (Optional): `Maybe J.JObject` - Updated custom metadata to associate with the file.
type UpdateFileMetadata =
  { "name" :: Maybe String -- New name to assign to the file.
  , "metadata" :: Maybe J.JObject -- Updated custom metadata to associate with the file.
  }

updateFileMetadataCodec :: CJ.Codec UpdateFileMetadata
updateFileMetadataCodec =
  CJR.objectStrict
    { "name": CJR.optional CJ.string
    , "metadata": CJR.optional CJ.jobject
    }

-- | Metadata provided when uploading a new file.
-- |
-- | * `Id` (Optional): `Maybe String` - Optional custom ID for the file. If not provided, a UUID will be generated.
-- | * `Name` (Optional): `Maybe String` - Name to assign to the file. If not provided, the original filename will be used.
-- | * `Metadata` (Optional): `Maybe J.JObject` - Custom metadata to associate with the file.
type UploadFileMetadata =
  { "id" :: Maybe String -- Optional custom ID for the file. If not provided, a UUID will be generated.
  , "name" :: Maybe String -- Name to assign to the file. If not provided, the original filename will be used.
  , "metadata" :: Maybe J.JObject -- Custom metadata to associate with the file.
  }

uploadFileMetadataCodec :: CJ.Codec UploadFileMetadata
uploadFileMetadataCodec =
  CJR.objectStrict
    { "id": CJR.optional CJ.string
    , "name": CJR.optional CJ.string
    , "metadata": CJR.optional CJ.jobject
    }

-- | Contains version information about the storage service.
-- |
-- | * `BuildVersion`: `String` - The version number of the storage service build.
type VersionInformation =
  { "buildVersion" :: String -- The version number of the storage service build.
  }

versionInformationCodec :: CJ.Codec VersionInformation
versionInformationCodec =
  CJR.objectStrict
    { "buildVersion": CJ.string
    }

-- | Output format for image files. Use 'auto' for content negotiation based on Accept header
data OutputImageFormat
  = OutputImageFormat_Auto
  | OutputImageFormat_Same
  | OutputImageFormat_Jpeg
  | OutputImageFormat_Webp
  | OutputImageFormat_Png
  | OutputImageFormat_Avif

derive instance genericOutputImageFormat :: Generic OutputImageFormat _
derive instance eqOutputImageFormat :: Eq OutputImageFormat
derive instance ordOutputImageFormat :: Ord OutputImageFormat

instance showOutputImageFormat :: Show OutputImageFormat where
  show = genericShow

outputImageFormatCodec :: CJ.Codec OutputImageFormat
outputImageFormatCodec = CJ.prismaticCodec "OutputImageFormat" dec enc CJ.string
  where
  dec = case _ of
    "Auto" -> Just OutputImageFormat_Auto
    "Same" -> Just OutputImageFormat_Same
    "Jpeg" -> Just OutputImageFormat_Jpeg
    "Webp" -> Just OutputImageFormat_Webp
    "Png" -> Just OutputImageFormat_Png
    "Avif" -> Just OutputImageFormat_Avif
    _ -> Nothing

  enc = case _ of
    OutputImageFormat_Auto -> "Auto"
    OutputImageFormat_Same -> "Same"
    OutputImageFormat_Jpeg -> "Jpeg"
    OutputImageFormat_Webp -> "Webp"
    OutputImageFormat_Png -> "Png"
    OutputImageFormat_Avif -> "Avif"

-- |
-- | * `BucketId` (Optional): `Maybe String` - Target bucket identifier where files will be stored.
-- | * `Metadata[]` (Optional): `Maybe (Array UploadFileMetadata)` - Optional custom metadata for each uploaded file. Must match the order of the file[] array.
-- | * `File[]`: `Array Blob` - Array of files to upload.
type UploadFilesBody =
  { "bucket-id" :: Maybe String -- Target bucket identifier where files will be stored.
  , "metadata[]" :: Maybe (Array UploadFileMetadata) -- Optional custom metadata for each uploaded file. Must match the order of the file[] array.
  , "file[]" :: Array Blob -- Array of files to upload.
  }

-- Codec not generated because this type contains Blob fields

-- |
-- | * `ProcessedFiles`: `Array FileMetadata` - List of successfully processed files with their metadata.
type UploadFilesResponse201 =
  { "processedFiles" :: Array FileMetadata -- List of successfully processed files with their metadata.
  }

uploadFilesResponse201Codec :: CJ.Codec UploadFilesResponse201
uploadFilesResponse201Codec =
  CJR.objectStrict
    { "processedFiles": (CJ.array fileMetadataCodec)
    }

-- |
-- | * `Metadata` (Optional): `Maybe UpdateFileMetadata` - Metadata that can be updated for an existing file.
-- | * `File` (Optional): `Maybe Blob` - New file content to replace the existing file
type ReplaceFileBody =
  { "metadata" :: Maybe UpdateFileMetadata -- Metadata that can be updated for an existing file.
  , "file" :: Maybe Blob -- New file content to replace the existing file
  }

-- Codec not generated because this type contains Blob fields

-- |
-- | * `Metadata` (Optional): `Maybe (Array FileSummary)`
type DeleteBrokenMetadataResponse200 =
  { "metadata" :: Maybe (Array FileSummary)
  }

deleteBrokenMetadataResponse200Codec :: CJ.Codec DeleteBrokenMetadataResponse200
deleteBrokenMetadataResponse200Codec =
  CJR.objectStrict
    { "metadata": CJR.optional (CJ.array fileSummaryCodec)
    }

-- |
-- | * `Files` (Optional): `Maybe (Array String)`
type DeleteOrphanedFilesResponse200 =
  { "files" :: Maybe (Array String)
  }

deleteOrphanedFilesResponse200Codec :: CJ.Codec DeleteOrphanedFilesResponse200
deleteOrphanedFilesResponse200Codec =
  CJR.objectStrict
    { "files": CJR.optional (CJ.array CJ.string)
    }

-- |
-- | * `Metadata` (Optional): `Maybe (Array FileSummary)`
type ListBrokenMetadataResponse200 =
  { "metadata" :: Maybe (Array FileSummary)
  }

listBrokenMetadataResponse200Codec :: CJ.Codec ListBrokenMetadataResponse200
listBrokenMetadataResponse200Codec =
  CJR.objectStrict
    { "metadata": CJR.optional (CJ.array fileSummaryCodec)
    }

-- |
-- | * `Metadata` (Optional): `Maybe (Array FileSummary)`
type ListFilesNotUploadedResponse200 =
  { "metadata" :: Maybe (Array FileSummary)
  }

listFilesNotUploadedResponse200Codec :: CJ.Codec ListFilesNotUploadedResponse200
listFilesNotUploadedResponse200Codec =
  CJR.objectStrict
    { "metadata": CJR.optional (CJ.array fileSummaryCodec)
    }

-- |
-- | * `Files` (Optional): `Maybe (Array String)`
type ListOrphanedFilesResponse200 =
  { "files" :: Maybe (Array String)
  }

listOrphanedFilesResponse200Codec :: CJ.Codec ListOrphanedFilesResponse200
listOrphanedFilesResponse200Codec =
  CJR.objectStrict
    { "files": CJR.optional (CJ.array CJ.string)
    }

-- | Parameters for the GetFile method.
type GetFileParams =
  { "q" :: Maybe Int -- Image quality (1-100). Only applies to JPEG, WebP and PNG files
  , "h" :: Maybe Int -- Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
  , "w" :: Maybe Int -- Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
  , "b" :: Maybe Number -- Blur the image using this sigma value. Only applies to image files
  , "f" :: Maybe OutputImageFormat -- Output format for image files. Use 'auto' for content negotiation based on Accept header
  }

getFileParamsCodec :: CJ.Codec GetFileParams
getFileParamsCodec =
  CJR.objectStrict
    { "q": CJ.maybe CJ.int
    , "h": CJ.maybe CJ.int
    , "w": CJ.maybe CJ.int
    , "b": CJ.maybe CJ.number
    , "f": CJ.maybe outputImageFormatCodec
    }

-- | Parameters for the GetFileMetadataHeaders method.
type GetFileMetadataHeadersParams =
  { "q" :: Maybe Int -- Image quality (1-100). Only applies to JPEG, WebP and PNG files
  , "h" :: Maybe Int -- Maximum height to resize image to while maintaining aspect ratio. Only applies to image files
  , "w" :: Maybe Int -- Maximum width to resize image to while maintaining aspect ratio. Only applies to image files
  , "b" :: Maybe Number -- Blur the image using this sigma value. Only applies to image files
  , "f" :: Maybe OutputImageFormat -- Output format for image files. Use 'auto' for content negotiation based on Accept header
  }

getFileMetadataHeadersParamsCodec :: CJ.Codec GetFileMetadataHeadersParams
getFileMetadataHeadersParamsCodec =
  CJR.objectStrict
    { "q": CJ.maybe CJ.int
    , "h": CJ.maybe CJ.int
    , "w": CJ.maybe CJ.int
    , "b": CJ.maybe CJ.number
    , "f": CJ.maybe outputImageFormatCodec
    }

-- | API Client type
type APIClient fetchResponse =
  {
    -- | UploadFiles
    -- |
    -- | Summary: Upload files
    -- |
    -- | Upload one or more files to a specified bucket. Supports batch uploading with optional custom metadata for each file. If uploading multiple files, either provide metadata for all files or none.
    -- |
    -- | Possible responses:
    -- |   - 201: UploadFilesResponse201
    uploadFiles :: UploadFilesBody -> Aff (fetchResponse (UploadFilesResponse201))
  ,
    -- | DeleteFile
    -- |
    -- | Summary: Delete file
    -- |
    -- | Permanently delete a file from storage. This removes both the file content and its associated metadata.
    -- |
    -- | Possible responses:
    -- |   - 204: Unit
    deleteFile :: String -> Aff (fetchResponse (Unit))
  ,
    -- | GetFile
    -- |
    -- | Summary: Download file
    -- |
    -- | Retrieve and download the complete file content. Supports conditional requests, image transformations, and range requests for partial downloads.
    -- |
    -- | Possible responses:
    -- |   - 200: Unit
    -- |   - 206: Unit
    -- |   - 304: Unit
    -- |   - 412: Unit
    getFile :: String -> Maybe GetFileParams -> Aff (fetchResponse (Blob))
  ,
    -- | GetFileMetadataHeaders
    -- |
    -- | Summary: Check file information
    -- |
    -- | Retrieve file metadata headers without downloading the file content. Supports conditional requests and provides caching information.
    -- |
    -- | Possible responses:
    -- |   - 200: Unit
    -- |   - 304: Unit
    -- |   - 412: Unit
    getFileMetadataHeaders :: String -> Maybe GetFileMetadataHeadersParams -> Aff (fetchResponse (Unit))
  ,
    -- | ReplaceFile
    -- |
    -- | Summary: Replace file
    -- |
    -- | Replace an existing file with new content while preserving the file ID. The operation follows these steps:
    -- | 1. The isUploaded flag is set to false to mark the file as being updated
    -- | 2. The file content is replaced in the storage backend
    -- | 3. File metadata is updated (size, mime-type, isUploaded, etc.)
    -- |
    -- | Each step is atomic, but if a step fails, previous steps will not be automatically rolled back.
    -- |
    -- |
    -- | Possible responses:
    -- |   - 200: FileMetadata
    replaceFile :: String -> ReplaceFileBody -> Aff (fetchResponse (FileMetadata))
  ,
    -- | GetFilePresignedURL
    -- |
    -- | Summary: Retrieve presigned URL to retrieve the file
    -- |
    -- | Retrieve presigned URL to retrieve the file. Expiration of the URL is
    -- | determined by bucket configuration
    -- |
    -- |
    -- | Possible responses:
    -- |   - 200: PresignedURLResponse
    getFilePresignedURL :: String -> Aff (fetchResponse (PresignedURLResponse))
  ,
    -- | DeleteBrokenMetadata
    -- |
    -- | Summary: Delete broken metadata
    -- |
    -- | Broken metadata is defined as metadata that has isUploaded = true but there is no file in the storage matching it. This is an admin operation that requires the Hasura admin secret.
    -- |
    -- | Possible responses:
    -- |   - 200: DeleteBrokenMetadataResponse200
    deleteBrokenMetadata :: Aff (fetchResponse (DeleteBrokenMetadataResponse200))
  ,
    -- | DeleteOrphanedFiles
    -- |
    -- | Summary: Deletes orphaned files
    -- |
    -- | Orphaned files are files that are present in the storage but have no associated metadata. This is an admin operation that requires the Hasura admin secret.
    -- |
    -- | Possible responses:
    -- |   - 200: DeleteOrphanedFilesResponse200
    deleteOrphanedFiles :: Aff (fetchResponse (DeleteOrphanedFilesResponse200))
  ,
    -- | ListBrokenMetadata
    -- |
    -- | Summary: Lists broken metadata
    -- |
    -- | Broken metadata is defined as metadata that has isUploaded = true but there is no file in the storage matching it. This is an admin operation that requires the Hasura admin secret.
    -- |
    -- | Possible responses:
    -- |   - 200: ListBrokenMetadataResponse200
    listBrokenMetadata :: Aff (fetchResponse (ListBrokenMetadataResponse200))
  ,
    -- | ListFilesNotUploaded
    -- |
    -- | Summary: Lists files that haven't been uploaded
    -- |
    -- | That is, metadata that has isUploaded = false. This is an admin operation that requires the Hasura admin secret.
    -- |
    -- | Possible responses:
    -- |   - 200: ListFilesNotUploadedResponse200
    listFilesNotUploaded :: Aff (fetchResponse (ListFilesNotUploadedResponse200))
  ,
    -- | ListOrphanedFiles
    -- |
    -- | Summary: Lists orphaned files
    -- |
    -- | Orphaned files are files that are present in the storage but have no associated metadata. This is an admin operation that requires the Hasura admin secret.
    -- |
    -- | Possible responses:
    -- |   - 200: ListOrphanedFilesResponse200
    listOrphanedFiles :: Aff (fetchResponse (ListOrphanedFilesResponse200))
  ,
    -- | GetVersion
    -- |
    -- | Summary: Get service version information
    -- |
    -- | Retrieves build and version information about the storage service. Useful for monitoring and debugging.
    -- |
    -- | Possible responses:
    -- |   - 200: VersionInformation
    getVersion :: Aff (fetchResponse (VersionInformation))
  }
