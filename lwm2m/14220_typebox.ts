import { Type } from '@sinclair/typebox'
/**
 * Button press: Describes a button press event.
 */
export const Buttonpress_14220 = Type.Object(
	{
		ObjectVersion: Type.Optional(Type.String({ examples: ['1.0'] })),
		ObjectID: Type.Number({ examples: [14220] }),
		Resources: Type.Object({
			0: Type.Integer({
				title: 'Button ID',
				description: 'The ID of the button that was pressed. Examples: 1, 2.',
			}),
			99: Type.Date({
				title: 'Timestamp',
				description: 'The timestamp of when the button was pressed.',
			}),
		}),
	},
	{ description: 'Describes a button press event.' },
)
