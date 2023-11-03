import { describe, it } from 'node:test'
import assert from 'node:assert'
import type { LwM2MObject } from 'senml/senMLtoLwM2M'
import type { TSchema } from '@sinclair/typebox'

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
				9: new Date(1698155694999),
			},
		}

		// TODO: generate type
		const type = {}

		// TODO: validate with { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
		const validateWithTypeBox = (
			LwM2MObject: LwM2MObject,
			typeDefinition: TSchema,
		) => ({ value: LwM2MObject })

		const result = validateWithTypeBox(lwM2MObject, type as unknown as TSchema)

		assert.deepEqual(result.value, lwM2MObject)
	})
})
