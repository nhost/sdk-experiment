package processor

type Property struct {
	// the name of the field for this property
	Name string
	// The parent type that this property belongs to
	Parent Type
	// The type of the property
	Type Type
	p    Plugin
}
