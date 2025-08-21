-- | This file is auto-generated. Do not edit manually.
module Auth.Client where

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

-- | The attestation statement format
data AttestationFormat
  = AttestationFormat_Packed
  | AttestationFormat_Tpm
  | AttestationFormat_AndroidKey
  | AttestationFormat_AndroidSafetynet
  | AttestationFormat_FidoU2f
  | AttestationFormat_Apple
  | AttestationFormat_None

derive instance genericAttestationFormat :: Generic AttestationFormat _
derive instance eqAttestationFormat :: Eq AttestationFormat
derive instance ordAttestationFormat :: Ord AttestationFormat

instance showAttestationFormat :: Show AttestationFormat where
  show = genericShow

attestationFormatCodec :: CJ.Codec AttestationFormat
attestationFormatCodec = CJ.prismaticCodec "AttestationFormat" dec enc CJ.string
  where
  dec = case _ of
    "Packed" -> Just AttestationFormat_Packed
    "Tpm" -> Just AttestationFormat_Tpm
    "AndroidKey" -> Just AttestationFormat_AndroidKey
    "AndroidSafetynet" -> Just AttestationFormat_AndroidSafetynet
    "FidoU2f" -> Just AttestationFormat_FidoU2f
    "Apple" -> Just AttestationFormat_Apple
    "None" -> Just AttestationFormat_None
    _ -> Nothing

  enc = case _ of
    AttestationFormat_Packed -> "Packed"
    AttestationFormat_Tpm -> "Tpm"
    AttestationFormat_AndroidKey -> "AndroidKey"
    AttestationFormat_AndroidSafetynet -> "AndroidSafetynet"
    AttestationFormat_FidoU2f -> "FidoU2f"
    AttestationFormat_Apple -> "Apple"
    AttestationFormat_None -> "None"

-- | Map of extension outputs from the client
-- |
-- | * `Appid` (Optional): `Maybe Boolean` - Application identifier extension output
-- | * `CredProps` (Optional): `Maybe CredentialPropertiesOutput` - Credential properties extension output
-- | * `HmacCreateSecret` (Optional): `Maybe Boolean` - HMAC secret extension output
type AuthenticationExtensionsClientOutputs =
  { "appid" :: Maybe Boolean -- Application identifier extension output
  , "credProps" :: Maybe CredentialPropertiesOutput -- Credential properties extension output
  , "hmacCreateSecret" :: Maybe Boolean -- HMAC secret extension output
  }

authenticationExtensionsClientOutputsCodec :: CJ.Codec AuthenticationExtensionsClientOutputs
authenticationExtensionsClientOutputsCodec =
  CJR.objectStrict
    { "appid": CJR.optional CJ.boolean
    , "credProps": CJR.optional credentialPropertiesOutputCodec
    , "hmacCreateSecret": CJR.optional CJ.boolean
    }

-- |
-- | * `ClientDataJSON`: `String` - Base64url encoded client data JSON
-- | * `AuthenticatorData`: `String` - Base64url encoded authenticator data
-- | * `Signature`: `String` - Base64url encoded assertion signature
-- | * `UserHandle` (Optional): `Maybe String` - Base64url encoded user handle
type AuthenticatorAssertionResponse =
  { "clientDataJSON" :: String -- Base64url encoded client data JSON
  , "authenticatorData" :: String -- Base64url encoded authenticator data
  , "signature" :: String -- Base64url encoded assertion signature
  , "userHandle" :: Maybe String -- Base64url encoded user handle
  }

authenticatorAssertionResponseCodec :: CJ.Codec AuthenticatorAssertionResponse
authenticatorAssertionResponseCodec =
  CJR.objectStrict
    { "clientDataJSON": CJ.string
    , "authenticatorData": CJ.string
    , "signature": CJ.string
    , "userHandle": CJR.optional CJ.string
    }

-- | The authenticator attachment modality
data AuthenticatorAttachment
  = AuthenticatorAttachment_Platform
  | AuthenticatorAttachment_CrossPlatform

derive instance genericAuthenticatorAttachment :: Generic AuthenticatorAttachment _
derive instance eqAuthenticatorAttachment :: Eq AuthenticatorAttachment
derive instance ordAuthenticatorAttachment :: Ord AuthenticatorAttachment

instance showAuthenticatorAttachment :: Show AuthenticatorAttachment where
  show = genericShow

authenticatorAttachmentCodec :: CJ.Codec AuthenticatorAttachment
authenticatorAttachmentCodec = CJ.prismaticCodec "AuthenticatorAttachment" dec enc CJ.string
  where
  dec = case _ of
    "Platform" -> Just AuthenticatorAttachment_Platform
    "CrossPlatform" -> Just AuthenticatorAttachment_CrossPlatform
    _ -> Nothing

  enc = case _ of
    AuthenticatorAttachment_Platform -> "Platform"
    AuthenticatorAttachment_CrossPlatform -> "CrossPlatform"

-- |
-- | * `ClientDataJSON`: `String` - Base64url-encoded binary data
-- | * `Transports` (Optional): `Maybe (Array String)` - The authenticator transports
-- | * `AuthenticatorData` (Optional): `Maybe String` - Base64url-encoded binary data
-- | * `PublicKey` (Optional): `Maybe String` - Base64url-encoded binary data
-- | * `PublicKeyAlgorithm` (Optional): `Maybe Int` - The public key algorithm identifier
-- | * `AttestationObject`: `String` - Base64url-encoded binary data
type AuthenticatorAttestationResponse =
  { "clientDataJSON" :: String -- Base64url-encoded binary data
  , "transports" :: Maybe (Array String) -- The authenticator transports
  , "authenticatorData" :: Maybe String -- Base64url-encoded binary data
  , "publicKey" :: Maybe String -- Base64url-encoded binary data
  , "publicKeyAlgorithm" :: Maybe Int -- The public key algorithm identifier
  , "attestationObject" :: String -- Base64url-encoded binary data
  }

authenticatorAttestationResponseCodec :: CJ.Codec AuthenticatorAttestationResponse
authenticatorAttestationResponseCodec =
  CJR.objectStrict
    { "clientDataJSON": CJ.string
    , "transports": CJR.optional (CJ.array CJ.string)
    , "authenticatorData": CJR.optional CJ.string
    , "publicKey": CJR.optional CJ.string
    , "publicKeyAlgorithm": CJR.optional CJ.int
    , "attestationObject": CJ.string
    }

-- |
-- | * `AuthenticatorAttachment` (Optional): `Maybe AuthenticatorAttachment` - The authenticator attachment modality
-- | * `RequireResidentKey` (Optional): `Maybe Boolean` - Whether the authenticator must create a client-side-resident public key credential source
-- | * `ResidentKey` (Optional): `Maybe ResidentKeyRequirement` - The resident key requirement
-- | * `UserVerification` (Optional): `Maybe UserVerificationRequirement` - A requirement for user verification for the operation
type AuthenticatorSelection =
  { "authenticatorAttachment" :: Maybe AuthenticatorAttachment -- The authenticator attachment modality
  , "requireResidentKey" :: Maybe Boolean -- Whether the authenticator must create a client-side-resident public key credential source
  , "residentKey" :: Maybe ResidentKeyRequirement -- The resident key requirement
  , "userVerification" :: Maybe UserVerificationRequirement -- A requirement for user verification for the operation
  }

authenticatorSelectionCodec :: CJ.Codec AuthenticatorSelection
authenticatorSelectionCodec =
  CJR.objectStrict
    { "authenticatorAttachment": CJR.optional authenticatorAttachmentCodec
    , "requireResidentKey": CJR.optional CJ.boolean
    , "residentKey": CJR.optional residentKeyRequirementCodec
    , "userVerification": CJR.optional userVerificationRequirementCodec
    }

-- | The authenticator transports that can be used
data AuthenticatorTransport
  = AuthenticatorTransport_Usb
  | AuthenticatorTransport_Nfc
  | AuthenticatorTransport_Ble
  | AuthenticatorTransport_SmartCard
  | AuthenticatorTransport_Hybrid
  | AuthenticatorTransport_Internal

derive instance genericAuthenticatorTransport :: Generic AuthenticatorTransport _
derive instance eqAuthenticatorTransport :: Eq AuthenticatorTransport
derive instance ordAuthenticatorTransport :: Ord AuthenticatorTransport

instance showAuthenticatorTransport :: Show AuthenticatorTransport where
  show = genericShow

authenticatorTransportCodec :: CJ.Codec AuthenticatorTransport
authenticatorTransportCodec = CJ.prismaticCodec "AuthenticatorTransport" dec enc CJ.string
  where
  dec = case _ of
    "Usb" -> Just AuthenticatorTransport_Usb
    "Nfc" -> Just AuthenticatorTransport_Nfc
    "Ble" -> Just AuthenticatorTransport_Ble
    "SmartCard" -> Just AuthenticatorTransport_SmartCard
    "Hybrid" -> Just AuthenticatorTransport_Hybrid
    "Internal" -> Just AuthenticatorTransport_Internal
    _ -> Nothing

  enc = case _ of
    AuthenticatorTransport_Usb -> "Usb"
    AuthenticatorTransport_Nfc -> "Nfc"
    AuthenticatorTransport_Ble -> "Ble"
    AuthenticatorTransport_SmartCard -> "SmartCard"
    AuthenticatorTransport_Hybrid -> "Hybrid"
    AuthenticatorTransport_Internal -> "Internal"

-- | The attestation conveyance preference
data ConveyancePreference
  = ConveyancePreference_None
  | ConveyancePreference_Indirect
  | ConveyancePreference_Direct
  | ConveyancePreference_Enterprise

derive instance genericConveyancePreference :: Generic ConveyancePreference _
derive instance eqConveyancePreference :: Eq ConveyancePreference
derive instance ordConveyancePreference :: Ord ConveyancePreference

instance showConveyancePreference :: Show ConveyancePreference where
  show = genericShow

conveyancePreferenceCodec :: CJ.Codec ConveyancePreference
conveyancePreferenceCodec = CJ.prismaticCodec "ConveyancePreference" dec enc CJ.string
  where
  dec = case _ of
    "None" -> Just ConveyancePreference_None
    "Indirect" -> Just ConveyancePreference_Indirect
    "Direct" -> Just ConveyancePreference_Direct
    "Enterprise" -> Just ConveyancePreference_Enterprise
    _ -> Nothing

  enc = case _ of
    ConveyancePreference_None -> "None"
    ConveyancePreference_Indirect -> "Indirect"
    ConveyancePreference_Direct -> "Direct"
    ConveyancePreference_Enterprise -> "Enterprise"

-- |
-- | * `ExpiresAt`: `String` - Expiration date of the PAT
-- | * `Metadata` (Optional): `Maybe J.JObject`
type CreatePATRequest =
  { "expiresAt" :: String -- Expiration date of the PAT
  , "metadata" :: Maybe J.JObject
  }

