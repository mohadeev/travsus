const fs = require('fs/promises')
const path = require('path')
const OpenAI = require('openai')

// Configuration
const CONFIG = {
	// Source directories to process
	SOURCE_DIRS: [
		path.join(process.cwd(), 'src', 'app', '[locale]'),
		path.join(process.cwd(), 'src', 'components'),
	],
	MESSAGES_DIR: path.join(process.cwd(), 'messages'),
	BACKUP_DIR: path.join(process.cwd(), '.i18n-backups'),

	// Static OpenAI API Key
	OPENAI_API_KEY:
		'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',
	OPENAI_MODEL: 'gpt-4',
	OPENAI_TEMPERATURE: 0.2,
	MAX_CONCURRENT: 3, // Max concurrent OpenAI requests
}

const openai = new OpenAI({
	apiKey: CONFIG.OPENAI_API_KEY,
})

// === Utility Functions ===

async function createBackup(filePath, content) {
	const relativePath = path.relative(process.cwd(), filePath)
	const backupPath = path.join(CONFIG.BACKUP_DIR, relativePath)
	const backupDir = path.dirname(backupPath)

	await fs.mkdir(backupDir, { recursive: true })
	await fs.writeFile(backupPath, content, 'utf-8')
}

async function getFilesToProcess() {
	const files = []

	for (const dir of CONFIG.SOURCE_DIRS) {
		const entries = await fs.readdir(dir, {
			withFileTypes: true,
			recursive: true,
		})

		for (const entry of entries) {
			if (
				entry.isFile() &&
				(entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))
			) {
				const fullPath = path.join(entry.path, entry.name)

				// Skip files in [locale] directory that are not pages
				if (fullPath.includes('[locale]') && !fullPath.includes('page.')) {
					continue
				}

				files.push(fullPath)
			}
		}
	}

	return files
}

function generateNamespace(filePath) {
	const relativePath = path.relative(process.cwd(), filePath)

	// Remove src/app/[locale]/ prefix for pages
	let cleanPath = relativePath
		.replace(/^src[\\/]app[\\/]\[locale\][\\/]/, '')
		.replace(/^src[\\/]components[\\/]/, 'components/')
		.replace(/\.[jt]sx$/, '')

	// Replace path separators with underscores
	cleanPath = cleanPath.replace(/[\\/]/g, '_')

	// Remove special characters
	cleanPath = cleanPath.replace(/[^a-zA-Z0-9_]/g, '')

	// Shorten if too long
	if (cleanPath.length > 40) {
		const parts = cleanPath.split('_')
		cleanPath = parts.slice(-3).join('_')
	}

	return cleanPath
}

async function getLanguages(mode) {
	if (mode === 'default') {
		return ['en_US', 'es_ES']
	}

	try {
		const files = await fs.readdir(CONFIG.MESSAGES_DIR)
		return files
			.filter((file) => file.endsWith('.json'))
			.map((file) => file.replace('.json', ''))
	} catch (error) {
		console.error('❌ Could not read messages directory:', error.message)
		return ['en_US', 'es_ES'] // Fallback to default
	}
}

// === Text Extraction ===
async function extractTextForTranslation(filePath, content) {
	const namespace = generateNamespace(filePath)

	const prompt = `
You are an internationalization assistant. Analyze this React component and:

1. Extract ALL user-facing text that needs translation
2. Generate CLEAN KEYS in format: "${namespace}_Descriptive_Key" 
3. Return ONLY this JSON format:

{
  "namespace": "${namespace}",
  "strings": {
    "${namespace}_Simplicity_In_Travel": "Simplicity in travel",
    "${namespace}_Book_Your_Trip": "Book your trip"
  }
}

KEY RULES:
- Prefix with "${namespace}_"
- Use Title_Case_With_Underscores
- Remove special characters
- Keep under 40 chars
- MUST be unique
- NO generic keys
`

	console.log(`🔍 Extracting text for ${path.basename(filePath)}...`)
	const result = await openai.chat.completions.create({
		model: CONFIG.OPENAI_MODEL,
		temperature: 0.1,
		messages: [
			{ role: 'system', content: prompt },
			{ role: 'user', content: content },
		],
	})

	// Parse JSON from response
	const response = result.choices[0].message.content
	try {
		const jsonStart = response.indexOf('{')
		const jsonEnd = response.lastIndexOf('}') + 1
		return JSON.parse(response.slice(jsonStart, jsonEnd))
	} catch (error) {
		console.error('❌ Key generation failed. AI response:', response)
		throw new Error('Failed to parse key mappings')
	}
}

// === Translation ===
async function translateStrings(strings, sourceLang, targetLang) {
	const prompt = `
Translate these UI strings from ${sourceLang} to ${targetLang}:

RULES:
1. Use formal, business-appropriate language
2. Maintain consistent terminology
3. Keep Title_Case if present
4. Preserve numbers/symbols
5. Return EXACT SAME JSON FORMAT with translations

Input:
${JSON.stringify(strings, null, 2)}

Output ONLY the translated JSON object.`

	console.log(`🌍 Translating to ${targetLang}...`)
	const result = await openai.chat.completions.create({
		model: CONFIG.OPENAI_MODEL,
		temperature: 0.3,
		messages: [{ role: 'system', content: prompt }],
	})

	// Parse JSON from response
	const response = result.choices[0].message.content
	try {
		const jsonStart = response.indexOf('{')
		const jsonEnd = response.lastIndexOf('}') + 1
		return JSON.parse(response.slice(jsonStart, jsonEnd))
	} catch (error) {
		console.error('❌ Translation failed. AI response:', response)
		throw new Error('Failed to parse translation response')
	}
}

