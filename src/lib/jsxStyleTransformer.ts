const babel = require('@babel/core')

function jsxStyleTransformer() {
	return {
		visitor: {
			JSXAttribute(path) {
				if (path.node.name.name === 'style') {
					// Extract the inline style object
					const styleObject = path.node.value.expression.properties

					// Convert the style object (camelCase) to a string (kebab-case)
					const styleString = styleObject
						.map((prop) => {
							const key = prop.key.name.replace(
								/[A-Z]/g,
								(match) => `-${match.toLowerCase()}`,
							)
							const value = prop.value.value
							return `${key}: ${value};`
						})
						.join(' ')

					// Replace JSX style with the normal HTML style
					path.replaceWith(
						babel.types.jsxAttribute(
							babel.types.jsxIdentifier('style'),
							babel.types.stringLiteral(styleString),
						),
					)
				}
			},
		},
	}
}

module.exports = jsxStyleTransformer