createPATRequestCodec :: CJ.Codec CreatePATRequest
createPATRequestCodec =
  CJR.objectStrict
    { "expiresAt": CJ.string
    , "metadata": CJR.optional CJ.jobject
    }

-- |
-- | * `Id`: `String` - ID of the PAT
-- | * `PersonalAccessToken`: `String` - PAT
type CreatePATResponse =
  { "id" :: String -- ID of the PAT
  , "personalAccessToken" :: String -- PAT
  }

createPATResponseCodec :: CJ.Codec CreatePATResponse
createPATResponseCodec =
  CJR.objectStrict
    { "id": CJ.string
    , "personalAccessToken": CJ.string
    }

-- |
-- | * `Id`: `String` - The credential's identifier
-- | * `Type`: `String` - The credential type represented by this object
-- | * `RawId`: `String` - Base64url-encoded binary data
-- | * `ClientExtensionResults` (Optional): `Maybe AuthenticationExtensionsClientOutputs` - Map of extension outputs from the client
-- | * `AuthenticatorAttachment` (Optional): `Maybe String` - The authenticator attachment
-- | * `Response`: `AuthenticatorAssertionResponse`
type CredentialAssertionResponse =
  { "id" :: String -- The credential's identifier
  , "type" :: String -- The credential type represented by this object
  , "rawId" :: String -- Base64url-encoded binary data
  , "clientExtensionResults" :: Maybe AuthenticationExtensionsClientOutputs -- Map of extension outputs from the client
  , "authenticatorAttachment" :: Maybe String -- The authenticator attachment
  , "response" :: AuthenticatorAssertionResponse
  }

credentialAssertionResponseCodec :: CJ.Codec CredentialAssertionResponse
credentialAssertionResponseCodec =
  CJR.objectStrict
    { "id": CJ.string
    , "type": CJ.string
    , "rawId": CJ.string
    , "clientExtensionResults": CJR.optional authenticationExtensionsClientOutputsCodec
    , "authenticatorAttachment": CJR.optional CJ.string
    , "response": authenticatorAssertionResponseCodec
    }

-- |
-- | * `Id`: `String` - The credential's identifier
-- | * `Type`: `String` - The credential type represented by this object
-- | * `RawId`: `String` - Base64url-encoded binary data
-- | * `ClientExtensionResults` (Optional): `Maybe AuthenticationExtensionsClientOutputs` - Map of extension outputs from the client
-- | * `AuthenticatorAttachment` (Optional): `Maybe String` - The authenticator attachment
-- | * `Response`: `AuthenticatorAttestationResponse`
type CredentialCreationResponse =
  { "id" :: String -- The credential's identifier
  , "type" :: String -- The credential type represented by this object
  , "rawId" :: String -- Base64url-encoded binary data
  , "clientExtensionResults" :: Maybe AuthenticationExtensionsClientOutputs -- Map of extension outputs from the client
  , "authenticatorAttachment" :: Maybe String -- The authenticator attachment
  , "response" :: AuthenticatorAttestationResponse
  }

credentialCreationResponseCodec :: CJ.Codec CredentialCreationResponse
credentialCreationResponseCodec =
  CJR.objectStrict
    { "id": CJ.string
    , "type": CJ.string
    , "rawId": CJ.string
    , "clientExtensionResults": CJR.optional authenticationExtensionsClientOutputsCodec
    , "authenticatorAttachment": CJR.optional CJ.string
    , "response": authenticatorAttestationResponseCodec
    }

-- |
-- | * `Type`: `CredentialType` - The valid credential types
-- | * `Alg`: `Int` - The cryptographic algorithm identifier
type CredentialParameter =
  { "type" :: CredentialType -- The valid credential types
  , "alg" :: Int -- The cryptographic algorithm identifier
  }

credentialParameterCodec :: CJ.Codec CredentialParameter
credentialParameterCodec =
  CJR.objectStrict
    { "type": credentialTypeCodec
    , "alg": CJ.int
    }

-- | Credential properties extension output
-- |
-- | * `Rk` (Optional): `Maybe Boolean` - Indicates if the credential is a resident key
type CredentialPropertiesOutput =
  { "rk" :: Maybe Boolean -- Indicates if the credential is a resident key
  }

credentialPropertiesOutputCodec :: CJ.Codec CredentialPropertiesOutput
credentialPropertiesOutputCodec =
  CJR.objectStrict
    { "rk": CJR.optional CJ.boolean
    }

-- | The valid credential types
data CredentialType = CredentialType_PublicKey

derive instance genericCredentialType :: Generic CredentialType _
derive instance eqCredentialType :: Eq CredentialType
derive instance ordCredentialType :: Ord CredentialType

instance showCredentialType :: Show CredentialType where
  show = genericShow

credentialTypeCodec :: CJ.Codec CredentialType
credentialTypeCodec = CJ.prismaticCodec "CredentialType" dec enc CJ.string
  where
  dec = case _ of
    "PublicKey" -> Just CredentialType_PublicKey
    _ -> Nothing

  enc = case _ of
    CredentialType_PublicKey -> "PublicKey"

-- | Error code identifying the specific application error
data ErrorResponseError
  = ErrorResponseError_DefaultRoleMustBeInAllowedRoles
  | ErrorResponseError_DisabledEndpoint
  | ErrorResponseError_DisabledUser
  | ErrorResponseError_EmailAlreadyInUse
  | ErrorResponseError_EmailAlreadyVerified
  | ErrorResponseError_ForbiddenAnonymous
  | ErrorResponseError_InternalServerError
  | ErrorResponseError_InvalidEmailPassword
  | ErrorResponseError_InvalidRequest
  | ErrorResponseError_LocaleNotAllowed
  | ErrorResponseError_PasswordTooShort
  | ErrorResponseError_PasswordInHibpDatabase
  | ErrorResponseError_RedirectToNotAllowed
  | ErrorResponseError_RoleNotAllowed
  | ErrorResponseError_SignupDisabled
  | ErrorResponseError_UnverifiedUser
  | ErrorResponseError_UserNotAnonymous
  | ErrorResponseError_InvalidPat
  | ErrorResponseError_InvalidRefreshToken
  | ErrorResponseError_InvalidTicket
  | ErrorResponseError_DisabledMfaTotp
  | ErrorResponseError_NoTotpSecret
  | ErrorResponseError_InvalidTotp
  | ErrorResponseError_MfaTypeNotFound
  | ErrorResponseError_TotpAlreadyActive
  | ErrorResponseError_InvalidState
  | ErrorResponseError_OauthTokenEchangeFailed
  | ErrorResponseError_OauthProfileFetchFailed
  | ErrorResponseError_OauthProviderError
  | ErrorResponseError_InvalidOtp
  | ErrorResponseError_CannotSendSms

derive instance genericErrorResponseError :: Generic ErrorResponseError _
derive instance eqErrorResponseError :: Eq ErrorResponseError
derive instance ordErrorResponseError :: Ord ErrorResponseError

instance showErrorResponseError :: Show ErrorResponseError where
  show = genericShow

errorResponseErrorCodec :: CJ.Codec ErrorResponseError
errorResponseErrorCodec = CJ.prismaticCodec "ErrorResponseError" dec enc CJ.string
  where
  dec = case _ of
    "DefaultRoleMustBeInAllowedRoles" -> Just ErrorResponseError_DefaultRoleMustBeInAllowedRoles
    "DisabledEndpoint" -> Just ErrorResponseError_DisabledEndpoint
    "DisabledUser" -> Just ErrorResponseError_DisabledUser
    "EmailAlreadyInUse" -> Just ErrorResponseError_EmailAlreadyInUse
    "EmailAlreadyVerified" -> Just ErrorResponseError_EmailAlreadyVerified
    "ForbiddenAnonymous" -> Just ErrorResponseError_ForbiddenAnonymous
    "InternalServerError" -> Just ErrorResponseError_InternalServerError
    "InvalidEmailPassword" -> Just ErrorResponseError_InvalidEmailPassword
    "InvalidRequest" -> Just ErrorResponseError_InvalidRequest
    "LocaleNotAllowed" -> Just ErrorResponseError_LocaleNotAllowed
    "PasswordTooShort" -> Just ErrorResponseError_PasswordTooShort
    "PasswordInHibpDatabase" -> Just ErrorResponseError_PasswordInHibpDatabase
    "RedirectToNotAllowed" -> Just ErrorResponseError_RedirectToNotAllowed
    "RoleNotAllowed" -> Just ErrorResponseError_RoleNotAllowed
    "SignupDisabled" -> Just ErrorResponseError_SignupDisabled
    "UnverifiedUser" -> Just ErrorResponseError_UnverifiedUser
    "UserNotAnonymous" -> Just ErrorResponseError_UserNotAnonymous
    "InvalidPat" -> Just ErrorResponseError_InvalidPat
    "InvalidRefreshToken" -> Just ErrorResponseError_InvalidRefreshToken
    "InvalidTicket" -> Just ErrorResponseError_InvalidTicket
    "DisabledMfaTotp" -> Just ErrorResponseError_DisabledMfaTotp
    "NoTotpSecret" -> Just ErrorResponseError_NoTotpSecret
    "InvalidTotp" -> Just ErrorResponseError_InvalidTotp
    "MfaTypeNotFound" -> Just ErrorResponseError_MfaTypeNotFound
    "TotpAlreadyActive" -> Just ErrorResponseError_TotpAlreadyActive
    "InvalidState" -> Just ErrorResponseError_InvalidState
    "OauthTokenEchangeFailed" -> Just ErrorResponseError_OauthTokenEchangeFailed
    "OauthProfileFetchFailed" -> Just ErrorResponseError_OauthProfileFetchFailed
    "OauthProviderError" -> Just ErrorResponseError_OauthProviderError
    "InvalidOtp" -> Just ErrorResponseError_InvalidOtp
    "CannotSendSms" -> Just ErrorResponseError_CannotSendSms
    _ -> Nothing

  enc = case _ of
    ErrorResponseError_DefaultRoleMustBeInAllowedRoles -> "DefaultRoleMustBeInAllowedRoles"
    ErrorResponseError_DisabledEndpoint -> "DisabledEndpoint"
    ErrorResponseError_DisabledUser -> "DisabledUser"
    ErrorResponseError_EmailAlreadyInUse -> "EmailAlreadyInUse"
    ErrorResponseError_EmailAlreadyVerified -> "EmailAlreadyVerified"
    ErrorResponseError_ForbiddenAnonymous -> "ForbiddenAnonymous"
    ErrorResponseError_InternalServerError -> "InternalServerError"
    ErrorResponseError_InvalidEmailPassword -> "InvalidEmailPassword"
    ErrorResponseError_InvalidRequest -> "InvalidRequest"
    ErrorResponseError_LocaleNotAllowed -> "LocaleNotAllowed"
    ErrorResponseError_PasswordTooShort -> "PasswordTooShort"
    ErrorResponseError_PasswordInHibpDatabase -> "PasswordInHibpDatabase"
    ErrorResponseError_RedirectToNotAllowed -> "RedirectToNotAllowed"
    ErrorResponseError_RoleNotAllowed -> "RoleNotAllowed"
    ErrorResponseError_SignupDisabled -> "SignupDisabled"
    ErrorResponseError_UnverifiedUser -> "UnverifiedUser"
    ErrorResponseError_UserNotAnonymous -> "UserNotAnonymous"
    ErrorResponseError_InvalidPat -> "InvalidPat"
    ErrorResponseError_InvalidRefreshToken -> "InvalidRefreshToken"
    ErrorResponseError_InvalidTicket -> "InvalidTicket"
    ErrorResponseError_DisabledMfaTotp -> "DisabledMfaTotp"
    ErrorResponseError_NoTotpSecret -> "NoTotpSecret"
    ErrorResponseError_InvalidTotp -> "InvalidTotp"
    ErrorResponseError_MfaTypeNotFound -> "MfaTypeNotFound"
    ErrorResponseError_TotpAlreadyActive -> "TotpAlreadyActive"
    ErrorResponseError_InvalidState -> "InvalidState"
    ErrorResponseError_OauthTokenEchangeFailed -> "OauthTokenEchangeFailed"
    ErrorResponseError_OauthProfileFetchFailed -> "OauthProfileFetchFailed"
    ErrorResponseError_OauthProviderError -> "OauthProviderError"
    ErrorResponseError_InvalidOtp -> "InvalidOtp"
    ErrorResponseError_CannotSendSms -> "CannotSendSms"

