const fs = require('fs').promises
const path = require('path')

// Configuration for v0.dev API - Ultra Advanced Version
const CONFIG = {
	SOURCE_DIR: path.join(process.cwd(), 's', 'src'),
	NESTED_PATH: path.join(
		process.cwd(),
		's',
		'src',
		'app',
		'[locale]',
		'[continent]',
		'[country]',
		'[region]',
		'[city]',
		'[category]',
		'[name]',
	),
	MESSAGES_DIR: path.join(process.cwd(), 's', 'messages'),
	BACKUP_DIR: path.join(process.cwd(), 's', '.i18n-backups'),
	CACHE_DIR: path.join(process.cwd(), 's', '.i18n-cache'),
	DEBUG_DIR: path.join(process.cwd(), 's', '.debug-responses'),
	ANALYSIS_DIR: path.join(process.cwd(), 's', '.text-analysis'),
	DEEP_ANALYSIS_DIR: path.join(process.cwd(), 's', '.deep-analysis'), // For ultra-deep analysis
	// v0.dev API Configuration
	V0_API_KEY: 'v1:oEZc7Ds3ddYfSKemF69xGkoz:jmzcX085FrkfJlDGUwRp4ZoZ',
	V0_MODEL: 'v0-1.5-md',
	V0_TEMPERATURE: 0.1,
	MAX_RETRIES: 3,
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

// Cache and tracking
const processedFiles = new Set()
const translatedFiles = new Set()
const noTextFiles = new Set()
const deepAnalyzedFiles = new Set() // Files that passed deep analysis
const translationCache = new Map()
const dependencyGraph = new Map()
const textAnalysisCache = new Map()
const deepAnalysisCache = new Map() // Cache for deep analysis results
let aiCallsCount = 0
let creditsWasted = 0
let deepAnalysisSkipped = 0 // Track files skipped by deep analysis

// === Ultra-Advanced Text Detection ===
function extractTranslatableTextAdvanced(content) {
	const translatableTexts = []

	// Remove comments and clean content
	const withoutComments = content
		.replace(/\/\*[\s\S]*?\*\//g, '') // Block comments
		.replace(/\/\/.*$/gm, '') // Line comments
		.replace(/^\s*import\s+.*$/gm, '') // Remove import statements
		.replace(/^\s*export\s+.*$/gm, '') // Remove export statements (but keep export default)

	// 1. JSX Return Statement Analysis - Most Important
	const jsxReturnTexts = extractJSXReturnTexts(withoutComments)
	translatableTexts.push(...jsxReturnTexts)

	// 2. Function Return Values that contain text
	const functionReturnTexts = extractFunctionReturnTexts(withoutComments)
	translatableTexts.push(...functionReturnTexts)

	// 3. JSX Attributes with text values
	const jsxAttributeTexts = extractJSXAttributeTexts(withoutComments)
	translatableTexts.push(...jsxAttributeTexts)

	// 4. Conditional rendering with text
	const conditionalTexts = extractConditionalTexts(withoutComments)
	translatableTexts.push(...conditionalTexts)

	// 5. Object/Array literals with text (like error messages, options)
	const objectTexts = extractObjectTexts(withoutComments)
	translatableTexts.push(...objectTexts)

	// 6. Template literals with static content
	const templateTexts = extractTemplateTexts(withoutComments)
	translatableTexts.push(...templateTexts)

	// 7. String constants and variables
	const constantTexts = extractConstantTexts(withoutComments)
	translatableTexts.push(...constantTexts)

	// Remove duplicates and filter
	const uniqueTexts = []
	const seen = new Set()
	for (const item of translatableTexts) {
		if (!seen.has(item.text) && isTranslatableTextAdvanced(item.text)) {
			seen.add(item.text)
			uniqueTexts.push(item)
		}
	}

	return uniqueTexts
}

function extractJSXReturnTexts(content) {
	const texts = []

	// Match return statements with JSX
	const returnRegex = /return\s*$$?\s*([\s\S]*?)(?:$$?\s*;|\)?\s*})/g
	let match

	while ((match = returnRegex.exec(content)) !== null) {
		const jsxContent = match[1]

		// Extract text between JSX tags
		const jsxTextRegex = />([^<>{}\n\r]+?)</g
		let textMatch
		while ((textMatch = jsxTextRegex.exec(jsxContent)) !== null) {
			const text = textMatch[1].trim()
			if (text && text.length > 1) {
				texts.push({
					type: 'jsx_return_content',
					text: text,
					context: `return JSX: ${textMatch[0]}`,
					priority: 'high',
				})
			}
		}

		// Extract string literals in JSX
		const jsxStringRegex = /["'`]([^"'`\n\r]{2,}?)["'`]/g
		while ((textMatch = jsxStringRegex.exec(jsxContent)) !== null) {
			const text = textMatch[1].trim()
			if (text && text.length > 1) {
				texts.push({
					type: 'jsx_return_string',
					text: text,
					context: `return JSX string: ${textMatch[0]}`,
					priority: 'high',
				})
			}
		}
	}

	return texts
}

function extractFunctionReturnTexts(content) {
	const texts = []

	// Match function declarations and arrow functions that return strings
	const functionRegex =
		/(?:function\s+\w+\s*$$[^)]*$$\s*{[\s\S]*?return\s+["'`]([^"'`\n\r]{2,}?)["'`]|const\s+\w+\s*=\s*$$[^)]*$$\s*=>\s*["'`]([^"'`\n\r]{2,}?)["'`]|const\s+\w+\s*=\s*$$[^)]*$$\s*=>\s*{[\s\S]*?return\s+["'`]([^"'`\n\r]{2,}?)["'`])/g
	let match

	while ((match = functionRegex.exec(content)) !== null) {
		const text = (match[1] || match[2] || match[3] || '').trim()
		if (text && text.length > 1) {
			texts.push({
				type: 'function_return_string',
				text: text,
				context: `function return: "${text}"`,
				priority: 'medium',
			})
		}
	}

	return texts
}

