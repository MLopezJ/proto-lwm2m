import ts from 'typescript'
import { addDocBlock } from './addDocBlock.js'
import { typeName } from './typebox.js'

export const generateTypebox = ({
	timestampResources,
	name,
	id,
	description,
}: {
	timestampResources: Record<number, number>
	name: string
	id: number
	description: string
}): ts.Node[] => {
	const type = ts.factory.createVariableStatement(
		[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList(
			[
				ts.factory.createVariableDeclaration(
					ts.factory.createIdentifier(`${typeName(`${id}`, name)}`),
					undefined,
					ts.factory.createTypeReferenceNode('Readonly', [
						ts.factory.createTypeReferenceNode('Record', [
							ts.factory.createTypeReferenceNode('number'),
							ts.factory.createTypeReferenceNode('number'),
						]),
					]),
					ts.factory.createObjectLiteralExpression(
						Object.entries(timestampResources).map(([k, v]) =>
							ts.factory.createPropertyAssignment(
								k,
								ts.factory.createNumericLiteral(v),
							),
						),
					),
				),
			],
			ts.NodeFlags.Const,
		),
	)
	addDocBlock([`${name}: ${description}`], type)

	return [type]
}