-- | Standardized error response
-- |
-- | * `Status`: `Int` - HTTP status error code
-- | * `Message`: `String` - Human-friendly error message
-- | * `Error`: `ErrorResponseError` - Error code identifying the specific application error
type ErrorResponse =
  { "status" :: Int -- HTTP status error code
  , "message" :: String -- Human-friendly error message
  , "error" :: ErrorResponseError -- Error code identifying the specific application error
  }

errorResponseCodec :: CJ.Codec ErrorResponse
errorResponseCodec =
  CJR.objectStrict
    { "status": CJ.int
    , "message": CJ.string
    , "error": errorResponseErrorCodec
    }

data IdTokenProvider
  = IdTokenProvider_Apple
  | IdTokenProvider_Google

derive instance genericIdTokenProvider :: Generic IdTokenProvider _
derive instance eqIdTokenProvider :: Eq IdTokenProvider
derive instance ordIdTokenProvider :: Ord IdTokenProvider

instance showIdTokenProvider :: Show IdTokenProvider where
  show = genericShow

idTokenProviderCodec :: CJ.Codec IdTokenProvider
idTokenProviderCodec = CJ.prismaticCodec "IdTokenProvider" dec enc CJ.string
  where
  dec = case _ of
    "Apple" -> Just IdTokenProvider_Apple
    "Google" -> Just IdTokenProvider_Google
    _ -> Nothing

  enc = case _ of
    IdTokenProvider_Apple -> "Apple"
    IdTokenProvider_Google -> "Google"

-- | JSON Web Key for JWT verification
-- |
-- | * `Alg`: `String` - Algorithm used with this key
-- | * `E`: `String` - RSA public exponent
-- | * `Kid`: `String` - Key ID
-- | * `Kty`: `String` - Key type
-- | * `N`: `String` - RSA modulus
-- | * `Use`: `String` - Key usage
type JWK =
  { "alg" :: String -- Algorithm used with this key
  , "e" :: String -- RSA public exponent
  , "kid" :: String -- Key ID
  , "kty" :: String -- Key type
  , "n" :: String -- RSA modulus
  , "use" :: String -- Key usage
  }

jWKCodec :: CJ.Codec JWK
jWKCodec =
  CJR.objectStrict
    { "alg": CJ.string
    , "e": CJ.string
    , "kid": CJ.string
    , "kty": CJ.string
    , "n": CJ.string
    , "use": CJ.string
    }

-- | JSON Web Key Set for verifying JWT signatures
-- |
-- | * `Keys`: `Array JWK` - Array of public keys
type JWKSet =
  { "keys" :: Array JWK -- Array of public keys
  }

jWKSetCodec :: CJ.Codec JWKSet
jWKSetCodec =
  CJR.objectStrict
    { "keys": (CJ.array jWKCodec)
    }

-- |
-- | * `Provider`: `IdTokenProvider`
-- | * `IdToken`: `String` - Apple ID token
-- | * `Nonce` (Optional): `Maybe String` - Nonce used during sign in process
type LinkIdTokenRequest =
  { "provider" :: IdTokenProvider
  , "idToken" :: String -- Apple ID token
  , "nonce" :: Maybe String -- Nonce used during sign in process
  }

linkIdTokenRequestCodec :: CJ.Codec LinkIdTokenRequest
linkIdTokenRequestCodec =
  CJR.objectStrict
    { "provider": idTokenProviderCodec
    , "idToken": CJ.string
    , "nonce": CJR.optional CJ.string
    }

-- | Challenge payload for multi-factor authentication
-- |
-- | * `Ticket`: `String` - Ticket to use when completing the MFA challenge
type MFAChallengePayload =
  { "ticket" :: String -- Ticket to use when completing the MFA challenge
  }

mFAChallengePayloadCodec :: CJ.Codec MFAChallengePayload
mFAChallengePayloadCodec =
  CJR.objectStrict
    { "ticket": CJ.string
    }

data OKResponse = OKResponse_OK

derive instance genericOKResponse :: Generic OKResponse _
derive instance eqOKResponse :: Eq OKResponse
derive instance ordOKResponse :: Ord OKResponse

instance showOKResponse :: Show OKResponse where
  show = genericShow

oKResponseCodec :: CJ.Codec OKResponse
oKResponseCodec = CJ.prismaticCodec "OKResponse" dec enc CJ.string
  where
  dec = case _ of
    "OK" -> Just OKResponse_OK
    _ -> Nothing

  enc = case _ of
    OKResponse_OK -> "OK"

-- |
-- | * `RedirectTo` (Optional): `Maybe String`
type OptionsRedirectTo =
  { "redirectTo" :: Maybe String
  }

optionsRedirectToCodec :: CJ.Codec OptionsRedirectTo
optionsRedirectToCodec =
  CJR.objectStrict
    { "redirectTo": CJR.optional CJ.string
    }

-- |
-- | * `Rp`: `RelyingPartyEntity`
-- | * `User`: `UserEntity`
-- | * `Challenge`: `String` - Base64url-encoded binary data
-- | * `PubKeyCredParams`: `Array CredentialParameter` - The desired credential types and their respective cryptographic parameters
-- | * `Timeout` (Optional): `Maybe Int` - A time, in milliseconds, that the caller is willing to wait for the call to complete
-- | * `ExcludeCredentials` (Optional): `Maybe (Array PublicKeyCredentialDescriptor)` - A list of PublicKeyCredentialDescriptor objects representing public key credentials that are not acceptable to the caller
-- | * `AuthenticatorSelection` (Optional): `Maybe AuthenticatorSelection`
-- | * `Hints` (Optional): `Maybe (Array PublicKeyCredentialHints)` - Hints to help guide the user through the experience
-- | * `Attestation` (Optional): `Maybe ConveyancePreference` - The attestation conveyance preference
-- | * `AttestationFormats` (Optional): `Maybe (Array AttestationFormat)` - The preferred attestation statement formats
-- | * `Extensions` (Optional): `Maybe J.JObject` - Additional parameters requesting additional processing by the client and authenticator
type PublicKeyCredentialCreationOptions =
  { "rp" :: RelyingPartyEntity
  , "user" :: UserEntity
  , "challenge" :: String -- Base64url-encoded binary data
  , "pubKeyCredParams" :: Array CredentialParameter -- The desired credential types and their respective cryptographic parameters
  , "timeout" :: Maybe Int -- A time, in milliseconds, that the caller is willing to wait for the call to complete
  , "excludeCredentials" :: Maybe (Array PublicKeyCredentialDescriptor) -- A list of PublicKeyCredentialDescriptor objects representing public key credentials that are not acceptable to the caller
  , "authenticatorSelection" :: Maybe AuthenticatorSelection
  , "hints" :: Maybe (Array PublicKeyCredentialHints) -- Hints to help guide the user through the experience
  , "attestation" :: Maybe ConveyancePreference -- The attestation conveyance preference
  , "attestationFormats" :: Maybe (Array AttestationFormat) -- The preferred attestation statement formats
  , "extensions" :: Maybe J.JObject -- Additional parameters requesting additional processing by the client and authenticator
  }

publicKeyCredentialCreationOptionsCodec :: CJ.Codec PublicKeyCredentialCreationOptions
publicKeyCredentialCreationOptionsCodec =
  CJR.objectStrict
    { "rp": relyingPartyEntityCodec
    , "user": userEntityCodec
    , "challenge": CJ.string
    , "pubKeyCredParams": (CJ.array credentialParameterCodec)
    , "timeout": CJR.optional CJ.int
    , "excludeCredentials": CJR.optional (CJ.array publicKeyCredentialDescriptorCodec)
    , "authenticatorSelection": CJR.optional authenticatorSelectionCodec
    , "hints": CJR.optional (CJ.array publicKeyCredentialHintsCodec)
    , "attestation": CJR.optional conveyancePreferenceCodec
    , "attestationFormats": CJR.optional (CJ.array attestationFormatCodec)
    , "extensions": CJR.optional CJ.jobject
    }

-- |
-- | * `Type`: `CredentialType` - The valid credential types
-- | * `Id`: `String` - Base64url-encoded binary data
-- | * `Transports` (Optional): `Maybe (Array AuthenticatorTransport)` - The authenticator transports that can be used
type PublicKeyCredentialDescriptor =
  { "type" :: CredentialType -- The valid credential types
  , "id" :: String -- Base64url-encoded binary data
  , "transports" :: Maybe (Array AuthenticatorTransport) -- The authenticator transports that can be used
  }

publicKeyCredentialDescriptorCodec :: CJ.Codec PublicKeyCredentialDescriptor
publicKeyCredentialDescriptorCodec =
  CJR.objectStrict
    { "type": credentialTypeCodec
    , "id": CJ.string
    , "transports": CJR.optional (CJ.array authenticatorTransportCodec)
    }

-- | Hints to help guide the user through the experience
data PublicKeyCredentialHints
  = PublicKeyCredentialHints_SecurityKey
  | PublicKeyCredentialHints_ClientDevice
  | PublicKeyCredentialHints_Hybrid

