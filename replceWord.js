/**
 * Extract all entries whose TEXT VALUE contains "guest"/"guests" (incl. common typo "gusets"),
 * preserving the original text EXACTLY, into a separate file, and clean the source file by
 * removing those same entries.
 *
 * IMPORTANT:
 * - Matches are based on VALUE only (the text), not the keys.
 * - Case-insensitive. Does NOT match inside other words like "suggest".
 * - If a parent group becomes empty after removals, it is removed from the cleaned file.
 *
 * Defaults:
 *   Input file: messages/en-US.JSON
 *   Extracted file: messages/en-US.guests.json
 *   Cleaning: in-place (original file updated) with a .bak backup
 *
 * Usage examples:
 *   node replceWord.js
 *   node replceWord.js --in messages/en-US.JSON --extract messages/en-US.guests.json
 *   node replceWord.js --in messages/en-US.JSON --out messages/en-US.cleaned.json   (writes cleaned to new file)
 *   node replceWord.js --in messages/en-US.JSON --in-place                          (default behavior)
 */

const fs = require('node:fs/promises')
const path = require('node:path')

function parseArgs(argv) {
	const args = {
		in: 'messages/en-US.JSON',
		extract: 'messages/en-US.guests.json',
		out: null, // if null, we will clean in-place (with .bak)
		inPlace: true,
	}
	for (let i = 2; i < argv.length; i++) {
		const a = argv[i]
		if (a === '--in' && argv[i + 1]) args.in = argv[++i]
		else if (a === '--extract' && argv[i + 1]) args.extract = argv[++i]
		else if (a === '--out' && argv[i + 1]) {
			args.out = argv[++i]
			args.inPlace = false
		} else if (a === '--in-place') {
			args.out = null
			args.inPlace = true
		}
	}
	return args
}

function isPlainObject(x) {
	return typeof x === 'object' && x !== null && !Array.isArray(x)
}

// Match guest/guests (and common typo gusets) as standalone relative to letters,
// so it won't hit words like "suggest". Still matches "Add guests", "{guests?.x}" etc.
const guestWord = /(?<![A-Za-z])(guests?|gusets?)(?![A-Za-z])/i

function valueHasGuest(str) {
	return typeof str === 'string' && guestWord.test(str)
}

async function extractAndClean(
	inputPath,
	extractPath,
	options = { outPath: null, inPlace: true },
) {
	const inAbs = path.resolve(process.cwd(), inputPath)
	const extractAbs = path.resolve(process.cwd(), extractPath)

	const raw = await fs.readFile(inAbs, 'utf8')
	let data
	try {
		data = JSON.parse(raw)
	} catch (err) {
		console.error(
			'Failed to parse JSON. Ensure the input file contains valid JSON.',
		)
		throw err
	}
	if (!isPlainObject(data)) {
		throw new Error('Root of input JSON must be an object.')
	}

	const extracted = {}
	const cleaned = {}
	let extractedCount = 0
	let keptCount = 0

	for (const [fatherKey, group] of Object.entries(data)) {
		if (!isPlainObject(group)) {
			// Non-object groups are simply carried over to cleaned as-is (and not considered for extraction)
			cleaned[fatherKey] = group
			continue
		}

		const newGroup = {}
		for (const [childKey, value] of Object.entries(group)) {
			if (valueHasGuest(value)) {
				if (!extracted[fatherKey]) extracted[fatherKey] = {}
				extracted[fatherKey][childKey] = value // preserve original text exactly
				extractedCount++
			} else {
				newGroup[childKey] = value
				keptCount++
			}
		}

		if (Object.keys(newGroup).length > 0) {
			cleaned[fatherKey] = newGroup
		}
	}

	// Write extracted file
	await fs.mkdir(path.dirname(extractAbs), { recursive: true })
	await fs.writeFile(
		extractAbs,
		JSON.stringify(extracted, null, 2) + '\n',
		'utf8',
	)

	// Write cleaned file (in-place with .bak or to outPath)
	if (options.inPlace) {
		const backupPath = inAbs + '.bak'
		await fs.writeFile(backupPath, raw, 'utf8')
		await fs.writeFile(inAbs, JSON.stringify(cleaned, null, 2) + '\n', 'utf8')
		console.log(`Backup written: ${backupPath}`)
		console.log(`Cleaned in place: ${inputPath}`)
	} else {
		const outAbs = path.resolve(
			process.cwd(),
			options.outPath || 'messages/en-US.cleaned.json',
		)
		await fs.mkdir(path.dirname(outAbs), { recursive: true })
		await fs.writeFile(outAbs, JSON.stringify(cleaned, null, 2) + '\n', 'utf8')
		console.log(`Cleaned file written: ${options.outPath}`)
	}

	console.log(`Extracted entries: ${extractedCount} -> ${extractPath}`)
	console.log(`Kept entries: ${keptCount}`)
}

async function main() {
	const args = parseArgs(process.argv)
	await extractAndClean(args.in, args.extract, {
		outPath: args.out,
		inPlace: args.inPlace,
	})
}

if (require.main === module) {
	main().catch((err) => {
		console.error(err)
		process.exit(1)
	})
}

module.exports = { extractAndClean }
