import { describe, it } from 'node:test'
import assert from 'node:assert'
import { Geolocation_14201 } from '../lwm2m/14201_typebox.js'
import type { Static } from '@sinclair/typebox'
import { validateLwM2M } from './validateLwM2M.js'

void describe('validateLwM2M', () => {
	void it(`should validate LwM2M object follows type  definition`, async () => {
		const object: Static<typeof Geolocation_14201> = {
			ObjectID: 14201,
			ObjectVersion: '1.0',
			Resources: {
				0: 33.98755678796222,
				1: -84.506132079174634,
				2: 295.468994140625,
				3: 17.74077033996582,
				4: 26.376304626464844,
				5: 359.1545715332,
				6: 'GNSS',
				99: new Date(1698155694),
			},
		}

		const result = validateLwM2M(Geolocation_14201)(object) as unknown as {
			value: unknown
		}

		assert.deepEqual(result.value, object)
	})

	void it(`should validate LwM2M object when object version is not provided`, async () => {
		const object: Static<typeof Geolocation_14201> = {
			ObjectID: 14201,
			Resources: {
				'0': 33.98771459323253,
				'1': -84.50632147267358,
				'2': 241.9342498779297,
				'3': 11.317643165588379,
				'4': 0.03478508070111275,
				'5': 90.31222534179688,
				'6': 'GNSS',
				99: new Date(1698155694),
			},
		}

		const result = validateLwM2M(Geolocation_14201)(object) as unknown as {
			value: unknown
		}

		assert.deepEqual(result.value, object)
	})
})
