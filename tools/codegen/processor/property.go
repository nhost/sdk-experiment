package processor

import "slices"

type Property struct {
	// the name of the field for this property
	name string
	// The parent type that this property belongs to
	Parent Type
	// The type of the property
	Type Type
	p    Plugin
}

func (p *Property) Name() string {
	return p.p.PropertyName(p.name)
}

func (p *Property) Required() bool {
	return slices.Contains(
		p.Parent.Schema().Schema().Required,
		p.name,
	)
}
