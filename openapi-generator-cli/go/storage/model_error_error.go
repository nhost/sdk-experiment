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

// checks if the ErrorError type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &ErrorError{}

// ErrorError struct for ErrorError
type ErrorError struct {
	Message *string `json:"message,omitempty"`
}

// NewErrorError instantiates a new ErrorError object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewErrorError() *ErrorError {
	this := ErrorError{}
	return &this
}

// NewErrorErrorWithDefaults instantiates a new ErrorError object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewErrorErrorWithDefaults() *ErrorError {
	this := ErrorError{}
	return &this
}

// GetMessage returns the Message field value if set, zero value otherwise.
func (o *ErrorError) GetMessage() string {
	if o == nil || IsNil(o.Message) {
		var ret string
		return ret
	}
	return *o.Message
}

// GetMessageOk returns a tuple with the Message field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *ErrorError) GetMessageOk() (*string, bool) {
	if o == nil || IsNil(o.Message) {
		return nil, false
	}
	return o.Message, true
}

// HasMessage returns a boolean if a field has been set.
func (o *ErrorError) HasMessage() bool {
	if o != nil && !IsNil(o.Message) {
		return true
	}

	return false
}

// SetMessage gets a reference to the given string and assigns it to the Message field.
func (o *ErrorError) SetMessage(v string) {
	o.Message = &v
}

func (o ErrorError) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o ErrorError) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if !IsNil(o.Message) {
		toSerialize["message"] = o.Message
	}
	return toSerialize, nil
}

type NullableErrorError struct {
	value *ErrorError
	isSet bool
}

func (v NullableErrorError) Get() *ErrorError {
	return v.value
}

func (v *NullableErrorError) Set(val *ErrorError) {
	v.value = val
	v.isSet = true
}

func (v NullableErrorError) IsSet() bool {
	return v.isSet
}

func (v *NullableErrorError) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableErrorError(val *ErrorError) *NullableErrorError {
	return &NullableErrorError{value: val, isSet: true}
}

func (v NullableErrorError) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableErrorError) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


