import chalk from 'chalk'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { unwrapNestedArray } from '../lwm2m/unwrapNestedArray.js'
import xml2js from 'xml2js'
import type { ParsedLwM2MObjectDefinition } from '../lwm2m/ParsedLwM2MObjectDefinition.js'

import { printNode } from './printNode.js'
import os from 'node:os'
import { generateTypebox } from './generateTypebox.js'

const baseDir = process.cwd()
const subDir = (...tree: string[]): string => path.join(baseDir, ...tree)

console.log(chalk.gray('Typebox'))
console.log(
	chalk.gray('', '·'),
	chalk.gray('Create Typebox definition for LwM2M objects'),
)
for (const objectDefinitionFile of (await readdir(subDir('lwm2m'))).filter(
	(s) => s.endsWith('.xml'),
)) {
	const definition = (
		unwrapNestedArray(
			await xml2js.parseStringPromise(
				await readFile(subDir('lwm2m', objectDefinitionFile), 'utf-8'),
			),
		) as any
	).LWM2M.Object as ParsedLwM2MObjectDefinition
	const ObjectID = parseInt(definition.ObjectID, 10)

	const file = subDir('lwm2m', `${ObjectID}_typebox.ts`)
	console.log(chalk.green('Writing'), chalk.blue(file.replace(baseDir, '')))
	await writeFile(
		file,
		generateTypebox({
			name: definition.Name,
			id: ObjectID,
			description: definition.Description1,
			objectVersion: definition.ObjectVersion ?? '1.0',
			resources: definition.Resources.Item,
		})
			.map(printNode)
			.join(os.EOL),
		'utf-8',
	)
}
