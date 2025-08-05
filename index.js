const fs = require('fs').promises
const path = require('path')

// Configuration
const CONFIG = {
	SOURCE_DIR: path.join(process.cwd(), 'src'),
	MESSAGES_DIR: path.join(process.cwd(), 'messages'),
	BACKUP_DIR: path.join(process.cwd(), '.i18n-backups'),
	DEBUG_DIR: path.join(process.cwd(), '.debug-responses'),
	// v0.dev API Configuration
	V0_API_KEY: 'v1:oEZc7Ds3ddYfSKemF69xGkoz:jmzcX085FrkfJlDGUwRp4ZoZ',
	V0_MODEL: 'v0-1.5-md',
	V0_TEMPERATURE: 0.1,
	MAX_RETRIES: 2,
}

// Supported languages
const SUPPORTED_LANGUAGES = [
	'en-US',
	'es-ES',
	'de-DE',
	'ja-JP',
	'pt-PT',
	'it-IT',
	'fr-FR',
	'ru-RU',
	'zh-CN',
	'ko-KR',
]

// === v0.dev API Function ===
async function callV0API(prompt, retryCount = 0) {
	try {
		console.log(
			`🤖 Making v0.dev API call (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES + 1})...`,
		)

		const response = await fetch('https://api.v0.dev/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${CONFIG.V0_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: CONFIG.V0_MODEL,
				temperature: CONFIG.V0_TEMPERATURE,
				max_tokens: 32000,
				messages: [
					{
						role: 'system',
						content: `You are a senior React developer specializing in internationalization. 
						FOLLOW ALL INSTRUCTIONS EXACTLY. 
						PAY SPECIAL ATTENTION TO THE NAMESPACE AND KEY FORMAT REQUIREMENTS.
						NEVER DEVIATE FROM THE SPECIFIED FORMAT.`,
					},
					{ role: 'user', content: prompt },
				],
			}),
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(
				`v0 API error: ${response.status} ${response.statusText} - ${errorText}`,
			)
		}

		const data = await response.json()
		const content = data.choices[0].message.content

		if (data.choices[0].finish_reason === 'length') {
			console.log('⚠️ Response was truncated due to length, retrying...')
			if (retryCount < CONFIG.MAX_RETRIES) {
				const enhancedPrompt = `${prompt}

CRITICAL: This is a retry request. The previous response was truncated. 
MUST provide the COMPLETE, FULL transformation. Do not truncate or summarize.`

				await new Promise((resolve) => setTimeout(resolve, 2000))
				return await callV0API(enhancedPrompt, retryCount + 1)
			}
		}

		return content
	} catch (error) {
		console.error(
			`❌ v0 API call failed (attempt ${retryCount + 1}):`,
			error.message,
		)

		if (retryCount < CONFIG.MAX_RETRIES) {
			console.log(`🔄 Retrying in 3 seconds...`)
			await new Promise((resolve) => setTimeout(resolve, 3000))
			return await callV0API(prompt, retryCount + 1)
		}

		throw error
	}
}

// === Utility Functions ===
function cleanTripleBackticks(input) {
	if (typeof input !== 'string') return input
	return input.replace(/^\s*```[a-z]*\s*\n?/, '').replace(/\n?\s*```\s*$/, '')
}

// FIXED: Generate namespace from folder path + filename
function generateNamespace(filePath) {
	const relativePath = path.relative(CONFIG.SOURCE_DIR, filePath)
	const namespace = relativePath
		.replace(/\.tsx$/, '')
		.replace(/\.jsx$/, '')
		.replace(/[\\/]/g, '_')
		.replace(/[^a-zA-Z0-9_]/g, '')
		.replace(/_{2,}/g, '_') // Replace multiple underscores with single
		.replace(/^_|_$/g, '') // Remove leading/trailing underscores

	return namespace
}

async function saveDebugResponse(filePath, prompt, response, namespace) {
	try {
		await fs.mkdir(CONFIG.DEBUG_DIR, { recursive: true })
		const debugFile = path.join(
			CONFIG.DEBUG_DIR,
			`${path.basename(filePath)}_${Date.now()}.txt`,
		)
		const debugContent = `
=== FILE: ${filePath} ===
=== NAMESPACE: ${namespace} ===
=== PROMPT ===
${prompt}

=== RESPONSE ===
${response}

=== END ===
`
		await fs.writeFile(debugFile, debugContent, 'utf-8')
	} catch (error) {
		console.error('Failed to save debug response:', error.message)
	}
}