// === Update Source File ===
async function updateSourceFile(filePath, translations) {
	const originalContent = await fs.readFile(filePath, 'utf-8')
	const namespace = translations.namespace

	const prompt = `
Transform this React component:

1. Replace ALL user-facing text with t('key') 
   (keys from provided translations)
2. Preserve all formatting/code structure
3. Add useTranslations import if missing
4. Return ONLY the transformed code

AVAILABLE KEYS:
${JSON.stringify(translations.strings, null, 2)}

ORIGINAL FILE:
${originalContent}
`

	console.log(`✏️  Updating ${path.basename(filePath)}...`)
	const result = await openai.chat.completions.create({
		model: CONFIG.OPENAI_MODEL,
		temperature: 0,
		messages: [{ role: 'system', content: prompt }],
	})

	await fs.writeFile(filePath, result.choices[0].message.content, 'utf-8')
}

// === Update Translation File ===
async function updateTranslationFile(language, namespace, strings) {
	const filePath = path.join(CONFIG.MESSAGES_DIR, `${language}.json`)

	let content = {}
	try {
		const fileContent = await fs.readFile(filePath, 'utf-8')
		content = JSON.parse(fileContent)
	} catch (error) {
		if (error.code !== 'ENOENT') {
			console.error(`❌ Error reading ${filePath}:`, error.message)
		}
	}

	// Create namespace if it doesn't exist
	if (!content[namespace]) {
		content[namespace] = {}
	}

	// Add new strings (preserve existing translations)
	for (const [key, value] of Object.entries(strings)) {
		if (!content[namespace][key]) {
			content[namespace][key] = value
		}
	}

	await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')
	console.log(`✅ Saved ${language}.json for ${namespace}`)
	return Object.keys(strings).length
}

// === Process Queue with Concurrency ===
async function processWithConcurrency(tasks, maxConcurrent) {
	const results = []
	const executing = []

	for (const task of tasks) {
		const p = task().then((result) => {
			executing.splice(executing.indexOf(p), 1)
			return result
		})

		executing.push(p)
		results.push(p)

		if (executing.length >= maxConcurrent) {
			await Promise.race(executing)
		}
	}

	return Promise.all(results)
}

// === Main Function ===
async function main(mode = 'default') {
	try {
		console.log(`🚀 Starting i18n automation (mode: ${mode})`)

		// Validate mode
		if (!['default', 'all'].includes(mode)) {
			throw new Error('Invalid mode. Use "default" or "all"')
		}

		// 1. Ensure directories exist
		await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true })
		await fs.mkdir(CONFIG.MESSAGES_DIR, { recursive: true })

		// 2. Get files and languages
		const files = await getFilesToProcess()
		const languages = await getLanguages(mode)

		if (files.length === 0) {
			console.log('ℹ️ No files found to process')
			return
		}

		console.log(`📂 Found ${files.length} files to process`)
		console.log(
			`🌐 Processing ${languages.length} languages: ${languages.join(', ')}`,
		)

		// 3. Create tasks queue
		const tasks = []
		let fileCount = 0

		for (const filePath of files) {
			tasks.push(async () => {
				try {
					fileCount++
					console.log(
						`\n📄 [${fileCount}/${files.length}] Processing ${path.relative(process.cwd(), filePath)}`,
					)

					// Read file content
					const content = await fs.readFile(filePath, 'utf-8')

					// Create backup
					await createBackup(filePath, content)

					// Extract English strings
					const englishData = await extractTextForTranslation(filePath, content)

					// Update source file with t() calls
					await updateSourceFile(filePath, englishData)

					// Process each language sequentially
					for (const lang of languages) {
						try {
							let translations

							if (lang === 'en_US') {
								// For English, use the original strings
								translations = englishData.strings
							} else {
								// For other languages, translate
								translations = await translateStrings(
									englishData.strings,
									'English',
									lang,
								)
							}

							// Save immediately after translation
							await updateTranslationFile(
								lang,
								englishData.namespace,
								translations,
							)
						} catch (error) {
							console.error(
								`❌ Failed to process ${lang} for ${filePath}:`,
								error.message,
							)
						}
					}

					return { filePath, success: true }
				} catch (error) {
					console.error(`❌ Failed to process ${filePath}:`, error.message)
					return { filePath, success: false, error: error.message }
				}
			})
		}

		// 4. Process files with concurrency control
		console.log(
			`\n🚦 Processing files (concurrency: ${CONFIG.MAX_CONCURRENT})...`,
		)
		const results = await processWithConcurrency(tasks, CONFIG.MAX_CONCURRENT)

		// 5. Report results
		const successCount = results.filter((r) => r.success).length
		const errorCount = results.filter((r) => !r.success).length

		console.log('\n🎉 Processing complete!')
		console.log(`✅ Successfully processed: ${successCount} files`)
		console.log(`❌ Failed to process: ${errorCount} files`)

		if (errorCount > 0) {
			console.log('\nFailed files:')
			results
				.filter((r) => !r.success)
				.forEach((r) => {
					console.log(`- ${r.filePath}: ${r.error}`)
				})
		}

		console.log('\n✅ All done! Internationalization complete!')
	} catch (error) {
		console.error('❌ Fatal error:', error.message)
		process.exit(1)
	}
}

// Parse command line argument
const mode = process.argv[2] || 'default'
main('default')