derive instance genericPublicKeyCredentialHints :: Generic PublicKeyCredentialHints _
derive instance eqPublicKeyCredentialHints :: Eq PublicKeyCredentialHints
derive instance ordPublicKeyCredentialHints :: Ord PublicKeyCredentialHints

instance showPublicKeyCredentialHints :: Show PublicKeyCredentialHints where
  show = genericShow

publicKeyCredentialHintsCodec :: CJ.Codec PublicKeyCredentialHints
publicKeyCredentialHintsCodec = CJ.prismaticCodec "PublicKeyCredentialHints" dec enc CJ.string
  where
  dec = case _ of
    "SecurityKey" -> Just PublicKeyCredentialHints_SecurityKey
    "ClientDevice" -> Just PublicKeyCredentialHints_ClientDevice
    "Hybrid" -> Just PublicKeyCredentialHints_Hybrid
    _ -> Nothing

  enc = case _ of
    PublicKeyCredentialHints_SecurityKey -> "SecurityKey"
    PublicKeyCredentialHints_ClientDevice -> "ClientDevice"
    PublicKeyCredentialHints_Hybrid -> "Hybrid"

-- |
-- | * `Challenge`: `String` - Base64url-encoded binary data
-- | * `Timeout` (Optional): `Maybe Int` - A time, in milliseconds, that the caller is willing to wait for the call to complete
-- | * `RpId` (Optional): `Maybe String` - The RP ID the credential should be scoped to
-- | * `AllowCredentials` (Optional): `Maybe (Array PublicKeyCredentialDescriptor)` - A list of CredentialDescriptor objects representing public key credentials acceptable to the caller
-- | * `UserVerification` (Optional): `Maybe UserVerificationRequirement` - A requirement for user verification for the operation
-- | * `Hints` (Optional): `Maybe (Array PublicKeyCredentialHints)` - Hints to help guide the user through the experience
-- | * `Extensions` (Optional): `Maybe J.JObject` - Additional parameters requesting additional processing by the client and authenticator
type PublicKeyCredentialRequestOptions =
  { "challenge" :: String -- Base64url-encoded binary data
  , "timeout" :: Maybe Int -- A time, in milliseconds, that the caller is willing to wait for the call to complete
  , "rpId" :: Maybe String -- The RP ID the credential should be scoped to
  , "allowCredentials" :: Maybe (Array PublicKeyCredentialDescriptor) -- A list of CredentialDescriptor objects representing public key credentials acceptable to the caller
  , "userVerification" :: Maybe UserVerificationRequirement -- A requirement for user verification for the operation
  , "hints" :: Maybe (Array PublicKeyCredentialHints) -- Hints to help guide the user through the experience
  , "extensions" :: Maybe J.JObject -- Additional parameters requesting additional processing by the client and authenticator
  }

publicKeyCredentialRequestOptionsCodec :: CJ.Codec PublicKeyCredentialRequestOptions
publicKeyCredentialRequestOptionsCodec =
  CJR.objectStrict
    { "challenge": CJ.string
    , "timeout": CJR.optional CJ.int
    , "rpId": CJR.optional CJ.string
    , "allowCredentials": CJR.optional (CJ.array publicKeyCredentialDescriptorCodec)
    , "userVerification": CJR.optional userVerificationRequirementCodec
    , "hints": CJR.optional (CJ.array publicKeyCredentialHintsCodec)
    , "extensions": CJR.optional CJ.jobject
    }

-- | Request to refresh an access token
-- |
-- | * `RefreshToken`: `String` - Refresh token used to generate a new access token
type RefreshTokenRequest =
  { "refreshToken" :: String -- Refresh token used to generate a new access token
  }

refreshTokenRequestCodec :: CJ.Codec RefreshTokenRequest
refreshTokenRequestCodec =
  CJR.objectStrict
    { "refreshToken": CJ.string
    }

-- |
-- | * `Name`: `String` - A human-palatable name for the entity
-- | * `Id`: `String` - A unique identifier for the Relying Party entity, which sets the RP ID
type RelyingPartyEntity =
  { "name" :: String -- A human-palatable name for the entity
  , "id" :: String -- A unique identifier for the Relying Party entity, which sets the RP ID
  }

relyingPartyEntityCodec :: CJ.Codec RelyingPartyEntity
relyingPartyEntityCodec =
  CJR.objectStrict
    { "name": CJ.string
    , "id": CJ.string
    }

-- | The resident key requirement
data ResidentKeyRequirement
  = ResidentKeyRequirement_Discouraged
  | ResidentKeyRequirement_Preferred
  | ResidentKeyRequirement_Required

derive instance genericResidentKeyRequirement :: Generic ResidentKeyRequirement _
derive instance eqResidentKeyRequirement :: Eq ResidentKeyRequirement
derive instance ordResidentKeyRequirement :: Ord ResidentKeyRequirement

instance showResidentKeyRequirement :: Show ResidentKeyRequirement where
  show = genericShow

residentKeyRequirementCodec :: CJ.Codec ResidentKeyRequirement
residentKeyRequirementCodec = CJ.prismaticCodec "ResidentKeyRequirement" dec enc CJ.string
  where
  dec = case _ of
    "Discouraged" -> Just ResidentKeyRequirement_Discouraged
    "Preferred" -> Just ResidentKeyRequirement_Preferred
    "Required" -> Just ResidentKeyRequirement_Required
    _ -> Nothing

  enc = case _ of
    ResidentKeyRequirement_Discouraged -> "Discouraged"
    ResidentKeyRequirement_Preferred -> "Preferred"
    ResidentKeyRequirement_Required -> "Required"

-- | User authentication session containing tokens and user information
-- |
-- | * `AccessToken`: `String` - JWT token for authenticating API requests
-- | * `AccessTokenExpiresIn`: `Int` - Expiration time of the access token in seconds
-- | * `RefreshTokenId`: `String` - Identifier for the refresh token
-- | * `RefreshToken`: `String` - Token used to refresh the access token
-- | * `User` (Optional): `Maybe User` - User profile and account information
type Session =
  { "accessToken" :: String -- JWT token for authenticating API requests
  , "accessTokenExpiresIn" :: Int -- Expiration time of the access token in seconds
  , "refreshTokenId" :: String -- Identifier for the refresh token
  , "refreshToken" :: String -- Token used to refresh the access token
  , "user" :: Maybe User -- User profile and account information
  }

sessionCodec :: CJ.Codec Session
sessionCodec =
  CJR.objectStrict
    { "accessToken": CJ.string
    , "accessTokenExpiresIn": CJ.int
    , "refreshTokenId": CJ.string
    , "refreshToken": CJ.string
    , "user": CJR.optional userCodec
    }

-- | Container for session information
-- |
-- | * `Session` (Optional): `Maybe Session` - User authentication session containing tokens and user information
type SessionPayload =
  { "session" :: Maybe Session -- User authentication session containing tokens and user information
  }

sessionPayloadCodec :: CJ.Codec SessionPayload
sessionPayloadCodec =
  CJR.objectStrict
    { "session": CJR.optional sessionCodec
    }

-- |
-- | * `DisplayName` (Optional): `Maybe String`
-- | * `Locale` (Optional): `Maybe String` - A two-characters locale
-- | * `Metadata` (Optional): `Maybe J.JObject`
type SignInAnonymousRequest =
  { "displayName" :: Maybe String
  , "locale" :: Maybe String -- A two-characters locale
  , "metadata" :: Maybe J.JObject
  }

signInAnonymousRequestCodec :: CJ.Codec SignInAnonymousRequest
signInAnonymousRequestCodec =
  CJR.objectStrict
    { "displayName": CJR.optional CJ.string
    , "locale": CJR.optional CJ.string
    , "metadata": CJR.optional CJ.jobject
    }

-- | Request to authenticate using email and password
-- |
-- | * `Email`: `String` - User's email address
-- | * `Password`: `String` - User's password
type SignInEmailPasswordRequest =
  { "email" :: String -- User's email address
  , "password" :: String -- User's password
  }

signInEmailPasswordRequestCodec :: CJ.Codec SignInEmailPasswordRequest
signInEmailPasswordRequestCodec =
  CJR.objectStrict
    { "email": CJ.string
    , "password": CJ.string
    }

-- | Response for email-password authentication that may include a session or MFA challenge
-- |
-- | * `Session` (Optional): `Maybe Session` - User authentication session containing tokens and user information
-- | * `Mfa` (Optional): `Maybe MFAChallengePayload` - Challenge payload for multi-factor authentication
type SignInEmailPasswordResponse =
  { "session" :: Maybe Session -- User authentication session containing tokens and user information
  , "mfa" :: Maybe MFAChallengePayload -- Challenge payload for multi-factor authentication
  }

signInEmailPasswordResponseCodec :: CJ.Codec SignInEmailPasswordResponse
signInEmailPasswordResponseCodec =
  CJR.objectStrict
    { "session": CJR.optional sessionCodec
    , "mfa": CJR.optional mFAChallengePayloadCodec
    }

-- |
-- | * `Provider`: `IdTokenProvider`
-- | * `IdToken`: `String` - Apple ID token
-- | * `Nonce` (Optional): `Maybe String` - Nonce used during sign in process
-- | * `Options` (Optional): `Maybe SignUpOptions`
type SignInIdTokenRequest =
  { "provider" :: IdTokenProvider
  , "idToken" :: String -- Apple ID token
  , "nonce" :: Maybe String -- Nonce used during sign in process
  , "options" :: Maybe SignUpOptions
  }

signInIdTokenRequestCodec :: CJ.Codec SignInIdTokenRequest
signInIdTokenRequestCodec =
  CJR.objectStrict
    { "provider": idTokenProviderCodec
    , "idToken": CJ.string
    , "nonce": CJR.optional CJ.string
    , "options": CJR.optional signUpOptionsCodec
    }

-- |
-- | * `Ticket`: `String` - Ticket
-- | * `Otp`: `String` - One time password
type SignInMfaTotpRequest =
  { "ticket" :: String -- Ticket
  , "otp" :: String -- One time password
  }

signInMfaTotpRequestCodec :: CJ.Codec SignInMfaTotpRequest
signInMfaTotpRequestCodec =
  CJR.objectStrict
    { "ticket": CJ.string
    , "otp": CJ.string
    }

-- |
-- | * `Email`: `String` - A valid email
-- | * `Options` (Optional): `Maybe SignUpOptions`
type SignInOTPEmailRequest =
  { "email" :: String -- A valid email
  , "options" :: Maybe SignUpOptions
  }

signInOTPEmailRequestCodec :: CJ.Codec SignInOTPEmailRequest
signInOTPEmailRequestCodec =
  CJR.objectStrict
    { "email": CJ.string
    , "options": CJR.optional signUpOptionsCodec
    }

