// The site's texts: messages/<locale>.json, shaped { group: { key: "text" } }.
// The translations panel reads and edits them here. Files keep their order
// and 2-space formatting so changes show up as small git diffs. Writing only
// works where the files can be changed (local `npm run dev`); the texts are
// bundled into the site at build time, so a change goes live with the next
// push/deploy.
import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { routing } from '@/i18n/routing'

export type Messages = Record<string, Record<string, string>>

const DIR = path.join(process.cwd(), 'messages')
export const LOCALES = routing.locales as readonly string[]
const NAME = /^[A-Za-z0-9_.-]{1,120}$/ // group and key names
const MAX_TEXT = 10_000

const file = (locale: string) => path.join(DIR, `${locale}.json`)

/** Editing is allowed when running locally (the deployed site is read-only). */
export const canWrite = () => process.env.NODE_ENV === 'development'

export async function readAll(): Promise<Record<string, Messages>> {
	const entries = await Promise.all(LOCALES.map(async (l) => [l, JSON.parse(await fs.readFile(file(l), 'utf8'))] as const))
	return Object.fromEntries(entries)
}

async function write(locale: string, data: Messages) {
	// Write to a temp file first, then swap: a crash never leaves half a file
	const tmp = `${file(locale)}.tmp`
	await fs.writeFile(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8')
	await fs.rename(tmp, file(locale))
}

export const validName = (v: unknown): v is string => typeof v === 'string' && NAME.test(v)

/** Set one text in some languages. An empty string removes it from that language. */
export async function setTexts(group: string, key: string, values: Record<string, unknown>) {
	const all = await readAll()
	for (const [locale, value] of Object.entries(values)) {
		if (!LOCALES.includes(locale) || typeof value !== 'string') continue
		const data = all[locale]
		if (value.trim() === '') {
			if (data[group]) delete data[group][key]
		} else {
			data[group] = data[group] ?? {}
			data[group][key] = value.slice(0, MAX_TEXT)
		}
		await write(locale, data)
	}
}

/** Remove a key from every language. */
export async function deleteKey(group: string, key: string) {
	const all = await readAll()
	for (const locale of LOCALES) {
		const data = all[locale]
		if (data[group] && key in data[group]) {
			delete data[group][key]
			if (Object.keys(data[group]).length === 0) delete data[group]
			await write(locale, data)
		}
	}
}

/**
 * Bulk import, the addLangs.js format: { "en-US": { group: { key: "text" } }, … }.
 * New texts replace existing ones; nothing else is touched.
 * Returns how many texts were written per language.
 */
export async function importTexts(input: unknown) {
	if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected { "en-US": { group: { key: "text" } } }')
	const all = await readAll()
	const counts: Record<string, number> = {}
	for (const [locale, groups] of Object.entries(input as Record<string, any>)) {
		if (!LOCALES.includes(locale)) throw new Error(`Unknown language "${locale}" (use one of ${LOCALES.join(', ')})`)
		if (!groups || typeof groups !== 'object') throw new Error(`"${locale}" must contain groups`)
		const data = all[locale]
		let n = 0
		for (const [group, keys] of Object.entries(groups as Record<string, any>)) {
			if (!validName(group)) throw new Error(`Bad group name "${group}"`)
			if (!keys || typeof keys !== 'object') throw new Error(`"${locale}.${group}" must contain keys`)
			for (const [key, value] of Object.entries(keys as Record<string, any>)) {
				if (!validName(key)) throw new Error(`Bad key name "${group}.${key}"`)
				if (typeof value !== 'string') throw new Error(`"${locale}.${group}.${key}" must be text`)
				data[group] = data[group] ?? {}
				data[group][key] = value.slice(0, MAX_TEXT)
				n++
			}
		}
		if (n) await write(locale, data)
		counts[locale] = n
	}
	return counts
}
