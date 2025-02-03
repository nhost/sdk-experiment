/*
Hasura Storage

Hasura Storage is amazing

API version: 1.0.0
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package openapi

import (
	"encoding/json"
)

// checks if the FilesPost200Response type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &FilesPost200Response{}

// FilesPost200Response struct for FilesPost200Response
type FilesPost200Response struct {
	ProcessedFiles []FileSummary `json:"ProcessedFiles,omitempty"`
}

// NewFilesPost200Response instantiates a new FilesPost200Response object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewFilesPost200Response() *FilesPost200Response {
	this := FilesPost200Response{}
	return &this
}

// NewFilesPost200ResponseWithDefaults instantiates a new FilesPost200Response object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewFilesPost200ResponseWithDefaults() *FilesPost200Response {
	this := FilesPost200Response{}
	return &this
}

// GetProcessedFiles returns the ProcessedFiles field value if set, zero value otherwise.
func (o *FilesPost200Response) GetProcessedFiles() []FileSummary {
	if o == nil || IsNil(o.ProcessedFiles) {
		var ret []FileSummary
		return ret
	}
	return o.ProcessedFiles
}

// GetProcessedFilesOk returns a tuple with the ProcessedFiles field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *FilesPost200Response) GetProcessedFilesOk() ([]FileSummary, bool) {
	if o == nil || IsNil(o.ProcessedFiles) {
		return nil, false
	}
	return o.ProcessedFiles, true
}

// HasProcessedFiles returns a boolean if a field has been set.
func (o *FilesPost200Response) HasProcessedFiles() bool {
	if o != nil && !IsNil(o.ProcessedFiles) {
		return true
	}

	return false
}

// SetProcessedFiles gets a reference to the given []FileSummary and assigns it to the ProcessedFiles field.
func (o *FilesPost200Response) SetProcessedFiles(v []FileSummary) {
	o.ProcessedFiles = v
}

func (o FilesPost200Response) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o FilesPost200Response) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if !IsNil(o.ProcessedFiles) {
		toSerialize["ProcessedFiles"] = o.ProcessedFiles
	}
	return toSerialize, nil
}

type NullableFilesPost200Response struct {
	value *FilesPost200Response
	isSet bool
}

func (v NullableFilesPost200Response) Get() *FilesPost200Response {
	return v.value
}

func (v *NullableFilesPost200Response) Set(val *FilesPost200Response) {
	v.value = val
	v.isSet = true
}

func (v NullableFilesPost200Response) IsSet() bool {
	return v.isSet
}

func (v *NullableFilesPost200Response) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableFilesPost200Response(val *FilesPost200Response) *NullableFilesPost200Response {
	return &NullableFilesPost200Response{value: val, isSet: true}
}

func (v NullableFilesPost200Response) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableFilesPost200Response) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