-- |
-- | * `Otp`: `String` - One time password
-- | * `Email`: `String` - A valid email
type SignInOTPEmailVerifyRequest =
  { "otp" :: String -- One time password
  , "email" :: String -- A valid email
  }

signInOTPEmailVerifyRequestCodec :: CJ.Codec SignInOTPEmailVerifyRequest
signInOTPEmailVerifyRequestCodec =
  CJR.objectStrict
    { "otp": CJ.string
    , "email": CJ.string
    }

-- |
-- | * `Session` (Optional): `Maybe Session` - User authentication session containing tokens and user information
type SignInOTPEmailVerifyResponse =
  { "session" :: Maybe Session -- User authentication session containing tokens and user information
  }

signInOTPEmailVerifyResponseCodec :: CJ.Codec SignInOTPEmailVerifyResponse
signInOTPEmailVerifyResponseCodec =
  CJR.objectStrict
    { "session": CJR.optional sessionCodec
    }

-- |
-- | * `PersonalAccessToken`: `String` - PAT
type SignInPATRequest =
  { "personalAccessToken" :: String -- PAT
  }

signInPATRequestCodec :: CJ.Codec SignInPATRequest
signInPATRequestCodec =
  CJR.objectStrict
    { "personalAccessToken": CJ.string
    }

-- |
-- | * `Email`: `String` - A valid email
-- | * `Options` (Optional): `Maybe SignUpOptions`
type SignInPasswordlessEmailRequest =
  { "email" :: String -- A valid email
  , "options" :: Maybe SignUpOptions
  }

signInPasswordlessEmailRequestCodec :: CJ.Codec SignInPasswordlessEmailRequest
signInPasswordlessEmailRequestCodec =
  CJR.objectStrict
    { "email": CJ.string
    , "options": CJR.optional signUpOptionsCodec
    }

-- |
-- | * `PhoneNumber`: `String` - Phone number of the user
-- | * `Otp`: `String` - One-time password received by SMS
type SignInPasswordlessSmsOtpRequest =
  { "phoneNumber" :: String -- Phone number of the user
  , "otp" :: String -- One-time password received by SMS
  }

signInPasswordlessSmsOtpRequestCodec :: CJ.Codec SignInPasswordlessSmsOtpRequest
signInPasswordlessSmsOtpRequestCodec =
  CJR.objectStrict
    { "phoneNumber": CJ.string
    , "otp": CJ.string
    }

-- |
-- | * `Session` (Optional): `Maybe Session` - User authentication session containing tokens and user information
-- | * `Mfa` (Optional): `Maybe MFAChallengePayload` - Challenge payload for multi-factor authentication
type SignInPasswordlessSmsOtpResponse =
  { "session" :: Maybe Session -- User authentication session containing tokens and user information
  , "mfa" :: Maybe MFAChallengePayload -- Challenge payload for multi-factor authentication
  }

signInPasswordlessSmsOtpResponseCodec :: CJ.Codec SignInPasswordlessSmsOtpResponse
signInPasswordlessSmsOtpResponseCodec =
  CJR.objectStrict
    { "session": CJR.optional sessionCodec
    , "mfa": CJR.optional mFAChallengePayloadCodec
    }

-- |
-- | * `PhoneNumber`: `String` - Phone number of the user
-- | * `Options` (Optional): `Maybe SignUpOptions`
type SignInPasswordlessSmsRequest =
  { "phoneNumber" :: String -- Phone number of the user
  , "options" :: Maybe SignUpOptions
  }

signInPasswordlessSmsRequestCodec :: CJ.Codec SignInPasswordlessSmsRequest
signInPasswordlessSmsRequestCodec =
  CJR.objectStrict
    { "phoneNumber": CJ.string
    , "options": CJR.optional signUpOptionsCodec
    }

-- |
-- | * `Email` (Optional): `Maybe String` - A valid email
type SignInWebauthnRequest =
  { "email" :: Maybe String -- A valid email
  }

signInWebauthnRequestCodec :: CJ.Codec SignInWebauthnRequest
signInWebauthnRequestCodec =
  CJR.objectStrict
    { "email": CJR.optional CJ.string
    }

-- |
-- | * `Email` (Optional): `Maybe String` - A valid email. Deprecated, no longer used
-- | * `Credential`: `CredentialAssertionResponse`
type SignInWebauthnVerifyRequest =
  { "email" :: Maybe String -- A valid email. Deprecated, no longer used
  , "credential" :: CredentialAssertionResponse
  }

signInWebauthnVerifyRequestCodec :: CJ.Codec SignInWebauthnVerifyRequest
signInWebauthnVerifyRequestCodec =
  CJR.objectStrict
    { "email": CJR.optional CJ.string
    , "credential": credentialAssertionResponseCodec
    }

-- |
-- | * `RefreshToken` (Optional): `Maybe String` - Refresh token for the current session
-- | * `All` (Optional): `Maybe Boolean` - Sign out from all connected devices
type SignOutRequest =
  { "refreshToken" :: Maybe String -- Refresh token for the current session
  , "all" :: Maybe Boolean -- Sign out from all connected devices
  }

signOutRequestCodec :: CJ.Codec SignOutRequest
signOutRequestCodec =
  CJR.objectStrict
    { "refreshToken": CJR.optional CJ.string
    , "all": CJR.optional CJ.boolean
    }

-- | Request to register a new user with email and password
-- |
-- | * `Email`: `String` - Email address for the new user account
-- | * `Password`: `String` - Password for the new user account
-- | * `Options` (Optional): `Maybe SignUpOptions`
type SignUpEmailPasswordRequest =
  { "email" :: String -- Email address for the new user account
  , "password" :: String -- Password for the new user account
  , "options" :: Maybe SignUpOptions
  }

signUpEmailPasswordRequestCodec :: CJ.Codec SignUpEmailPasswordRequest
signUpEmailPasswordRequestCodec =
  CJR.objectStrict
    { "email": CJ.string
    , "password": CJ.string
    , "options": CJR.optional signUpOptionsCodec
    }

-- |
-- | * `AllowedRoles` (Optional): `Maybe (Array String)`
-- | * `DefaultRole` (Optional): `Maybe String`
-- | * `DisplayName` (Optional): `Maybe String`
-- | * `Locale` (Optional): `Maybe String` - A two-characters locale
-- | * `Metadata` (Optional): `Maybe J.JObject`
-- | * `RedirectTo` (Optional): `Maybe String`
type SignUpOptions =
  { "allowedRoles" :: Maybe (Array String)
  , "defaultRole" :: Maybe String
  , "displayName" :: Maybe String
  , "locale" :: Maybe String -- A two-characters locale
  , "metadata" :: Maybe J.JObject
  , "redirectTo" :: Maybe String
  }

signUpOptionsCodec :: CJ.Codec SignUpOptions
signUpOptionsCodec =
  CJR.objectStrict
    { "allowedRoles": CJR.optional (CJ.array CJ.string)
    , "defaultRole": CJR.optional CJ.string
    , "displayName": CJR.optional CJ.string
    , "locale": CJR.optional CJ.string
    , "metadata": CJR.optional CJ.jobject
    , "redirectTo": CJR.optional CJ.string
    }

-- |
-- | * `Email`: `String` - A valid email
-- | * `Options` (Optional): `Maybe SignUpOptions`
type SignUpWebauthnRequest =
  { "email" :: String -- A valid email
  , "options" :: Maybe SignUpOptions
  }

signUpWebauthnRequestCodec :: CJ.Codec SignUpWebauthnRequest
signUpWebauthnRequestCodec =
  CJR.objectStrict
    { "email": CJ.string
    , "options": CJR.optional signUpOptionsCodec
    }

-- |
-- | * `Credential`: `CredentialCreationResponse`
-- | * `Options` (Optional): `Maybe SignUpOptions`
-- | * `Nickname` (Optional): `Maybe String` - Nickname for the security key
type SignUpWebauthnVerifyRequest =
  { "credential" :: CredentialCreationResponse
  , "options" :: Maybe SignUpOptions
  , "nickname" :: Maybe String -- Nickname for the security key
  }

signUpWebauthnVerifyRequestCodec :: CJ.Codec SignUpWebauthnVerifyRequest
signUpWebauthnVerifyRequestCodec =
  CJR.objectStrict
    { "credential": credentialCreationResponseCodec
    , "options": CJR.optional signUpOptionsCodec
    , "nickname": CJR.optional CJ.string
    }

-- | Response containing TOTP setup information for MFA
-- |
-- | * `ImageUrl`: `String` - URL to QR code image for scanning with an authenticator app
-- | * `TotpSecret`: `String` - TOTP secret key for manual setup with an authenticator app
type TotpGenerateResponse =
  { "imageUrl" :: String -- URL to QR code image for scanning with an authenticator app
  , "totpSecret" :: String -- TOTP secret key for manual setup with an authenticator app
  }

totpGenerateResponseCodec :: CJ.Codec TotpGenerateResponse
totpGenerateResponseCodec =
  CJR.objectStrict
    { "imageUrl": CJ.string
    , "totpSecret": CJ.string
    }

-- | Base64url-encoded binary data
newtype URLEncodedBase64 = URLEncodedBase64 String

derive instance Newtype URLEncodedBase64 _
derive instance Generic URLEncodedBase64 _
derive instance Eq URLEncodedBase64

instance Show URLEncodedBase64 where
  show x = genericShow x

uRLEncodedBase64Codec :: CJ.Codec URLEncodedBase64
uRLEncodedBase64Codec = dimap unwrap wrap CJ.string

-- | User profile and account information
-- |
-- | * `AvatarUrl`: `String` - URL to the user's profile picture
-- | * `CreatedAt`: `String` - Timestamp when the user account was created
-- | * `DefaultRole`: `String` - Default authorization role for the user
-- | * `DisplayName`: `String` - User's display name
-- | * `Email` (Optional): `Maybe String` - User's email address
-- | * `EmailVerified`: `Boolean` - Whether the user's email has been verified
-- | * `Id`: `String` - Unique identifier for the user
-- | * `IsAnonymous`: `Boolean` - Whether this is an anonymous user account
-- | * `Locale`: `String` - User's preferred locale (language code)
-- | * `Metadata`: `J.JObject` - Custom metadata associated with the user
-- | * `PhoneNumber` (Optional): `Maybe String` - User's phone number
-- | * `PhoneNumberVerified`: `Boolean` - Whether the user's phone number has been verified
-- | * `Roles`: `Array String` - List of roles assigned to the user
-- | * `ActiveMfaType` (Optional): `Maybe String` - Active MFA type for the user
type User =
  { "avatarUrl" :: String -- URL to the user's profile picture
  , "createdAt" :: String -- Timestamp when the user account was created
  , "defaultRole" :: String -- Default authorization role for the user
  , "displayName" :: String -- User's display name
  , "email" :: Maybe String -- User's email address
  , "emailVerified" :: Boolean -- Whether the user's email has been verified
  , "id" :: String -- Unique identifier for the user
  , "isAnonymous" :: Boolean -- Whether this is an anonymous user account
  , "locale" :: String -- User's preferred locale (language code)
  , "metadata" :: J.JObject -- Custom metadata associated with the user
  , "phoneNumber" :: Maybe String -- User's phone number
  , "phoneNumberVerified" :: Boolean -- Whether the user's phone number has been verified
  , "roles" :: Array String -- List of roles assigned to the user
  , "activeMfaType" :: Maybe String -- Active MFA type for the user
  }

