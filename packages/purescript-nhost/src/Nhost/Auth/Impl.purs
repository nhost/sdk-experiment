module Nhost.Auth.Impl where

import Nhost.Auth.Client
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
import Nhost.Fetch

-- | Convert SignInProviderParams to query string
signInProviderParamsToQuery
  :: String
  -> Maybe SignInProviderParams
  -> Either (NonEmptyArray NonEmptyString) String
signInProviderParamsToQuery baseUrl Nothing = Right baseUrl
signInProviderParamsToQuery baseUrl (Just params) =
  let
    kvs = Array.catMaybes
      [ params."allowedRoles" >>= \roles ->
          if Array.null roles then Nothing
          else Just (Tuple "allowedRoles" (String.joinWith "," roles))
      , params."defaultRole" <#> \role -> Tuple "defaultRole" role
      , params."displayName" <#> \name -> Tuple "displayName" name
      , params."locale" <#> \locale -> Tuple "locale" locale
      , params."metadata" <#> \metadata -> Tuple "metadata" (JSON.print (JSON.fromJObject metadata))
      , params."redirectTo" <#> \redirect -> Tuple "redirectTo" redirect
      , params."connect" <#> \connect -> Tuple "connect" connect
      ]
  in
    mkUrlWithMaybeQuery baseUrl kvs

verifyTicketParamsToQuery
  :: String
  -> Maybe VerifyTicketParams
  -> Either (NonEmptyArray NonEmptyString) String
verifyTicketParamsToQuery baseUrl Nothing = Right baseUrl
verifyTicketParamsToQuery baseUrl (Just params) =
  let
    kvs = Array.catMaybes
      [ Just (Tuple "ticket" (unwrap params."ticket"))
      , params."type" <#> \ticketType -> Tuple "type" (ticketTypeQuery_enc ticketType)
      , Just (Tuple "redirectTo" (unwrap params."redirectTo"))
      ]
  in
    mkUrlWithMaybeQuery baseUrl kvs

type MkUrlOutput = Either (NonEmptyArray NonEmptyString) String

