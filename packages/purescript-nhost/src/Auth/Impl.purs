module Auth.Impl where

import Auth.Client
import Prelude

import Affjax (AffjaxDriver, Error, Response, Request)
import Affjax as Affjax
import Affjax.RequestBody as Affjax
import Affjax.RequestHeader as Affjax
import Affjax.ResponseFormat as Affjax.ResponseFormat
import Affjax.ResponseHeader as Affjax
import Affjax.StatusCode as Affjax
import Data.Argonaut.Core (Json)
import Data.Argonaut.Core as J
import Data.Array (elem)
import Data.Codec.JSON as J
import Data.Either (Either(..), either)
import Data.HTTP.Method (Method(..))
import Data.Maybe (Maybe(..), maybe)
import Data.String as String
import Effect.Aff (Aff, throwError)
import Effect.Exception (error)
import Foreign (Foreign)
import Unsafe.Coerce (unsafeCoerce)

data FetchResponse a
  = FetchResponse_AffjaxError Affjax.Error
  | FetchResponse_JsonDecodeError (Affjax.Response J.Json) J.DecodeError
  | FetchResponse_Success
    { status :: Affjax.StatusCode
    , statusText :: String
    , headers :: Array Affjax.ResponseHeader
    , body :: a
    }

makeRequestGetImpl
  :: forall a
   . AffjaxDriver
  -> String -- base url
  -> J.Codec a
  -> String -- url
  -> Array Affjax.RequestHeader
  -> Aff (FetchResponse a)
makeRequestGetImpl affjaxDriver baseURL codec url headers = do
  result <- Affjax.request affjaxDriver
    { method: Left GET
    , url: baseURL <> url
    , headers
    , content: Nothing
    , username: Nothing
    , password: Nothing
    , withCredentials: false
    , responseFormat: Affjax.ResponseFormat.json
    , timeout: Nothing
    }
  case result of
    Left err ->
      pure $ FetchResponse_AffjaxError err

    Right res ->
      case J.decode codec res.body of
        Right decoded ->
          pure $ FetchResponse_Success
            { status: res.status
            , statusText: res.statusText
            , headers: res.headers
            , body: decoded
            }
        Left decodeErr ->
          pure $ FetchResponse_JsonDecodeError res decodeErr

