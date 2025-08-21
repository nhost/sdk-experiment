module Auth.Impl where

import Prelude

import Affjax (Error, Response)
import Affjax as AX
import Affjax.RequestBody as RequestBody
import Affjax.RequestHeader (RequestHeader(..))
import Affjax.ResponseFormat as ResponseFormat
import Auth.Client
import Data.Codec.JSON as J
import Data.Either (Either(..), either)
import Data.HTTP.Method (Method(..))
import Data.Maybe (Maybe(..), maybe)
import Data.String as String
import Effect.Aff (Aff, throwError)
import Effect.Exception (error)
import Foreign (Foreign)

-- | Response wrapper for API calls
type FetchResponse a =
  { body :: a
  , status :: Int
  , headers :: Foreign
  }

-- | Error thrown by API calls
data FetchError = FetchError Foreign Int Foreign

-- Helper to make HTTP requests with error handling
makeRequestImpl :: forall a. String -> J.Codec a -> Method -> String -> Maybe Foreign -> Array RequestHeader -> Aff (FetchResponse a)
makeRequestImpl baseURL codec method url body headers = do
  let
    request =
      { method: method
      , url: baseURL <> url
      , headers: headers
      , content: map (const RequestBody.json) body
      , username: Nothing
      , password: Nothing
      , timeout: Nothing
      , withCredentials: false
      , responseFormat: ResponseFormat.json
      }

  response <- AX.request request

  if response.status >= 300 then do
    let responseBody = if response.status == 412 then Nothing else Just response.body
    throwError $ error $ "HTTP Error: " <> show response.status
  else do
    let
      payload =
        if response.status == 204 || response.status == 205 || response.status == 304 then Nothing
        else Just response.body

    case payload of
      Nothing ->
        -- For Unit responses, create empty object
        case J.decode codec (J.fromJSON {}) of
          Right decoded -> pure { body: decoded, status: response.status, headers: response.headers }
          Left err -> throwError $ error $ "Decode error: " <> show err
      Just jsonBody ->
        case J.decode codec jsonBody of
          Right decoded -> pure { body: decoded, status: response.status, headers: response.headers }
          Left err -> throwError $ error $ "Decode error: " <> show err

-- Helper to create query string from parameters
createQueryString :: forall params. J.Codec params -> Maybe params -> String
createQueryString _ Nothing = ""
createQueryString codec (Just params) =
  let
    encoded = J.encode codec params
  in
    "?" <> show encoded -- Simplified - would need proper URL encoding

