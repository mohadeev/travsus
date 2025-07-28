const fs = require('fs')
const path = require('path')

// Path to the messages directory (same directory as package.json)
const messagesDir = path.join(__dirname, 'messages')

// Read all files in the messages directory
fs.readdir(messagesDir, (err, files) => {
	if (err) {
		console.error('Error reading directory:', err)
		return
	}

	// Filter for JSON files
	const jsonFiles = files.filter((file) => file.endsWith('.json'))

	jsonFiles.forEach((oldFileName) => {
		// Replace all underscores with hyphens in the filename
		const newFileName = oldFileName.replace(/_/g, '-')

		// Only rename if the filename actually changes
		if (oldFileName !== newFileName) {
			const oldPath = path.join(messagesDir, oldFileName)
			const newPath = path.join(messagesDir, newFileName)

			fs.rename(oldPath, newPath, (renameErr) => {
				if (renameErr) {
					console.error(
						`Error renaming ${oldFileName} to ${newFileName}:`,
						renameErr,
					)
				} else {
					console.log(`Renamed: ${oldFileName} → ${newFileName}`)
				}
			})
		}
	})
})
