const fs = require('fs').promises
const path = require('path')

async function findComponentTranslations() {
	try {
		// Configuration
		const COMPONENT_PATH = path.join(process.cwd(), 'ListingFlightsPage.tsx')
		const MESSAGES_DIR = path.join(process.cwd(), 'messages')
		const NAMESPACE = 'flightlistings_listingflights_page'

		// 1. Get all translation files
		const translationFiles = (await fs.readdir(MESSAGES_DIR)).filter((file) =>
			file.endsWith('.json'),
		)

		// 2. Extract keys from component
		const componentContent = await fs.readFile(COMPONENT_PATH, 'utf8')
		const keys = extractTranslationKeys(componentContent)

		console.log(`🔍 Found keys in ${path.basename(COMPONENT_PATH)}:`)
		console.log(keys.map((k) => ` - ${k}`).join('\n'))

		// 3. Find and log translations
		for (const file of translationFiles) {
			const lang = file.replace('.json', '')
			const filePath = path.join(MESSAGES_DIR, file)
			const content = await fs.readFile(filePath, 'utf8')
			const translations = JSON.parse(content)

			if (translations[NAMESPACE]) {
				console.log(`\n🌐 Translations in ${file}:`)
				keys.forEach((key) => {
					const value = translations[NAMESPACE][key]
					console.log(
						`   ${lang}: ${key} = ${value ? `"${value}"` : '❌ MISSING'}`,
					)
				})
			} else {
				console.log(`\n❌ Namespace "${NAMESPACE}" not found in ${file}`)
			}
		}
	} catch (error) {
		console.error('❌ Error:', error.message)
	}
}

function extractTranslationKeys(content) {
	const uniqueKeys = new Set()
	const regex = /t\(['"]([^'"]+)['"]\)/g

	let match
	while ((match = regex.exec(content)) !== null) {
		uniqueKeys.add(match[1])
	}

	return Array.from(uniqueKeys)
}

// Run the script
findComponentTranslations()
