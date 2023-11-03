import chalk from 'chalk'
import jsonata from 'jsonata'
import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { FrontMatter, ModelIDRegExp } from './model.js'
import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { SenML } from '../senml/SenMLSchema.js'
import { senMLtoLwM2M } from '../senml/senMLtoLwM2M.js'
import { getCodeBlock } from '../markdown/getCodeBlock.js'
import { getFrontMatter } from 'markdown/getFrontMatter.js'

const validateSenML = validateWithTypeBox(SenML)

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
		'Model identifiers must consist of numbers and letters only',
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

			const transformResult =
				await jsonata(transformExpression).evaluate(inputExample)
			const maybeValidSenML = validateSenML(transformResult)
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

			assert.deepEqual(transformResult, resultExample)
			console.log(
				' ',
				chalk.green('✔'),
				chalk.gray('The transformation result matches the example'),
			)

			senMLtoLwM2M(maybeValidSenML.value)
			// FIXME: validate LwM2M (see #)
		}
	}
}