userCodec :: CJ.Codec User
userCodec =
  CJR.objectStrict
    { "avatarUrl": CJ.string
    , "createdAt": CJ.string
    , "defaultRole": CJ.string
    , "displayName": CJ.string
    , "email": CJR.optional CJ.string
    , "emailVerified": CJ.boolean
    , "id": CJ.string
    , "isAnonymous": CJ.boolean
    , "locale": CJ.string
    , "metadata": CJ.jobject
    , "phoneNumber": CJR.optional CJ.string
    , "phoneNumberVerified": CJ.boolean
    , "roles": (CJ.array CJ.string)
    , "activeMfaType": CJR.optional CJ.string
    }

-- | Which sign-in method to use
data UserDeanonymizeRequestSignInMethod
  = UserDeanonymizeRequestSignInMethod_EmailPassword
  | UserDeanonymizeRequestSignInMethod_Passwordless

derive instance genericUserDeanonymizeRequestSignInMethod :: Generic UserDeanonymizeRequestSignInMethod _
derive instance eqUserDeanonymizeRequestSignInMethod :: Eq UserDeanonymizeRequestSignInMethod
derive instance ordUserDeanonymizeRequestSignInMethod :: Ord UserDeanonymizeRequestSignInMethod

instance showUserDeanonymizeRequestSignInMethod :: Show UserDeanonymizeRequestSignInMethod where
  show = genericShow

userDeanonymizeRequestSignInMethodCodec :: CJ.Codec UserDeanonymizeRequestSignInMethod
userDeanonymizeRequestSignInMethodCodec = CJ.prismaticCodec "UserDeanonymizeRequestSignInMethod" dec enc CJ.string
  where
  dec = case _ of
    "EmailPassword" -> Just UserDeanonymizeRequestSignInMethod_EmailPassword
    "Passwordless" -> Just UserDeanonymizeRequestSignInMethod_Passwordless
    _ -> Nothing

  enc = case _ of
    UserDeanonymizeRequestSignInMethod_EmailPassword -> "EmailPassword"
    UserDeanonymizeRequestSignInMethod_Passwordless -> "Passwordless"

-- |
-- | * `SignInMethod`: `UserDeanonymizeRequestSignInMethod` - Which sign-in method to use
-- | * `Email`: `String` - A valid email
-- | * `Password` (Optional): `Maybe String` - A password of minimum 3 characters
-- | * `Connection` (Optional): `Maybe String` - Deprecated, will be ignored
-- | * `Options` (Optional): `Maybe SignUpOptions`
type UserDeanonymizeRequest =
  { "signInMethod" :: UserDeanonymizeRequestSignInMethod -- Which sign-in method to use
  , "email" :: String -- A valid email
  , "password" :: Maybe String -- A password of minimum 3 characters
  , "connection" :: Maybe String -- Deprecated, will be ignored
  , "options" :: Maybe SignUpOptions
  }

userDeanonymizeRequestCodec :: CJ.Codec UserDeanonymizeRequest
userDeanonymizeRequestCodec =
  CJR.objectStrict
    { "signInMethod": userDeanonymizeRequestSignInMethodCodec
    , "email": CJ.string
    , "password": CJR.optional CJ.string
    , "connection": CJR.optional CJ.string
    , "options": CJR.optional signUpOptionsCodec
    }

-- |
-- | * `NewEmail`: `String` - A valid email
-- | * `Options` (Optional): `Maybe OptionsRedirectTo`
type UserEmailChangeRequest =
  { "newEmail" :: String -- A valid email
  , "options" :: Maybe OptionsRedirectTo
  }

userEmailChangeRequestCodec :: CJ.Codec UserEmailChangeRequest
userEmailChangeRequestCodec =
  CJR.objectStrict
    { "newEmail": CJ.string
    , "options": CJR.optional optionsRedirectToCodec
    }

-- |
-- | * `Email`: `String` - A valid email
-- | * `Options` (Optional): `Maybe OptionsRedirectTo`
type UserEmailSendVerificationEmailRequest =
  { "email" :: String -- A valid email
  , "options" :: Maybe OptionsRedirectTo
  }

userEmailSendVerificationEmailRequestCodec :: CJ.Codec UserEmailSendVerificationEmailRequest
userEmailSendVerificationEmailRequestCodec =
  CJR.objectStrict
    { "email": CJ.string
    , "options": CJR.optional optionsRedirectToCodec
    }

-- |
-- | * `Name`: `String` - A human-palatable name for the entity
-- | * `DisplayName`: `String` - A human-palatable name for the user account, intended only for display
-- | * `Id`: `String` - The user handle of the user account entity
type UserEntity =
  { "name" :: String -- A human-palatable name for the entity
  , "displayName" :: String -- A human-palatable name for the user account, intended only for display
  , "id" :: String -- The user handle of the user account entity
  }

userEntityCodec :: CJ.Codec UserEntity
userEntityCodec =
  CJR.objectStrict
    { "name": CJ.string
    , "displayName": CJ.string
    , "id": CJ.string
    }

-- | Type of MFA to activate. Use empty string to disable MFA.
data UserMfaRequestActiveMfaType
  = UserMfaRequestActiveMfaType_Totp
  | UserMfaRequestActiveMfaType_Empty

derive instance genericUserMfaRequestActiveMfaType :: Generic UserMfaRequestActiveMfaType _
derive instance eqUserMfaRequestActiveMfaType :: Eq UserMfaRequestActiveMfaType
derive instance ordUserMfaRequestActiveMfaType :: Ord UserMfaRequestActiveMfaType

instance showUserMfaRequestActiveMfaType :: Show UserMfaRequestActiveMfaType where
  show = genericShow

userMfaRequestActiveMfaTypeCodec :: CJ.Codec UserMfaRequestActiveMfaType
userMfaRequestActiveMfaTypeCodec = CJ.prismaticCodec "UserMfaRequestActiveMfaType" dec enc CJ.string
  where
  dec = case _ of
    "Totp" -> Just UserMfaRequestActiveMfaType_Totp
    "" -> Just UserMfaRequestActiveMfaType_Empty
    _ -> Nothing

  enc = case _ of
    UserMfaRequestActiveMfaType_Totp -> "Totp"
    UserMfaRequestActiveMfaType_Empty -> ""

-- | Request to activate or deactivate multi-factor authentication
-- |
-- | * `Code`: `String` - Verification code from the authenticator app when activating MFA
-- | * `ActiveMfaType` (Optional): `Maybe UserMfaRequestActiveMfaType` - Type of MFA to activate. Use empty string to disable MFA.
type UserMfaRequest =
  { "code" :: String -- Verification code from the authenticator app when activating MFA
  , "activeMfaType" :: Maybe UserMfaRequestActiveMfaType -- Type of MFA to activate. Use empty string to disable MFA.
  }

userMfaRequestCodec :: CJ.Codec UserMfaRequest
userMfaRequestCodec =
  CJR.objectStrict
    { "code": CJ.string
    , "activeMfaType": CJR.optional userMfaRequestActiveMfaTypeCodec
    }

-- |
-- | * `NewPassword`: `String` - A password of minimum 3 characters
-- | * `Ticket` (Optional): `Maybe String` - Ticket to reset the password, required if the user is not authenticated
type UserPasswordRequest =
  { "newPassword" :: String -- A password of minimum 3 characters
  , "ticket" :: Maybe String -- Ticket to reset the password, required if the user is not authenticated
  }

userPasswordRequestCodec :: CJ.Codec UserPasswordRequest
userPasswordRequestCodec =
  CJR.objectStrict
    { "newPassword": CJ.string
    , "ticket": CJR.optional CJ.string
    }

-- |
-- | * `Email`: `String` - A valid email
-- | * `Options` (Optional): `Maybe OptionsRedirectTo`
type UserPasswordResetRequest =
  { "email" :: String -- A valid email
  , "options" :: Maybe OptionsRedirectTo
  }

userPasswordResetRequestCodec :: CJ.Codec UserPasswordResetRequest
userPasswordResetRequestCodec =
  CJR.objectStrict
    { "email": CJ.string
    , "options": CJR.optional optionsRedirectToCodec
    }

-- | A requirement for user verification for the operation
data UserVerificationRequirement
  = UserVerificationRequirement_Required
  | UserVerificationRequirement_Preferred
  | UserVerificationRequirement_Discouraged

derive instance genericUserVerificationRequirement :: Generic UserVerificationRequirement _
derive instance eqUserVerificationRequirement :: Eq UserVerificationRequirement
derive instance ordUserVerificationRequirement :: Ord UserVerificationRequirement

instance showUserVerificationRequirement :: Show UserVerificationRequirement where
  show = genericShow

userVerificationRequirementCodec :: CJ.Codec UserVerificationRequirement
userVerificationRequirementCodec = CJ.prismaticCodec "UserVerificationRequirement" dec enc CJ.string
  where
  dec = case _ of
    "Required" -> Just UserVerificationRequirement_Required
    "Preferred" -> Just UserVerificationRequirement_Preferred
    "Discouraged" -> Just UserVerificationRequirement_Discouraged
    _ -> Nothing

  enc = case _ of
    UserVerificationRequirement_Required -> "Required"
    UserVerificationRequirement_Preferred -> "Preferred"
    UserVerificationRequirement_Discouraged -> "Discouraged"

-- |
-- | * `Credential`: `CredentialCreationResponse`
-- | * `Nickname` (Optional): `Maybe String` - Optional nickname for the security key
type VerifyAddSecurityKeyRequest =
  { "credential" :: CredentialCreationResponse
  , "nickname" :: Maybe String -- Optional nickname for the security key
  }

verifyAddSecurityKeyRequestCodec :: CJ.Codec VerifyAddSecurityKeyRequest
verifyAddSecurityKeyRequestCodec =
  CJR.objectStrict
    { "credential": credentialCreationResponseCodec
    , "nickname": CJR.optional CJ.string
    }

-- |
-- | * `Id`: `String` - The ID of the newly added security key
-- | * `Nickname` (Optional): `Maybe String` - The nickname of the security key if provided
type VerifyAddSecurityKeyResponse =
  { "id" :: String -- The ID of the newly added security key
  , "nickname" :: Maybe String -- The nickname of the security key if provided
  }

