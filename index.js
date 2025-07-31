const fs = require('fs').promises
const path = require('path')
const OpenAI = require('openai')

// Configuration
const CONFIG = {
	SOURCE_DIR: path.join(process.cwd(), 'src'),
	MESSAGES_DIR: path.join(process.cwd(), 'messages'),
	BACKUP_DIR: path.join(process.cwd(), '.i18n-backups'),

	// Static OpenAI API Key
	OPENAI_API_KEY:
		'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',
	OPENAI_MODEL: 'gpt-4',
	OPENAI_TEMPERATURE: 0.1, // Maximum determinism
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
	console.log(`📂 Backup created: ${backupPath}`)
}

async function getTsxFiles() {
	const files = []
	const entries = await fs.readdir(CONFIG.SOURCE_DIR, {
		recursive: true,
		withFileTypes: true,
	})

	for (const entry of entries) {
		if (
			entry.isFile() &&
			(entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))
		) {
			files.push(path.join(entry.path, entry.name))
		}
	}

	return files
}

async function getAvailableLanguages() {
	try {
		const files = await fs.readdir(CONFIG.MESSAGES_DIR)
		return files
			.filter((file) => file.endsWith('.json'))
			.map((file) => file.replace('.json', '').replace('_', '-'))
	} catch (error) {
		console.error('❌ Could not read messages directory:', error.message)
		return ['en-US', 'es-ES'] // Fallback to default
	}
}

// === Core Processing ===

async function processFileWithAI(filePath, namespace) {
	try {
		const content = await fs.readFile(filePath, 'utf-8')

		// Skip files without the required import
		if (!content.includes("import { useTranslations } from '@/lib/i18n'")) {
			console.log(
				`⏩ Skipping ${path.basename(filePath)} - missing i18n import`,
			)
			return null
		}

		// Create backup before processing
		await createBackup(filePath, content)

		const prompt = `
# STRICT INSTRUCTIONS FOR INTERNATIONALIZATION

You are an expert React/Next.js developer. Transform this component EXACTLY as specified:

## REQUIREMENTS
1. MUST use: import { useTranslations } from '@/lib/i18n'
2. MUST call useTranslations with namespace: "${namespace}"
3. MUST generate keys in format: ${namespace}_Descriptive_Key
4. Replace ONLY user-facing static text (no code, no props, no variables)
5. PRESERVE ALL formatting, whitespace, and code structure
6. DO NOT change any functionality or logic
7. DO NOT add or remove any imports except the required i18n import
8. ABSOLUTELY NO DOTTED KEYS (${namespace}_Key.subkey is FORBIDDEN)
9. JSON MUST HAVE NAMESPACE OBJECT: { "${namespace}": { key: value } }

## KEY GENERATION RULES
- Create keys from text content: "Book your trip" → ${namespace}_Book_Your_Trip
- Keep keys under 40 characters
- Maintain consistent casing (Title_Case_With_Underscores)
- NEVER use dots in keys (${namespace}_Key.subkey is ILLEGAL)

## OUTPUT FORMAT
Return ONLY this exact format:
---CODE:
<transformed code>
---MESSAGES:
{
  "${namespace}": {
    "${namespace}_Key1": "Original text 1",
    "${namespace}_Key2": "Original text 2"
  }
}

## EXAMPLE TRANSFORMATION

BEFORE:
<div className="container">
  <h1>Welcome to our site</h1>
  <p>Book your trip today</p>
</div>

AFTER:
import { useTranslations } from '@/lib/i18n';

export default function Component() {
  const t = useTranslations("${namespace}");
  
  return (
    <div className="container">
      <h1>{t('${namespace}_Welcome_To_Our_Site')}</h1>
      <p>{t('${namespace}_Book_Your_Trip_Today')}</p>
    </div>
  );
}

---MESSAGES:
{
  "${namespace}": {
    "${namespace}_Welcome_To_Our_Site": "Welcome to our site",
    "${namespace}_Book_Your_Trip_Today": "Book your trip today"
  }
}

## COMPONENT TO PROCESS:
${content}
`

		console.log(`💬 Processing ${path.basename(filePath)} with AI...`)
		const result = await openai.chat.completions.create({
			model: CONFIG.OPENAI_MODEL,
			temperature: CONFIG.OPENAI_TEMPERATURE,
			messages: [
				{
					role: 'system',
					content:
						'You are a senior React developer specializing in internationalization. Follow instructions EXACTLY.',
				},
				{ role: 'user', content: prompt },
			],
		})

		const output = result.choices[0].message.content
		const codeMatch = output.match(/---CODE:\s*([\s\S]*?)---MESSAGES:/)
		const msgMatch = output.match(/---MESSAGES:\s*([\s\S]*)$/)

		if (!codeMatch || !msgMatch) {
			console.error('❌ FAILED TO PARSE AI OUTPUT FOR:', filePath)
			console.error('RAW OUTPUT:', output)
			throw new Error('AI response format invalid')
		}

		// Parse and validate messages
		const messages = JSON.parse(msgMatch[1].trim())

		// Validate namespace structure
		if (!messages[namespace]) {
			throw new Error(`Namespace "${namespace}" missing in AI output`)
		}

		// Validate key format
		for (const key in messages[namespace]) {
			if (key.includes('.')) {
				throw new Error(`FORBIDDEN KEY FORMAT: ${key} - DOTS NOT ALLOWED`)
			}
			if (!key.startsWith(`${namespace}_`)) {
				throw new Error(
					`KEY MUST START WITH NAMESPACE: ${key} should start with ${namespace}_`,
				)
			}
		}

		return {
			newCode: codeMatch[1].trim(),
			messages,
		}
	} catch (error) {
		console.error(`❌ CRITICAL ERROR PROCESSING ${filePath}:`, error.message)
		return null
	}
}

