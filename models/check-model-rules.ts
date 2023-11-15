import chalk from 'chalk'
import jsonata from 'jsonata'
import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { FrontMatter, ModelIDRegExp } from './types.js'
import { senMLtoLwM2M } from '../senml/senMLtoLwM2M.js'
import { getCodeBlock } from '../markdown/getCodeBlock.js'
import { getFrontMatter } from '../markdown/getFrontMatter.js'
import { validateSenML } from '../senml/validateSenML.js'
import { stripEmptyValues } from '../senml/stripEmptyValues.js'
import { validateLwM2M } from './validateLwM2M.js'
import { Geolocation_14201 } from 'lwm2m/14201_typebox.js'

console.log(chalk.gray('Models rules check'))
console.log('')
const modelsDir = path.join(process.cwd(), 'models')
for (const model of await readdir(modelsDir)) {
	const modelDir = path.join(modelsDir, model)
	if (!(await stat(modelDir)).isDirectory()) continue
	console.log(chalk.white('·'), chalk.white.bold(model))
	assert.match(
		model,
		ModelIDRegExp,
		'Model identifiers must consist of numbers, letters, dash, plus, and underscore only',
	)
	console.log(chalk.green('✔'), chalk.gray('Model name is correct'))

	// A README.md should exist
	try {
		await stat(path.join(modelDir, 'README.md'))
	} catch {
		throw new Error(`No README.md defined for model ${model}!`)
	}
	console.log(chalk.green('✔'), chalk.gray(`README.md exists`))

	// Validate jsonata expressions
	let hasTransformers = false
	const transformsFolder = path.join(modelDir, 'transformers')
	try {
		await stat(transformsFolder)
		hasTransformers = true
		console.log(' ', chalk.gray('Transformers:'))
	} catch {
		console.log(' ', chalk.gray('No transformers found.'))
	}
	if (hasTransformers) {
		for (const transformer of (await readdir(transformsFolder)).filter((f) =>
			f.endsWith('.md'),
		)) {
			console.log(' ', chalk.white('·'), chalk.white.bold(transformer))
			const markdown = await readFile(
				path.join(modelDir, 'transformers', transformer),
				'utf-8',
			)

			// Validate front-matter
			const type = getFrontMatter(markdown, FrontMatter).type
			console.log(' ', chalk.green('✔'), chalk.gray(`Type ${type} is valid`))
			const findBlock = getCodeBlock(markdown)
			const matchExpression = findBlock('jsonata', 'Match Expression')
			const transformExpression = findBlock('jsonata', 'Transform Expression')
			const inputExample = JSON.parse(findBlock('json', 'Input Example'))
			const resultExample = JSON.parse(findBlock('json', 'Result Example'))

			const selectResult = await jsonata(matchExpression).evaluate(inputExample)
			if (selectResult !== true) {
				throw new Error(
					`The select expression did not evaluate to true with the given example.`,
				)
			}
			console.log(
				' ',
				chalk.green('✔'),
				chalk.gray('Select expression evaluated to true for the example input'),
			)

			const transformResult = await jsonata(
				// For testing purposes this function call result is hardcoded
				transformExpression.replace('$millis()', '1699999999999'),
			).evaluate(inputExample)

			const maybeValidSenML = validateSenML(stripEmptyValues(transformResult))
			if ('errors' in maybeValidSenML) {
				console.error(maybeValidSenML.errors)
				throw new Error('The JSONata expression must produce valid SenML')
			}

			assert.deepEqual(maybeValidSenML.value, resultExample)
			console.log(
				' ',
				chalk.green('✔'),
				chalk.gray('Transformation result is valid SenML'),
			)

			assert.deepEqual(maybeValidSenML.value, resultExample)
			console.log(
				' ',
				chalk.green('✔'),
				chalk.gray('The transformation result matches the example'),
			)

			// WIP: implementation in progress
			// TODO: make it generic
			if (senMLtoLwM2M(maybeValidSenML.value)[0]?.ObjectID === 14201) {
				const maybeValidLwM2M = validateLwM2M(Geolocation_14201)(
					senMLtoLwM2M(maybeValidSenML.value)[0],
				)
				if ('errors' in maybeValidLwM2M) {
					console.error(maybeValidLwM2M.errors)
					throw new Error(
						'The LwM2M object must follow LwM2M schema definition',
					)
				} else {
					console.log(
						' ',
						chalk.green('✔'),
						chalk.gray('SenML object is valid LwM2M'),
					)
				}
			}
			// FIXME: validate LwM2M (see #)
		}
	}
}
