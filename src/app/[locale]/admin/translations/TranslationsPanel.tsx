'use client'
// Translations panel: every text of the site in its 10 languages.
// Coverage per language, search, "missing" filters, an editor per key
// (lists are edited one item per line), add / delete keys, and bulk import
// in the format addLangs.js used.
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { AlertTriangle, Check, ChevronDown, Languages, Loader2, Plus, Search, Trash2, Upload, X } from 'lucide-react'

type Text = string | string[]
type Messages = Record<string, Record<string, Text>>
type Data = { locales: string[]; writable: boolean; messages: Record<string, Messages> }
type Filter = 'all' | 'missing' | 'orphans'

const BASE = 'en-US'
/** Lists (e.g. plan features) are shown and edited one item per line */
const asText = (v: unknown) => (Array.isArray(v) ? v.join('\n') : typeof v === 'string' ? v : '')
const nativeName = (code: string) => {
	try {
		const n = new Intl.DisplayNames([code], { type: 'language' }).of(code.split('-')[0]) ?? code
		return n.charAt(0).toUpperCase() + n.slice(1)
	} catch {
		return code
	}
}
const flag = (code: string) => {
	const region = code.split('-')[1]
	return region && /^[A-Z]{2}$/.test(region) ? String.fromCodePoint(...Array.from(region).map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : '🌐'
}
/** {name}, {count, plural…} → the variable names used */
const placeholders = (text?: string) => new Set(Array.from((text ?? '').matchAll(/\{\s*([A-Za-z0-9_]+)/g), (m) => m[1]))
const sameSet = (a: Set<string>, b: Set<string>) => a.size === b.size && Array.from(a).every((x) => b.has(x))
/** Percentage done; never shows 100% while something is missing */
const pct = (n: number, of: number) => (!of || n >= of ? 100 : Math.min(99, Math.floor((n / of) * 100)))

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

export default function TranslationsPanel({ initialData }: { initialData?: Data } = {}) {
	const [data, setData] = useState<Data | null>(initialData ?? null)
	const [loadError, setLoadError] = useState('')
	const [group, setGroup] = useState<string | null>(null)
	const [query, setQuery] = useState('')
	const [groupQuery, setGroupQuery] = useState('')
	const [filter, setFilter] = useState<Filter>('all')
	const [lang, setLang] = useState('') // "missing" in this language only ('' = any)
	const [openKey, setOpenKey] = useState<string | null>(null)
	const [importing, setImporting] = useState(false)
	const [toast, setToast] = useState('')
	const searchRef = useRef<HTMLInputElement>(null)

	const reload = () =>
		api('GET')
			.then((d) => {
				setData(d)
				setLoadError('')
			})
			.catch((e) => setLoadError(e.message))
	useEffect(() => {
		if (!initialData) reload()
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	// "/" jumps to search
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === '/' && !(e.target as HTMLElement)?.closest('input, textarea, select')) {
				e.preventDefault()
				searchRef.current?.focus()
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [])

	useEffect(() => {
		if (!toast) return
		const timer = setTimeout(() => setToast(''), 2500)
		return () => clearTimeout(timer)
	}, [toast])

	const model = useMemo(() => {
		if (!data) return null
		const text = (l: string, g: string, k: string) => asText(data.messages[l]?.[g]?.[k])
		const groups = new Map<string, Set<string>>()
		for (const l of data.locales)
			for (const [g, keys] of Object.entries(data.messages[l] ?? {})) {
				const set = groups.get(g) ?? new Set<string>()
				Object.keys(keys).forEach((k) => set.add(k))
				groups.set(g, set)
			}
		// Coverage counts only keys English has (the others are leftovers)
		const englishKeys: [string, string][] = []
		for (const [g, keys] of Object.entries(data.messages[BASE] ?? {})) for (const k of Object.keys(keys)) if (text(BASE, g, k).trim()) englishKeys.push([g, k])
		const coverage = data.locales.map((l) => {
			const done = englishKeys.filter(([g, k]) => text(l, g, k).trim()).length
			return { locale: l, done, missing: englishKeys.length - done, pct: pct(done, englishKeys.length) }
		})
		const isOrphan = (g: string, k: string) => !text(BASE, g, k).trim()
		const isMissing = (g: string, k: string) =>
			!isOrphan(g, k) && data.locales.some((l) => (lang ? l === lang : true) && !text(l, g, k).trim())
		const list = Array.from(groups, ([name, set]) => {
			const keys = Array.from(set)
			const english = keys.filter((k) => !isOrphan(name, k))
			const complete = english.filter((k) => data.locales.every((l) => text(l, name, k).trim())).length
			return { name, keys, missing: keys.filter((k) => isMissing(name, k)).length, orphans: keys.length - english.length, pct: pct(complete, english.length) }
		}).sort((a, b) => a.name.localeCompare(b.name))
		return { text, list, coverage, isMissing, isOrphan, englishTotal: englishKeys.length }
	}, [data, lang])

	if (loadError) return <p className="mx-auto max-w-3xl px-5 py-16 text-red-600">{loadError}</p>
	if (!data || !model) return <p className="mx-auto max-w-3xl px-5 py-16 text-neutral-500">Loading texts…</p>

	const { text, list, coverage, isMissing, isOrphan } = model
	const keep = (g: string, k: string) => (filter === 'missing' ? isMissing(g, k) : filter === 'orphans' ? isOrphan(g, k) : true)
	const q = query.trim().toLowerCase()
	const rows: [string, string][] = q
		? list
				.flatMap((g) =>
					g.keys
						.filter((k) => `${g.name}.${k}`.toLowerCase().includes(q) || data.locales.some((l) => text(l, g.name, k).toLowerCase().includes(q)))
						.map((k) => [g.name, k] as [string, string]),
				)
				.filter(([g, k]) => keep(g, k))
				.slice(0, 200)
		: group
			? (list.find((g) => g.name === group)?.keys ?? []).filter((k) => keep(group, k)).map((k) => [group, k] as [string, string])
			: filter !== 'all'
				? list.flatMap((g) => g.keys.filter((k) => keep(g.name, k)).map((k) => [g.name, k] as [string, string])).slice(0, 200)
				: []
	const across = !!q || (!group && filter !== 'all') // rows from several groups
	const groupsShown = list.filter(
		(g) =>
			(!groupQuery || g.name.toLowerCase().includes(groupQuery.toLowerCase())) &&
			(filter === 'missing' ? g.missing > 0 : filter === 'orphans' ? g.orphans > 0 : true),
	)
	const missingTotal = list.reduce((n, g) => n + g.missing, 0)
	const orphanTotal = list.reduce((n, g) => n + g.orphans, 0)
	const chooseLang = (l: string) => {
		const same = lang === l && filter === 'missing'
		setLang(same ? '' : l)
		setFilter(same ? 'all' : 'missing')
	}

	return (
		<div className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 dark:text-white">
			{/* Title */}
			<header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
						<Languages className="h-4 w-4" />
						TRAVSUS
					</p>
					<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">Translations</h1>
					<p className="mt-3 text-neutral-500">
						{model.englishTotal.toLocaleString()} texts · {list.length} groups · {data.locales.length} languages
					</p>
				</div>
				<button
					type="button"
					onClick={() => setImporting(true)}
					disabled={!data.writable}
					className="inline-flex h-12 items-center gap-2 self-start rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-40 sm:self-auto dark:bg-white dark:text-neutral-950"
				>
					<Upload className="h-4 w-4" />
					Import JSON
				</button>
			</header>

			{!data.writable && (
				<p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
					View only: the live site can&apos;t change its files. Run the site on your computer (<code className="font-mono">npm run dev</code>), edit here, then push.
				</p>
			)}

			{/* Coverage per language */}
			<ul className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
				{coverage.map((c) => {
					const active = filter === 'missing' && lang === c.locale
					return (
						<li key={c.locale}>
							<button
								type="button"
								onClick={() => chooseLang(c.locale)}
								title={c.missing ? `Show the ${c.missing} texts missing in ${nativeName(c.locale)}` : 'Complete'}
								className={`w-full rounded-2xl p-4 text-left transition ${active ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800'}`}
							>
								<span className="flex items-center justify-between gap-2">
									<span className="truncate text-sm font-semibold">
										<span className="mr-1.5">{flag(c.locale)}</span>
										{nativeName(c.locale)}
									</span>
									<span className={`text-sm font-bold tabular-nums ${c.pct === 100 ? 'text-emerald-600' : ''} ${active ? '!text-inherit' : ''}`}>{c.pct}%</span>
								</span>
								<span className={`mt-3 block h-1.5 overflow-hidden rounded-full ${active ? 'bg-white/20 dark:bg-neutral-950/20' : 'bg-neutral-200 dark:bg-neutral-800'}`}>
									<span className={`block h-full rounded-full ${c.pct === 100 ? 'bg-emerald-500' : active ? 'bg-white dark:bg-neutral-950' : 'bg-neutral-950 dark:bg-white'}`} style={{ width: `${c.pct}%` }} />
								</span>
								<span className={`mt-2 block text-xs ${active ? 'opacity-70' : 'text-neutral-500'}`}>{c.missing ? `${c.missing} missing` : 'Complete'}</span>
							</button>
						</li>
					)
				})}
			</ul>

			{/* Toolbar */}
			<div className="sticky top-0 z-20 -mx-5 mt-6 border-b border-neutral-200 bg-white/85 px-5 py-3 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/85">
				<div className="flex flex-col gap-3 md:flex-row md:items-center">
					<label className="relative flex-1">
						<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
						<span className="sr-only">Search</span>
						<input
							ref={searchRef}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search keys and texts in every language…"
							className="h-11 w-full rounded-full border-0 bg-neutral-100 pl-11 pr-12 ring-1 ring-transparent focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
						/>
						<kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-neutral-300 px-1.5 text-xs text-neutral-400 sm:block dark:border-neutral-700">/</kbd>
					</label>
					<div className="flex gap-1 overflow-x-auto rounded-full bg-neutral-100 p-1 [scrollbar-width:none] dark:bg-neutral-900">
						{(
							[
								['all', 'All'],
								['missing', `Missing${lang ? ` in ${nativeName(lang)}` : ''} · ${missingTotal}`],
								['orphans', `Not in English · ${orphanTotal}`],
							] as [Filter, string][]
						).map(([value, label]) => (
							<button
								key={value}
								type="button"
								onClick={() => {
									setFilter(value)
									if (value !== 'missing') setLang('')
								}}
								className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === value ? 'bg-white shadow-sm dark:bg-neutral-800' : 'text-neutral-500 hover:text-neutral-950 dark:hover:text-white'}`}
							>
								{label}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
				{/* Groups */}
				<aside className={`min-w-0 lg:sticky lg:top-24 lg:self-start ${q ? 'hidden lg:block lg:opacity-40' : ''}`}>
					<select
						value={group ?? ''}
						onChange={(e) => setGroup(e.target.value || null)}
						className="h-12 w-full rounded-2xl border-0 bg-neutral-100 px-4 font-medium lg:hidden dark:bg-neutral-900"
					>
						<option value="">Choose a group…</option>
						{groupsShown.map((g) => (
							<option key={g.name} value={g.name}>
								{g.name} ({g.keys.length}){g.missing ? ` · ${g.missing} missing` : ''}
							</option>
						))}
					</select>
					<div className="hidden overflow-hidden rounded-3xl ring-1 ring-neutral-200 lg:block dark:ring-neutral-800">
						<div className="border-b border-neutral-200 p-2 dark:border-neutral-800">
							<input
								value={groupQuery}
								onChange={(e) => setGroupQuery(e.target.value)}
								placeholder={`Filter ${groupsShown.length} groups…`}
								className="h-9 w-full rounded-xl border-0 bg-neutral-100 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900"
							/>
						</div>
						<ul className="max-h-[calc(100vh_-_14rem)] overflow-y-auto p-2">
							{groupsShown.map((g) => {
								const active = group === g.name
								return (
									<li key={g.name}>
										<button
											type="button"
											onClick={() => {
												setGroup(g.name)
												setQuery('')
											}}
											className={`w-full rounded-xl px-3 py-2 text-left transition ${active ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
										>
											<span className="flex items-center justify-between gap-2 text-sm">
												<span className="truncate">{g.name}</span>
												<span className="flex shrink-0 items-center gap-1.5 text-xs tabular-nums">
													{g.missing > 0 && <span className="rounded-full bg-red-500 px-1.5 py-0.5 font-semibold text-white">{g.missing}</span>}
													<span className="opacity-50">{g.keys.length}</span>
												</span>
											</span>
											<span className={`mt-1.5 block h-0.5 w-full overflow-hidden rounded-full ${active ? 'bg-white/20 dark:bg-neutral-950/15' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
												<span className={`block h-full rounded-full ${g.pct === 100 ? 'bg-emerald-400/70' : 'bg-amber-500'}`} style={{ width: `${g.pct}%` }} />
											</span>
										</button>
									</li>
								)
							})}
							{groupsShown.length === 0 && <li className="px-3 py-6 text-center text-sm text-neutral-500">No groups.</li>}
						</ul>
					</div>
				</aside>

				{/* Keys */}
				<section className="min-w-0">
					{!q && !group && filter === 'all' ? (
						<div className="rounded-[28px] bg-neutral-100 px-6 py-16 text-center dark:bg-neutral-900">
							<Languages className="mx-auto h-10 w-10 text-neutral-400" strokeWidth={1.5} />
							<p className="mt-4 text-xl font-bold tracking-tight">Pick a group or search</p>
							<p className="mx-auto mt-1 max-w-sm text-neutral-500">Tip: click a language above to see everything still missing in it.</p>
						</div>
					) : (
						<>
							<div className="mb-3 flex items-center justify-between gap-3">
								<h2 className="truncate text-lg font-bold tracking-tight">
									{q
										? `${rows.length}${rows.length === 200 ? '+' : ''} results for “${query.trim()}”`
										: group
											? <span className="font-mono text-base">{group}</span>
											: `${rows.length}${rows.length === 200 ? '+' : ''} ${filter === 'missing' ? `missing${lang ? ` in ${nativeName(lang)}` : ''}` : 'not in English'}`}
								</h2>
								{!q && group && data.writable && <AddKey group={group} onAdded={(k) => reload().then(() => setOpenKey(`${group}.${k}`))} />}
							</div>
							<ul className="space-y-2">
								{rows.map(([g, k]) => (
									<KeyRow
										key={`${g}.${k}`}
										group={g}
										name={k}
										showGroup={across}
										data={data}
										open={openKey === `${g}.${k}`}
										onToggle={() => setOpenKey(openKey === `${g}.${k}` ? null : `${g}.${k}`)}
										onSaved={async (message) => {
											await reload()
											setToast(message)
										}}
									/>
								))}
								{rows.length === 0 && (
									<li className="rounded-3xl bg-neutral-100 px-6 py-12 text-center text-neutral-500 dark:bg-neutral-900">
										{filter === 'missing' ? 'Nothing missing here. 🎉' : 'Nothing found.'}
									</li>
								)}
							</ul>
						</>
					)}
				</section>
			</div>

			<ImportDialog
				open={importing}
				onClose={() => setImporting(false)}
				onDone={async () => {
					await reload()
					setToast('Imported')
				}}
			/>

			{/* Toast */}
			<div
				role="status"
				className={`pointer-events-none fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-xl transition sm:bottom-8 dark:bg-white dark:text-neutral-950 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
			>
				<Check className="mr-2 inline h-4 w-4" />
				{toast}
			</div>
		</div>
	)
}

function KeyRow({
	group,
	name,
	showGroup,
	data,
	open,
	onToggle,
	onSaved,
}: {
	group: string
	name: string
	showGroup: boolean
	data: Data
	open: boolean
	onToggle: () => void
	onSaved: (message: string) => Promise<void>
}) {
	const current = (l: string) => asText(data.messages[l]?.[group]?.[name])
	// A list in any language stays a list when saved
	const isList = data.locales.some((l) => Array.isArray(data.messages[l]?.[group]?.[name]))
	const [draft, setDraft] = useState<Record<string, string>>({})
	const [state, setState] = useState<'idle' | 'saving' | string>('idle')
	useEffect(() => {
		if (open) setDraft(Object.fromEntries(data.locales.map((l) => [l, current(l)])))
	}, [open]) // eslint-disable-line react-hooks/exhaustive-deps

	const present = data.locales.map((l) => !!current(l).trim())
	const missing = present.filter((p) => !p).length
	const english = current(BASE)
	const base = placeholders(english)
	const changed = data.locales.filter((l) => draft[l] !== undefined && draft[l] !== current(l))

	async function save() {
		if (!changed.length) return
		setState('saving')
		try {
			const toValue = (v: string) => (isList ? v.split('\n').map((x) => x.trim()).filter(Boolean) : v)
			await api('PUT', { group, key: name, values: Object.fromEntries(changed.map((l) => [l, toValue(draft[l])])) })
			await onSaved(`Saved ${changed.length} ${changed.length === 1 ? 'language' : 'languages'}`)
			setState('idle')
		} catch (e: any) {
			setState(e.message)
		}
	}
	async function remove() {
		if (!window.confirm(`Delete "${group}.${name}" from all ${data.locales.length} languages?`)) return
		try {
			await api('DELETE', { group, key: name })
			await onSaved('Key deleted')
		} catch (e: any) {
			setState(e.message)
		}
	}

	return (
		<li className={`overflow-hidden rounded-2xl ring-1 transition ${open ? 'shadow-lg ring-neutral-950 dark:ring-white' : 'ring-neutral-200 hover:ring-neutral-400 dark:ring-neutral-800'}`}>
			<button type="button" onClick={onToggle} className="flex w-full items-center gap-4 px-4 py-3.5 text-left">
				<span className="min-w-0 flex-1">
					<span className="block truncate font-mono text-xs text-neutral-500">
						{showGroup && <span className="text-neutral-400">{group}.</span>}
						{name}
					</span>
					<span className="mt-0.5 block truncate text-[15px]">{english || <em className="text-neutral-400">Not in English</em>}</span>
				</span>
				{/* One dot per language: green = has the text */}
				<span className="hidden shrink-0 gap-1 sm:flex" aria-label={`${data.locales.length - missing} of ${data.locales.length} languages`}>
					{data.locales.map((l, i) => (
						<span key={l} title={`${nativeName(l)}: ${present[i] ? 'done' : 'missing'}`} className={`h-2 w-2 rounded-full ${present[i] ? 'bg-emerald-500' : 'bg-red-400'}`} />
					))}
				</span>
				{missing > 0 && <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 sm:hidden dark:bg-red-950 dark:text-red-300">{missing} missing</span>}
				<ChevronDown className={`h-4 w-4 shrink-0 text-neutral-400 transition ${open ? 'rotate-180' : ''}`} />
			</button>

			{open && (
				<div
					className="border-t border-neutral-200 bg-neutral-50/60 dark:border-neutral-800 dark:bg-neutral-900/40"
					onKeyDown={(e) => {
						if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
							e.preventDefault()
							save()
						}
					}}
				>
					<div className="grid gap-3 p-4 xl:grid-cols-2">
						{data.locales.map((l) => {
							const value = draft[l] ?? ''
							const edited = changed.includes(l)
							const mismatch = !!value.trim() && l !== BASE && base.size > 0 && !sameSet(base, placeholders(value))
							return (
								<label
									key={l}
									className={`block rounded-2xl bg-white p-3 ring-1 transition focus-within:ring-2 focus-within:ring-neutral-950 dark:bg-neutral-950 dark:focus-within:ring-white ${edited ? 'ring-amber-400' : !value.trim() ? 'ring-red-300 dark:ring-red-900' : 'ring-neutral-200 dark:ring-neutral-800'} ${l === BASE ? 'xl:col-span-2' : ''}`}
								>
									<span className="mb-1.5 flex items-center gap-2 text-xs">
										<span className="font-semibold">
											{flag(l)} {nativeName(l)}
										</span>
										<span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:bg-neutral-800">{l}</span>
										{isList && <span className="text-neutral-400">list · one item per line</span>}
										<span className="ml-auto flex items-center gap-2">
											{mismatch && (
												<span className="inline-flex items-center gap-1 text-amber-600" title={`English uses ${Array.from(base).map((p) => `{${p}}`).join(' ')}`}>
													<AlertTriangle className="h-3 w-3" />
													placeholders
												</span>
											)}
											{edited ? <span className="font-semibold text-amber-600">edited</span> : !value.trim() ? <span className="font-semibold text-red-600">missing</span> : null}
											<span className="tabular-nums text-neutral-400">{value.length}</span>
										</span>
									</span>
									<textarea
										lang={l}
										value={value}
										readOnly={!data.writable}
										placeholder={l === BASE ? 'English text' : `${nativeName(l)} translation`}
										onChange={(e) => {
											setDraft((d) => ({ ...d, [l]: e.target.value }))
											setState('idle')
										}}
										rows={Math.min(8, Math.max(2, value.split('\n').length, Math.ceil(value.length / 70)))}
										className="w-full resize-y border-0 bg-transparent p-0 text-[15px] leading-relaxed placeholder:text-neutral-300 focus:outline-none focus:ring-0 dark:placeholder:text-neutral-700"
									/>
								</label>
							)
						})}
					</div>

					{data.writable && (
						<div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
							<button type="button" onClick={remove} className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
								<Trash2 className="h-4 w-4" />
								<span className="hidden sm:inline">Delete key</span>
							</button>
							<span className="ml-auto text-sm text-neutral-500">
								{!['idle', 'saving'].includes(state) ? <span className="text-red-600">{state}</span> : changed.length ? `${changed.length} unsaved ${changed.length === 1 ? 'change' : 'changes'}` : 'No changes'}
							</span>
							{changed.length > 0 && (
								<button
									type="button"
									onClick={() => setDraft(Object.fromEntries(data.locales.map((l) => [l, current(l)])))}
									className="h-10 rounded-full px-4 text-sm font-semibold text-neutral-500 hover:text-neutral-950 dark:hover:text-white"
								>
									Discard
								</button>
							)}
							<button
								type="button"
								onClick={save}
								disabled={!changed.length || state === 'saving'}
								className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-30 dark:bg-white dark:text-neutral-950"
							>
								{state === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
								Save
								<kbd className="hidden rounded border border-white/30 px-1 text-[10px] font-normal sm:inline dark:border-neutral-950/30">⌘↵</kbd>
							</button>
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
			<button type="button" onClick={() => setOpen(true)} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-neutral-100 px-4 text-sm font-semibold transition hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
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
			className="flex flex-wrap items-center justify-end gap-2"
		>
			<input autoFocus value={key} onChange={(e) => setKey(e.target.value)} placeholder="key_name" required className="h-9 w-36 rounded-full border-0 bg-neutral-100 px-3 font-mono text-xs focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900" />
			<input value={english} onChange={(e) => setEnglish(e.target.value)} placeholder="English text" required className="h-9 w-48 rounded-full border-0 bg-neutral-100 px-3 text-sm focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900" />
			<button type="submit" className="h-9 rounded-full bg-neutral-950 px-4 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">
				Add
			</button>
			<button type="button" onClick={() => setOpen(false)} aria-label="Cancel" className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900">
				<X className="h-4 w-4" />
			</button>
			{error && <span className="w-full text-right text-xs text-red-600">{error}</span>}
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
			const { counts } = await api('POST', { import: JSON.parse(json) })
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
				<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
				</Transition.Child>
				<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
					<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="translate-y-8 opacity-0" enterTo="translate-y-0 opacity-100" leave="ease-in duration-150" leaveFrom="translate-y-0 opacity-100" leaveTo="translate-y-8 opacity-0">
						<Dialog.Panel className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 text-neutral-950 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-8 dark:bg-neutral-900 dark:text-white">
							<div className="flex items-center justify-between">
								<Dialog.Title className="text-2xl font-bold tracking-tight">Import JSON</Dialog.Title>
								<button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-800">
									<X className="h-4 w-4" />
								</button>
							</div>
							<p className="mt-2 text-sm text-neutral-500">
								Same format as the old addLangs.js / content.json: language → group → key → text. Texts with the same key are replaced; nothing else changes.
							</p>
							<textarea
								value={json}
								onChange={(e) => setJson(e.target.value)}
								placeholder={EXAMPLE}
								rows={14}
								spellCheck={false}
								className="mt-5 w-full rounded-2xl border-0 bg-neutral-950 p-4 font-mono text-xs text-emerald-300 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
							{result && (
								<p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
									Imported{' '}
									{Object.entries(result)
										.map(([l, n]) => `${flag(l)} ${n}`)
										.join('  ·  ')}
								</p>
							)}
							{!['idle', 'busy'].includes(state) && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{state}</p>}
							<div className="mt-5 flex justify-end">
								<button type="button" onClick={run} disabled={!json.trim() || state === 'busy'} className="inline-flex h-12 items-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-950">
									{state === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
									Import
								</button>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}
