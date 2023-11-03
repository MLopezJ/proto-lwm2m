import chalk from 'chalk'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { unwrapNestedArray } from '../lwm2m/unwrapNestedArray.js'
import xml2js from 'xml2js'
import type { ParsedLwM2MObjectDefinition } from '../lwm2m/ParsedLwM2MObjectDefinition.js'
import { generateLwm2mTimestampResources } from './generateLwm2mTimestampResources.js'
import { printNode } from './printNode.js'
import os from 'node:os'

const baseDir = process.cwd()
const subDir = (...tree: string[]): string => path.join(baseDir, ...tree)

console.log(chalk.gray('LwM2M'))
console.log(chalk.gray('', '·'), chalk.gray('timestamp resources map'))
const timestampResources: Record<number, number> = {}
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
	const ResourceId = parseInt(
		definition.Resources.Item.find(({ Type }) => Type === 'Time')?.$
			.ID as string,
		10,
	)
	timestampResources[ObjectID] = ResourceId
	console.log(
		'  ',
		chalk.gray('·'),
		`${chalk.white(ObjectID)}${chalk.gray('.')}${chalk.white(ResourceId)}`,
	)
}
const timestampResourcesFile = subDir('lwm2m', 'timestampResources.ts')
console.log(
	chalk.green('Writing'),
	chalk.blue(timestampResourcesFile.replace(baseDir, '')),
)
await writeFile(
	timestampResourcesFile,
	generateLwm2mTimestampResources(timestampResources)
		.map(printNode)
		.join(os.EOL),
	'utf-8',
)
