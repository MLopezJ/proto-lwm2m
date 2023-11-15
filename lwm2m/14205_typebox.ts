import { Type } from '@sinclair/typebox'
/**
 * Environment: Environment information.
 */
export const Environment_14205 = Type.Object(
	{
		ObjectVersion: Type.Optional(Type.String({ examples: ['1.0'] })),
		ObjectID: Type.Number({ examples: [14205] }),
		Resources: Type.Object({
			0: Type.Optional(
				Type.Number({
					title: 'Temperature',
					description:
						'Environmental temperature in Celsius. Examples: 23.5, -10.2.',
				}),
			),
			1: Type.Optional(
				Type.Number({
					title: 'Humidity',
					description: 'Environmental humidity in percent. Examples: 44.2, 72.',
				}),
			),
			2: Type.Optional(
				Type.Number({
					title: 'Atmoshperic pressure',
					description: 'Atmoshperic pressure in pascal. Examples: 1003.6, 977.',
				}),
			),
			10: Type.Optional(
				Type.Integer({
					title: 'Air Quality Index',
					description:
						'The Bosch BME680 sensor calculates an Air Quality Index. See https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bme680-ds001.pdf',
				}),
			),
			99: Type.Date({
				title: 'Timestamp',
				description: 'The timestamp of when the measurement was performed.',
			}),
		}),
	},
	{ description: 'Environment information.' },
)