-- | Create API client with base URL and optional middleware
createAPIClient :: AffjaxDriver -> String -> APIClient FetchResponse
createAPIClient affjaxDriver baseURL =
  { getJWKs: makeRequestGetImpl affjaxDriver baseURL jWKSetCodec "/.well-known/jwks.json"

  -- , elevateWebauthn: makeRequest publicKeyCredentialRequestOptionsCodec POST "/elevate/webauthn" Nothing []
  --
  -- , verifyElevateWebauthn: \body ->
  --     makeRequest sessionPayloadCodec POST "/elevate/webauthn/verify"
  --       (Just $ J.encode signInWebauthnVerifyRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , healthCheckGet: makeRequest oKResponseCodec GET "/healthz" Nothing []
  --
  -- , healthCheckHead: makeRequest (unsafeCoerce unit) HEAD "/healthz" Nothing []
  --
  -- , linkIdToken: \body ->
  --     makeRequest oKResponseCodec POST "/link/idtoken"
  --       (Just $ J.encode linkIdTokenRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , changeUserMfa: makeRequest totpGenerateResponseCodec GET "/mfa/totp/generate" Nothing []
  --
  -- , createPAT: \body ->
  --     makeRequest createPATResponseCodec POST "/pat"
  --       (Just $ J.encode createPATRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signInAnonymous: \maybeBody ->
  --     makeRequest sessionPayloadCodec POST "/signin/anonymous"
  --       (map (J.encode signInAnonymousRequestCodec) maybeBody)
  --       [ ContentType "application/json" ]
  --
  -- , signInEmailPassword: \body ->
  --     makeRequest signInEmailPasswordResponseCodec POST "/signin/email-password"
  --       (Just $ J.encode signInEmailPasswordRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signInIdToken: \body ->
  --     makeRequest sessionPayloadCodec POST "/signin/idtoken"
  --       (Just $ J.encode signInIdTokenRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , verifySignInMfaTotp: \body ->
  --     makeRequest sessionPayloadCodec POST "/signin/mfa/totp"
  --       (Just $ J.encode signInMfaTotpRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signInOTPEmail: \body ->
  --     makeRequest oKResponseCodec POST "/signin/otp/email"
  --       (Just $ J.encode signInOTPEmailRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , verifySignInOTPEmail: \body ->
  --     makeRequest signInOTPEmailVerifyResponseCodec POST "/signin/otp/email/verify"
  --       (Just $ J.encode signInOTPEmailVerifyRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signInPasswordlessEmail: \body ->
  --     makeRequest oKResponseCodec POST "/signin/passwordless/email"
  --       (Just $ J.encode signInPasswordlessEmailRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signInPasswordlessSms: \body ->
  --     makeRequest oKResponseCodec POST "/signin/passwordless/sms"
  --       (Just $ J.encode signInPasswordlessSmsRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , verifySignInPasswordlessSms: \body ->
  --     makeRequest signInPasswordlessSmsOtpResponseCodec POST "/signin/passwordless/sms/otp"
  --       (Just $ J.encode signInPasswordlessSmsOtpRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signInPAT: \body ->
  --     makeRequest sessionPayloadCodec POST "/signin/pat"
  --       (Just $ J.encode signInPATRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signInProvider: \provider maybeParams ->
  --     let
  --       paramString = maybe ""
  --         ( \params ->
  --             let
  --               encoded = J.encode signInProviderParamsCodec params
  --             in
  --               "?" <> show encoded -- Simplified
  --         )
  --         maybeParams
  --       providerStr = case provider of
  --         SignInProvider_Apple -> "apple"
  --         SignInProvider_Github -> "github"
  --         SignInProvider_Google -> "google"
  --         SignInProvider_Linkedin -> "linkedin"
  --         SignInProvider_Discord -> "discord"
  --         SignInProvider_Spotify -> "spotify"
  --         SignInProvider_Twitch -> "twitch"
  --         SignInProvider_Gitlab -> "gitlab"
  --         SignInProvider_Bitbucket -> "bitbucket"
  --         SignInProvider_Workos -> "workos"
  --         SignInProvider_Azuread -> "azuread"
  --         SignInProvider_Strava -> "strava"
  --         SignInProvider_Facebook -> "facebook"
  --         SignInProvider_Windowslive -> "windowslive"
  --         SignInProvider_Twitter -> "twitter"
  --     in
  --       baseURL <> "/signin/provider/" <> providerStr <> paramString
  --
  -- , signInWebauthn: \maybeBody ->
  --     makeRequest publicKeyCredentialRequestOptionsCodec POST "/signin/webauthn"
  --       (map (J.encode signInWebauthnRequestCodec) maybeBody)
  --       [ ContentType "application/json" ]
  --
  -- , verifySignInWebauthn: \body ->
  --     makeRequest sessionPayloadCodec POST "/signin/webauthn/verify"
  --       (Just $ J.encode signInWebauthnVerifyRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signOut: \body ->
  --     makeRequest oKResponseCodec POST "/signout"
  --       (Just $ J.encode signOutRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signUpEmailPassword: \body ->
  --     makeRequest sessionPayloadCodec POST "/signup/email-password"
  --       (Just $ J.encode signUpEmailPasswordRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , signUpWebauthn: \body ->
  --     makeRequest publicKeyCredentialCreationOptionsCodec POST "/signup/webauthn"
  --       (Just $ J.encode signUpWebauthnRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , verifySignUpWebauthn: \body ->
  --     makeRequest sessionPayloadCodec POST "/signup/webauthn/verify"
  --       (Just $ J.encode signUpWebauthnVerifyRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , refreshToken: \body ->
  --     makeRequest sessionCodec POST "/token"
  --       (Just $ J.encode refreshTokenRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , verifyToken: \maybeBody ->
  --     makeRequest (unsafeCoerce unit) POST "/token/verify"
  --       (map (J.encode verifyTokenRequestCodec) maybeBody)
  --       [ ContentType "application/json" ]
  --
  -- , getUser: makeRequest userCodec GET "/user" Nothing []
  --
  -- , deanonymizeUser: \body ->
  --     makeRequest oKResponseCodec POST "/user/deanonymize"
  --       (Just $ J.encode userDeanonymizeRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , changeUserEmail: \body ->
  --     makeRequest oKResponseCodec POST "/user/email/change"
  --       (Just $ J.encode userEmailChangeRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , sendVerificationEmail: \body ->
  --     makeRequest oKResponseCodec POST "/user/email/send-verification-email"
  --       (Just $ J.encode userEmailSendVerificationEmailRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , verifyChangeUserMfa: \body ->
  --     makeRequest oKResponseCodec POST "/user/mfa"
  --       (Just $ J.encode userMfaRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , changeUserPassword: \body ->
  --     makeRequest oKResponseCodec POST "/user/password"
  --       (Just $ J.encode userPasswordRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , sendPasswordResetEmail: \body ->
  --     makeRequest oKResponseCodec POST "/user/password/reset"
  --       (Just $ J.encode userPasswordResetRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , addSecurityKey: makeRequest publicKeyCredentialCreationOptionsCodec POST "/user/webauthn/add" Nothing []
  --
  -- , verifyAddSecurityKey: \body ->
  --     makeRequest verifyAddSecurityKeyResponseCodec POST "/user/webauthn/verify"
  --       (Just $ J.encode verifyAddSecurityKeyRequestCodec body)
  --       [ ContentType "application/json" ]
  --
  -- , verifyTicket: \maybeParams ->
  --     let
  --       paramString = maybe ""
  --         ( \params ->
  --             let
  --               encoded = J.encode verifyTicketParamsCodec params
  --             in
  --               "?" <> show encoded -- Simplified
  --         )
  --         maybeParams
  --     in
  --       baseURL <> "/verify" <> paramString
  --
  -- , getVersion: makeRequest getVersionResponse200Codec GET "/version" Nothing []
  }