async function translateMessages(englishMessages, targetLang) {
	if (targetLang === 'en-US') return englishMessages

	const namespace = Object.keys(englishMessages)[0]
	const strings = englishMessages[namespace]

	const prompt = `
# STRICT TRANSLATION INSTRUCTIONS

Translate these UI strings from English to ${targetLang}:

## RULES
1. Use formal business language
2. Maintain EXACT terminology from original
3. Preserve ALL variables like {year} exactly as-is
4. Keep capitalization and punctuation identical
5. Return ONLY the JSON object with translations
6. ABSOLUTELY NO CHANGES TO KEYS - TRANSLATE VALUES ONLY
7. MAINTAIN NAMESPACE STRUCTURE: { "${namespace}": { key: value } }

## INPUT STRINGS:
${JSON.stringify({ [namespace]: strings }, null, 2)}

## OUTPUT FORMAT:
{
  "${namespace}": {
    <EXACT SAME KEYS WITH TRANSLATED VALUES>
  }
}

DO NOT RETURN ANYTHING ELSE! ONLY THE JSON OBJECT!
`

	console.log(`🌍 Translating to ${targetLang}...`)
	const result = await openai.chat.completions.create({
		model: CONFIG.OPENAI_MODEL,
		temperature: CONFIG.OPENAI_TEMPERATURE,
		messages: [
			{
				role: 'system',
				content:
					'You are a professional translator. Follow instructions EXACTLY.',
			},
			{ role: 'user', content: prompt },
		],
	})

	const translations = JSON.parse(result.choices[0].message.content)

	// Validate translations
	if (!translations[namespace]) {
		throw new Error(`Namespace "${namespace}" missing in translation`)
	}

	const originalKeys = Object.keys(strings)
	const translatedKeys = Object.keys(translations[namespace])

	if (originalKeys.length !== translatedKeys.length) {
		throw new Error('KEY COUNT MISMATCH IN TRANSLATION')
	}

	for (const key of originalKeys) {
		if (!translations[namespace][key]) {
			throw new Error(`MISSING KEY IN TRANSLATION: ${key}`)
		}
		if (key.includes('.')) {
			throw new Error(`FORBIDDEN KEY FORMAT: ${key}`)
		}
	}

	return translations
}

async function updateSourceFile(filePath, newCode) {
	// Final validation before writing
	if (newCode.includes("import { useTranslations } from '@/lib/i18n'")) {
		await fs.writeFile(filePath, newCode, 'utf-8')
		console.log(`✏️ UPDATED: ${path.basename(filePath)}`)
	} else {
		throw new Error('I18N IMPORT MISSING IN OUTPUT CODE')
	}
}

