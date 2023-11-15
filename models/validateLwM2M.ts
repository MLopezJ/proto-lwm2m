import { TypeCompiler, type ValueError } from '@sinclair/typebox/compiler'
import type { TSchema, Static } from '@sinclair/typebox'

/**
 * validate object against definiton using Typebox
 */
export const validateLwM2M = <T extends TSchema>(
	schema: T,
): ((object: unknown) =>
	| { value: Static<typeof schema> }
	| {
			error: ValueError
	  }) => {
	const validate = TypeCompiler.Compile(schema)
	return (object: unknown) => {
		const valid = validate.Errors(object).First() === undefined
		if (valid === false) {
			return {
				error: validate.Errors(object).First() as ValueError,
			}
		}
		return { value: object as Static<typeof schema> }
	}
}