function extractJSXAttributeTexts(content) {
	const texts = []

	// JSX attributes that commonly contain user-facing text
	const attributeRegex =
		/\s+(alt|title|placeholder|aria-label|aria-describedby|label|text|content|description|name|data-\w+)\s*=\s*["'`]([^"'`\n\r]{2,}?)["'`]/g
	let match

	while ((match = attributeRegex.exec(content)) !== null) {
		const text = match[2].trim()
		if (text && text.length > 1) {
			texts.push({
				type: 'jsx_attribute',
				text: text,
				context: `${match[1]}="${text}"`,
				priority: 'high',
			})
		}
	}

	return texts
}

function extractConditionalTexts(content) {
	const texts = []

	// Conditional rendering patterns: condition ? "text" : "other text"
	const conditionalRegex =
		/\?\s*["'`]([^"'`\n\r]{2,}?)["'`]\s*:\s*["'`]([^"'`\n\r]{2,}?)["'`]|\?\s*["'`]([^"'`\n\r]{2,}?)["'`]|&&\s*["'`]([^"'`\n\r]{2,}?)["'`]/g
	let match

	while ((match = conditionalRegex.exec(content)) !== null) {
		const text1 = (match[1] || match[3] || match[4] || '').trim()
		const text2 = (match[2] || '').trim()

		if (text1 && text1.length > 1) {
			texts.push({
				type: 'conditional_text',
				text: text1,
				context: `conditional: ${match[0]}`,
				priority: 'medium',
			})
		}

		if (text2 && text2.length > 1) {
			texts.push({
				type: 'conditional_text',
				text: text2,
				context: `conditional: ${match[0]}`,
				priority: 'medium',
			})
		}
	}

	return texts
}

function extractObjectTexts(content) {
	const texts = []

	// Object properties that commonly contain text
	const objectRegex =
		/(?:message|label|text|title|description|placeholder|error|success|warning|info|name|content|value|defaultValue)\s*:\s*["'`]([^"'`\n\r]{2,}?)["'`]/g
	let match

	while ((match = objectRegex.exec(content)) !== null) {
		const text = match[1].trim()
		if (text && text.length > 1) {
			texts.push({
				type: 'object_property',
				text: text,
				context: `object property: ${match[0]}`,
				priority: 'medium',
			})
		}
	}

	return texts
}

function extractTemplateTexts(content) {
	const texts = []

	// Template literals with mostly static content
	const templateRegex = /`([^`${}]{3,}?)`/g
	let match

	while ((match = templateRegex.exec(content)) !== null) {
		const text = match[1].trim()
		if (text && text.length > 2) {
			texts.push({
				type: 'template_literal',
				text: text,
				context: `template: \`${text}\``,
				priority: 'low',
			})
		}
	}

	return texts
}