-- | Create API client with base URL and optional middleware
createAPIClient :: String -> APIClient FetchResponse FetchResponse FetchResponse Fetch.Response Fetch.Response MkUrlOutput
createAPIClient baseURL =
  { getJWKs: makeRequestGet baseURL getJWKsPath jWKSetCodec
  , elevateWebauthn: makeRequestPostWithoutBody baseURL elevateWebauthnPath publicKeyCredentialCreationOptionsCodec
  , verifyElevateWebauthn: makeRequestPostWithBody baseURL verifyElevateWebauthnPath signInWebauthnVerifyRequestCodec sessionPayloadCodec
  , healthCheckGet: makeRequestGet baseURL healthCheckGetPath oKResponseCodec
  , healthCheckHead: makeRequestHead baseURL healthCheckHeadPath
  , linkIdToken: makeRequestPostWithBody baseURL linkIdTokenPath linkIdTokenRequestCodec oKResponseCodec
  , changeUserMfa: makeRequestGet baseURL changeUserMfaPath totpGenerateResponseCodec
  , createPAT: makeRequestPostWithBody baseURL createPATPath createPATRequestCodec createPATResponseCodec
  , signInAnonymous: makeRequestPostWithMaybeBody baseURL signInAnonymousPath signInAnonymousRequestCodec sessionPayloadCodec
  , signInEmailPassword: makeRequestPostWithBody baseURL signInEmailPasswordPath signInEmailPasswordRequestCodec signInEmailPasswordResponseCodec
  , signInIdToken: makeRequestPostWithBody baseURL signInIdTokenPath signInIdTokenRequestCodec sessionPayloadCodec
  , verifySignInMfaTotp: makeRequestPostWithBody baseURL verifySignInMfaTotpPath signInMfaTotpRequestCodec sessionPayloadCodec
  , signInOTPEmail: makeRequestPostWithBody baseURL signInOTPEmailPath signInOTPEmailRequestCodec oKResponseCodec
  , verifySignInOTPEmail: makeRequestPostWithBody baseURL verifySignInOTPEmailPath signInOTPEmailVerifyRequestCodec signInOTPEmailVerifyResponseCodec
  , signInPasswordlessEmail: makeRequestPostWithBody baseURL signInPasswordlessEmailPath signInPasswordlessEmailRequestCodec oKResponseCodec
  , signInPasswordlessSms: makeRequestPostWithBody baseURL signInPasswordlessSmsPath signInPasswordlessSmsRequestCodec oKResponseCodec
  , verifySignInPasswordlessSms: makeRequestPostWithBody baseURL verifySignInPasswordlessSmsPath signInPasswordlessSmsOtpRequestCodec signInPasswordlessSmsOtpResponseCodec
  , signInPAT: makeRequestPostWithBody baseURL signInPATPath signInPATRequestCodec sessionPayloadCodec
  , signInProvider: \provider -> signInProviderParamsToQuery (baseURL <> "/signin/provider/" <> signInProvider_enc provider) -- dynamic path still
  , signInWebauthn: makeRequestPostWithMaybeBody baseURL signInWebauthnPath signInWebauthnRequestCodec publicKeyCredentialRequestOptionsCodec
  , verifySignInWebauthn: makeRequestPostWithBody baseURL verifySignInWebauthnPath signInWebauthnVerifyRequestCodec sessionPayloadCodec
  , signOut: makeRequestPostWithBody baseURL signOutPath signOutRequestCodec oKResponseCodec
  , signUpEmailPassword: makeRequestPostWithBody baseURL signUpEmailPasswordPath signUpEmailPasswordRequestCodec sessionPayloadCodec
  , signUpWebauthn: makeRequestPostWithBody baseURL signUpWebauthnPath signUpWebauthnRequestCodec publicKeyCredentialCreationOptionsCodec
  , verifySignUpWebauthn: makeRequestPostWithBody baseURL verifySignUpWebauthnPath signUpWebauthnVerifyRequestCodec sessionPayloadCodec
  , refreshToken: makeRequestPostWithBody baseURL refreshTokenPath refreshTokenRequestCodec sessionCodec
  , verifyToken: makeRequestPostWithMaybeBody baseURL verifyTokenPath verifyTokenRequestCodec CJ.string
  , getUser: makeRequestGet baseURL getUserPath userCodec
  , deanonymizeUser: makeRequestPostWithBody baseURL deanonymizeUserPath userDeanonymizeRequestCodec oKResponseCodec
  , changeUserEmail: makeRequestPostWithBody baseURL changeUserEmailPath userEmailChangeRequestCodec oKResponseCodec
  , sendVerificationEmail: makeRequestPostWithBody baseURL sendVerificationEmailPath userEmailSendVerificationEmailRequestCodec oKResponseCodec
  , verifyChangeUserMfa: makeRequestPostWithBody baseURL verifyChangeUserMfaPath userMfaRequestCodec oKResponseCodec
  , changeUserPassword: makeRequestPostWithBody baseURL changeUserPasswordPath userPasswordRequestCodec oKResponseCodec
  , sendPasswordResetEmail: makeRequestPostWithBody baseURL sendPasswordResetEmailPath userPasswordResetRequestCodec oKResponseCodec
  , addSecurityKey: makeRequestPostWithoutBody baseURL addSecurityKeyPath publicKeyCredentialCreationOptionsCodec
  , verifyAddSecurityKey: makeRequestPostWithBody baseURL verifyAddSecurityKeyPath verifyAddSecurityKeyRequestCodec verifyAddSecurityKeyResponseCodec
  , verifyTicket: verifyTicketParamsToQuery (baseURL <> verifyTicketPath)
  , getVersion: makeRequestGet baseURL getVersionPath getVersionResponse200Codec
  }
