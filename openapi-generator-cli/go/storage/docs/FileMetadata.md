# FileMetadata

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | Pointer to **string** |  | [optional] 
**Name** | Pointer to **string** |  | [optional] 
**Size** | Pointer to **float32** |  | [optional] 
**BucketId** | Pointer to **string** |  | [optional] 
**ETag** | Pointer to **string** |  | [optional] 
**CreatedAt** | Pointer to **time.Time** |  | [optional] 
**UpdatedAt** | Pointer to **time.Time** |  | [optional] 
**IsUploaded** | Pointer to **bool** |  | [optional] 
**MimeType** | Pointer to **string** |  | [optional] 
**UploadedByUserId** | Pointer to **string** |  | [optional] 
**Metadata** | Pointer to **map[string]interface{}** |  | [optional] 

## Methods

### NewFileMetadata

`func NewFileMetadata() *FileMetadata`

NewFileMetadata instantiates a new FileMetadata object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewFileMetadataWithDefaults

`func NewFileMetadataWithDefaults() *FileMetadata`

NewFileMetadataWithDefaults instantiates a new FileMetadata object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *FileMetadata) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *FileMetadata) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *FileMetadata) SetId(v string)`

SetId sets Id field to given value.

### HasId

`func (o *FileMetadata) HasId() bool`

HasId returns a boolean if a field has been set.

### GetName

`func (o *FileMetadata) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *FileMetadata) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *FileMetadata) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *FileMetadata) HasName() bool`

HasName returns a boolean if a field has been set.

### GetSize

`func (o *FileMetadata) GetSize() float32`

GetSize returns the Size field if non-nil, zero value otherwise.

### GetSizeOk

`func (o *FileMetadata) GetSizeOk() (*float32, bool)`

GetSizeOk returns a tuple with the Size field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSize

`func (o *FileMetadata) SetSize(v float32)`

SetSize sets Size field to given value.

### HasSize

`func (o *FileMetadata) HasSize() bool`

HasSize returns a boolean if a field has been set.

### GetBucketId

`func (o *FileMetadata) GetBucketId() string`

GetBucketId returns the BucketId field if non-nil, zero value otherwise.

### GetBucketIdOk

`func (o *FileMetadata) GetBucketIdOk() (*string, bool)`

GetBucketIdOk returns a tuple with the BucketId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetBucketId

`func (o *FileMetadata) SetBucketId(v string)`

SetBucketId sets BucketId field to given value.

### HasBucketId

`func (o *FileMetadata) HasBucketId() bool`

HasBucketId returns a boolean if a field has been set.

### GetETag

`func (o *FileMetadata) GetETag() string`

GetETag returns the ETag field if non-nil, zero value otherwise.

### GetETagOk

`func (o *FileMetadata) GetETagOk() (*string, bool)`

GetETagOk returns a tuple with the ETag field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetETag

`func (o *FileMetadata) SetETag(v string)`

SetETag sets ETag field to given value.

### HasETag

`func (o *FileMetadata) HasETag() bool`

HasETag returns a boolean if a field has been set.

### GetCreatedAt

`func (o *FileMetadata) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *FileMetadata) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *FileMetadata) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.

### HasCreatedAt

`func (o *FileMetadata) HasCreatedAt() bool`

HasCreatedAt returns a boolean if a field has been set.

### GetUpdatedAt

`func (o *FileMetadata) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *FileMetadata) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *FileMetadata) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.

### HasUpdatedAt

`func (o *FileMetadata) HasUpdatedAt() bool`

HasUpdatedAt returns a boolean if a field has been set.

### GetIsUploaded

`func (o *FileMetadata) GetIsUploaded() bool`

GetIsUploaded returns the IsUploaded field if non-nil, zero value otherwise.

### GetIsUploadedOk

`func (o *FileMetadata) GetIsUploadedOk() (*bool, bool)`

GetIsUploadedOk returns a tuple with the IsUploaded field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIsUploaded

`func (o *FileMetadata) SetIsUploaded(v bool)`

SetIsUploaded sets IsUploaded field to given value.

### HasIsUploaded

`func (o *FileMetadata) HasIsUploaded() bool`

HasIsUploaded returns a boolean if a field has been set.

### GetMimeType

`func (o *FileMetadata) GetMimeType() string`

GetMimeType returns the MimeType field if non-nil, zero value otherwise.

### GetMimeTypeOk

`func (o *FileMetadata) GetMimeTypeOk() (*string, bool)`

GetMimeTypeOk returns a tuple with the MimeType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMimeType

`func (o *FileMetadata) SetMimeType(v string)`

SetMimeType sets MimeType field to given value.

### HasMimeType

`func (o *FileMetadata) HasMimeType() bool`

HasMimeType returns a boolean if a field has been set.

### GetUploadedByUserId

`func (o *FileMetadata) GetUploadedByUserId() string`

GetUploadedByUserId returns the UploadedByUserId field if non-nil, zero value otherwise.

### GetUploadedByUserIdOk

`func (o *FileMetadata) GetUploadedByUserIdOk() (*string, bool)`

GetUploadedByUserIdOk returns a tuple with the UploadedByUserId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUploadedByUserId

`func (o *FileMetadata) SetUploadedByUserId(v string)`

SetUploadedByUserId sets UploadedByUserId field to given value.

### HasUploadedByUserId

`func (o *FileMetadata) HasUploadedByUserId() bool`

HasUploadedByUserId returns a boolean if a field has been set.

### GetMetadata

`func (o *FileMetadata) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *FileMetadata) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *FileMetadata) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *FileMetadata) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