function extractConstantTexts(content) {
	const texts = []

	// String constants and variables
	const constantRegex =
		/const\s+[A-Z_][A-Z0-9_]*\s*=\s*["'`]([^"'`\n\r]{2,}?)["'`]/g
	let match

	while ((match = constantRegex.exec(content)) !== null) {
		const text = match[1].trim()
		if (text && text.length > 1) {
			texts.push({
				type: 'constant_string',
				text: text,
				context: `constant: ${match[0]}`,
				priority: 'low',
			})
		}
	}

	return texts
}

function isTranslatableTextAdvanced(text) {
	if (!text || text.length < 2) return false

	// Enhanced filtering - more sophisticated detection

	// Skip technical strings
	if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(text)) return false // Variable names
	if (/^\d+(\.\d+)?$/.test(text)) return false // Numbers
	if (
		/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|svg|webp|ico|css|js|ts|tsx|jsx|json|xml|html)$/i.test(
			text,
		)
	)
		return false // File names
	if (/^#[0-9a-fA-F]{3,8}$/.test(text)) return false // Color codes
	if (/^https?:\/\//.test(text)) return false // URLs
	if (/^\/[a-zA-Z0-9_/-]*$/.test(text)) return false // Paths
	if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text))
		return false // Emails
	if (/^\$\{.*\}$/.test(text)) return false // Template variables
	if (/^[A-Z_][A-Z0-9_]*$/.test(text)) return false // Constants
	if (/^\w+:\w+$/.test(text)) return false // Key:value pairs
	if (text.includes('()') || text.includes('{}') || text.includes('[]'))
		return false // Function calls

	// Skip CSS-related strings
	if (/^[a-z-]+:[a-z0-9-]+$/.test(text)) return false // CSS properties
	if (/^[a-z-]+\s+[a-z-]+$/.test(text) && text.length < 10) return false // CSS classes

	// Skip code-like strings
	if (/^[a-zA-Z]+$$[^)]*$$$/.test(text)) return false // Function calls
	if (/^[a-zA-Z]+\.[a-zA-Z]+$/.test(text)) return false // Object properties
	if (/^[a-zA-Z]+\[[^\]]*\]$/.test(text)) return false // Array access

	// Skip very short non-meaningful text
	if (
		text.length < 3 &&
		!/^(ok|no|yes|go|hi|bye|on|off|up|new|old|add|get|set|run|end|top|all|any|now|why|how|who|and|but|for|the|you|can|may|use|see|try|buy|pay|win|fix|cut|put|let|ask|say|do|be|is|am|are|was|has|had|get|got|did|will|would|could|should|might|must|need|want|like|love|hate|know|think|feel|look|seem|find|keep|make|take|give|come|go|turn|move|stop|start|play|work|live|stay|leave|help|tell|show|call|read|write|send|open|close|save|load|edit|copy|paste|delete|remove|clear|reset|undo|redo|back|next|prev|skip|done|exit|quit|cancel|ok|yes|no|true|false|on|off|in|out|up|down|left|right|here|there|this|that|some|more|less|most|best|good|bad|big|small|long|short|high|low|fast|slow|easy|hard|free|paid|new|old|hot|cold|full|empty|open|close|start|stop|first|last|next|prev|home|away|near|far|today|tomorrow|yesterday|now|then|soon|late|early|always|never|often|sometimes|maybe|sure|sorry|thanks|please|welcome|hello|goodbye|hi|bye)$/i.test(
			text,
		)
	)
		return false

	// Must contain at least one letter
	if (!/[a-zA-Z]/.test(text)) return false

	// Skip if it's mostly symbols or numbers
	const alphaCount = (text.match(/[a-zA-Z]/g) || []).length
	if (alphaCount < text.length * 0.4) return false

	// Skip single characters unless they're meaningful
	if (text.length === 1 && !/[a-zA-Z]/.test(text)) return false

	// Must have some word-like structure
	if (!/\b[a-zA-Z]{2,}\b/.test(text)) return false

	return true
}

async function performDeepAnalysis(filePath) {
	const cacheKey = filePath
	if (deepAnalysisCache.has(cacheKey)) {
		return deepAnalysisCache.get(cacheKey)
	}

	try {
		const content = await fs.readFile(filePath, 'utf-8')

		// Ultra-deep analysis
		const analysis = {
			hasJSXReturn: false,
			hasTextInJSX: false,
			hasTranslatableContent: false,
			jsxReturnCount: 0,
			functionReturnCount: 0,
			totalTextCount: 0,
			highPriorityTexts: [],
			mediumPriorityTexts: [],
			lowPriorityTexts: [],
			analysisDetails: {},
		}

		// Check if component has JSX return
		const hasJSXReturn = /return\s*\(?\s*</.test(content)
		analysis.hasJSXReturn = hasJSXReturn

		if (!hasJSXReturn) {
			console.log(
				`🚫 No JSX return found in ${path.basename(filePath)} - likely not a React component`,
			)
			analysis.analysisDetails.reason = 'No JSX return statement found'
			deepAnalysisCache.set(cacheKey, analysis)
			await saveDeepAnalysis(filePath, analysis)
			return analysis
		}

		// Extract all translatable texts with advanced detection
		const translatableTexts = extractTranslatableTextAdvanced(content)
		analysis.totalTextCount = translatableTexts.length

		// Categorize by priority
		for (const textItem of translatableTexts) {
			if (textItem.priority === 'high') {
				analysis.highPriorityTexts.push(textItem)
			} else if (textItem.priority === 'medium') {
				analysis.mediumPriorityTexts.push(textItem)
			} else {
				analysis.lowPriorityTexts.push(textItem)
			}
		}

		// Determine if component has translatable content
		analysis.hasTranslatableContent =
			analysis.highPriorityTexts.length > 0 ||
			analysis.mediumPriorityTexts.length > 0
		analysis.hasTextInJSX = analysis.highPriorityTexts.length > 0

		// Additional analysis
		analysis.jsxReturnCount = (content.match(/return\s*\(?\s*</g) || []).length
		analysis.functionReturnCount = (
			content.match(/return\s+["'`]/g) || []
		).length

		// Analysis details
		analysis.analysisDetails = {
			componentType: hasJSXReturn ? 'React Component' : 'Utility/Hook',
			hasUserFacingText: analysis.hasTextInJSX,
			recommendTranslation: analysis.hasTranslatableContent,
			skipReason: analysis.hasTranslatableContent
				? null
				: 'No user-facing text found',
		}

		// Cache the analysis
		deepAnalysisCache.set(cacheKey, analysis)
		await saveDeepAnalysis(filePath, analysis)

		return analysis
	} catch (error) {
		console.error(`❌ Deep analysis failed for ${filePath}:`, error.message)
		const errorAnalysis = {
			hasJSXReturn: false,
			hasTextInJSX: false,
			hasTranslatableContent: false,
			totalTextCount: 0,
			analysisDetails: { error: error.message },
		}
		deepAnalysisCache.set(cacheKey, errorAnalysis)
		return errorAnalysis
	}
}

