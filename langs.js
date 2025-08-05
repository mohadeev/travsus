const fs = require('fs')
const path = require('path')

// Use current working directory for proper path resolution
const LOCALES_DIR = path.join(
	process.cwd(),
	'node_modules',
	'date-fns',
	'locale',
)
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'lib', 'dateFnsLocales.ts')

// Get all locale files
const localeFiles = fs
	.readdirSync(LOCALES_DIR)
	.filter(
		(file) =>
			file.endsWith('.js') &&
			!file.startsWith('index') &&
			!file.startsWith('_'),
	)

// Generate import statements and mapping object
const imports = []
const mappingEntries = []

localeFiles.forEach((file) => {
	const localeName = path.basename(file, '.js')
	const varName = localeName.replace(/-/g, '_')

	imports.push(`import ${varName} from 'date-fns/locale/${localeName}';`)
	mappingEntries.push(`  '${localeName}': ${varName},`)
})

// Create file content
const fileContent = `// AUTO-GENERATED FILE - DO NOT EDIT
// Run 'npm run generate:locales' to update
${imports.join('\n')}

const locales = {
${mappingEntries.join('\n')}
} as const;

export type DateFnsLocaleKey = keyof typeof locales;
export default locales;
`

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE)
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true })
}

// Write to file
fs.writeFileSync(OUTPUT_FILE, fileContent)
console.log(`✅ Generated ${mappingEntries.length} locales at ${OUTPUT_FILE}`)