-- | Create API client with base URL and optional middleware
createAPIClient :: String -> APIClient FetchResponse
createAPIClient baseURL =
  let
    -- Helper to make HTTP requests with error handling
    makeRequest :: forall a. J.Codec a -> Method -> String -> Maybe Foreign -> Array RequestHeader -> Aff (FetchResponse a)
    makeRequest = makeRequestImpl baseURL
  in
    { getJWKs: makeRequest jWKSetCodec GET "/.well-known/jwks.json" Nothing []

    , elevateWebauthn: makeRequest publicKeyCredentialRequestOptionsCodec POST "/elevate/webauthn" Nothing []

    , verifyElevateWebauthn: \body ->
        makeRequest sessionPayloadCodec POST "/elevate/webauthn/verify"
          (Just $ J.encode signInWebauthnVerifyRequestCodec body)
          [ ContentType "application/json" ]

    , healthCheckGet: makeRequest oKResponseCodec GET "/healthz" Nothing []

    , healthCheckHead: makeRequest (J.codec' (\_ -> Right unit) (const J.fromJSON unit)) HEAD "/healthz" Nothing []

    , linkIdToken: \body ->
        makeRequest oKResponseCodec POST "/link/idtoken"
          (Just $ J.encode linkIdTokenRequestCodec body)
          [ ContentType "application/json" ]

    , changeUserMfa: makeRequest totpGenerateResponseCodec GET "/mfa/totp/generate" Nothing []

    , createPAT: \body ->
        makeRequest createPATResponseCodec POST "/pat"
          (Just $ J.encode createPATRequestCodec body)
          [ ContentType "application/json" ]

    , signInAnonymous: \maybeBody ->
        makeRequest sessionPayloadCodec POST "/signin/anonymous"
          (map (J.encode signInAnonymousRequestCodec) maybeBody)
          [ ContentType "application/json" ]

    , signInEmailPassword: \body ->
        makeRequest signInEmailPasswordResponseCodec POST "/signin/email-password"
          (Just $ J.encode signInEmailPasswordRequestCodec body)
          [ ContentType "application/json" ]

    , signInIdToken: \body ->
        makeRequest sessionPayloadCodec POST "/signin/idtoken"
          (Just $ J.encode signInIdTokenRequestCodec body)
          [ ContentType "application/json" ]

    , verifySignInMfaTotp: \body ->
        makeRequest sessionPayloadCodec POST "/signin/mfa/totp"
          (Just $ J.encode signInMfaTotpRequestCodec body)
          [ ContentType "application/json" ]

    , signInOTPEmail: \body ->
        makeRequest oKResponseCodec POST "/signin/otp/email"
          (Just $ J.encode signInOTPEmailRequestCodec body)
          [ ContentType "application/json" ]

    , verifySignInOTPEmail: \body ->
        makeRequest signInOTPEmailVerifyResponseCodec POST "/signin/otp/email/verify"
          (Just $ J.encode signInOTPEmailVerifyRequestCodec body)
          [ ContentType "application/json" ]

    , signInPasswordlessEmail: \body ->
        makeRequest oKResponseCodec POST "/signin/passwordless/email"
          (Just $ J.encode signInPasswordlessEmailRequestCodec body)
          [ ContentType "application/json" ]

    , signInPasswordlessSms: \body ->
        makeRequest oKResponseCodec POST "/signin/passwordless/sms"
          (Just $ J.encode signInPasswordlessSmsRequestCodec body)
          [ ContentType "application/json" ]

    , verifySignInPasswordlessSms: \body ->
        makeRequest signInPasswordlessSmsOtpResponseCodec POST "/signin/passwordless/sms/otp"
          (Just $ J.encode signInPasswordlessSmsOtpRequestCodec body)
          [ ContentType "application/json" ]

    , signInPAT: \body ->
        makeRequest sessionPayloadCodec POST "/signin/pat"
          (Just $ J.encode signInPATRequestCodec body)
          [ ContentType "application/json" ]

    , signInProvider: \provider maybeParams ->
        let
          paramString = maybe ""
            ( \params ->
                let
                  encoded = J.encode signInProviderParamsCodec params
                in
                  "?" <> show encoded -- Simplified
            )
            maybeParams
          providerStr = case provider of
            SignInProvider_Apple -> "apple"
            SignInProvider_Github -> "github"
            SignInProvider_Google -> "google"
            SignInProvider_Linkedin -> "linkedin"
            SignInProvider_Discord -> "discord"
            SignInProvider_Spotify -> "spotify"
            SignInProvider_Twitch -> "twitch"
            SignInProvider_Gitlab -> "gitlab"
            SignInProvider_Bitbucket -> "bitbucket"
            SignInProvider_Workos -> "workos"
            SignInProvider_Azuread -> "azuread"
            SignInProvider_Strava -> "strava"
            SignInProvider_Facebook -> "facebook"
            SignInProvider_Windowslive -> "windowslive"
            SignInProvider_Twitter -> "twitter"
        in
          baseURL <> "/signin/provider/" <> providerStr <> paramString

    , signInWebauthn: \maybeBody ->
        makeRequest publicKeyCredentialRequestOptionsCodec POST "/signin/webauthn"
          (map (J.encode signInWebauthnRequestCodec) maybeBody)
          [ ContentType "application/json" ]

    , verifySignInWebauthn: \body ->
        makeRequest sessionPayloadCodec POST "/signin/webauthn/verify"
          (Just $ J.encode signInWebauthnVerifyRequestCodec body)
          [ ContentType "application/json" ]

    , signOut: \body ->
        makeRequest oKResponseCodec POST "/signout"
          (Just $ J.encode signOutRequestCodec body)
          [ ContentType "application/json" ]

    , signUpEmailPassword: \body ->
        makeRequest sessionPayloadCodec POST "/signup/email-password"
          (Just $ J.encode signUpEmailPasswordRequestCodec body)
          [ ContentType "application/json" ]

    , signUpWebauthn: \body ->
        makeRequest publicKeyCredentialCreationOptionsCodec POST "/signup/webauthn"
          (Just $ J.encode signUpWebauthnRequestCodec body)
          [ ContentType "application/json" ]

    , verifySignUpWebauthn: \body ->
        makeRequest sessionPayloadCodec POST "/signup/webauthn/verify"
          (Just $ J.encode signUpWebauthnVerifyRequestCodec body)
          [ ContentType "application/json" ]

    , refreshToken: \body ->
        makeRequest sessionCodec POST "/token"
          (Just $ J.encode refreshTokenRequestCodec body)
          [ ContentType "application/json" ]

    , verifyToken: \maybeBody ->
        makeRequest (J.codec' (const $ Right "") (const $ J.fromJSON "")) POST "/token/verify"
          (map (J.encode verifyTokenRequestCodec) maybeBody)
          [ ContentType "application/json" ]

    , getUser: makeRequest userCodec GET "/user" Nothing []

    , deanonymizeUser: \body ->
        makeRequest oKResponseCodec POST "/user/deanonymize"
          (Just $ J.encode userDeanonymizeRequestCodec body)
          [ ContentType "application/json" ]

    , changeUserEmail: \body ->
        makeRequest oKResponseCodec POST "/user/email/change"
          (Just $ J.encode userEmailChangeRequestCodec body)
          [ ContentType "application/json" ]

    , sendVerificationEmail: \body ->
        makeRequest oKResponseCodec POST "/user/email/send-verification-email"
          (Just $ J.encode userEmailSendVerificationEmailRequestCodec body)
          [ ContentType "application/json" ]

    , verifyChangeUserMfa: \body ->
        makeRequest oKResponseCodec POST "/user/mfa"
          (Just $ J.encode userMfaRequestCodec body)
          [ ContentType "application/json" ]

    , changeUserPassword: \body ->
        makeRequest oKResponseCodec POST "/user/password"
          (Just $ J.encode userPasswordRequestCodec body)
          [ ContentType "application/json" ]

    , sendPasswordResetEmail: \body ->
        makeRequest oKResponseCodec POST "/user/password/reset"
          (Just $ J.encode userPasswordResetRequestCodec body)
          [ ContentType "application/json" ]

    , addSecurityKey: makeRequest publicKeyCredentialCreationOptionsCodec POST "/user/webauthn/add" Nothing []

    , verifyAddSecurityKey: \body ->
        makeRequest verifyAddSecurityKeyResponseCodec POST "/user/webauthn/verify"
          (Just $ J.encode verifyAddSecurityKeyRequestCodec body)
          [ ContentType "application/json" ]

    , verifyTicket: \maybeParams ->
        let
          paramString = maybe ""
            ( \params ->
                let
                  encoded = J.encode verifyTicketParamsCodec params
                in
                  "?" <> show encoded -- Simplified
            )
            maybeParams
        in
          baseURL <> "/verify" <> paramString

    , getVersion: makeRequest getVersionResponse200Codec GET "/version" Nothing []
    }
