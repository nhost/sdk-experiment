module Auth.Impl where

import Auth.Client
import Prelude

import Data.Array (elem)
import Data.Codec.JSON as J
import Data.Either (Either(..), either)
import Data.HTTP.Method (Method(..))
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.String as String
import Data.String.CaseInsensitive (CaseInsensitiveString(..))
import Effect.Aff (Aff, throwError)
import Effect.Exception (error)
import Fetch as Fetch
import Foreign (Foreign, unsafeFromForeign, unsafeToForeign)
import JS.Fetch.Headers as Headers
import JS.Fetch.RequestBody as JS.Fetch.RequestBody
import JSON (JSON)
import JSON as JSON
import Unsafe.Coerce (unsafeCoerce)

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

makeRequestHead
  :: forall a
   . String -- base url
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

-- | Create API client with base URL and optional middleware
createAPIClient :: String -> APIClient FetchResponse FetchResponse FetchResponse Fetch.Response Fetch.Response
createAPIClient baseURL =
  { getJWKs: makeRequestGet baseURL "/.well-known/jwks.json" jWKSetCodec
  , elevateWebauthn: makeRequestPostWithoutBody baseURL "/elevate/webauthn" publicKeyCredentialRequestOptionsCodec
  , verifyElevateWebauthn: makeRequestPostWithBody baseURL "/elevate/webauthn/verify" signInWebauthnVerifyRequestCodec sessionPayloadCodec
  , healthCheckGet: makeRequestGet baseURL "/healthz" oKResponseCodec
  , healthCheckHead: makeRequestHead baseURL "/healthz"
  , linkIdToken: makeRequestPostWithBody baseURL "/link/idtoken" linkIdTokenRequestCodec oKResponseCodec
  , changeUserMfa: makeRequestGet baseURL "/mfa/totp/generate" totpGenerateResponseCodec
  , createPAT: makeRequestPostWithBody baseURL "/pat" createPATRequestCodec createPATResponseCodec
  , signInAnonymous: makeRequestPostWithBody baseURL "/signin/anonymous" signInAnonymousRequestCodec sessionPayloadCodec
  , signInEmailPassword: makeRequestPostWithBody baseURL "/signin/email-password" signInEmailPasswordRequestCodec signInEmailPasswordResponseCodec
  , signInIdToken: makeRequestPostWithBody baseURL "/signin/idtoken" signInIdTokenRequestCodec sessionPayloadCodec
  , verifySignInMfaTotp: makeRequestPostWithBody baseURL "/signin/mfa/totp" signInMfaTotpRequestCodec sessionPayloadCodec
  , signInOTPEmail: makeRequestPostWithBody baseURL "/signin/otp/email" signInOTPEmailRequestCodec oKResponseCodec
  , verifySignInOTPEmail: makeRequestPostWithBody baseURL "/signin/otp/email/verify" signInOTPEmailVerifyRequestCodec signInOTPEmailVerifyResponseCodec
  , signInPasswordlessEmail: makeRequestPostWithBody baseURL "/signin/passwordless/email" signInPasswordlessEmailRequestCodec oKResponseCodec
  , signInPasswordlessSms: makeRequestPostWithBody baseURL "/signin/passwordless/sms" signInPasswordlessSmsRequestCodec oKResponseCodec
  , verifySignInPasswordlessSms: makeRequestPostWithBody baseURL "/signin/passwordless/sms/otp" signInPasswordlessSmsOtpRequestCodec signInPasswordlessSmsOtpResponseCodec
  , signInPAT: makeRequestPostWithBody baseURL "/signin/pat" signInPATRequestCodec sessionPayloadCodec
  , signInProvider: \provider maybeParams ->
      let
        paramString =
          maybe ""
            (\params ->
               let encodedParams = J.encode signInProviderParamsCodec params
               in "?" <> show encodedParams
            )
            maybeParams

        providerStr = J.encode signInProviderCodec provider
      in
        baseURL <> "/signin/provider/" <> providerStr <> paramString
  , signInWebauthn: makeRequestPostWithBody baseURL "/signin/webauthn" signInWebauthnRequestCodec publicKeyCredentialRequestOptionsCodec
  , verifySignInWebauthn: makeRequestPostWithBody baseURL "/signin/webauthn/verify" signInWebauthnVerifyRequestCodec sessionPayloadCodec
  , signOut: makeRequestPostWithBody baseURL "/signout" signOutRequestCodec oKResponseCodec
  , signUpEmailPassword: makeRequestPostWithBody baseURL "/signup/email-password" signUpEmailPasswordRequestCodec sessionPayloadCodec
  , signUpWebauthn: makeRequestPostWithBody baseURL "/signup/webauthn" signUpWebauthnRequestCodec publicKeyCredentialCreationOptionsCodec
  , verifySignUpWebauthn: makeRequestPostWithBody baseURL "/signup/webauthn/verify" signUpWebauthnVerifyRequestCodec sessionPayloadCodec
  , refreshToken: makeRequestPostWithBody baseURL "/token" refreshTokenRequestCodec sessionCodec
  , verifyToken: makeRequestPostWithBody baseURL "/token/verify" verifyTokenRequestCodec unit
  , getUser: makeRequestGet baseURL "/user" userCodec
  , deanonymizeUser: makeRequestPostWithBody baseURL "/user/deanonymize" userDeanonymizeRequestCodec oKResponseCodec
  , changeUserEmail: makeRequestPostWithBody baseURL "/user/email/change" userEmailChangeRequestCodec oKResponseCodec
  , sendVerificationEmail: makeRequestPostWithBody baseURL "/user/email/send-verification-email" userEmailSendVerificationEmailRequestCodec oKResponseCodec
  , verifyChangeUserMfa: makeRequestPostWithBody baseURL "/user/mfa" userMfaRequestCodec oKResponseCodec
  , changeUserPassword: makeRequestPostWithBody baseURL "/user/password" userPasswordRequestCodec oKResponseCodec
  , sendPasswordResetEmail: makeRequestPostWithBody baseURL "/user/password/reset" userPasswordResetRequestCodec oKResponseCodec
  , addSecurityKey: makeRequestPostWithoutBody baseURL "/user/webauthn/add" publicKeyCredentialCreationOptionsCodec
  , verifyAddSecurityKey: makeRequestPostWithBody baseURL "/user/webauthn/verify" verifyAddSecurityKeyRequestCodec verifyAddSecurityKeyResponseCodec
  , verifyTicket: \maybeParams ->
      let
        paramString = maybe "" (\params -> "?" <> show (J.encode verifyTicketParamsCodec params)) maybeParams
      in
        baseURL <> "/verify" <> paramString
  , getVersion: makeRequestGet baseURL "/version" getVersionResponse200Codec
  }
