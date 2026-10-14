'use client'
// Translations panel: browse every text of the site in its 10 languages,
// find what's missing, edit, add or delete keys, and bulk import JSON
// (the format addLangs.js used).
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AlertTriangle, Check, ChevronDown, Loader2, Plus, Search, Trash2, Upload, X } from 'lucide-react'

type Messages = Record<string, Record<string, string>>
type Data = { locales: string[]; writable: boolean; messages: Record<string, Messages> }

const BASE = 'en-US'
const nativeName = (code: string) => {
	try {
		const n = new Intl.DisplayNames([code], { type: 'language' }).of(code.split('-')[0]) ?? code
		return n.charAt(0).toUpperCase() + n.slice(1)
	} catch {
		return code
	}
}
/** {name}, {count, plural…} → the variable names used */
const placeholders = (text?: string) => new Set(Array.from((text ?? '').matchAll(/\{\s*([A-Za-z0-9_]+)/g), (m) => m[1]))
const sameSet = (a: Set<string>, b: Set<string>) => a.size === b.size && Array.from(a).every((x) => b.has(x))

async function api(method: string, body?: unknown) {
	const res = await fetch('/api/admin/translations', {
		method,
		headers: body ? { 'Content-Type': 'application/json' } : undefined,
		body: body ? JSON.stringify(body) : undefined,
		cache: 'no-store',
	})
	const data = await res.json().catch(() => ({}))
	if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
	return data
}

export default function TranslationsPanel() {
	const [data, setData] = useState<Data | null>(null)
	const [loadError, setLoadError] = useState('')
	const [group, setGroup] = useState<string | null>(null)
	const [query, setQuery] = useState('')
	const [missingIn, setMissingIn] = useState('') // a language: show only its missing texts
	const [openKey, setOpenKey] = useState<string | null>(null) // "group.key"
	const [importing, setImporting] = useState(false)

	const reload = () =>
		api('GET')
			.then((d) => {
				setData(d)
				setLoadError('')
			})
			.catch((e) => setLoadError(e.message))
	useEffect(() => {
		reload()
	}, [])

	// Every group.key that exists in any language
	const index = useMemo(() => {
		if (!data) return { groups: [] as { name: string; keys: string[]; missing: number }[], total: 0 }
		const groups = new Map<string, Set<string>>()
		for (const locale of data.locales)
			for (const [g, keys] of Object.entries(data.messages[locale] ?? {})) {
				const set = groups.get(g) ?? new Set()
				Object.keys(keys).forEach((k) => set.add(k))
				groups.set(g, set)
			}
		const missingCount = (g: string, k: string) =>
			data.locales.filter((l) => (missingIn ? l === missingIn : true) && !data.messages[l]?.[g]?.[k]?.trim()).length
		const list = Array.from(groups, ([name, keys]) => {
			const sorted = Array.from(keys)
			return { name, keys: sorted, missing: sorted.reduce((n, k) => n + (missingCount(name, k) > 0 ? 1 : 0), 0) }
		}).sort((a, b) => a.name.localeCompare(b.name))
		return { groups: list, total: list.reduce((n, g) => n + g.keys.length, 0) }
	}, [data, missingIn])

	if (loadError) return <p className="mx-auto max-w-3xl px-5 py-16 text-red-600">{loadError}</p>
	if (!data) return <p className="mx-auto max-w-3xl px-5 py-16 text-neutral-500">Loading texts…</p>

	const text = (l: string, g: string, k: string) => data.messages[l]?.[g]?.[k] ?? ''
	const isMissing = (g: string, k: string) => data.locales.some((l) => (missingIn ? l === missingIn : true) && !text(l, g, k).trim())

	// Rows to show: search across everything, else the chosen group
	const q = query.trim().toLowerCase()
	const rows: [string, string][] = q
		? index.groups.flatMap((g) =>
				g.keys
					.filter((k) => `${g.name}.${k}`.toLowerCase().includes(q) || data.locales.some((l) => text(l, g.name, k).toLowerCase().includes(q)))
					.map((k) => [g.name, k] as [string, string]),
			).slice(0, 200)
		: group
			? (index.groups.find((g) => g.name === group)?.keys ?? []).map((k) => [group, k] as [string, string])
			: []
	const shown = missingIn ? rows.filter(([g, k]) => isMissing(g, k)) : rows
	const missingTotal = index.groups.reduce((n, g) => n + g.missing, 0)

	return (
		<div className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 dark:text-white">
			<header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">TRAVSUS</p>
					<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Translations</h1>
					<p className="mt-2 text-neutral-500">
						{index.groups.length} groups · {index.total.toLocaleString()} texts · {data.locales.length} languages ·{' '}
						<span className={missingTotal ? 'font-semibold text-red-600' : ''}>{missingTotal} missing{missingIn ? ` in ${nativeName(missingIn)}` : ''}</span>
					</p>
				</div>
				<button
					type="button"
					onClick={() => setImporting(true)}
					disabled={!data.writable}
					className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white disabled:opacity-40 sm:self-auto dark:bg-white dark:text-neutral-950"
				>
					<Upload className="h-4 w-4" />
					Import JSON
				</button>
			</header>

			{!data.writable && (
				<p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
					View only: the live site can't change its files. Run the site on your computer (<code className="font-mono">npm run dev</code>), edit here, then push.
				</p>
			)}

			<div className="mt-6 flex flex-col gap-3 sm:flex-row">
				<label className="relative flex-1">
					<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<span className="sr-only">Search</span>
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search keys and texts in every language…"
						className="h-12 w-full rounded-full border-0 bg-neutral-100 pl-11 pr-4 ring-1 ring-transparent focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
					/>
				</label>
				<label className="relative">
					<span className="sr-only">Missing in</span>
					<select
						value={missingIn}
						onChange={(e) => setMissingIn(e.target.value)}
						className="h-12 w-full appearance-none rounded-full border-0 bg-neutral-100 pl-5 pr-10 font-medium ring-1 ring-transparent focus:outline-none focus:ring-neutral-950 sm:w-64 dark:bg-neutral-900"
					>
						<option value="">All texts</option>
						{data.locales.map((l) => (
							<option key={l} value={l}>
								Missing in {nativeName(l)}
							</option>
						))}
					</select>
					<ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
				</label>
			</div>

			<div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				{/* Groups */}
				<nav className={`min-w-0 ${q ? 'hidden lg:block lg:opacity-40' : ''}`}>
					<select
						value={group ?? ''}
						onChange={(e) => setGroup(e.target.value || null)}
						className="h-12 w-full rounded-2xl border-0 bg-neutral-100 px-4 lg:hidden dark:bg-neutral-900"
					>
						<option value="">Choose a group…</option>
						{index.groups.map((g) => (
							<option key={g.name} value={g.name}>
								{g.name} ({g.keys.length}){g.missing ? ` · ${g.missing} missing` : ''}
							</option>
						))}
					</select>
					<ul className="hidden max-h-[70vh] overflow-y-auto rounded-3xl p-2 ring-1 ring-neutral-200 lg:block dark:ring-neutral-800">
						{index.groups
							.filter((g) => !missingIn || g.missing)
							.map((g) => (
								<li key={g.name}>
									<button
										type="button"
										onClick={() => {
											setGroup(g.name)
											setQuery('')
										}}
										className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm ${group === g.name ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
									>
										<span className="truncate">{g.name}</span>
										<span className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums">
											{g.missing > 0 && <span className="rounded-full bg-red-500 px-1.5 py-0.5 font-semibold text-white">{g.missing}</span>}
											<span className="opacity-60">{g.keys.length}</span>
										</span>
									</button>
								</li>
							))}
					</ul>
				</nav>

				{/* Texts */}
				<section className="min-w-0">
					{!q && !group ? (
						<p className="rounded-3xl bg-neutral-100 px-6 py-12 text-center text-neutral-500 dark:bg-neutral-900">Choose a group or search to see its texts.</p>
					) : (
						<>
							<div className="mb-3 flex items-center justify-between gap-3">
								<h2 className="truncate font-mono text-sm font-semibold">{q ? `${shown.length}${rows.length === 200 ? '+' : ''} results` : group}</h2>
								{!q && group && data.writable && <AddKey group={group} onAdded={(k) => reload().then(() => setOpenKey(`${group}.${k}`))} />}
							</div>
							<ul className="space-y-2">
								{shown.map(([g, k]) => (
									<KeyRow
										key={`${g}.${k}`}
										group={g}
										name={k}
										showGroup={!!q}
										data={data}
										open={openKey === `${g}.${k}`}
										onToggle={() => setOpenKey(openKey === `${g}.${k}` ? null : `${g}.${k}`)}
										onSaved={reload}
									/>
								))}
								{shown.length === 0 && <li className="rounded-3xl bg-neutral-100 px-6 py-10 text-center text-neutral-500 dark:bg-neutral-900">Nothing here. 🎉</li>}
							</ul>
						</>
					)}
				</section>
			</div>

			<ImportDialog open={importing} onClose={() => setImporting(false)} onDone={reload} />
		</div>
	)
}

function KeyRow({ group, name, showGroup, data, open, onToggle, onSaved }: { group: string; name: string; showGroup: boolean; data: Data; open: boolean; onToggle: () => void; onSaved: () => Promise<void> }) {
	const current = (l: string) => data.messages[l]?.[group]?.[name] ?? ''
	const [draft, setDraft] = useState<Record<string, string>>({})
	const [state, setState] = useState<'idle' | 'saving' | 'saved' | string>('idle')
	useEffect(() => {
		if (open) setDraft(Object.fromEntries(data.locales.map((l) => [l, current(l)])))
	}, [open]) // eslint-disable-line react-hooks/exhaustive-deps

	const missing = data.locales.filter((l) => !current(l).trim())
	const base = placeholders(current(BASE))
	const changed = data.locales.filter((l) => (draft[l] ?? current(l)) !== current(l))

	async function save() {
		setState('saving')
		try {
			await api('PUT', { group, key: name, values: Object.fromEntries(changed.map((l) => [l, draft[l]])) })
			await onSaved()
			setState('saved')
		} catch (e: any) {
			setState(e.message)
		}
	}
	async function remove() {
		if (!window.confirm(`Delete "${group}.${name}" from all ${data.locales.length} languages?`)) return
		try {
			await api('DELETE', { group, key: name })
			await onSaved()
		} catch (e: any) {
			setState(e.message)
		}
	}

	return (
		<li className="overflow-hidden rounded-2xl ring-1 ring-neutral-200 dark:ring-neutral-800">
			<button type="button" onClick={onToggle} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900">
				<span className="min-w-0 flex-1">
					<span className="block truncate font-mono text-xs text-neutral-500">
						{showGroup && `${group}.`}
						{name}
					</span>
					<span className="mt-0.5 block truncate text-sm">{current(BASE) || <em className="text-neutral-400">no English text</em>}</span>
				</span>
				{missing.length > 0 && (
					<span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
						{missing.length === data.locales.length - 1 && !missing.includes(BASE) ? 'English only' : `${missing.length} missing`}
					</span>
				)}
				<ChevronDown className={`mt-1 h-4 w-4 shrink-0 transition ${open ? 'rotate-180' : ''}`} />
			</button>

			{open && (
				<div className="space-y-3 border-t border-neutral-200 px-4 py-4 dark:border-neutral-800">
					{data.locales.map((l) => {
						const value = draft[l] ?? ''
						const mismatch = value.trim() && l !== BASE && base.size > 0 && !sameSet(base, placeholders(value))
						return (
							<label key={l} className="block">
								<span className="mb-1 flex items-center gap-2 text-xs font-semibold">
									{nativeName(l)} <span className="font-normal text-neutral-400">{l}</span>
									{!value.trim() && <span className="text-red-600">missing</span>}
									{mismatch && (
										<span className="inline-flex items-center gap-1 text-amber-600">
											<AlertTriangle className="h-3 w-3" />
											placeholders differ from English ({Array.from(base).map((p) => `{${p}}`).join(' ')})
										</span>
									)}
								</span>
								<textarea
									lang={l}
									value={value}
									readOnly={!data.writable}
									onChange={(e) => {
										setDraft((d) => ({ ...d, [l]: e.target.value }))
										setState('idle')
									}}
									rows={Math.min(6, Math.max(1, Math.ceil(value.length / 80)))}
									className="w-full resize-y rounded-xl border-0 bg-neutral-100 px-3 py-2 text-sm ring-1 ring-transparent focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
								/>
							</label>
						)
					})}
					{data.writable && (
						<div className="flex flex-wrap items-center gap-3 pt-1">
							<button
								type="button"
								onClick={save}
								disabled={!changed.length || state === 'saving'}
								className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-950"
							>
								{state === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
								Save {changed.length ? `(${changed.length})` : ''}
							</button>
							<button type="button" onClick={remove} className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
								<Trash2 className="h-4 w-4" />
								Delete key
							</button>
							{state === 'saved' && <span className="text-sm text-emerald-600">Saved to messages/*.json</span>}
							{!['idle', 'saving', 'saved'].includes(state) && <span className="text-sm text-red-600">{state}</span>}
						</div>
					)}
				</div>
			)}
		</li>
	)
}

function AddKey({ group, onAdded }: { group: string; onAdded: (key: string) => void }) {
	const [open, setOpen] = useState(false)
	const [key, setKey] = useState('')
	const [english, setEnglish] = useState('')
	const [error, setError] = useState('')
	if (!open)
		return (
			<button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4">
				<Plus className="h-4 w-4" />
				Add key
			</button>
		)
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				try {
					await api('PUT', { group, key: key.trim(), values: { [BASE]: english } })
					setOpen(false)
					setKey('')
					setEnglish('')
					onAdded(key.trim())
				} catch (err: any) {
					setError(err.message)
				}
			}}
			className="flex flex-wrap items-center gap-2"
		>
			<input value={key} onChange={(e) => setKey(e.target.value)} placeholder="key_name" required className="h-9 w-36 rounded-full bg-neutral-100 px-3 font-mono text-xs dark:bg-neutral-900" />
			<input value={english} onChange={(e) => setEnglish(e.target.value)} placeholder="English text" required className="h-9 w-48 rounded-full bg-neutral-100 px-3 text-sm dark:bg-neutral-900" />
			<button type="submit" className="h-9 rounded-full bg-neutral-950 px-4 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">
				Add
			</button>
			<button type="button" onClick={() => setOpen(false)} aria-label="Cancel" className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900">
				<X className="h-4 w-4" />
			</button>
			{error && <span className="w-full text-xs text-red-600">{error}</span>}
		</form>
	)
}

const EXAMPLE = `{
  "en-US": { "Home": { "new_key": "Hello" } },
  "fr-FR": { "Home": { "new_key": "Bonjour" } }
}`

function ImportDialog({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => Promise<void> }) {
	const [json, setJson] = useState('')
	const [state, setState] = useState<'idle' | 'busy' | string>('idle')
	const [result, setResult] = useState<Record<string, number> | null>(null)

	async function run() {
		setState('busy')
		setResult(null)
		try {
			const parsed = JSON.parse(json)
			const { counts } = await api('POST', { import: parsed })
			setResult(counts)
			setState('idle')
			await onDone()
		} catch (e: any) {
			setState(e instanceof SyntaxError ? `Not valid JSON: ${e.message}` : e.message)
		}
	}

	return (
		<Transition show={open} as={Fragment}>
			<Dialog className="relative z-50" onClose={onClose}>
				<div className="fixed inset-0 bg-black/40" />
				<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
					<Dialog.Panel className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 text-neutral-950 sm:max-w-2xl sm:rounded-3xl dark:bg-neutral-900 dark:text-white">
						<div className="flex items-center justify-between">
							<Dialog.Title className="text-xl font-bold">Import JSON</Dialog.Title>
							<button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-800">
								<X className="h-4 w-4" />
							</button>
						</div>
						<p className="mt-2 text-sm text-neutral-500">Same format as the old addLangs.js / content.json: language → group → key → text. Existing texts with the same key are replaced; nothing else changes.</p>
						<textarea
							value={json}
							onChange={(e) => setJson(e.target.value)}
							placeholder={EXAMPLE}
							rows={14}
							spellCheck={false}
							className="mt-4 w-full rounded-2xl border-0 bg-neutral-100 p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-800"
						/>
						{result && (
							<p className="mt-3 text-sm text-emerald-600">
								Imported:{' '}
								{Object.entries(result)
									.map(([l, n]) => `${l} ${n}`)
									.join(' · ')}
							</p>
						)}
						{!['idle', 'busy'].includes(state) && <p className="mt-3 text-sm text-red-600">{state}</p>}
						<div className="mt-4 flex justify-end">
							<button type="button" onClick={run} disabled={!json.trim() || state === 'busy'} className="inline-flex h-11 items-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-950">
								{state === 'busy' && <Loader2 className="h-4 w-4 animate-spin" />}
								Import
							</button>
						</div>
					</Dialog.Panel>
				</div>
			</Dialog>
		</Transition>
	)
}
