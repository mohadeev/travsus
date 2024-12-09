import handlebars from 'handlebars'

export async function compileTemplate(template: any, data: any) {
	const compiledTemplate = await handlebars.compile(await template(data))
	const htmlBody = await compiledTemplate(data)
	return htmlBody
}
