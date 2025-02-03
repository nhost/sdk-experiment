# \DocumentationAPI

All URIs are relative to *http://localhost:8000/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**OpenapiYamlGet**](DocumentationAPI.md#OpenapiYamlGet) | **Get** /openapi.yaml | Return this schema definition
[**VersionGet**](DocumentationAPI.md#VersionGet) | **Get** /version | Retrieve build information about the server



## OpenapiYamlGet

> map[string]interface{} OpenapiYamlGet(ctx).Execute()

Return this schema definition

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
	resp, r, err := apiClient.DocumentationAPI.OpenapiYamlGet(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DocumentationAPI.OpenapiYamlGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `OpenapiYamlGet`: map[string]interface{}
	fmt.Fprintf(os.Stdout, "Response from `DocumentationAPI.OpenapiYamlGet`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiOpenapiYamlGetRequest struct via the builder pattern


### Return type

**map[string]interface{}**

### Authorization

[Authorization](../README.md#Authorization), [X-Hasura-Admin-Secret](../README.md#X-Hasura-Admin-Secret)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/x-yaml

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## VersionGet

> VersionInformation VersionGet(ctx).Execute()

Retrieve build information about the server

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
	resp, r, err := apiClient.DocumentationAPI.VersionGet(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DocumentationAPI.VersionGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `VersionGet`: VersionInformation
	fmt.Fprintf(os.Stdout, "Response from `DocumentationAPI.VersionGet`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiVersionGetRequest struct via the builder pattern


### Return type

[**VersionInformation**](VersionInformation.md)

### Authorization

[Authorization](../README.md#Authorization), [X-Hasura-Admin-Secret](../README.md#X-Hasura-Admin-Secret)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

