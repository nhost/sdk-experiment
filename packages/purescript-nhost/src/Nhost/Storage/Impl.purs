module Nhost.Storage.Impl where

import Nhost.Fetch
import Nhost.Storage.Client
import Prelude

import Data.Array as Array
import Data.Array.NonEmpty (NonEmptyArray)
import Data.Codec.JSON as CJ
import Data.Codec.JSON as J
import Data.Either (Either(..))
import Data.HTTP.Method (Method(..))
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.String as String
import Data.String.NonEmpty (NonEmptyString)
import Data.Tuple (Tuple(..))
import Effect.Aff (Aff)
import Fetch as Fetch
import Foreign (Foreign, unsafeFromForeign)
import JSON (JSON)
import JSON as JSON
import Nhost.Query (mkUrlWithMaybeQuery)
import Unsafe.Coerce (unsafeCoerce)

-- | Create API client with base URL
createAPIClient
  :: String
  -> APIClient FetchResponse FetchResponse FetchResponse Fetch.Response Fetch.Response Void
createAPIClient baseURL =
  { uploadFiles: \body -> unsafeCoerce unit -- makeRequestPostWithBody baseURL uploadFilesPath uploadFilesResponse201Codec body
  , deleteFile: \fileId -> unsafeCoerce unit -- makeRequestDelete baseURL (deleteFilePath fileId)
  , getFile: \fileId params -> unsafeCoerce unit -- makeRequestGetWithParams baseURL (getFilePath fileId) params
  , getFileMetadataHeaders: \fileId params -> unsafeCoerce unit -- makeRequestHeadWithParams baseURL (getFileMetadataHeadersPath fileId) params
  , replaceFile: \fileId body -> unsafeCoerce unit -- makeRequestPutWithBody baseURL (replaceFilePath fileId) body fileMetadataCodec
  , getFilePresignedURL: \fileId -> makeRequestGet baseURL (getFilePresignedURLPath fileId) presignedURLResponseCodec
  , deleteBrokenMetadata: makeRequestPostWithoutBody baseURL deleteBrokenMetadataPath deleteBrokenMetadataResponse200Codec
  , deleteOrphanedFiles: makeRequestPostWithoutBody baseURL deleteOrphanedFilesPath deleteOrphanedFilesResponse200Codec
  , listBrokenMetadata: makeRequestPostWithoutBody baseURL listBrokenMetadataPath listBrokenMetadataResponse200Codec
  , listFilesNotUploaded: makeRequestPostWithoutBody baseURL listFilesNotUploadedPath listFilesNotUploadedResponse200Codec
  , listOrphanedFiles: makeRequestPostWithoutBody baseURL listOrphanedFilesPath listOrphanedFilesResponse200Codec
  , getVersion: makeRequestGet baseURL getVersionPath versionInformationCodec
  }