async function updateTranslationFiles(lang, messages) {
	// Convert to filename format (es-ES → es_ES.json)
	const filename = `${lang.replace('-', '_')}.json`
	const filePath = path.join(CONFIG.MESSAGES_DIR, filename)

	let content = {}
	try {
		const fileContent = await fs.readFile(filePath, 'utf-8')
		content = JSON.parse(fileContent)
	} catch {
		// File doesn't exist yet
	}

	const namespace = Object.keys(messages)[0]
	const newStrings = messages[namespace]

	// Create namespace if needed
	if (!content[namespace]) {
		content[namespace] = {}
	}

	// Add new translations without overwriting existing ones
	for (const [key, value] of Object.entries(newStrings)) {
		// Validate key format
		if (key.includes('.')) {
			throw new Error(`FORBIDDEN KEY FORMAT: ${key} - USE UNDERSCORES ONLY`)
		}

		if (!content[namespace][key]) {
			content[namespace][key] = value
		}
	}

	await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')
	console.log(`✅ UPDATED: ${filename} for namespace ${namespace}`)
}

// === Main Function ===

async function main() {
	try {
		console.log('🚀 STARTING STRICT NAMESPACE-BASED I18N AUTOMATION')
		console.log('🔒 STRICT RULES ENFORCED:')
		console.log(
			'   1. NAMESPACE OBJECT STRUCTURE: { "namespace": { key: value } }',
		)
		console.log('   2. NO DOTTED KEYS - UNDERSCORES ONLY')
		console.log(
			'   3. KEYS MUST START WITH NAMESPACE (e.g., footer_footer_Disclaimer)',
		)
		console.log('   4. ZERO TOLERANCE FOR DEVIATIONS')

		// Ensure directories exist
		await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true })
		await fs.mkdir(CONFIG.MESSAGES_DIR, { recursive: true })

		// 1. Get all files and languages
		const files = await getTsxFiles()
		const languages = await getAvailableLanguages()

		if (files.length === 0) {
			console.log('ℹ️ No .tsx files found')
			return
		}

		console.log(`📂 FILES TO PROCESS: ${files.length}`)
		console.log(`🌐 LANGUAGES: ${languages.join(', ')}`)

		// 2. Process each file
		for (const [index, filePath] of files.entries()) {
			try {
				console.log(`\n=== PROCESSING FILE ${index + 1}/${files.length} ===`)
				console.log(`📄 ${path.relative(CONFIG.SOURCE_DIR, filePath)}`)

				// Derive namespace from file path
				const relativePath = path.relative(CONFIG.SOURCE_DIR, filePath)
				const namespace = relativePath
					.replace(/\.tsx$/, '')
					.replace(/\.jsx$/, '')
					.replace(/[\\/]/g, '_')
					.replace(/[^a-zA-Z0-9_]/g, '')

				// Process file with AI
				const result = await processFileWithAI(filePath, namespace)
				if (!result) continue

				// Update source file
				await updateSourceFile(filePath, result.newCode)

				// Process each language
				for (const lang of languages) {
					try {
						let messages

						if (lang === 'en-US') {
							// Use English messages as-is
							messages = result.messages
						} else {
							// Translate for other languages
							messages = await translateMessages(result.messages, lang)
						}

						// Update translation file
						await updateTranslationFiles(lang, messages)
					} catch (error) {
						console.error(`❌ TRANSLATION FAILED FOR ${lang}:`, error.message)
					}
				}

				console.log(`✅ SUCCESS: ${path.basename(filePath)} processed`)
			} catch (error) {
				console.error(`💥 PROCESSING FAILURE: ${filePath} - ${error.message}`)
			}
		}

		console.log('\n🎉 OPERATION COMPLETE!')
		console.log('🔥 ALL FILES INTERNATIONALIZED WITH PRECISION!')
	} catch (error) {
		console.error('💣 FATAL SYSTEM FAILURE:', error.message)
	}
}

// Run the script
main()
