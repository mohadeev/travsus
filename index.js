const fs = require('fs/promises')
const path = require('path')
const OpenAI = require('openai')

// Configuration
const CONFIG = {
	SOURCE_FILE: path.join(
		process.cwd(),
		'src',
		'app',
		'[locale]',
		'about',
		'page.tsx',
	),
	MESSAGES_DIR: path.join(process.cwd(), 'messages'),
	BACKUP_DIR: path.join(process.cwd(), '.i18n-backups'),

	// Static OpenAI API Key (for demo only)
	OPENAI_API_KEY:
		'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',
	OPENAI_MODEL: 'gpt-4',
	OPENAI_TEMPERATURE: 0.2,
}

const openai = new OpenAI({
	apiKey: CONFIG.OPENAI_API_KEY,
})

// === Backup Function ===
async function createBackup() {
	const backupPath = path.join(CONFIG.BACKUP_DIR, 'about-page.tsx.bak')
	const originalContent = await fs.readFile(CONFIG.SOURCE_FILE, 'utf-8')

	await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true })
	await fs.writeFile(backupPath, originalContent, 'utf-8')
	console.log('📂 Backup created at:', backupPath)
}

// === Text Extraction with Human-Readable Keys ===
async function extractTextForTranslation() {
	const fileContent = await fs.readFile(CONFIG.SOURCE_FILE, 'utf-8')
	const namespace = 'about'

	const prompt = `
You are an internationalization assistant. Analyze this React component and:

1. Extract ALL user-facing text that needs translation
2. Generate CLEAN KEYS in format: "about_Descriptive_Key" 
   (based on text content, not generic "key1")
3. Return ONLY this JSON format:

{
  "namespace": "${namespace}",
  "strings": {
	"about_Simplicity_In_Travel": "Simplicity in travel",
	"about_Book_Your_Trip": "Book your trip"
  }
}

KEY RULES:
- Prefix with "about_" (folder name)
- Use Title_Case_With_Underscores
- Remove special characters (!?.,)
- Keep under 40 chars
- MUST be unique per text
- NO generic keys (key1, key2)
`

	console.log('🔍 Extracting text with readable keys...')
	const result = await openai.chat.completions.create({
		model: CONFIG.OPENAI_MODEL,
		temperature: 0.1, // Lower temp for consistent keys
		messages: [
			{ role: 'system', content: prompt },
			{ role: 'user', content: fileContent },
		],
	})

	// Robust JSON parsing
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

// === Spanish Translation ===
async function getSpanishTranslations(englishStrings) {
	const prompt = `
Translate these UI strings from English to Spanish (Spain):

RULES:
1. Use formal, business-appropriate Spanish
2. Maintain consistent terminology
3. Keep Title_Case if present
4. Preserve numbers/symbols
5. Return EXACT SAME JSON FORMAT with translations

Input:
${JSON.stringify(englishStrings.strings, null, 2)}

Output ONLY the translated JSON object.`

	console.log('🌍 Translating to Spanish...')
	const result = await openai.chat.completions.create({
		model: CONFIG.OPENAI_MODEL,
		temperature: 0.3,
		messages: [{ role: 'system', content: prompt }],
	})

	return {
		namespace: englishStrings.namespace,
		strings: JSON.parse(result.choices[0].message.content),
	}
}

// === Update Source File ===
async function updateSourceFile(translations) {
	const fileContent = await fs.readFile(CONFIG.SOURCE_FILE, 'utf-8')
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
${fileContent}
`

	console.log('✏️  Updating source file...')
	const result = await openai.chat.completions.create({
		model: CONFIG.OPENAI_MODEL,
		temperature: 0,
		messages: [{ role: 'system', content: prompt }],
	})

	await fs.writeFile(
		CONFIG.SOURCE_FILE,
		result.choices[0].message.content,
		'utf-8',
	)
}

// === Update Translation Files ===
async function updateTranslationFiles(englishData, spanishData) {
	// Ensure messages directory exists
	await fs.mkdir(CONFIG.MESSAGES_DIR, { recursive: true })

	// English File
	const enFile = path.join(CONFIG.MESSAGES_DIR, 'en_US.json')
	let enContent = {}
	try {
		enContent = JSON.parse(await fs.readFile(enFile, 'utf-8'))
	} catch {
		enContent = {}
	}
	enContent[englishData.namespace] = englishData.strings
	await fs.writeFile(enFile, JSON.stringify(enContent, null, 2), 'utf-8')

	// Spanish File
	const esFile = path.join(CONFIG.MESSAGES_DIR, 'es_ES.json')
	let esContent = {}
	try {
		esContent = JSON.parse(await fs.readFile(esFile, 'utf-8'))
	} catch {
		esContent = {}
	}
	esContent[spanishData.namespace] = spanishData.strings
	await fs.writeFile(esFile, JSON.stringify(esContent, null, 2), 'utf-8')

	console.log('📝 Updated translation files:')
	console.log(`- 🇬🇧 ${enFile}`)
	console.log(`- 🇪🇸 ${esFile}`)
}

// === Main Function ===
async function main() {
	try {
		console.log('🚀 Starting i18n processing for about/page.tsx')

		// 1. Backup original file
		await createBackup()

		// 2. Extract English text with readable keys
		const englishData = await extractTextForTranslation()
		console.log('📋 Extracted strings:', englishData.strings)

		// 3. Get Spanish translations
		const spanishData = await getSpanishTranslations(englishData)
		console.log('🌍 Spanish translations:', spanishData.strings)

		// 4. Update source file with t() calls
		await updateSourceFile(englishData)

		// 5. Save translations
		await updateTranslationFiles(englishData, spanishData)

		console.log('✅ All done! Files updated successfully!')
	} catch (error) {
		console.error('❌ Error:', error.message)
		process.exit(1)
	}
}

main()