async function saveDeepAnalysis(filePath, analysis) {
	try {
		await fs.mkdir(CONFIG.DEEP_ANALYSIS_DIR, { recursive: true })
		const analysisFile = path.join(
			CONFIG.DEEP_ANALYSIS_DIR,
			`${path.basename(filePath)}_deep_analysis.json`,
		)
		const analysisContent = {
			file: filePath,
			timestamp: new Date().toISOString(),
			...analysis,
		}
		await fs.writeFile(
			analysisFile,
			JSON.stringify(analysisContent, null, 2),
			'utf-8',
		)
	} catch (error) {
		console.error('Failed to save deep analysis:', error.message)
	}
}

// === Translation Detection ===
async function isAlreadyTranslated(filePath) {
	try {
		const content = await fs.readFile(filePath, 'utf-8')

		const hasLibI18n = content.includes(
			"import { useTranslations } from '@/lib/i18n'",
		)
		const hasNextIntl = content.includes(
			"import { useTranslations } from 'next-intl'",
		)

		const isTranslated = hasLibI18n || hasNextIntl

		if (isTranslated) {
			translatedFiles.add(filePath)
			console.log(
				`✅ Already translated: ${path.basename(filePath)} (${hasLibI18n ? '@/lib/i18n' : 'next-intl'})`,
			)
		}

		return isTranslated
	} catch {
		return false
	}
}

