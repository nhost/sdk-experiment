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

// checks if the FilesPost201Response type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &FilesPost201Response{}

// FilesPost201Response struct for FilesPost201Response
type FilesPost201Response struct {
	ProcessedFiles []FileMetadata `json:"ProcessedFiles,omitempty"`
}

// NewFilesPost201Response instantiates a new FilesPost201Response object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewFilesPost201Response() *FilesPost201Response {
	this := FilesPost201Response{}
	return &this
}

// NewFilesPost201ResponseWithDefaults instantiates a new FilesPost201Response object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewFilesPost201ResponseWithDefaults() *FilesPost201Response {
	this := FilesPost201Response{}
	return &this
}

// GetProcessedFiles returns the ProcessedFiles field value if set, zero value otherwise.
func (o *FilesPost201Response) GetProcessedFiles() []FileMetadata {
	if o == nil || IsNil(o.ProcessedFiles) {
		var ret []FileMetadata
		return ret
	}
	return o.ProcessedFiles
}

// GetProcessedFilesOk returns a tuple with the ProcessedFiles field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *FilesPost201Response) GetProcessedFilesOk() ([]FileMetadata, bool) {
	if o == nil || IsNil(o.ProcessedFiles) {
		return nil, false
	}
	return o.ProcessedFiles, true
}

// HasProcessedFiles returns a boolean if a field has been set.
func (o *FilesPost201Response) HasProcessedFiles() bool {
	if o != nil && !IsNil(o.ProcessedFiles) {
		return true
	}

	return false
}

// SetProcessedFiles gets a reference to the given []FileMetadata and assigns it to the ProcessedFiles field.
func (o *FilesPost201Response) SetProcessedFiles(v []FileMetadata) {
	o.ProcessedFiles = v
}

func (o FilesPost201Response) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o FilesPost201Response) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if !IsNil(o.ProcessedFiles) {
		toSerialize["ProcessedFiles"] = o.ProcessedFiles
	}
	return toSerialize, nil
}

type NullableFilesPost201Response struct {
	value *FilesPost201Response
	isSet bool
}

func (v NullableFilesPost201Response) Get() *FilesPost201Response {
	return v.value
}

func (v *NullableFilesPost201Response) Set(val *FilesPost201Response) {
	v.value = val
	v.isSet = true
}

func (v NullableFilesPost201Response) IsSet() bool {
	return v.isSet
}

func (v *NullableFilesPost201Response) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableFilesPost201Response(val *FilesPost201Response) *NullableFilesPost201Response {
	return &NullableFilesPost201Response{value: val, isSet: true}
}

func (v NullableFilesPost201Response) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableFilesPost201Response) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


