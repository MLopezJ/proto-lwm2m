export enum LwM2MType {
	Boolean = 'Boolean',
	Float = 'Float',
	Integer = 'Integer',
	UnsignedInteger = 'Unsigned Integer',
	Objlnk = 'Objlnk',
	Corelnk = 'Corelnk',
	Opaque = 'Opaque',
	String = 'String',
	Time = 'Time',
}
/**
 * Transform from LwM2M type to Typebox type
 */
export const resourceType = (type: LwM2MType): string => {
	let typeSpecification = ''
	switch (type) {
		case LwM2MType.Float:
			typeSpecification = 'Number'
			break
		case LwM2MType.Integer:
		case LwM2MType.UnsignedInteger:
			typeSpecification = 'Integer'
			break
		case LwM2MType.Boolean:
			typeSpecification = 'Boolean'
			break
		case LwM2MType.String:
		case LwM2MType.Opaque:
		case LwM2MType.Corelnk:
		case LwM2MType.Objlnk:
			typeSpecification = 'String'
			break
		case LwM2MType.Time:
			typeSpecification = 'Date'
			break
	}
	return typeSpecification
}