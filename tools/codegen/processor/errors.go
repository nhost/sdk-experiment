package processor

import "errors"

var (
	ErrUnknownType        = errors.New("unknown type")
	ErrUnsupportedFeature = errors.New("unsupported feature")
)