async function createBackup(filePath, content) {
	const relativePath = path.relative(process.cwd(), filePath)
	const backupPath = path.join(CONFIG.BACKUP_DIR, relativePath)
	const backupDir = path.dirname(backupPath)
	await fs.mkdir(backupDir, { recursive: true })
	await fs.writeFile(backupPath, content, 'utf-8')
	console.log(`📂 Backup created: ${backupPath}`)
}

async function getFilesByType() {
	const pages = []
	const components = []

	const localeDir = path.join(
		CONFIG.SOURCE_DIR,
		'app',
		'[locale]',
		'[continent]',
		'[country]',
		'[region]',
		'[city]',
		'[category]',
		'[name]',
	)
	const componentsDir = path.join(CONFIG.SOURCE_DIR, 'components')

	// Get all locale pages
	try {
		const localeEntries = await fs.readdir(localeDir, {
			recursive: true,
			withFileTypes: true,
		})

		for (const entry of localeEntries) {
			if (
				entry.isFile() &&
				(entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))
			) {
				pages.push(path.join(entry.path, entry.name))
			}
		}
	} catch (error) {
		console.log('⚠️ No locale directory found, skipping pages')
	}

	// Get all components
	try {
		const componentEntries = await fs.readdir(componentsDir, {
			recursive: true,
			withFileTypes: true,
		})

		for (const entry of componentEntries) {
			if (
				entry.isFile() &&
				(entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))
			) {
				components.push(path.join(entry.path, entry.name))
			}
		}
	} catch (error) {
		console.log('⚠️ No components directory found, skipping components')
	}

	return { pages, components }
}

async function getAvailableLanguages() {
	try {
		const files = await fs.readdir(CONFIG.MESSAGES_DIR)
		return files
			.filter((file) => file.endsWith('.json'))
			.map((file) => {
				const lang = file.replace('.json', '')
				return lang.includes('_') ? lang.replace('_', '-') : lang
			})
			.filter((lang) => SUPPORTED_LANGUAGES.includes(lang))
	} catch (error) {
		console.error('❌ Could not read messages directory:', error.message)
		return SUPPORTED_LANGUAGES
	}
}

