export type Resource = {
	$: {
		ID: string // e.g. '0'
	}
	Name: string // e.g. 'Latitude'
	Operations: 'R'
	MultipleInstances: 'Single'
	Mandatory: 'Optional' | 'Mandatory'
	Type: 'String' | 'Integer' | 'Float' | 'Boolean' | 'Opaque' | 'Time'
	RangeEnumeration: string // e.g. ''
	Units: string // e.g. 'lat'
	Description: string // e.g. 'The decimal notation of latitude, e.g. -43.5723 [World Geodetic System 1984].'
}

export type ParsedLwM2MObjectDefinition = {
	$: { ObjectType: 'MODefinition' }
	Name: string // e.g. 'Location'
	Description1: string // e.g. 'This LwM2M Object provides a range of location telemetry related information which can be queried by the LwM2M Server.'
	ObjectID: string // e.g. '14201'
	ObjectURN: string // e.g. 'urn:oma:lwm2m:x:14201'
	ObjectVersion?: string // e.g. '1.0'
	MultipleInstances: 'Multiple'
	Mandatory: 'Optional'
	Resources: {
		Item: Resource[]
	}
	Description2: string // e.g. ''
}
