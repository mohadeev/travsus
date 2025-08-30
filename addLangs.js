const fs = require('fs')
const path = require('path')

// Sorting function (same as before)
function sortObjectKeys(obj) {
	if (typeof obj !== 'object' || obj === null) return obj
	if (Array.isArray(obj)) {
		return obj.map((item) => sortObjectKeys(item))
	}
	const sorted = {}
	Object.keys(obj)
		.sort((a, b) => {
			return a.localeCompare(b, undefined, {
				sensitivity: 'base',
				numeric: true,
				ignorePunctuation: true,
			})
		})
		.forEach((key) => {
			sorted[key] = sortObjectKeys(obj[key])
		})
	return sorted
}

// Main function to update translation files
function updateTranslations() {
	const messagesDir = path.join(__dirname, 'messages')
	const contentFile = path.join(__dirname, 'content.json')

	// Read content.json
	let contentData
	try {
		const contentJson = fs.readFileSync(contentFile, 'utf8')
		contentData = JSON.parse(contentJson)
	} catch (error) {
		console.error(`Error reading content.json: ${error.message}`)
		return
	}

	// Process each language in content.json
	for (const [langCode, langContent] of Object.entries(contentData)) {
		const langFile = path.join(messagesDir, `${langCode}.json`)
		let existingData = {}

		// Read existing translations if file exists
		if (fs.existsSync(langFile)) {
			try {
				const fileContent = fs.readFileSync(langFile, 'utf8')
				existingData = JSON.parse(fileContent)
			} catch (error) {
				console.error(`Error reading ${langFile}: ${error.message}`)
				continue
			}
		}

		// Merge content and replace existing values with new ones
		const mergedData = mergeTranslations(existingData, langContent)

		// Sort the merged content
		const sortedData = sortObjectKeys(mergedData)

		// Write back to file
		try {
			fs.writeFileSync(langFile, JSON.stringify(sortedData, null, 2) + '\n')
			console.log(`Updated ${langFile}`)
		} catch (error) {
			console.error(`Error writing ${langFile}: ${error.message}`)
		}
	}

	console.log('All translations updated successfully!')
}

// Merge translations and REPLACE existing values with new ones
function mergeTranslations(existing, newContent) {
	const merged = { ...existing }

	for (const [section, sectionContent] of Object.entries(newContent)) {
		if (!merged[section]) {
			merged[section] = {}
		}

		for (const [key, value] of Object.entries(sectionContent)) {
			// Always replace with new value (this is the key change)
			merged[section][key] = value
		}
	}

	return merged
}

// Run the update
updateTranslations()
