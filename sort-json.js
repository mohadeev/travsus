const fs = require('fs')
const path = require('path')

function sortObjectKeys(obj) {
	if (typeof obj !== 'object' || obj === null) return obj

	if (Array.isArray(obj)) {
		return obj.map((item) => sortObjectKeys(item))
	}

	const sorted = {}
	// Case-insensitive sort: uppercase and lowercase treated equally
	Object.keys(obj)
		.sort((a, b) => {
			return a.localeCompare(b, undefined, { sensitivity: 'base' })
		})
		.forEach((key) => {
			sorted[key] = sortObjectKeys(obj[key])
		})
	return sorted
}

function processJsonFiles(directory) {
	fs.readdirSync(directory).forEach((file) => {
		const filePath = path.join(directory, file)
		const stat = fs.statSync(filePath)

		if (stat.isDirectory()) {
			processJsonFiles(filePath)
		} else if (path.extname(file) === '.json') {
			try {
				const jsonContent = fs.readFileSync(filePath, 'utf8')
				const parsedJson = JSON.parse(jsonContent)
				const sortedJson = sortObjectKeys(parsedJson)

				fs.writeFileSync(filePath, JSON.stringify(sortedJson, null, 2) + '\n')

				console.log(`Sorted keys in: ${filePath}`)
			} catch (error) {
				console.error(`Error processing ${filePath}:`, error.message)
			}
		}
	})
}

// Start processing from the messages directory
const messagesDir = path.join(__dirname, 'messages')
processJsonFiles(messagesDir)

// Add this at the end of sort-json.js:
module.exports = {
	sortObjectKeys,
}
