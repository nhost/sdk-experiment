# \StorageAPI

All URIs are relative to *http://localhost:8000/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**FilesIdDelete**](StorageAPI.md#FilesIdDelete) | **Delete** /files/{id} | Delete a file
[**FilesIdGet**](StorageAPI.md#FilesIdGet) | **Get** /files/{id} | Retrieve contents of file
[**FilesIdHead**](StorageAPI.md#FilesIdHead) | **Head** /files/{id} | Retrieve information about a file
[**FilesIdPresignedurlContentsGet**](StorageAPI.md#FilesIdPresignedurlContentsGet) | **Get** /files/{id}/presignedurl/contents | Retrieve contents of file
[**FilesIdPresignedurlGet**](StorageAPI.md#FilesIdPresignedurlGet) | **Get** /files/{id}/presignedurl | Retrieve presigned URL to retrieve the file
[**FilesIdPut**](StorageAPI.md#FilesIdPut) | **Put** /files/{id} | Replace an existing file with a new one
[**FilesPost**](StorageAPI.md#FilesPost) | **Post** /files/ | Upload one or more files



## FilesIdDelete

> FilesIdDelete(ctx, id).Execute()

Delete a file



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/nhost/sdk-experiment/openapi-generator-cli/go/storage"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.StorageAPI.FilesIdDelete(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `StorageAPI.FilesIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiFilesIdDeleteRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

 (empty response body)

### Authorization

[Authorization](../README.md#Authorization)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## FilesIdGet

> FilesIdGet(ctx, id).IfMatch(ifMatch).IfNoneMatch(ifNoneMatch).IfModifiedSince(ifModifiedSince).IfUnmodifiedSince(ifUnmodifiedSince).Q(q).H(h).W(w).B(b).Execute()

Retrieve contents of file



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/nhost/sdk-experiment/openapi-generator-cli/go/storage"
)

func main() {
	id := "id_example" // string | 
	ifMatch := "ifMatch_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match (optional)
	ifNoneMatch := "ifNoneMatch_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match (optional)
	ifModifiedSince := "ifModifiedSince_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since (optional)
	ifUnmodifiedSince := "ifUnmodifiedSince_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since (optional)
	q := float32(8.14) // float32 | Quality of the image. Only applies to jpeg, webp and png files (optional)
	h := float32(8.14) // float32 | Resize image up to h maintaining aspect ratio. Only applies to jpeg, webp and png files (optional)
	w := float32(8.14) // float32 | Resize image up to w maintaining aspect ratio. Only applies to jpeg, webp and png files (optional)
	b := float32(8.14) // float32 | Blur the image according to this sigma value. Only applies to jpeg, webp and png files (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.StorageAPI.FilesIdGet(context.Background(), id).IfMatch(ifMatch).IfNoneMatch(ifNoneMatch).IfModifiedSince(ifModifiedSince).IfUnmodifiedSince(ifUnmodifiedSince).Q(q).H(h).W(w).B(b).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `StorageAPI.FilesIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiFilesIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **ifMatch** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match | 
 **ifNoneMatch** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match | 
 **ifModifiedSince** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since | 
 **ifUnmodifiedSince** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since | 
 **q** | **float32** | Quality of the image. Only applies to jpeg, webp and png files | 
 **h** | **float32** | Resize image up to h maintaining aspect ratio. Only applies to jpeg, webp and png files | 
 **w** | **float32** | Resize image up to w maintaining aspect ratio. Only applies to jpeg, webp and png files | 
 **b** | **float32** | Blur the image according to this sigma value. Only applies to jpeg, webp and png files | 

### Return type

 (empty response body)

### Authorization

[Authorization](../README.md#Authorization)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/octet-stream

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## FilesIdHead

> FilesIdHead(ctx, id).IfMatch(ifMatch).IfNoneMatch(ifNoneMatch).IfModifiedSince(ifModifiedSince).IfUnmodifiedSince(ifUnmodifiedSince).Q(q).H(h).W(w).B(b).Execute()

Retrieve information about a file



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/nhost/sdk-experiment/openapi-generator-cli/go/storage"
)

func main() {
	id := "id_example" // string | 
	ifMatch := "ifMatch_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match (optional)
	ifNoneMatch := "ifNoneMatch_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match (optional)
	ifModifiedSince := "ifModifiedSince_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since (optional)
	ifUnmodifiedSince := "ifUnmodifiedSince_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since (optional)
	q := float32(8.14) // float32 | Quality of the image. Only applies to jpeg, webp and png files (optional)
	h := float32(8.14) // float32 | Resize image up to h maintaining aspect ratio. Only applies to jpeg, webp and png files (optional)
	w := float32(8.14) // float32 | Resize image up to w maintaining aspect ratio. Only applies to jpeg, webp and png files (optional)
	b := float32(8.14) // float32 | Blur the image according to this sigma value. Only applies to jpeg, webp and png files (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.StorageAPI.FilesIdHead(context.Background(), id).IfMatch(ifMatch).IfNoneMatch(ifNoneMatch).IfModifiedSince(ifModifiedSince).IfUnmodifiedSince(ifUnmodifiedSince).Q(q).H(h).W(w).B(b).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `StorageAPI.FilesIdHead``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiFilesIdHeadRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **ifMatch** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match | 
 **ifNoneMatch** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match | 
 **ifModifiedSince** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since | 
 **ifUnmodifiedSince** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since | 
 **q** | **float32** | Quality of the image. Only applies to jpeg, webp and png files | 
 **h** | **float32** | Resize image up to h maintaining aspect ratio. Only applies to jpeg, webp and png files | 
 **w** | **float32** | Resize image up to w maintaining aspect ratio. Only applies to jpeg, webp and png files | 
 **b** | **float32** | Blur the image according to this sigma value. Only applies to jpeg, webp and png files | 

### Return type

 (empty response body)

### Authorization

[Authorization](../README.md#Authorization)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## FilesIdPresignedurlContentsGet

> FilesIdPresignedurlContentsGet(ctx, id).XAmzAlgorithm(xAmzAlgorithm).XAmzCredential(xAmzCredential).XAmzDate(xAmzDate).XAmzExpires(xAmzExpires).XAmzSignature(xAmzSignature).XAmzSignedHeaders(xAmzSignedHeaders).IfMatch(ifMatch).IfNoneMatch(ifNoneMatch).IfModifiedSince(ifModifiedSince).IfUnmodifiedSince(ifUnmodifiedSince).Q(q).H(h).W(w).B(b).Execute()

Retrieve contents of file



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/nhost/sdk-experiment/openapi-generator-cli/go/storage"
)

func main() {
	id := "id_example" // string | 
	xAmzAlgorithm := "xAmzAlgorithm_example" // string | Use presignedurl endpoint to generate this automatically
	xAmzCredential := "xAmzCredential_example" // string | Use presignedurl endpoint to generate this automatically
	xAmzDate := "xAmzDate_example" // string | Use presignedurl endpoint to generate this automatically
	xAmzExpires := "xAmzExpires_example" // string | Use presignedurl endpoint to generate this automatically
	xAmzSignature := "xAmzSignature_example" // string | Use presignedurl endpoint to generate this automatically
	xAmzSignedHeaders := "xAmzSignedHeaders_example" // string | Use presignedurl endpoint to generate this automatically
	ifMatch := "ifMatch_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match (optional)
	ifNoneMatch := "ifNoneMatch_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match (optional)
	ifModifiedSince := "ifModifiedSince_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since (optional)
	ifUnmodifiedSince := "ifUnmodifiedSince_example" // string | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since (optional)
	q := float32(8.14) // float32 | Quality of the image. Only applies to jpeg, webp and png files (optional)
	h := float32(8.14) // float32 | Resize image up to h maintaining aspect ratio. Only applies to jpeg, webp and png files (optional)
	w := float32(8.14) // float32 | Resize image up to w maintaining aspect ratio. Only applies to jpeg, webp and png files (optional)
	b := float32(8.14) // float32 | Blur the image according to this sigma value. Only applies to jpeg, webp and png files (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.StorageAPI.FilesIdPresignedurlContentsGet(context.Background(), id).XAmzAlgorithm(xAmzAlgorithm).XAmzCredential(xAmzCredential).XAmzDate(xAmzDate).XAmzExpires(xAmzExpires).XAmzSignature(xAmzSignature).XAmzSignedHeaders(xAmzSignedHeaders).IfMatch(ifMatch).IfNoneMatch(ifNoneMatch).IfModifiedSince(ifModifiedSince).IfUnmodifiedSince(ifUnmodifiedSince).Q(q).H(h).W(w).B(b).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `StorageAPI.FilesIdPresignedurlContentsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiFilesIdPresignedurlContentsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **xAmzAlgorithm** | **string** | Use presignedurl endpoint to generate this automatically | 
 **xAmzCredential** | **string** | Use presignedurl endpoint to generate this automatically | 
 **xAmzDate** | **string** | Use presignedurl endpoint to generate this automatically | 
 **xAmzExpires** | **string** | Use presignedurl endpoint to generate this automatically | 
 **xAmzSignature** | **string** | Use presignedurl endpoint to generate this automatically | 
 **xAmzSignedHeaders** | **string** | Use presignedurl endpoint to generate this automatically | 
 **ifMatch** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Match | 
 **ifNoneMatch** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match | 
 **ifModifiedSince** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since | 
 **ifUnmodifiedSince** | **string** | https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Unmodified-Since | 
 **q** | **float32** | Quality of the image. Only applies to jpeg, webp and png files | 
 **h** | **float32** | Resize image up to h maintaining aspect ratio. Only applies to jpeg, webp and png files | 
 **w** | **float32** | Resize image up to w maintaining aspect ratio. Only applies to jpeg, webp and png files | 
 **b** | **float32** | Blur the image according to this sigma value. Only applies to jpeg, webp and png files | 

### Return type

 (empty response body)

### Authorization

[Authorization](../README.md#Authorization)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/octet-stream

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## FilesIdPresignedurlGet

> FileMetadata FilesIdPresignedurlGet(ctx, id).Execute()

Retrieve presigned URL to retrieve the file



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/nhost/sdk-experiment/openapi-generator-cli/go/storage"
)

func main() {
	id := "id_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.StorageAPI.FilesIdPresignedurlGet(context.Background(), id).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `StorageAPI.FilesIdPresignedurlGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `FilesIdPresignedurlGet`: FileMetadata
	fmt.Fprintf(os.Stdout, "Response from `StorageAPI.FilesIdPresignedurlGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiFilesIdPresignedurlGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**FileMetadata**](FileMetadata.md)

### Authorization

[Authorization](../README.md#Authorization)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## FilesIdPut

> FileMetadata FilesIdPut(ctx, id).Metadata(metadata).File(file).Execute()

Replace an existing file with a new one



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/nhost/sdk-experiment/openapi-generator-cli/go/storage"
)

func main() {
	id := "id_example" // string | 
	metadata := *openapiclient.NewUpdateFileMetadata() // UpdateFileMetadata |  (optional)
	file := TODO // interface{} | New contents of the file to upload. (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.StorageAPI.FilesIdPut(context.Background(), id).Metadata(metadata).File(file).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `StorageAPI.FilesIdPut``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `FilesIdPut`: FileMetadata
	fmt.Fprintf(os.Stdout, "Response from `StorageAPI.FilesIdPut`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**id** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiFilesIdPutRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **metadata** | [**UpdateFileMetadata**](UpdateFileMetadata.md) |  | 
 **file** | [**interface{}**](interface{}.md) | New contents of the file to upload. | 

### Return type

[**FileMetadata**](FileMetadata.md)

### Authorization

[Authorization](../README.md#Authorization)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## FilesPost

> FilesPost200Response FilesPost(ctx).BucketId(bucketId).Metadata(metadata).File(file).Execute()

Upload one or more files



### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/nhost/sdk-experiment/openapi-generator-cli/go/storage"
)

func main() {
	bucketId := "bucketId_example" // string | Bucket to upload the files to (optional)
	metadata := []openapiclient.UploadFileMetadata{*openapiclient.NewUploadFileMetadata()} // []UploadFileMetadata | (Optional) Set the following metadata for the uploaded files instead of letting the server do it automatically. See \\\"UploadFileMetadata\\\". (optional)
	file := []*os.File{"TODO"} // []*os.File | Array of files to upload. (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.StorageAPI.FilesPost(context.Background()).BucketId(bucketId).Metadata(metadata).File(file).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `StorageAPI.FilesPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `FilesPost`: FilesPost200Response
	fmt.Fprintf(os.Stdout, "Response from `StorageAPI.FilesPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiFilesPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **bucketId** | **string** | Bucket to upload the files to | 
 **metadata** | [**[]UploadFileMetadata**](UploadFileMetadata.md) | (Optional) Set the following metadata for the uploaded files instead of letting the server do it automatically. See \\\&quot;UploadFileMetadata\\\&quot;. | 
 **file** | **[]*os.File** | Array of files to upload. | 

### Return type

[**FilesPost200Response**](FilesPost200Response.md)

### Authorization

[Authorization](../README.md#Authorization)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

