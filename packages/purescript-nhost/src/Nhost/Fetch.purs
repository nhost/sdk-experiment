module Nhost.Fetch where

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

data FetchResponse a
  = FetchResponse_JsonDecodeError Fetch.Response J.DecodeError
  | FetchResponse_Success Fetch.Response a

foreignToJSON :: Foreign -> JSON
foreignToJSON = unsafeFromForeign

makeRequestGet
  :: forall a
   . String -- base url
  -> String -- url
  -> J.Codec a
  -> Aff (FetchResponse a)
makeRequestGet baseURL url codec = do
  response <- Fetch.fetch (baseURL <> url)
    { method: GET
    , headers: { "Content-Type": "application/json" }
    }
  json <- response.json
  case J.decode codec (foreignToJSON json) of
    Right decoded ->
      pure $ FetchResponse_Success response decoded
    Left decodeErr ->
      pure $ FetchResponse_JsonDecodeError response decodeErr

makeRequestDelete
  :: forall a
   . String -- base url
  -> String -- url
  -> J.Codec a
  -> Aff (FetchResponse a)
makeRequestDelete baseURL url codec = do
  response <- Fetch.fetch (baseURL <> url)
    { method: DELETE
    , headers: { "Content-Type": "application/json" }
    }
  json <- response.json
  case J.decode codec (foreignToJSON json) of
    Right decoded ->
      pure $ FetchResponse_Success response decoded
    Left decodeErr ->
      pure $ FetchResponse_JsonDecodeError response decodeErr

makeRequestHead
  :: String -- base url
  -> String -- url
  -> Aff Fetch.Response
makeRequestHead baseURL url = do
  Fetch.fetch (baseURL <> url)
    { method: HEAD
    }

makeRequestPostWithoutBody
  :: forall a
   . String -- base url
  -> String -- url
  -> J.Codec a
  -> Aff (FetchResponse a)
makeRequestPostWithoutBody baseURL url codec = do
  response <- Fetch.fetch (baseURL <> url)
    { method: POST
    , headers: { "Content-Type": "application/json" }
    }
  json <- response.json
  case J.decode codec (foreignToJSON json) of
    Right decoded ->
      pure $ FetchResponse_Success response decoded
    Left decodeErr ->
      pure $ FetchResponse_JsonDecodeError response decodeErr

-- POST (with request body)
makeRequestPostWithBody
  :: forall a b
   . String -- base url
  -> String -- url
  -> J.Codec b -- request body codec
  -> J.Codec a -- response body codec
  -> b -- request body value
  -> Aff (FetchResponse a)
makeRequestPostWithBody baseURL url codecReq codecRes body = do
  let bodyJson = JSON.print (J.encode codecReq body)
  response <- Fetch.fetch (baseURL <> url)
    { method: POST
    , headers: { "Content-Type": "application/json" }
    , body: bodyJson
    }
  json <- response.json
  case J.decode codecRes (foreignToJSON json) of
    Right decoded ->
      pure $ FetchResponse_Success response decoded
    Left decodeErr ->
      pure $ FetchResponse_JsonDecodeError response decodeErr

-- POST (with request body)
makeRequestPostWithMaybeBody
  :: forall a b
   . String -- base url
  -> String -- url
  -> J.Codec b -- request body codec
  -> J.Codec a -- response body codec
  -> Maybe b -- request body value
  -> Aff (FetchResponse a)
makeRequestPostWithMaybeBody baseURL url codecReq codecRes = case _ of
  Just body -> makeRequestPostWithBody baseURL url codecReq codecRes body
  Nothing -> makeRequestPostWithoutBody baseURL url codecRes
