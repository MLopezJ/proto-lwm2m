import { describe, it } from 'node:test'
import assert from 'node:assert'
import type { LwM2MObject } from 'senml/senMLtoLwM2M'
import { Type } from '@sinclair/typebox'
import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'

void describe('validateLwM2M', () => {
	void it(`should validate LwM2M object follows type  definition`, () => {
		const lwM2MObject: LwM2MObject = {
			ObjectID: 14201,
			ObjectVersion: '1.1',
			Resources: {
				0: 33.98755678796222,
				1: -84.506132079174634,
				2: 295.468994140625,
				3: 17.74077033996582,
				4: 26.376304626464844,
				5: 359.1545715332,
				9: 1698155694999, //new Date(1698155694999), // FIXME
			},
		}

		const type = getTypeDefinition()

		const result = validateWithTypeBox(type)(lwM2MObject) as unknown as {
			value: unknown
		}

		assert.deepEqual(result.value, lwM2MObject)
	})
})

/**
 * Typebox definition of object 14201
 */
const getTypeDefinition = () => {
	return Type.Object(
		{
			//Name: Type.String({ examples: ['Geolocation'] }),
			//ObjectURN: Type.String({ examples: ['urn:oma:lwm2m:oma:14201'] }),
			//LWM2MVersion: Type.Number({ examples: [1.1] }),
			ObjectVersion: Type.String({ examples: ['1.1'] }),
			Resources: Type.Object({
				0: Type.Number({
					$id: '0',
					title: 'Latitude',
					description:
						'The decimal notation of latitude, e.g. -43.5723 [World Geodetic System 1984].',
				}),
				1: Type.Number({
					$id: '1',
					title: 'Longitude',
					description:
						'The decimal notation of longitude, e.g. 153.21760 [World Geodetic System 1984].',
				}),
				2: Type.Optional(
					Type.Number({
						$id: '2',
						title: 'Altitude',
						description:
							'The decimal notation of altitude in meters above sea level.',
					}),
				),
				3: Type.Optional(
					Type.Number({
						$id: '3',
						title: 'Radius',
						description:
							'The value in this resource indicates the radius of a circular area in meters. The circular area is used to describe uncertainty about a point for coordinates in a two-dimensional coordinate reference systems (CRS). The center point of a circular area is specified by using the Latitude and the Longitude Resources.',
					}),
				),
				4: Type.Optional(
					Type.Number({
						$id: '4',
						title: 'Speed',
						description: 'Speed is the time rate of change in position.',
					}),
				),
				5: Type.Optional(
					Type.Number({
						$id: '5',
						title: 'Heading',
						description: 'The angle of movement.',
					}),
				),
				9: Type.Number({
					$id: '9',
					title: 'Timestamp',
					description:
						'The timestamp of when the location measurement was performed.',
					minimum: 1234567890123,
					examples: [1584533788029],
				}),
			}),
		},
		{
			description: '',
		},
	)
}
