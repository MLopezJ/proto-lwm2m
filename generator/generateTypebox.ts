import ts from 'typescript'
import { addDocBlock } from './addDocBlock.js'
import type { Resource } from 'lwm2m/ParsedLwM2MObjectDefinition.js'
import { LwM2MType, resourceType } from 'lwm2m/resourceType.js'
import { tokenizeName } from './tokenizeName.js'

/**
 * uses src/type-generation/createLwM2MObjectType.ts from lwm2m-types-js as a ref
 */

export const generateTypebox = ({
	name,
	id,
	description,
	objectVersion,
	resources,
}: {
	name: string
	id: number
	description: string
	objectVersion: string
	resources: Resource[]
}): ts.Node[] => {
	/**
	 * import { Type } from '@sinclair/typebox'
	 */
	const importTypebox = ts.factory.createImportDeclaration(
		undefined,
		ts.factory.createImportClause(
			false,
			undefined,
			ts.factory.createNamedImports([
				ts.factory.createImportSpecifier(
					false,
					undefined,
					ts.factory.createIdentifier(`Type`),
				),
			]),
		),
		ts.factory.createStringLiteral('@sinclair/typebox'),
	)

	const resourceTypeboxDefiniton = (resource: Resource) =>
		ts.factory.createCallExpression(
			ts.factory.createPropertyAccessExpression(
				ts.factory.createIdentifier('Type'),
				ts.factory.createIdentifier(
					`${resourceType(resource.Type as LwM2MType)}`,
				),
			),
			undefined,
			[
				ts.factory.createObjectLiteralExpression(
					[
						ts.factory.createPropertyAssignment(
							ts.factory.createIdentifier('title'),
							ts.factory.createStringLiteral(`${resource.Name}`),
						),
						ts.factory.createPropertyAssignment(
							ts.factory.createIdentifier('description'),
							ts.factory.createStringLiteral(`${resource.Description}`),
						),
					],
					undefined,
				),
			],
		)

	/**
	 * Typebox definition for all the resources
	 */
	const resourcesDef = resources.map((resource) => {
		return ts.factory.createPropertyAssignment(
			ts.factory.createIdentifier(`${resource.$.ID}`),
			resource.Mandatory === 'Mandatory'
				? resourceTypeboxDefiniton(resource)
				: // optional
				  ts.factory.createCallExpression(
						ts.factory.createPropertyAccessExpression(
							ts.factory.createIdentifier('Type'),
							ts.factory.createIdentifier('Optional'),
						),
						undefined,
						[resourceTypeboxDefiniton(resource)],
				  ),
		)
	})

	/**
	 * Type.Object({ObjectVersion: ..., ObjectID: ..., Resources:...}, {description: ...});
	 */
	const typeboxObject = ts.factory.createCallExpression(
		ts.factory.createPropertyAccessExpression(
			ts.factory.createIdentifier('Type'),
			ts.factory.createIdentifier('Object'),
		),
		undefined,
		[
			ts.factory.createObjectLiteralExpression([
				// Object Version
				ts.factory.createPropertyAssignment(
					ts.factory.createIdentifier('ObjectVersion'),
					ts.factory.createCallExpression(
						ts.factory.createPropertyAccessExpression(
							ts.factory.createIdentifier('Type'),
							ts.factory.createIdentifier('Optional'),
						),
						undefined,
						[
							ts.factory.createCallExpression(
								ts.factory.createPropertyAccessExpression(
									ts.factory.createIdentifier('Type'),
									ts.factory.createIdentifier('String'),
								),
								undefined,
								[
									ts.factory.createObjectLiteralExpression(
										[
											ts.factory.createPropertyAssignment(
												ts.factory.createIdentifier('examples'),
												ts.factory.createArrayLiteralExpression([
													ts.factory.createStringLiteral(`${objectVersion}`),
												]),
											),
										],
										undefined,
									),
								],
							),
						],
					),
				),

				// Object ID
				ts.factory.createPropertyAssignment(
					ts.factory.createIdentifier('ObjectID'),
					ts.factory.createCallExpression(
						ts.factory.createPropertyAccessExpression(
							ts.factory.createIdentifier('Type'),
							ts.factory.createIdentifier('Number'),
						),
						undefined,
						[
							ts.factory.createObjectLiteralExpression(
								[
									ts.factory.createPropertyAssignment(
										ts.factory.createIdentifier('examples'),
										ts.factory.createArrayLiteralExpression([
											ts.factory.createNumericLiteral(id),
										]),
									),
								],
								undefined,
							),
						],
					),
				),

				// Resources
				ts.factory.createPropertyAssignment(
					ts.factory.createIdentifier('Resources'),
					ts.factory.createCallExpression(
						ts.factory.createPropertyAccessExpression(
							ts.factory.createIdentifier('Type'),
							ts.factory.createIdentifier('Object'),
						),
						undefined,
						[ts.factory.createObjectLiteralExpression(resourcesDef)],
					),
				),
			]),
			ts.factory.createObjectLiteralExpression([
				ts.factory.createPropertyAssignment(
					ts.factory.createIdentifier('description'),
					ts.factory.createStringLiteral(description),
				),
			]),
		],
	)

	/**
	 * export const XXXX =
	 */
	const variableDeclaration = ts.factory.createVariableStatement(
		[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList(
			[
				ts.factory.createVariableDeclaration(
					ts.factory.createIdentifier(`${tokenizeName(name)}_${id}`),
					undefined,
					undefined,
					typeboxObject,
				),
			],
			ts.NodeFlags.Const,
		),
	)
	addDocBlock([`${name}: ${description}`], variableDeclaration)

	return [importTypebox, variableDeclaration]
}