verifyAddSecurityKeyResponseCodec :: CJ.Codec VerifyAddSecurityKeyResponse
verifyAddSecurityKeyResponseCodec =
  CJR.objectStrict
    { "id": CJ.string
    , "nickname": CJR.optional CJ.string
    }

-- |
-- | * `Token` (Optional): `Maybe String` - JWT token to verify
type VerifyTokenRequest =
  { "token" :: Maybe String -- JWT token to verify
  }

verifyTokenRequestCodec :: CJ.Codec VerifyTokenRequest
verifyTokenRequestCodec =
  CJR.objectStrict
    { "token": CJR.optional CJ.string
    }

-- | Target URL for the redirect
newtype RedirectToQuery = RedirectToQuery String

derive instance Newtype RedirectToQuery _
derive instance Generic RedirectToQuery _
derive instance Eq RedirectToQuery

instance Show RedirectToQuery where
  show x = genericShow x

redirectToQueryCodec :: CJ.Codec RedirectToQuery
redirectToQueryCodec = dimap unwrap wrap CJ.string

data SignInProvider
  = SignInProvider_Apple
  | SignInProvider_Github
  | SignInProvider_Google
  | SignInProvider_Linkedin
  | SignInProvider_Discord
  | SignInProvider_Spotify
  | SignInProvider_Twitch
  | SignInProvider_Gitlab
  | SignInProvider_Bitbucket
  | SignInProvider_Workos
  | SignInProvider_Azuread
  | SignInProvider_Strava
  | SignInProvider_Facebook
  | SignInProvider_Windowslive
  | SignInProvider_Twitter

derive instance genericSignInProvider :: Generic SignInProvider _
derive instance eqSignInProvider :: Eq SignInProvider
derive instance ordSignInProvider :: Ord SignInProvider

instance showSignInProvider :: Show SignInProvider where
  show = genericShow

signInProviderCodec :: CJ.Codec SignInProvider
signInProviderCodec = CJ.prismaticCodec "SignInProvider" dec enc CJ.string
  where
  dec = case _ of
    "Apple" -> Just SignInProvider_Apple
    "Github" -> Just SignInProvider_Github
    "Google" -> Just SignInProvider_Google
    "Linkedin" -> Just SignInProvider_Linkedin
    "Discord" -> Just SignInProvider_Discord
    "Spotify" -> Just SignInProvider_Spotify
    "Twitch" -> Just SignInProvider_Twitch
    "Gitlab" -> Just SignInProvider_Gitlab
    "Bitbucket" -> Just SignInProvider_Bitbucket
    "Workos" -> Just SignInProvider_Workos
    "Azuread" -> Just SignInProvider_Azuread
    "Strava" -> Just SignInProvider_Strava
    "Facebook" -> Just SignInProvider_Facebook
    "Windowslive" -> Just SignInProvider_Windowslive
    "Twitter" -> Just SignInProvider_Twitter
    _ -> Nothing

  enc = case _ of
    SignInProvider_Apple -> "Apple"
    SignInProvider_Github -> "Github"
    SignInProvider_Google -> "Google"
    SignInProvider_Linkedin -> "Linkedin"
    SignInProvider_Discord -> "Discord"
    SignInProvider_Spotify -> "Spotify"
    SignInProvider_Twitch -> "Twitch"
    SignInProvider_Gitlab -> "Gitlab"
    SignInProvider_Bitbucket -> "Bitbucket"
    SignInProvider_Workos -> "Workos"
    SignInProvider_Azuread -> "Azuread"
    SignInProvider_Strava -> "Strava"
    SignInProvider_Facebook -> "Facebook"
    SignInProvider_Windowslive -> "Windowslive"
    SignInProvider_Twitter -> "Twitter"

-- | Ticket
newtype TicketQuery = TicketQuery String

derive instance Newtype TicketQuery _
derive instance Generic TicketQuery _
derive instance Eq TicketQuery

instance Show TicketQuery where
  show x = genericShow x

ticketQueryCodec :: CJ.Codec TicketQuery
ticketQueryCodec = dimap unwrap wrap CJ.string

-- | Type of the ticket
data TicketTypeQuery
  = TicketTypeQuery_EmailVerify
  | TicketTypeQuery_EmailConfirmChange
  | TicketTypeQuery_SigninPasswordless
  | TicketTypeQuery_PasswordReset

derive instance genericTicketTypeQuery :: Generic TicketTypeQuery _
derive instance eqTicketTypeQuery :: Eq TicketTypeQuery
derive instance ordTicketTypeQuery :: Ord TicketTypeQuery

instance showTicketTypeQuery :: Show TicketTypeQuery where
  show = genericShow

ticketTypeQueryCodec :: CJ.Codec TicketTypeQuery
ticketTypeQueryCodec = CJ.prismaticCodec "TicketTypeQuery" dec enc CJ.string
  where
  dec = case _ of
    "EmailVerify" -> Just TicketTypeQuery_EmailVerify
    "EmailConfirmChange" -> Just TicketTypeQuery_EmailConfirmChange
    "SigninPasswordless" -> Just TicketTypeQuery_SigninPasswordless
    "PasswordReset" -> Just TicketTypeQuery_PasswordReset
    _ -> Nothing

  enc = case _ of
    TicketTypeQuery_EmailVerify -> "EmailVerify"
    TicketTypeQuery_EmailConfirmChange -> "EmailConfirmChange"
    TicketTypeQuery_SigninPasswordless -> "SigninPasswordless"
    TicketTypeQuery_PasswordReset -> "PasswordReset"

-- |
-- | * `Version`: `String` - The version of the authentication service
type GetVersionResponse200 =
  { "version" :: String -- The version of the authentication service
  }

getVersionResponse200Codec :: CJ.Codec GetVersionResponse200
getVersionResponse200Codec =
  CJR.objectStrict
    { "version": CJ.string
    }

-- | Parameters for the SignInProvider method.
type SignInProviderParams =
  { "allowedRoles" :: Maybe (Array String) -- Array of allowed roles for the user
  , "defaultRole" :: Maybe String -- Default role for the user
  , "displayName" :: Maybe String -- Display name for the user
  , "locale" :: Maybe String -- A two-characters locale
  , "metadata" :: Maybe J.JObject -- Additional metadata for the user (JSON encoded string)
  , "redirectTo" :: Maybe String -- URI to redirect to
  , "connect" :: Maybe String -- If set, this means that the user is already authenticated and wants to link their account. This needs to be a valid JWT access token.
  }

signInProviderParamsCodec :: CJ.Codec SignInProviderParams
signInProviderParamsCodec =
  CJR.objectStrict
    { "allowedRoles": CJ.maybe (CJ.array CJ.string)
    , "defaultRole": CJ.maybe CJ.string
    , "displayName": CJ.maybe CJ.string
    , "locale": CJ.maybe CJ.string
    , "metadata": CJ.maybe CJ.jobject
    , "redirectTo": CJ.maybe CJ.string
    , "connect": CJ.maybe CJ.string
    }

-- | Parameters for the VerifyTicket method.
type VerifyTicketParams =
  { "ticket" :: TicketQuery -- Ticket
  , "type" :: Maybe TicketTypeQuery -- Type of the ticket. Deprecated, no longer used
  , "redirectTo" :: RedirectToQuery -- Target URL for the redirect
  }

verifyTicketParamsCodec :: CJ.Codec VerifyTicketParams
verifyTicketParamsCodec =
  CJR.objectStrict
    { "ticket": ticketQueryCodec
    , "type": CJ.maybe ticketTypeQueryCodec
    , "redirectTo": redirectToQueryCodec
    }

