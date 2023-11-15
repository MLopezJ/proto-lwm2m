import { Type } from '@sinclair/typebox'
/**
 * Solar charge: Measurements from the solar shield.
 */
export const Solarcharge_14210 = Type.Object(
	{
		ObjectVersion: Type.Optional(Type.String({ examples: ['1.0'] })),
		ObjectID: Type.Number({ examples: [14210] }),
		Resources: Type.Object({
			0: Type.Number({
				title: 'Gain',
				description:
					'The current gain from the solar shield, measured in mA. Example: 3.123, -0.0032.',
			}),
			1: Type.Optional(
				Type.Number({
					title: 'Voltage',
					description: 'Battery voltage in Volt. Examples: 2.754, 3.3.',
				}),
			),
			99: Type.Date({
				title: 'Timestamp',
				description: 'The timestamp of when the measurement was performed.',
			}),
		}),
	},
	{ description: 'Measurements from the solar shield.' },
)