// === Core Processing ===
async function processFileWithAI(filePath, namespace) {
	try {
		const content = await fs.readFile(filePath, 'utf-8')

		// Skip files that ALREADY have translations
		if (content.includes("import { useTranslations } from '@/lib/i18n'")) {
			console.log(`⏩ Skipping ${path.basename(filePath)} - already translated`)
			return null
		}

		// Skip empty files
		if (content.trim().length < 50) {
			console.log(`⏩ Skipping ${path.basename(filePath)} - file too small`)
			return null
		}

		// Create backup before processing
		await createBackup(filePath, content)

		console.log(`🏷️ Using namespace: "${namespace}"`)
		console.log(`📊 File size: ${content.length} characters`)

		const prompt = `# ULTRA-STRICT INTERNATIONALIZATION INSTRUCTIONS

Transform this TSX file to use internationalization.

## CRITICAL NAMESPACE AND KEY REQUIREMENTS:
- You MUST use the exact namespace: "${namespace}"
- The useTranslations call MUST be: useTranslations("${namespace}")
- Keys should be simple descriptive names WITHOUT the namespace prefix
- Example: t('Welcome_Message') NOT t('${namespace}_Welcome_Message')

## EXACT REQUIREMENTS:
1. Add this import: import { useTranslations } from '@/lib/i18n'
2. Add this hook call: const t = useTranslations("${namespace}");
3. Replace static text with: t('Simple_Key_Name')
4. Generate simple keys like: Welcome_Message, Button_Text, Error_Message

## KEY FORMAT RULES:
- Use descriptive names: Welcome_Message, Submit_Button, Error_Text
- NO namespace prefix in keys
- Use Title_Case_With_Underscores
- Keep keys under 30 characters

## OUTPUT FORMAT:
---CODE:
<COMPLETE TSX FILE WITH EXACT NAMESPACE>
---MESSAGES:
{
  "${namespace}": {
	"Welcome_Message": "Welcome to our site",
	"Button_Text": "Click here",
	"Error_Message": "Something went wrong"
  }
}

## EXAMPLE TRANSFORMATION:

BEFORE:
<div>
  <h1>Welcome to our site</h1>
  <button>Click here</button>
  <p>Something went wrong</p>
</div>

AFTER:
import { useTranslations } from '@/lib/i18n';

export default function Component() {
  const t = useTranslations("${namespace}");
  
  return (
	<div>
	  <h1>{t('Welcome_Message')}</h1>
	  <button>{t('Button_Text')}</button>
	  <p>{t('Error_Message')}</p>
	</div>
  );
}

---MESSAGES:
{
  "${namespace}": {
	"Welcome_Message": "Welcome to our site",
	"Button_Text": "Click here", 
	"Error_Message": "Something went wrong"
  }
}

## FILE TO TRANSFORM:
${content}

REMEMBER: 
- Use EXACTLY "${namespace}" in useTranslations()
- Keys should be simple names WITHOUT namespace prefix
- JSON structure: { "${namespace}": { "Simple_Key": "value" } }`

		console.log(`💬 Processing ${path.basename(filePath)} with v0.dev AI...`)

		const output = await callV0API(prompt)

		// Save debug response
		await saveDebugResponse(filePath, prompt, output, namespace)

		// Check if AI is asking for component code (common error)
		if (
			output.includes("don't see the component code") ||
			output.includes('provide the React component')
		) {
			console.error('❌ AI did not receive component code properly')
			throw new Error('AI did not process component code - check prompt format')
		}

		const codeMatch = output.match(/---CODE:\s*([\s\S]*?)---MESSAGES:/)
		const msgMatch = output.match(/---MESSAGES:\s*([\s\S]*)$/)

		if (!codeMatch || !msgMatch) {
			console.error('❌ FAILED TO PARSE AI OUTPUT FOR:', filePath)
			console.error('Raw output preview:', output.substring(0, 1000))
			throw new Error('AI response format invalid')
		}

		const newCode = cleanTripleBackticks(codeMatch[1].trim())
		const messagesStr = cleanTripleBackticks(msgMatch[1].trim())

		console.log(`🔍 Validating namespace usage in generated code...`)

		// Check if import is present
		const hasImport = newCode.includes(
			"import { useTranslations } from '@/lib/i18n'",
		)
		console.log(`✓ Has import: ${hasImport}`)

		// Check if exact namespace is used
		const namespacePattern = `useTranslations("${namespace}")`
		const hasCorrectNamespace = newCode.includes(namespacePattern)
		console.log(`✓ Has correct namespace call: ${hasCorrectNamespace}`)

		if (!hasImport) {
			console.error('❌ Missing import in generated code')
			throw new Error('I18N IMPORT MISSING IN OUTPUT CODE')
		}

		if (!hasCorrectNamespace) {
			console.error(`❌ Namespace "${namespace}" not used correctly`)
			// Try to find what namespace was actually used
			const actualNamespaceMatch = newCode.match(
				/useTranslations\s*$$\s*["'`]([^"'`]+)["'`]\s*$$/,
			)
			if (actualNamespaceMatch) {
				console.error(
					`❌ AI used namespace: "${actualNamespaceMatch[1]}" instead of "${namespace}"`,
				)
			}
			throw new Error(
				`NAMESPACE "${namespace}" NOT USED IN useTranslations CALL`,
			)
		}

		// Parse and validate messages
		const messages = JSON.parse(messagesStr)

		// Validate namespace structure
		if (!messages[namespace]) {
			throw new Error(`Namespace "${namespace}" missing in AI output messages`)
		}

		// FIXED: Validate key format - keys should NOT have namespace prefix
		const generatedKeys = Object.keys(messages[namespace])
		console.log(`✓ Generated ${generatedKeys.length} translation keys`)

		for (const key in messages[namespace]) {
			if (key.includes('.')) {
				throw new Error(`FORBIDDEN KEY FORMAT: ${key} - DOTS NOT ALLOWED`)
			}
			// FIXED: Keys should NOT start with namespace
			if (key.startsWith(`${namespace}_`)) {
				throw new Error(
					`KEY SHOULD NOT HAVE NAMESPACE PREFIX: ${key} should be simple like "Welcome_Message"`,
				)
			}
		}

		return {
			newCode,
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

	const prompt = `# STRICT TRANSLATION INSTRUCTIONS

Translate these UI strings from English to ${targetLang}:

## RULES:
1. Use formal business language appropriate for ${targetLang}
2. Maintain EXACT terminology from original
3. Preserve ALL variables like {year}, {name}, etc. exactly as-is
4. Keep capitalization and punctuation identical
5. Return ONLY the complete JSON object with translations
6. ABSOLUTELY NO CHANGES TO KEYS - TRANSLATE VALUES ONLY
7. MAINTAIN NAMESPACE STRUCTURE: { "${namespace}": { key: value } }

## INPUT STRINGS:
${JSON.stringify({ [namespace]: strings }, null, 2)}

## OUTPUT FORMAT (JSON ONLY):
{
  "${namespace}": {
	<EXACT SAME KEYS WITH TRANSLATED VALUES>
  }
}

CRITICAL: Provide translations for ALL strings. Do not truncate.`

	console.log(
		`🌍 Translating ${Object.keys(strings).length} strings to ${targetLang}...`,
	)

	const result = await callV0API(prompt)
	const cleanedResponse = cleanTripleBackticks(result)
	const translations = JSON.parse(cleanedResponse)

	if (!translations[namespace]) {
		throw new Error(`Namespace "${namespace}" missing in translation`)
	}

	return translations
}

async function updateSourceFile(filePath, newCode) {
	if (newCode.includes("import { useTranslations } from '@/lib/i18n'")) {
		await fs.writeFile(filePath, newCode, 'utf-8')
		console.log(`✏️ UPDATED: ${path.basename(filePath)}`)
	} else {
		throw new Error('I18N IMPORT MISSING IN OUTPUT CODE')
	}
}

async function updateTranslationFiles(lang, messages) {
	const filename = `${lang}.json`
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

	if (!content[namespace]) {
		content[namespace] = {}
	}

	for (const [key, value] of Object.entries(newStrings)) {
		if (!content[namespace][key]) {
			content[namespace][key] = value
		}
	}

	await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')
	console.log(`✅ UPDATED: ${filename} for namespace ${namespace}`)
}

// Process a batch of files
async function processFiles(files, languages, batchName) {
	if (files.length === 0) {
		console.log(`ℹ️ No files found in ${batchName}`)
		return
	}

	console.log(
		`\n🚀 STARTING ${batchName.toUpperCase()} PROCESSING (${files.length} files)`,
	)

	for (const [index, filePath] of files.entries()) {
		try {
			console.log(`\n=== PROCESSING FILE ${index + 1}/${files.length} ===`)
			console.log(`📄 ${path.relative(CONFIG.SOURCE_DIR, filePath)}`)

			// Skip if already has translations
			const content = await fs.readFile(filePath, 'utf-8')
			if (content.includes("import { useTranslations } from '@/lib/i18n'")) {
				console.log(`⏩ Skipping - already translated`)
				continue
			}

			// Generate namespace from folder path + filename
			const namespace = generateNamespace(filePath)

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
						messages = result.messages
					} else {
						messages = await translateMessages(result.messages, lang)
					}
					await updateTranslationFiles(lang, messages)
				} catch (error) {
					console.error(`❌ Translation failed for ${lang}:`, error.message)
				}
			}

			console.log(`✅ SUCCESS: ${path.basename(filePath)} processed`)
		} catch (error) {
			console.error(`💥 PROCESSING FAILURE: ${filePath} - ${error.message}`)
		}
	}
}

// === Main Function ===
async function main() {
	try {
		console.log(
			'🚀 STARTING FIXED v0.dev I18N AUTOMATION - PROPER JSON STRUCTURE',
		)
		console.log('🔧 FIXES APPLIED:')
		console.log('   ✅ Namespace = folder_path_filename')
		console.log('   ✅ Keys are simple names WITHOUT namespace prefix')
		console.log(
			'   ✅ JSON structure: { "namespace": { "Simple_Key": "value" } }',
		)
		console.log('   ✅ NO MORE FLAT KEYS WITH LONG PREFIXES!')
		console.log('🌐 SUPPORTED LANGUAGES:', SUPPORTED_LANGUAGES.join(', '))

		// Ensure directories exist
		await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true })
		await fs.mkdir(CONFIG.MESSAGES_DIR, { recursive: true })
		await fs.mkdir(CONFIG.DEBUG_DIR, { recursive: true })

		const { pages, components } = await getFilesByType()
		const languages = await getAvailableLanguages()

		console.log(`📂 PAGES TO PROCESS: ${pages.length}`)
		console.log(`🧩 COMPONENTS TO PROCESS: ${components.length}`)
		console.log(`🌐 LANGUAGES: ${languages.join(', ')}`)

		// Process pages first, then components
		await processFiles(pages, languages, 'pages')
		await processFiles(components, languages, 'components')

		console.log('\n🎉 OPERATION COMPLETE!')
		console.log(`📋 Debug responses saved in: ${CONFIG.DEBUG_DIR}`)
		console.log('🎯 JSON STRUCTURE IS NOW PROPER NESTED OBJECTS!')
	} catch (error) {
		console.error('💣 FATAL SYSTEM FAILURE:', error.message)
	}
}

// Run the script
main()