-- | API Client type
type APIClient fetchResponse =
  {
    -- | GetJWKs
    -- |
    -- | Summary: Get public keys for JWT verification in JWK Set format
    -- |
    -- | Retrieve the JSON Web Key Set (JWKS) containing public keys used to verify JWT signatures. This endpoint is used by clients to validate access tokens.
    -- |
    -- | Possible responses:
    -- |   - 200: JWKSet
    getJWKs :: Aff (fetchResponse (JWKSet))
  ,
    -- | ElevateWebauthn
    -- |
    -- | Summary: Elevate access for an already signed in user using FIDO2 Webauthn
    -- |
    -- | Generate a Webauthn challenge for elevating user permissions
    -- |
    -- | Possible responses:
    -- |   - 200: PublicKeyCredentialRequestOptions
    elevateWebauthn :: Aff (fetchResponse (PublicKeyCredentialRequestOptions))
  ,
    -- | VerifyElevateWebauthn
    -- |
    -- | Summary: Verify FIDO2 Webauthn authentication using public-key cryptography for elevation
    -- |
    -- | Complete Webauthn elevation by verifying the authentication response
    -- |
    -- | Possible responses:
    -- |   - 200: SessionPayload
    verifyElevateWebauthn :: SignInWebauthnVerifyRequest -> Aff (fetchResponse (SessionPayload))
  ,
    -- | HealthCheckGet
    -- |
    -- | Summary: Health check (GET)
    -- |
    -- | Verify if the authentication service is operational using GET method
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    healthCheckGet :: Aff (fetchResponse (OKResponse))
  ,
    -- | HealthCheckHead
    -- |
    -- | Summary: Health check (HEAD)
    -- |
    -- | Verify if the authentication service is operational using HEAD method
    -- |
    -- | Possible responses:
    -- |   - 200: Unit
    healthCheckHead :: Aff (fetchResponse (Unit))
  ,
    -- | LinkIdToken
    -- |
    -- | Summary: Link a user account with the provider's account using an id token
    -- |
    -- | Link the authenticated user's account with an external OAuth provider account using an ID token. Requires elevated permissions.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    linkIdToken :: LinkIdTokenRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | ChangeUserMfa
    -- |
    -- | Summary: Generate TOTP secret
    -- |
    -- | Generate a Time-based One-Time Password (TOTP) secret for setting up multi-factor authentication
    -- |
    -- | Possible responses:
    -- |   - 200: TotpGenerateResponse
    changeUserMfa :: Aff (fetchResponse (TotpGenerateResponse))
  ,
    -- | CreatePAT
    -- |
    -- | Summary: Create a Personal Access Token (PAT)
    -- |
    -- | Generate a new Personal Access Token for programmatic API access. PATs are long-lived tokens that can be used instead of regular authentication for automated systems. Requires elevated permissions.
    -- |
    -- | Possible responses:
    -- |   - 200: CreatePATResponse
    createPAT :: CreatePATRequest -> Aff (fetchResponse (CreatePATResponse))
  ,
    -- | SignInAnonymous
    -- |
    -- | Summary: Sign in anonymously
    -- |
    -- | Create an anonymous user session without providing credentials. Anonymous users can be converted to regular users later via the deanonymize endpoint.
    -- |
    -- | Possible responses:
    -- |   - 200: SessionPayload
    signInAnonymous :: Maybe SignInAnonymousRequest -> Aff (fetchResponse (SessionPayload))
  ,
    -- | SignInEmailPassword
    -- |
    -- | Summary: Sign in with email and password
    -- |
    -- | Authenticate a user with their email and password. Returns a session object or MFA challenge if two-factor authentication is enabled.
    -- |
    -- | Possible responses:
    -- |   - 200: SignInEmailPasswordResponse
    signInEmailPassword :: SignInEmailPasswordRequest -> Aff (fetchResponse (SignInEmailPasswordResponse))
  ,
    -- | SignInIdToken
    -- |
    -- | Summary: Sign in with an ID token
    -- |
    -- | Authenticate using an ID token from a supported OAuth provider (Apple or Google). Creates a new user account if one doesn't exist.
    -- |
    -- | Possible responses:
    -- |   - 200: SessionPayload
    signInIdToken :: SignInIdTokenRequest -> Aff (fetchResponse (SessionPayload))
  ,
    -- | VerifySignInMfaTotp
    -- |
    -- | Summary: Verify TOTP for MFA
    -- |
    -- | Complete the multi-factor authentication by verifying a Time-based One-Time Password (TOTP). Returns a session if validation is successful.
    -- |
    -- | Possible responses:
    -- |   - 200: SessionPayload
    verifySignInMfaTotp :: SignInMfaTotpRequest -> Aff (fetchResponse (SessionPayload))
  ,
    -- | SignInOTPEmail
    -- |
    -- | Summary: Sign in with email OTP
    -- |
    -- | Initiate email-based one-time password authentication. Sends an OTP to the specified email address. If the user doesn't exist, a new account will be created with the provided options.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    signInOTPEmail :: SignInOTPEmailRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | VerifySignInOTPEmail
    -- |
    -- | Summary: Verify email OTP
    -- |
    -- | Complete email OTP authentication by verifying the one-time password. Returns a session if validation is successful.
    -- |
    -- | Possible responses:
    -- |   - 200: SignInOTPEmailVerifyResponse
    verifySignInOTPEmail :: SignInOTPEmailVerifyRequest -> Aff (fetchResponse (SignInOTPEmailVerifyResponse))
  ,
    -- | SignInPasswordlessEmail
    -- |
    -- | Summary: Sign in with magic link email
    -- |
    -- | Initiate passwordless authentication by sending a magic link to the user's email. If the user doesn't exist, a new account will be created with the provided options.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    signInPasswordlessEmail :: SignInPasswordlessEmailRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | SignInPasswordlessSms
    -- |
    -- | Summary: Sign in with SMS OTP
    -- |
    -- | Initiate passwordless authentication by sending a one-time password to the user's phone number. If the user doesn't exist, a new account will be created with the provided options.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    signInPasswordlessSms :: SignInPasswordlessSmsRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | VerifySignInPasswordlessSms
    -- |
    -- | Summary: Verify SMS OTP
    -- |
    -- | Complete passwordless SMS authentication by verifying the one-time password. Returns a session if validation is successful.
    -- |
    -- | Possible responses:
    -- |   - 200: SignInPasswordlessSmsOtpResponse
    verifySignInPasswordlessSms :: SignInPasswordlessSmsOtpRequest -> Aff (fetchResponse (SignInPasswordlessSmsOtpResponse))
  ,
    -- | SignInPAT
    -- |
    -- | Summary: Sign in with Personal Access Token (PAT)
    -- |
    -- | Authenticate using a Personal Access Token. PATs are long-lived tokens that can be used for programmatic access to the API.
    -- |
    -- | Possible responses:
    -- |   - 200: SessionPayload
    signInPAT :: SignInPATRequest -> Aff (fetchResponse (SessionPayload))
  ,
    -- | SignInProvider
    -- |
    -- | Summary: Sign in with an OAuth2 provider
    -- |
    -- | Initiate OAuth2 authentication flow with a social provider. Redirects the user to the provider's authorization page.
    -- |
    -- | This method is a redirect, it returns a URL `String` instead of an `Aff`.
    signInProvider :: SignInProvider -> Maybe SignInProviderParams -> String
  ,
    -- | SignInWebauthn
    -- |
    -- | Summary: Sign in with Webauthn
    -- |
    -- | Initiate a Webauthn sign-in process by sending a challenge to the user's device. The user must have previously registered a Webauthn credential.
    -- |
    -- | Possible responses:
    -- |   - 200: PublicKeyCredentialRequestOptions
    signInWebauthn :: Maybe SignInWebauthnRequest -> Aff (fetchResponse (PublicKeyCredentialRequestOptions))
  ,
    -- | VerifySignInWebauthn
    -- |
    -- | Summary: Verify Webauthn sign-in
    -- |
    -- | Complete the Webauthn sign-in process by verifying the response from the user's device. Returns a session if validation is successful.
    -- |
    -- | Possible responses:
    -- |   - 200: SessionPayload
    verifySignInWebauthn :: SignInWebauthnVerifyRequest -> Aff (fetchResponse (SessionPayload))
  ,
    -- | SignOut
    -- |
    -- | Summary: Sign out
    -- |
    -- | End the current user session by invalidating refresh tokens. Optionally sign out from all devices.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    signOut :: SignOutRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | SignUpEmailPassword
    -- |
    -- | Summary: Sign up with email and password
    -- |
    -- | Register a new user account with email and password. Returns a session if email verification is not required, otherwise returns null session.
    -- |
    -- | Possible responses:
    -- |   - 200: SessionPayload
    signUpEmailPassword :: SignUpEmailPasswordRequest -> Aff (fetchResponse (SessionPayload))
  ,
    -- | SignUpWebauthn
    -- |
    -- | Summary: Sign up with Webauthn
    -- |
    -- | Initiate a Webauthn sign-up process by sending a challenge to the user's device. The user must not have an existing account.
    -- |
    -- | Possible responses:
    -- |   - 200: PublicKeyCredentialCreationOptions
    signUpWebauthn :: SignUpWebauthnRequest -> Aff (fetchResponse (PublicKeyCredentialCreationOptions))
  ,
    -- | VerifySignUpWebauthn
    -- |
    -- | Summary: Verify Webauthn sign-up
    -- |
    -- | Complete the Webauthn sign-up process by verifying the response from the user's device. Returns a session if validation is successful.
    -- |
    -- | Possible responses:
    -- |   - 200: SessionPayload
    verifySignUpWebauthn :: SignUpWebauthnVerifyRequest -> Aff (fetchResponse (SessionPayload))
  ,
    -- | RefreshToken
    -- |
    -- | Summary: Refresh access token
    -- |
    -- | Generate a new JWT access token using a valid refresh token. The refresh token used will be revoked and a new one will be issued.
    -- |
    -- | Possible responses:
    -- |   - 200: Session
    refreshToken :: RefreshTokenRequest -> Aff (fetchResponse (Session))
  ,
    -- | VerifyToken
    -- |
    -- | Summary: Verify JWT token
    -- |
    -- | Verify the validity of a JWT access token. If no request body is provided, the Authorization header will be used for verification.
    -- |
    -- | Possible responses:
    -- |   - 200: String
    verifyToken :: Maybe VerifyTokenRequest -> Aff (fetchResponse (String))
  ,
    -- | GetUser
    -- |
    -- | Summary: Get user information
    -- |
    -- | Retrieve the authenticated user's profile information including roles, metadata, and account status.
    -- |
    -- | Possible responses:
    -- |   - 200: User
    getUser :: Aff (fetchResponse (User))
  ,
    -- | DeanonymizeUser
    -- |
    -- | Summary: Deanonymize an anonymous user
    -- |
    -- | Convert an anonymous user to a regular user by adding email and optionally password credentials. A confirmation email will be sent if the server is configured to do so.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    deanonymizeUser :: UserDeanonymizeRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | ChangeUserEmail
    -- |
    -- | Summary: Change user email
    -- |
    -- | Request to change the authenticated user's email address. A verification email will be sent to the new address to confirm the change. Requires elevated permissions.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    changeUserEmail :: UserEmailChangeRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | SendVerificationEmail
    -- |
    -- | Summary: Send verification email
    -- |
    -- | Send an email verification link to the specified email address. Used to verify email addresses for new accounts or email changes.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    sendVerificationEmail :: UserEmailSendVerificationEmailRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | VerifyChangeUserMfa
    -- |
    -- | Summary: Manage multi-factor authentication
    -- |
    -- | Activate or deactivate multi-factor authentication for the authenticated user
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    verifyChangeUserMfa :: UserMfaRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | ChangeUserPassword
    -- |
    -- | Summary: Change user password
    -- |
    -- | Change the user's password. The user must be authenticated with elevated permissions or provide a valid password reset ticket.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    changeUserPassword :: UserPasswordRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | SendPasswordResetEmail
    -- |
    -- | Summary: Request password reset
    -- |
    -- | Request a password reset for a user account. An email with a verification link will be sent to the user's email address to complete the password reset process.
    -- |
    -- | Possible responses:
    -- |   - 200: OKResponse
    sendPasswordResetEmail :: UserPasswordResetRequest -> Aff (fetchResponse (OKResponse))
  ,
    -- | AddSecurityKey
    -- |
    -- | Summary: Initialize adding of a new webauthn security key
    -- |
    -- | Start the process of adding a new WebAuthn security key to the user's account. Returns a challenge that must be completed by the user's authenticator device. Requires elevated permissions.
    -- |
    -- | Possible responses:
    -- |   - 200: PublicKeyCredentialCreationOptions
    addSecurityKey :: Aff (fetchResponse (PublicKeyCredentialCreationOptions))
  ,
    -- | VerifyAddSecurityKey
    -- |
    -- | Summary: Verify adding of a new webauthn security key
    -- |
    -- | Complete the process of adding a new WebAuthn security key by verifying the authenticator response. Requires elevated permissions.
    -- |
    -- | Possible responses:
    -- |   - 200: VerifyAddSecurityKeyResponse
    verifyAddSecurityKey :: VerifyAddSecurityKeyRequest -> Aff (fetchResponse (VerifyAddSecurityKeyResponse))
  ,
    -- | VerifyTicket
    -- |
    -- | Summary: Verify email and authentication tickets
    -- |
    -- | Verify tickets created by email verification, magic link authentication, or password reset processes. Redirects the user to the appropriate destination upon successful verification.
    -- |
    -- | This method is a redirect, it returns a URL `String` instead of an `Aff`.
    verifyTicket :: Maybe VerifyTicketParams -> String
  ,
    -- | GetVersion
    -- |
    -- | Summary: Get service version
    -- |
    -- | Retrieve version information about the authentication service
    -- |
    -- | Possible responses:
    -- |   - 200: GetVersionResponse200
    getVersion :: Aff (fetchResponse (GetVersionResponse200))
  }