// === v0.dev API Functions ===
async function callV0API(prompt, retryCount = 0) {
	aiCallsCount++
	console.log(
		`🤖 AI Call #${aiCallsCount} - Making v0.dev API call (attempt ${retryCount + 1}/${CONFIG.MAX_RETRIES + 1})...`,
	)

	try {
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
                        PAY SPECIAL ATTENTION TO THE NAMESPACE REQUIREMENT.
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

// === Cache Management ===
async function loadCache() {
	try {
		await fs.mkdir(CONFIG.CACHE_DIR, { recursive: true })
		await fs.mkdir(CONFIG.DEBUG_DIR, { recursive: true })
		await fs.mkdir(CONFIG.ANALYSIS_DIR, { recursive: true })
		await fs.mkdir(CONFIG.DEEP_ANALYSIS_DIR, { recursive: true })

		// Load all cache files
		const cacheFiles = [
			{ file: 'processed.json', set: processedFiles, name: 'processed files' },
			{
				file: 'translated.json',
				set: translatedFiles,
				name: 'translated files',
			},
			{ file: 'no-text.json', set: noTextFiles, name: 'no-text files' },
			{
				file: 'deep-analyzed.json',
				set: deepAnalyzedFiles,
				name: 'deep-analyzed files',
			},
		]

		for (const { file, set, name } of cacheFiles) {
			try {
				const data = await fs.readFile(
					path.join(CONFIG.CACHE_DIR, file),
					'utf-8',
				)
				const items = JSON.parse(data)
				items.forEach((item) => set.add(item))
				console.log(`📋 Loaded ${items.length} ${name} from cache`)
			} catch {}
		}

		// Load map caches
		const mapCaches = [
			{
				file: 'translations.json',
				map: translationCache,
				name: 'translations',
			},
			{
				file: 'text-analysis.json',
				map: textAnalysisCache,
				name: 'text analyses',
			},
			{
				file: 'deep-analysis.json',
				map: deepAnalysisCache,
				name: 'deep analyses',
			},
			{
				file: 'dependencies.json',
				map: dependencyGraph,
				name: 'dependency entries',
			},
		]

		for (const { file, map, name } of mapCaches) {
			try {
				const data = await fs.readFile(
					path.join(CONFIG.CACHE_DIR, file),
					'utf-8',
				)
				const items = JSON.parse(data)
				Object.entries(items).forEach(([key, value]) => map.set(key, value))
				console.log(`💾 Loaded ${map.size} ${name} from cache`)
			} catch {}
		}
	} catch (error) {
		console.error('⚠️ Cache loading failed:', error.message)
	}
}

async function saveCache() {
	try {
		// Save set caches
		const setCaches = [
			{ file: 'processed.json', set: processedFiles },
			{ file: 'translated.json', set: translatedFiles },
			{ file: 'no-text.json', set: noTextFiles },
			{ file: 'deep-analyzed.json', set: deepAnalyzedFiles },
		]

		for (const { file, set } of setCaches) {
			await fs.writeFile(
				path.join(CONFIG.CACHE_DIR, file),
				JSON.stringify([...set], null, 2),
			)
		}

		// Save map caches
		const mapCaches = [
			{ file: 'translations.json', map: translationCache },
			{ file: 'text-analysis.json', map: textAnalysisCache },
			{ file: 'deep-analysis.json', map: deepAnalysisCache },
			{ file: 'dependencies.json', map: dependencyGraph },
		]

		for (const { file, map } of mapCaches) {
			const obj = Object.fromEntries(map)
			await fs.writeFile(
				path.join(CONFIG.CACHE_DIR, file),
				JSON.stringify(obj, null, 2),
			)
		}

		console.log('💾 Cache saved successfully')
	} catch (error) {
		console.error('⚠️ Cache saving failed:', error.message)
	}
}

// === Dependency Analysis ===
function extractImports(content) {
	const imports = []
	const importRegex = /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g
	let match

	while ((match = importRegex.exec(content)) !== null) {
		const importPath = match[1]
		if (
			importPath.startsWith('./') ||
			importPath.startsWith('../') ||
			importPath.startsWith('@/')
		) {
			imports.push(importPath)
		}
	}

	return imports
}

function resolveImportPath(currentFile, importPath) {
	const currentDir = path.dirname(currentFile)

	if (importPath.startsWith('@/')) {
		return path.resolve(CONFIG.SOURCE_DIR, importPath.substring(2))
	} else if (importPath.startsWith('./') || importPath.startsWith('../')) {
		return path.resolve(currentDir, importPath)
	}

	return null
}

function findActualTsxFile(basePath) {
	const tsxPath = basePath + '.tsx'
	try {
		if (require('fs').existsSync(tsxPath)) {
			return tsxPath
		}
	} catch {}

	const indexPath = path.join(basePath, 'index.tsx')
	try {
		if (require('fs').existsSync(indexPath)) {
			return indexPath
		}
	} catch {}

	return null
}

async function buildDependencyGraph(filePath) {
	if (dependencyGraph.has(filePath)) {
		return dependencyGraph.get(filePath)
	}

	try {
		const content = await fs.readFile(filePath, 'utf-8')
		const imports = extractImports(content)
		const dependencies = []

		for (const importPath of imports) {
			const resolvedPath = resolveImportPath(filePath, importPath)
			if (resolvedPath) {
				const actualFile = findActualTsxFile(resolvedPath)
				if (actualFile && actualFile.includes(CONFIG.SOURCE_DIR)) {
					dependencies.push(actualFile)
				}
			}
		}

		dependencyGraph.set(filePath, dependencies)
		console.log(
			`🔗 ${path.basename(filePath)} has ${dependencies.length} TSX dependencies`,
		)
		return dependencies
	} catch (error) {
		console.error(
			`⚠️ Failed to analyze dependencies for ${filePath}:`,
			error.message,
		)
		return []
	}
}

// === Nested Path File Discovery ===
async function getAllTsxFilesFromNestedPath() {
	const allFiles = []

	console.log(
		`🔍 Searching for TSX files in nested path: ${CONFIG.NESTED_PATH}`,
	)

	try {
		const pathExists = await fs
			.access(CONFIG.NESTED_PATH)
			.then(() => true)
			.catch(() => false)

		if (!pathExists) {
			console.log(`⚠️ Nested path does not exist: ${CONFIG.NESTED_PATH}`)
			console.log(`📁 Creating directory structure...`)
			await fs.mkdir(CONFIG.NESTED_PATH, { recursive: true })
			console.log(`✅ Directory structure created`)
			return []
		}

		async function findTsxFiles(dir) {
			const entries = await fs.readdir(dir, { withFileTypes: true })

			for (const entry of entries) {
				const fullPath = path.join(dir, entry.name)

				if (entry.isDirectory()) {
					await findTsxFiles(fullPath)
				} else if (entry.isFile() && entry.name.endsWith('.tsx')) {
					allFiles.push(fullPath)
				}
			}
		}

		await findTsxFiles(CONFIG.NESTED_PATH)

		console.log(
			`📂 Found ${allFiles.length} TSX files in nested path structure`,
		)

		if (allFiles.length > 0) {
			console.log(`📋 Files found:`)
			allFiles.forEach((file, index) => {
				const relativePath = path.relative(CONFIG.NESTED_PATH, file)
				console.log(`   ${index + 1}. ${relativePath}`)
			})
		}
	} catch (error) {
		console.error('❌ Error searching nested path:', error.message)
	}

	return allFiles
}

// === Ultra-Advanced Smart Processing ===
async function processFileWithV0(filePath, namespace) {
	if (processedFiles.has(filePath)) {
		console.log(`⏩ Using cached result for ${path.basename(filePath)}`)
		return translationCache.get(filePath)
	}

	if (await isAlreadyTranslated(filePath)) {
		console.log(
			`💰 CREDITS SAVED: Skipping AI call for ${path.basename(filePath)} - already translated`,
		)
		processedFiles.add(filePath)
		return null
	}

	// ULTRA-ADVANCED: Perform deep analysis first
	console.log(`🔬 Performing deep analysis on ${path.basename(filePath)}...`)
	const deepAnalysis = await performDeepAnalysis(filePath)

	if (!deepAnalysis.hasTranslatableContent) {
		console.log(
			`💰 CREDITS SAVED: Deep analysis shows no translatable content in ${path.basename(filePath)}`,
		)
		console.log(
			`   📊 Analysis: JSX Return: ${deepAnalysis.hasJSXReturn}, Text in JSX: ${deepAnalysis.hasTextInJSX}`,
		)
		console.log(
			`   📊 High Priority Texts: ${deepAnalysis.highPriorityTexts.length}, Medium: ${deepAnalysis.mediumPriorityTexts.length}`,
		)
		console.log(
			`   📊 Reason: ${deepAnalysis.analysisDetails.skipReason || 'No user-facing text detected'}`,
		)

		noTextFiles.add(filePath)
		processedFiles.add(filePath)
		deepAnalysisSkipped++
		return null
	}

	deepAnalyzedFiles.add(filePath)

	console.log(`🎯 Deep analysis PASSED - Component needs translation:`)
	console.log(
		`   📊 High Priority Texts: ${deepAnalysis.highPriorityTexts.length}`,
	)
	console.log(
		`   📊 Medium Priority Texts: ${deepAnalysis.mediumPriorityTexts.length}`,
	)
	console.log(`   📊 Total Translatable Texts: ${deepAnalysis.totalTextCount}`)

	// Show the high priority texts that were found
	if (deepAnalysis.highPriorityTexts.length > 0) {
		console.log(`   🔥 High Priority Texts Found:`)
		deepAnalysis.highPriorityTexts.slice(0, 3).forEach((item, index) => {
			console.log(`      ${index + 1}. "${item.text}" (${item.type})`)
		})
		if (deepAnalysis.highPriorityTexts.length > 3) {
			console.log(
				`      ... and ${deepAnalysis.highPriorityTexts.length - 3} more high priority texts`,
			)
		}
	}

	try {
		const content = await fs.readFile(filePath, 'utf-8')
		const fileSize = content.length

		console.log(
			`📊 File size: ${fileSize} characters - CONFIRMED NEEDS TRANSLATION`,
		)
		console.log(`🏷️  Using namespace: "${namespace}"`)

		// Create backup
		await createBackup(filePath, content)

		// Ultra-enhanced prompt with deep analysis context
		const allTexts = [
			...deepAnalysis.highPriorityTexts,
			...deepAnalysis.mediumPriorityTexts,
		]
		const foundTexts = allTexts.map((t) => `"${t.text}"`).join(', ')

		const prompt = `# ULTRA-STRICT INTERNATIONALIZATION INSTRUCTIONS

Transform this TSX file to use internationalization. I've performed DEEP ANALYSIS and confirmed it needs translation.

## DEEP ANALYSIS RESULTS:
- Component Type: ${deepAnalysis.analysisDetails.componentType}
- Has JSX Return: ${deepAnalysis.hasJSXReturn}
- Has User-Facing Text: ${deepAnalysis.hasTextInJSX}
- High Priority Texts: ${deepAnalysis.highPriorityTexts.length}
- Medium Priority Texts: ${deepAnalysis.mediumPriorityTexts.length}
- Total Texts to Translate: ${deepAnalysis.totalTextCount}

## CRITICAL NAMESPACE REQUIREMENT:
- You MUST use the exact namespace: "${namespace}"
- The useTranslations call MUST be: useTranslations("${namespace}")
- Do NOT modify this namespace in any way

## EXACT REQUIREMENTS:
1. Add this import: import { useTranslations } from '@/lib/i18n'
2. Add this hook call: const t = useTranslations("${namespace}");
3. Replace static text with: t('${namespace}_Key_Name')
4. Generate keys like: ${namespace}_Welcome_Message, ${namespace}_Button_Text

## PRIORITY TEXTS TO TRANSLATE:
${allTexts.map((item, index) => `${index + 1}. "${item.text}" (${item.type} - ${item.priority} priority)`).join('\n')}

## VALIDATION CHECKLIST:
✓ Import added: import { useTranslations } from '@/lib/i18n'
✓ Hook called with EXACT namespace: useTranslations("${namespace}")
✓ Keys start with namespace: ${namespace}_*
✓ No dots in keys (use underscores)
✓ All ${deepAnalysis.totalTextCount} texts translated

## OUTPUT FORMAT:
---CODE:
<COMPLETE TSX FILE WITH EXACT NAMESPACE>
---MESSAGES:
{
  "${namespace}": {
    "${namespace}_Key1": "Original text 1",
    "${namespace}_Key2": "Original text 2"
  }
}

## FILE TO TRANSFORM:
${content}

REMEMBER: Use EXACTLY "${namespace}" and translate all ${deepAnalysis.totalTextCount} identified texts!`

		console.log(
			`🤖 Processing ${path.basename(filePath)} with v0.dev (${deepAnalysis.totalTextCount} texts confirmed by deep analysis)...`,
		)

		const output = await callV0API(prompt)

		// Save debug response
		await saveDebugResponse(filePath, prompt, output, namespace)

		const codeMatch = output.match(/---CODE:\s*([\s\S]*?)---MESSAGES:/)
		const msgMatch = output.match(/---MESSAGES:\s*([\s\S]*)$/)

		if (!codeMatch || !msgMatch) {
			console.error('❌ FAILED TO PARSE v0 OUTPUT FOR:', filePath)
			console.error('Raw output preview:', output.substring(0, 1000))
			throw new Error('v0 response format invalid')
		}

		const newCode = cleanTripleBackticks(codeMatch[1].trim())
		const messagesStr = cleanTripleBackticks(msgMatch[1].trim())

		console.log(`🔍 Validating namespace usage in generated code...`)

		const hasImport = newCode.includes(
			"import { useTranslations } from '@/lib/i18n'",
		)
		const namespacePattern = `useTranslations("${namespace}")`
		const hasCorrectNamespace = newCode.includes(namespacePattern)

		console.log(`✓ Has import: ${hasImport}`)
		console.log(`✓ Has correct namespace call: ${hasCorrectNamespace}`)

		if (!hasImport) {
			console.error('❌ Missing import in generated code')
			throw new Error('I18N IMPORT MISSING IN OUTPUT CODE')
		}

		if (!hasCorrectNamespace) {
			console.error(`❌ Namespace "${namespace}" not used correctly`)
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

		const messages = JSON.parse(messagesStr)

		if (!messages[namespace]) {
			throw new Error(`Namespace "${namespace}" missing in v0 output messages`)
		}

		const generatedKeys = Object.keys(messages[namespace])
		console.log(`✓ Generated ${generatedKeys.length} translation keys`)

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

		const result = { newCode, messages }

		processedFiles.add(filePath)
		translationCache.set(filePath, result)

		console.log(
			`✅ Successfully processed: ${path.basename(filePath)} with ${deepAnalysis.totalTextCount} texts translated (deep analysis confirmed)`,
		)
		return result
	} catch (error) {
		console.error(`❌ v0 processing failed for ${filePath}:`, error.message)
		return null
	}
}

async function processFileAndDependencies(
	filePath,
	languages,
	processed = new Set(),
) {
	if (processed.has(filePath)) {
		return
	}
	processed.add(filePath)

	console.log(`\n📄 Analyzing: ${path.relative(CONFIG.SOURCE_DIR, filePath)}`)

	const isTranslated = await isAlreadyTranslated(filePath)

	if (isTranslated) {
		console.log(
			`✅ File already translated - checking its dependencies instead`,
		)

		const dependencies = await buildDependencyGraph(filePath)
		const tsxDependencies = dependencies.filter((dep) => dep.endsWith('.tsx'))

		console.log(`🔗 Found ${tsxDependencies.length} TSX dependencies to check`)

		for (const depPath of tsxDependencies) {
			await processFileAndDependencies(depPath, languages, processed)
		}

		processedFiles.add(filePath)
		return
	}

	if (noTextFiles.has(filePath)) {
		console.log(
			`🚫 File has no translatable text (cached) - checking dependencies`,
		)

		const dependencies = await buildDependencyGraph(filePath)
		const tsxDependencies = dependencies.filter((dep) => dep.endsWith('.tsx'))

		for (const depPath of tsxDependencies) {
			await processFileAndDependencies(depPath, languages, processed)
		}

		processedFiles.add(filePath)
		return
	}

	console.log(`🔄 File needs deep analysis - processing dependencies first`)

	const dependencies = await buildDependencyGraph(filePath)
	const tsxDependencies = dependencies.filter((dep) => dep.endsWith('.tsx'))
	console.log(`🔗 Found ${tsxDependencies.length} TSX dependencies`)

	for (const depPath of tsxDependencies) {
		await processFileAndDependencies(depPath, languages, processed)
	}

	const namespace = path
		.relative(CONFIG.SOURCE_DIR, filePath)
		.replace(/\.tsx$/, '')
		.replace(/[\\/]/g, '_')
		.replace(/[^a-zA-Z0-9_]/g, '')

	console.log(`🎯 Processing file: ${path.basename(filePath)}`)
	console.log(`🏷️  Generated namespace: "${namespace}"`)

	const result = await processFileWithV0(filePath, namespace)

	if (result) {
		await updateSourceFile(filePath, result.newCode)

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

		console.log(`✅ SUCCESS: ${path.basename(filePath)} completely processed`)
	}
}

// === Utility Functions ===
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

function cleanTripleBackticks(input) {
	if (typeof input !== 'string') return input
	return input.replace(/^\s*```[a-z]*\s*\n?/, '').replace(/\n?\s*```\s*$/, '')
}

async function createBackup(filePath, content) {
	const relativePath = path.relative(path.join(process.cwd(), 's'), filePath)
	const backupPath = path.join(CONFIG.BACKUP_DIR, relativePath)
	const backupDir = path.dirname(backupPath)
	await fs.mkdir(backupDir, { recursive: true })
	await fs.writeFile(backupPath, content, 'utf-8')
	console.log(`📂 Backup created: ${backupPath}`)
}

async function translateMessages(englishMessages, targetLang) {
	if (targetLang === 'en-US') return englishMessages

	const cacheKey = `${JSON.stringify(englishMessages)}_${targetLang}`
	if (translationCache.has(cacheKey)) {
		console.log(`💾 Using cached translation for ${targetLang}`)
		return translationCache.get(cacheKey)
	}

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

	translationCache.set(cacheKey, translations)
	return translations
}

async function updateSourceFile(filePath, newCode) {
	if (newCode.includes("import { useTranslations } from '@/lib/i18n'")) {
		await fs.writeFile(filePath, newCode, 'utf-8')
		console.log(`✏️ UPDATED: ${path.basename(filePath)}`)
		translatedFiles.add(filePath)
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

// === Main Function ===
async function main() {
	try {
		console.log(
			'🚀 STARTING ULTRA-ADVANCED DEEP ANALYSIS v0.dev I18N AUTOMATION',
		)
		console.log('🧠 ULTRA-ADVANCED FEATURES:')
		console.log('   🔬 Deep JSX return analysis')
		console.log('   🎯 Function return text detection')
		console.log('   📊 Priority-based text categorization')
		console.log('   🚫 Skip non-React components automatically')
		console.log('   💡 Advanced translatable text filtering')
		console.log('   🔍 Ultra-sophisticated text detection patterns')
		console.log('   💰 Maximum credit optimization through deep analysis')
		console.log(`   🔑 Using your provided API key`)

		aiCallsCount = 0
		creditsWasted = 0
		deepAnalysisSkipped = 0

		// Ensure all directories exist
		await fs.mkdir(CONFIG.BACKUP_DIR, { recursive: true })
		await fs.mkdir(CONFIG.MESSAGES_DIR, { recursive: true })
		await fs.mkdir(CONFIG.CACHE_DIR, { recursive: true })
		await fs.mkdir(CONFIG.DEBUG_DIR, { recursive: true })
		await fs.mkdir(CONFIG.ANALYSIS_DIR, { recursive: true })
		await fs.mkdir(CONFIG.DEEP_ANALYSIS_DIR, { recursive: true })

		await loadCache()

		const nestedFiles = await getAllTsxFilesFromNestedPath()
		const languages = await getAvailableLanguages()

		console.log(`📂 TSX FILES FOUND IN NESTED PATH: ${nestedFiles.length}`)
		console.log(`🌐 LANGUAGES: ${languages.join(', ')}`)

		if (nestedFiles.length === 0) {
			console.log('⚠️ No TSX files found in the nested path structure')
			console.log(`📁 Searched in: ${CONFIG.NESTED_PATH}`)
			console.log('💡 Make sure the path exists and contains TSX files')
			return
		}

		for (const [index, filePath] of nestedFiles.entries()) {
			console.log(
				`\n=== PROCESSING NESTED FILE ${index + 1}/${nestedFiles.length} ===`,
			)
			console.log(`📄 ${path.relative(CONFIG.NESTED_PATH, filePath)}`)

			await processFileAndDependencies(filePath, languages)

			if ((index + 1) % 3 === 0) {
				await saveCache()
				console.log(`💾 Cache saved after processing ${index + 1} files`)
			}
		}

		await saveCache()

		console.log('\n🎉 ULTRA-ADVANCED DEEP ANALYSIS PROCESSING COMPLETE!')
		console.log(`📊 FINAL STATISTICS:`)
		console.log(`   📁 Total files processed: ${processedFiles.size}`)
		console.log(`   ✅ Already translated files: ${translatedFiles.size}`)
		console.log(`   🚫 No-text files (skipped): ${noTextFiles.size}`)
		console.log(`   🔬 Deep analysis passed: ${deepAnalyzedFiles.size}`)
		console.log(`   🤖 AI calls made: ${aiCallsCount}`)
		console.log(
			`   💰 Credits saved by translation detection: ${translatedFiles.size}`,
		)
		console.log(`   💰 Credits saved by deep analysis: ${deepAnalysisSkipped}`)
		console.log(
			`   💰 Total credits saved: ${translatedFiles.size + deepAnalysisSkipped}`,
		)
		console.log(`   🔗 Dependency entries: ${dependencyGraph.size}`)
		console.log(`   🔍 Text analyses: ${textAnalysisCache.size}`)
		console.log(`   🔬 Deep analyses: ${deepAnalysisCache.size}`)
		console.log(`   📋 Deep analysis reports: ${CONFIG.DEEP_ANALYSIS_DIR}`)
		console.log(`   🗂️  Processed nested path: ${CONFIG.NESTED_PATH}`)
		console.log(
			`   💡 Credit efficiency: ${Math.round(((translatedFiles.size + deepAnalysisSkipped) / (processedFiles.size || 1)) * 100)}% of files skipped`,
		)
	} catch (error) {
		console.error('💣 FATAL ERROR:', error.message)
		console.error('Stack trace:', error.stack)
		await saveCache()
	}
}

// Run the script
main()
