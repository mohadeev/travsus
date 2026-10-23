'use client'
// Reads export files in the browser and merges them into one { table: rows[] }
// object. Accepted files:
// - CSV with one "all_data" cell holding { table: rows } (the SQL editor export)
// - CSV with one cell holding a JSON array (one table, named after the file)
// - a normal CSV table (one row per line; JSON-looking cells are parsed)
// - the same shapes as .json files
import { useMemo, useState } from 'react'
import { Download, FileUp, Loader2, Table2, X } from 'lucide-react'

type Rows = Record<string, unknown>[]
type Tables = Record<string, Rows>
type Loaded = { name: string; size: number; tables: string[]; error?: string }

const PREVIEW = 20

/** CSV text → rows of cells (quotes and "" escapes, newlines inside quotes). */
function parseCsv(text: string): string[][] {
	const rows: string[][] = []
	let row: string[] = []
	let cell = ''
	let quoted = false
	for (let i = 0; i < text.length; i++) {
		const c = text[i]
		if (quoted) {
			if (c === '"') {
				if (text[i + 1] === '"') (cell += '"'), i++
				else quoted = false
			} else cell += c
		} else if (c === '"') quoted = true
		else if (c === ',') row.push(cell), (cell = '')
		else if (c === '\n' || c === '\r') {
			if (c === '\r' && text[i + 1] === '\n') i++
			row.push(cell), rows.push(row), (row = []), (cell = '')
		} else cell += c
	}
	if (cell || row.length) row.push(cell), rows.push(row)
	return rows.filter((r) => r.some((c) => c !== ''))
}

