# PresignedURLResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Url** | Pointer to **string** |  | [optional] 
**Expiration** | Pointer to **float32** |  | [optional] 

## Methods

### NewPresignedURLResponse

`func NewPresignedURLResponse() *PresignedURLResponse`

NewPresignedURLResponse instantiates a new PresignedURLResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPresignedURLResponseWithDefaults

`func NewPresignedURLResponseWithDefaults() *PresignedURLResponse`

NewPresignedURLResponseWithDefaults instantiates a new PresignedURLResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetUrl

`func (o *PresignedURLResponse) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *PresignedURLResponse) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *PresignedURLResponse) SetUrl(v string)`

SetUrl sets Url field to given value.

### HasUrl

`func (o *PresignedURLResponse) HasUrl() bool`

HasUrl returns a boolean if a field has been set.

### GetExpiration

`func (o *PresignedURLResponse) GetExpiration() float32`

GetExpiration returns the Expiration field if non-nil, zero value otherwise.

### GetExpirationOk

`func (o *PresignedURLResponse) GetExpirationOk() (*float32, bool)`

GetExpirationOk returns a tuple with the Expiration field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiration

`func (o *PresignedURLResponse) SetExpiration(v float32)`

SetExpiration sets Expiration field to given value.

### HasExpiration

`func (o *PresignedURLResponse) HasExpiration() bool`

HasExpiration returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


