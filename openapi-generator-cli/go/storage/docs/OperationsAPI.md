# \OperationsAPI

All URIs are relative to *http://localhost:8000/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**OpsDeleteBrokenMetadataPost**](OperationsAPI.md#OpsDeleteBrokenMetadataPost) | **Post** /ops/delete-broken-metadata | Delete broken metadata
[**OpsDeleteOrphansPost**](OperationsAPI.md#OpsDeleteOrphansPost) | **Post** /ops/delete-orphans | Deletes orphaned files
[**OpsListBrokenMetadataPost**](OperationsAPI.md#OpsListBrokenMetadataPost) | **Post** /ops/list-broken-metadata | Lists broken metadata
[**OpsListNotUploadedPost**](OperationsAPI.md#OpsListNotUploadedPost) | **Post** /ops/list-not-uploaded | Lists files that haven&#39;t been uploaded
[**OpsListOrphansPost**](OperationsAPI.md#OpsListOrphansPost) | **Post** /ops/list-orphans | Lists orphaned files



## OpsDeleteBrokenMetadataPost

> OpsListBrokenMetadataPost200Response OpsDeleteBrokenMetadataPost(ctx).Execute()

Delete broken metadata



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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.OperationsAPI.OpsDeleteBrokenMetadataPost(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `OperationsAPI.OpsDeleteBrokenMetadataPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `OpsDeleteBrokenMetadataPost`: OpsListBrokenMetadataPost200Response
	fmt.Fprintf(os.Stdout, "Response from `OperationsAPI.OpsDeleteBrokenMetadataPost`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiOpsDeleteBrokenMetadataPostRequest struct via the builder pattern


### Return type

[**OpsListBrokenMetadataPost200Response**](OpsListBrokenMetadataPost200Response.md)

### Authorization

[X-Hasura-Admin-Secret](../README.md#X-Hasura-Admin-Secret)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## OpsDeleteOrphansPost

> OpsListOrphansPost200Response OpsDeleteOrphansPost(ctx).Execute()

Deletes orphaned files



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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.OperationsAPI.OpsDeleteOrphansPost(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `OperationsAPI.OpsDeleteOrphansPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `OpsDeleteOrphansPost`: OpsListOrphansPost200Response
	fmt.Fprintf(os.Stdout, "Response from `OperationsAPI.OpsDeleteOrphansPost`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiOpsDeleteOrphansPostRequest struct via the builder pattern


### Return type

[**OpsListOrphansPost200Response**](OpsListOrphansPost200Response.md)

### Authorization

[X-Hasura-Admin-Secret](../README.md#X-Hasura-Admin-Secret)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## OpsListBrokenMetadataPost

> OpsListBrokenMetadataPost200Response OpsListBrokenMetadataPost(ctx).Execute()

Lists broken metadata



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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.OperationsAPI.OpsListBrokenMetadataPost(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `OperationsAPI.OpsListBrokenMetadataPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `OpsListBrokenMetadataPost`: OpsListBrokenMetadataPost200Response
	fmt.Fprintf(os.Stdout, "Response from `OperationsAPI.OpsListBrokenMetadataPost`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiOpsListBrokenMetadataPostRequest struct via the builder pattern


### Return type

[**OpsListBrokenMetadataPost200Response**](OpsListBrokenMetadataPost200Response.md)

### Authorization

[X-Hasura-Admin-Secret](../README.md#X-Hasura-Admin-Secret)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## OpsListNotUploadedPost

> OpsListBrokenMetadataPost200Response OpsListNotUploadedPost(ctx).Execute()

Lists files that haven't been uploaded



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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.OperationsAPI.OpsListNotUploadedPost(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `OperationsAPI.OpsListNotUploadedPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `OpsListNotUploadedPost`: OpsListBrokenMetadataPost200Response
	fmt.Fprintf(os.Stdout, "Response from `OperationsAPI.OpsListNotUploadedPost`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiOpsListNotUploadedPostRequest struct via the builder pattern


### Return type

[**OpsListBrokenMetadataPost200Response**](OpsListBrokenMetadataPost200Response.md)

### Authorization

[X-Hasura-Admin-Secret](../README.md#X-Hasura-Admin-Secret)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## OpsListOrphansPost

> OpsListOrphansPost200Response OpsListOrphansPost(ctx).Execute()

Lists orphaned files



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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.OperationsAPI.OpsListOrphansPost(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `OperationsAPI.OpsListOrphansPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `OpsListOrphansPost`: OpsListOrphansPost200Response
	fmt.Fprintf(os.Stdout, "Response from `OperationsAPI.OpsListOrphansPost`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiOpsListOrphansPostRequest struct via the builder pattern


### Return type

[**OpsListOrphansPost200Response**](OpsListOrphansPost200Response.md)

### Authorization

[X-Hasura-Admin-Secret](../README.md#X-Hasura-Admin-Secret)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

