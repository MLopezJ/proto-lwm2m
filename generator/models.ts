/**
 * Generate code from the model and schema definitions
 */

import chalk from 'chalk'
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { getCodeBlock } from '../markdown/getCodeBlock.js'
import { getFrontMatter } from '../markdown/getFrontMatter.js'
import { generateModels } from './generateModels.js'
import { printNode } from './printNode.js'
import { FrontMatter } from 'models/model.js'

const baseDir = process.cwd()
const subDir = (...tree: string[]): string => path.join(baseDir, ...tree)

console.log(chalk.gray('Models'))

const loadModelTransforms = async (
	model: string,
): Promise<
	{
		type: 'shadow' | 'messages'
		match: string
		transform: string
	}[]
> =>
	Promise.all(await readdir(subDir('models', model, 'transformers')))
		.then((entries) => entries.filter((e) => e.endsWith('.md')))
		.then(async (expressions) =>
			Promise.all(
				expressions.map(async (expression) =>
					readFile(
						subDir('models', model, 'transformers', expression),
						'utf-8',
					),
				),
			),
		)
		.then((transforms) =>
			transforms.map((markdown) => {
				const findBlock = getCodeBlock(markdown)
				return {
					type: getFrontMatter(markdown, FrontMatter).type,
					match: findBlock('jsonata', 'Match Expression'),
					transform: findBlock('jsonata', 'Transform Expression'),
				}
			}),
		)

const models = await Promise.all(
	(
		await Promise.all(
			(await readdir(subDir('models'))).map(async (f) => ({
				name: f,
				stat: await stat(subDir('models', f)),
			})),
		)
	)
		.filter(({ stat }) => stat.isDirectory())
		.map(async (model) => {
			console.log(chalk.gray('·'), chalk.white(model.name))
			return {
				id: model.name,
				transforms: await loadModelTransforms(model.name),
			}
		}),
)

const modelsFile = subDir('models', 'models.ts')
console.log(chalk.green('Writing'), chalk.blue(modelsFile.replace(baseDir, '')))
await writeFile(
	modelsFile,
	generateModels(models).map(printNode).join(os.EOL),
	'utf-8',
)