const tryJson = (value: string): unknown => {
	const v = value.trim()
	if (!/^[[{]/.test(v)) return undefined
	try {
		return JSON.parse(v)
	} catch {
		return undefined
	}
}

const tableName = (file: string) => file.replace(/\.(csv|json)$/i, '').replace(/^Supabase Snippet\s*/i, '').trim() || 'table'

/** A parsed JSON value → tables (object of arrays, or one array). */
function fromJson(value: unknown, file: string): Tables {
	if (Array.isArray(value)) return { [tableName(file)]: value as Rows }
	if (value && typeof value === 'object') {
		const entries = Object.entries(value as Record<string, unknown>)
		if (entries.every(([, v]) => Array.isArray(v) || v === null)) return Object.fromEntries(entries.map(([k, v]) => [k, (v ?? []) as Rows]))
	}
	throw new Error('JSON is not a list of rows or an object of tables')
}

function readFile(text: string, file: string): Tables {
	if (/\.json$/i.test(file) || /^\s*[[{]/.test(text)) return fromJson(JSON.parse(text), file)
	const rows = parseCsv(text)
	if (rows.length < 2) throw new Error('No data rows in this CSV')
	const [header, ...body] = rows
	// One cell holding JSON: the "all_data" / "data" export
	if (header.length === 1 && body.length === 1) {
		const value = tryJson(body[0][0])
		if (value !== undefined) return fromJson(value, file)
	}
	return {
		[tableName(file)]: body.map((r) => Object.fromEntries(header.map((h, i) => {
			const cell = r[i] ?? ''
			const json = tryJson(cell)
			return [h, json !== undefined ? json : cell === '' ? null : cell]
		}))),
	}
}

const mb = (bytes: number) => `${(bytes / 1e6).toFixed(bytes < 1e7 ? 2 : 1)} MB`

export default function MigratePanel() {
	const [tables, setTables] = useState<Tables>({})
	const [files, setFiles] = useState<Loaded[]>([])
	const [busy, setBusy] = useState(false)
	const [selected, setSelected] = useState<string | null>(null)

	const names = useMemo(() => Object.keys(tables).sort((a, b) => tables[b].length - tables[a].length || a.localeCompare(b)), [tables])
	const total = names.reduce((n, t) => n + tables[t].length, 0)
	const current = selected && tables[selected] ? selected : names[0]
	const columns = useMemo(() => {
		const set = new Set<string>()
		for (const r of (current ? tables[current] : []).slice(0, 200)) Object.keys(r ?? {}).forEach((k) => set.add(k))
		return Array.from(set)
	}, [tables, current])

	async function add(list: FileList | null) {
		if (!list?.length) return
		setBusy(true)
		const next = { ...tables }
		const loaded: Loaded[] = []
		for (const file of Array.from(list)) {
			try {
				const found = readFile(await file.text(), file.name)
				// The same table in two files (export in parts): keep all rows
				for (const [name, rows] of Object.entries(found)) next[name] = next[name] ? [...next[name], ...rows] : rows
				loaded.push({ name: file.name, size: file.size, tables: Object.keys(found) })
			} catch (e) {
				loaded.push({ name: file.name, size: file.size, tables: [], error: e instanceof Error ? e.message : 'Could not read' })
			}
		}
		setTables(next)
		setFiles((f) => [...f, ...loaded])
		setBusy(false)
	}

	function download() {
		const blob = new Blob([JSON.stringify(tables, null, 1)], { type: 'application/json' })
		const a = document.createElement('a')
		a.href = URL.createObjectURL(blob)
		a.download = `travsus-all-data-${new Date().toISOString().slice(0, 10)}.json`
		a.click()
		setTimeout(() => URL.revokeObjectURL(a.href), 1000)
	}

	const reset = () => (setTables({}), setFiles([]), setSelected(null))

	return (
		<main className="mx-auto max-w-7xl px-5 py-10 text-neutral-950 dark:text-white">
			<h1 className="text-3xl font-bold tracking-tight">Database export</h1>
			<p className="mt-2 max-w-2xl text-neutral-500">
				Add the files exported from the Supabase SQL editor (CSV or JSON). They are read in this browser only: nothing is uploaded or saved. Then download everything as one JSON file.
			</p>

			<div className="mt-6 flex flex-wrap items-center gap-3">
				<label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
					{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
					Add files
					<input type="file" accept=".csv,.json,text/csv,application/json" multiple className="sr-only" disabled={busy} onChange={(e) => (add(e.target.files), (e.target.value = ''))} />
				</label>
				{names.length > 0 && (
					<>
						<button onClick={download} className="inline-flex h-11 items-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
							<Download className="h-4 w-4" /> Download one JSON file
						</button>
						<button onClick={reset} className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm text-neutral-500 hover:text-neutral-950 dark:hover:text-white">
							<X className="h-4 w-4" /> Clear
						</button>
						<span className="text-sm text-neutral-500">
							{names.length} tables · {total.toLocaleString()} rows
						</span>
					</>
				)}
			</div>

			{files.length > 0 && (
				<ul className="mt-5 space-y-1 text-sm">
					{files.map((f, i) => (
						<li key={i} className={f.error ? 'text-red-600' : 'text-neutral-500'}>
							{f.name} ({mb(f.size)}) — {f.error ? f.error : `${f.tables.length} table${f.tables.length === 1 ? '' : 's'}`}
						</li>
					))}
				</ul>
			)}

			{names.length > 0 && (
				<div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
					<ul className="max-h-[70vh] overflow-y-auto rounded-2xl border border-neutral-200 p-2 dark:border-neutral-800">
						{names.map((t) => (
							<li key={t}>
								<button
									onClick={() => setSelected(t)}
									className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm ${t === current ? 'bg-neutral-100 font-semibold dark:bg-neutral-800' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}>
									<span className="flex min-w-0 items-center gap-2">
										<Table2 className="h-4 w-4 shrink-0 text-neutral-400" />
										<span className="truncate">{t}</span>
									</span>
									<span className="tabular-nums text-neutral-500">{tables[t].length.toLocaleString()}</span>
								</button>
							</li>
						))}
					</ul>

					{current && (
						<section className="min-w-0">
							<h2 className="text-xl font-semibold">
								{current} <span className="font-normal text-neutral-500">· {tables[current].length.toLocaleString()} rows · {columns.length} columns</span>
							</h2>
							<p className="mt-1 break-words text-sm text-neutral-500">{columns.join(', ')}</p>
							<p className="mt-4 text-sm text-neutral-500">
								First {Math.min(PREVIEW, tables[current].length)} rows:
							</p>
							<pre className="mt-2 max-h-[60vh] overflow-auto rounded-2xl bg-neutral-100 p-4 text-xs leading-relaxed dark:bg-neutral-900">
								{JSON.stringify(tables[current].slice(0, PREVIEW), null, 2)}
							</pre>
						</section>
					)}
				</div>
			)}
		</main>
	)
}
