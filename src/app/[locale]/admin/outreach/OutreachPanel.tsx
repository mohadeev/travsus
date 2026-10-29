'use client'
// Outreach tracker: everyone we talk to about becoming an affiliate (mostly in
// Instagram DMs), in one list. The pipeline on top counts each status and
// filters the list; "Follow up" gathers who's due: their follow-up day has
// come, or they haven't answered a message for FOLLOW_UP_AFTER days. Open a
// person to change their status, details and follow-up day, and to add notes
// to their timeline. "Paste handles" adds many people at once.
import { Fragment, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { BellRing, Check, ExternalLink, Instagram, Loader2, Plus, Search, Trash2, Users, X } from 'lucide-react'
import { cleanHandle, OUTREACH_STATUSES, type OutreachContact, type OutreachPlatform, type OutreachStatus } from '@/lib/admin/outreach'

type Filter = OutreachStatus | 'all' | 'due'

const FOLLOW_UP_AFTER = 5 // days without an answer

const STATUS: Record<OutreachStatus, [string, string, string]> = {
	// [label, pill colours, dot colour]
	to_contact: ['To contact', 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300', 'bg-neutral-400'],
	messaged: ['Messaged', 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300', 'bg-sky-500'],
	replied: ['Replied', 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300', 'bg-violet-500'],
	talking: ['In talks', 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', 'bg-amber-500'],
	joined: ['Joined', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', 'bg-emerald-500'],
	no_reply: ['No reply', 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400', 'bg-neutral-300'],
	declined: ['Declined', 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', 'bg-red-500'],
}
const PLATFORM_URL: Record<OutreachPlatform, ((h: string) => string) | null> = {
	instagram: (h) => `https://www.instagram.com/${h}/`,
	tiktok: (h) => `https://www.tiktok.com/@${h}`,
	youtube: (h) => `https://www.youtube.com/@${h}`,
	other: null,
}

const DAY_MS = 86400_000
const today = () => new Date().toISOString().slice(0, 10)
const inDays = (n: number) => new Date(Date.now() + n * DAY_MS).toISOString().slice(0, 10)
const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const time = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const compact = (n: number) => new Intl.NumberFormat('en', { notation: 'compact' }).format(n)
function ago(iso: string | null) {
	if (!iso) return 'Not contacted yet'
	const days = Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS)
	return days <= 0 ? 'Today' : days === 1 ? 'Yesterday' : days < 30 ? `${days} days ago` : date(iso)
}

/** Waiting on us: their follow-up day has come, or no answer for a while */
function isDue(c: OutreachContact) {
	if (c.status === 'joined' || c.status === 'declined') return false
	if (c.follow_up) return c.follow_up <= today()
	return c.status === 'messaged' && !!c.last_contact_at && Date.now() - new Date(c.last_contact_at).getTime() > FOLLOW_UP_AFTER * DAY_MS
}

async function send(method: 'POST' | 'PATCH' | 'DELETE', body: object) {
	const res = await fetch('/api/admin/outreach', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
	const data = await res.json().catch(() => ({}))
	if (!res.ok) throw new Error(data.error || 'Could not save. Please try again.')
	return data
}

const field = 'h-11 w-full rounded-2xl border-0 bg-neutral-100 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-800 dark:focus:ring-white'

export default function OutreachPanel({ initial, loadError }: { initial: OutreachContact[]; loadError: string }) {
	const [rows, setRows] = useState(initial)
	const [filter, setFilter] = useState<Filter>(initial.some(isDue) ? 'due' : 'all')
	const [query, setQuery] = useState('')
	const [openId, setOpenId] = useState<string | null>(null)
	const [adding, setAdding] = useState(false)
	const [toast, setToast] = useState('')

	const counts = useMemo(() => {
		const c: Record<string, number> = { all: rows.length, due: rows.filter(isDue).length }
		for (const s of OUTREACH_STATUSES) c[s] = 0
		for (const r of rows) c[r.status]++
		return c
	}, [rows])

	const matches = (r: OutreachContact) => !query || `${r.handle} ${r.name ?? ''} ${r.email ?? ''} ${r.log.map((e) => e.text ?? '').join(' ')}`.toLowerCase().includes(query.toLowerCase())
	const shown = rows
		.filter((r) => (filter === 'all' ? true : filter === 'due' ? isDue(r) : r.status === filter) && matches(r))
		// Latest conversations first; never contacted at the end
		.sort((a, b) => (b.last_contact_at ?? b.created_at).localeCompare(a.last_contact_at ?? a.created_at))
	const open = rows.find((r) => r.id === openId) ?? null

	function notify(message: string) {
		setToast(message)
		setTimeout(() => setToast(''), 4000)
	}
	const replace = (contact: OutreachContact) => setRows((all) => all.map((r) => (r.id === contact.id ? contact : r)))

	async function quickStatus(row: OutreachContact, status: OutreachStatus) {
		try {
			const { contact } = await send('PATCH', { id: row.id, status })
			replace(contact)
			notify(`@${row.handle}: ${STATUS[status][0]}`)
		} catch (e: any) {
			notify(e.message)
		}
	}

	const pill = (key: Filter, label: string, dot?: string) => (
		<button
			key={key}
			type="button"
			onClick={() => setFilter(key)}
			className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
				filter === key ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 dark:bg-neutral-900 dark:text-neutral-400'
			}`}
		>
			{dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
			{label}
			<span className={`tabular-nums ${filter === key ? 'opacity-60' : 'text-neutral-400'}`}>{counts[key]}</span>
		</button>
	)

	// Talking now = replied + in talks
	const active = counts.replied + counts.talking
	const contacted = rows.filter((r) => r.status !== 'to_contact').length
	const answered = rows.filter((r) => r.log.some((e) => e.status && ['replied', 'talking', 'joined', 'declined'].includes(e.status))).length

	return (
		<div className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 dark:text-white">
			<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">TRAVSUS</p>
					<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Outreach</h1>
					<p className="mt-2 max-w-2xl text-lg text-neutral-500">Everyone you talk to about becoming an affiliate, mostly in Instagram DMs: where each conversation stands and what was said.</p>
				</div>
				<button
					type="button"
					onClick={() => setAdding(true)}
					className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950"
				>
					<Plus className="h-4 w-4" />
					Add people
				</button>
			</div>

			{/* Numbers */}
			<section className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
				{(
					[
						['People', rows.length, `${counts.to_contact} still to contact`],
						['Answer rate', contacted ? `${Math.round((answered / contacted) * 100)}%` : '–', `${answered} of ${contacted} answered`],
						['Talking now', active, `${counts.replied} replied · ${counts.talking} in talks`],
						['Joined', counts.joined, `${counts.declined} declined · ${counts.no_reply} no reply`],
					] as const
				).map(([label, value, sub], i) => (
					<div key={label} className={`rounded-[24px] p-5 ${i === 3 ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 dark:bg-neutral-900'}`}>
						<p className={`text-sm font-semibold ${i === 3 ? 'text-white/60 dark:text-neutral-500' : 'text-neutral-500'}`}>{label}</p>
						<p className="mt-1 text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">{value}</p>
						<p className={`mt-1 text-xs ${i === 3 ? 'text-white/60 dark:text-neutral-500' : 'text-neutral-500'}`}>{sub}</p>
					</div>
				))}
			</section>

			<div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="-mx-5 flex gap-1.5 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:px-0">
					{counts.due > 0 && (
						<button
							type="button"
							onClick={() => setFilter('due')}
							className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === 'due' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-300'}`}
						>
							<BellRing className="h-4 w-4" />
							Follow up
							<span className="tabular-nums opacity-70">{counts.due}</span>
						</button>
					)}
					{pill('all', 'All')}
					{OUTREACH_STATUSES.map((s) => pill(s, STATUS[s][0], STATUS[s][2]))}
				</div>
				<label className="relative lg:w-72">
					<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, @handle or notes" className="h-11 w-full rounded-full border-0 bg-neutral-100 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white" />
				</label>
			</div>

			{loadError && <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{loadError}</p>}

			<ul className="mt-5 space-y-2.5">
				{shown.map((r) => {
					const last = [...r.log].reverse().find((e) => e.text)
					const due = isDue(r)
					return (
						<li key={r.id} className="flex flex-col gap-3 rounded-3xl p-4 ring-1 ring-neutral-200 transition hover:ring-neutral-400 sm:flex-row sm:items-center sm:p-5 dark:ring-neutral-800">
							<button type="button" onClick={() => setOpenId(r.id)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
								<span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 p-[2px]">
									<span className="grid h-full w-full place-items-center rounded-full bg-white text-base font-bold uppercase dark:bg-neutral-950">{r.handle[0]}</span>
								</span>
								<span className="min-w-0">
									<span className="flex items-center gap-2">
										<span className="truncate font-semibold">@{r.handle}</span>
										{r.followers ? <span className="shrink-0 text-xs font-semibold text-neutral-400">{compact(r.followers)}</span> : null}
									</span>
									<span className="mt-0.5 block truncate text-sm text-neutral-500">{[r.name, ago(r.last_contact_at), last?.text].filter(Boolean).join(' · ')}</span>
								</span>
							</button>
							<div className="flex flex-wrap items-center gap-2 sm:justify-end">
								{due && (
									<span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-300">
										<BellRing className="h-3 w-3" />
										Follow up
									</span>
								)}
								{!due && r.follow_up && r.status !== 'joined' && r.status !== 'declined' && <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">Follow up {date(r.follow_up)}</span>}
								<label className="relative">
									<span className="sr-only">Status of @{r.handle}</span>
									<select
										value={r.status}
										onChange={(e) => quickStatus(r, e.target.value as OutreachStatus)}
										className={`h-8 cursor-pointer appearance-none rounded-full border-0 py-0 pl-3 pr-8 text-xs font-semibold focus:ring-2 focus:ring-neutral-950 ${STATUS[r.status][1]}`}
									>
										{OUTREACH_STATUSES.map((s) => (
											<option key={s} value={s}>
												{STATUS[s][0]}
											</option>
										))}
									</select>
								</label>
							</div>
						</li>
					)
				})}
			</ul>

			{!shown.length && !loadError && (
				<div className="mt-5 rounded-[28px] bg-neutral-100 px-6 py-16 text-center dark:bg-neutral-900">
					<Users className="mx-auto h-8 w-8 text-neutral-400" />
					<p className="mt-3 font-semibold">{query ? 'Nothing matches your search' : rows.length ? 'Nobody here' : 'Nobody yet'}</p>
					<p className="mt-1 text-sm text-neutral-500">{rows.length ? 'Try another filter.' : 'Use “Add people”: paste the Instagram names you messaged, one per line.'}</p>
				</div>
			)}

			<Sheet show={!!open} onClose={() => setOpenId(null)} wide>
				{open && (
					<Person
						key={open.id}
						row={open}
						onClose={() => setOpenId(null)}
						onSaved={(c, message) => {
							replace(c)
							if (message) notify(message)
						}}
						onRemoved={() => {
							setRows((all) => all.filter((r) => r.id !== open.id))
							setOpenId(null)
							notify(`@${open.handle} removed`)
						}}
					/>
				)}
			</Sheet>

			<Sheet show={adding} onClose={() => setAdding(false)}>
				<AddPeople
					onClose={() => setAdding(false)}
					onAdded={(created, skipped) => {
						setRows((all) => [...created, ...all])
						setAdding(false)
						setFilter('all')
						notify(`${created.length} added${skipped.length ? `, ${skipped.length} already in the list` : ''}`)
					}}
				/>
			</Sheet>

			{toast && (
				<div role="status" className="fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 sm:bottom-8">
					<p className="flex items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-medium text-white shadow-2xl dark:bg-white dark:text-neutral-950">
						<Check className="h-4 w-4 text-emerald-400" />
						{toast}
					</p>
				</div>
			)}
		</div>
	)
}

/** Dialog: a sheet from the bottom on phones, a centred card from sm */
function Sheet({ show, onClose, wide = false, children }: { show: boolean; onClose: () => void; wide?: boolean; children: React.ReactNode }) {
	return (
		<Transition show={show} as={Fragment}>
			<Dialog className="relative z-50" onClose={onClose}>
				<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
				</Transition.Child>
				<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
					<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="translate-y-8 opacity-0" enterTo="translate-y-0 opacity-100" leave="ease-in duration-150" leaveFrom="translate-y-0 opacity-100" leaveTo="translate-y-8 opacity-0">
						<Dialog.Panel className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 text-neutral-950 shadow-2xl sm:rounded-3xl sm:p-8 dark:bg-neutral-900 dark:text-white ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'}`}>
							{children}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}

function Close({ onClose }: { onClose: () => void }) {
	return (
		<button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700">
			<X className="h-4 w-4" />
		</button>
	)
}

/** Add people: many handles pasted at once, all with the same status */
function AddPeople({ onClose, onAdded }: { onClose: () => void; onAdded: (created: OutreachContact[], skipped: string[]) => void }) {
	const [text, setText] = useState('')
	const [status, setStatus] = useState<OutreachStatus>('messaged')
	const [note, setNote] = useState('')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const handles = Array.from(new Set(text.split(/[\n,]+/).map(cleanHandle).filter((h) => h.length >= 2)))

	async function add() {
		setBusy(true)
		setError('')
		try {
			const { created, skipped } = await send('POST', { handles, status, note })
			onAdded(created, skipped)
		} catch (e: any) {
			setError(e.message)
			setBusy(false)
		}
	}

	return (
		<>
			<div className="flex items-start justify-between gap-4">
				<div>
					<Dialog.Title className="text-2xl font-bold tracking-tight">Add people</Dialog.Title>
					<p className="mt-1 text-sm text-neutral-500">Paste Instagram names or links, one per line. People already in the list are skipped.</p>
				</div>
				<Close onClose={onClose} />
			</div>
			<textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} autoFocus placeholder={'@wanderwithsofia\n@marrakech.diaries\ninstagram.com/desert.tales'} className="mt-6 w-full rounded-2xl border-0 bg-neutral-100 px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-800 dark:focus:ring-white" />
			<p className="mt-4 text-sm font-semibold">Where are they at?</p>
			<div className="mt-2 flex flex-wrap gap-1.5">
				{OUTREACH_STATUSES.map((s) => (
					<button key={s} type="button" onClick={() => setStatus(s)} className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${status === s ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'}`}>
						{STATUS[s][0]}
					</button>
				))}
			</div>
			<label className="mt-4 block">
				<span className="text-sm font-semibold">Note for all of them (optional)</span>
				<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Sent the €150 commission message" className={`mt-2 ${field}`} />
			</label>
			{error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}
			<button type="button" onClick={add} disabled={busy || !handles.length} className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-950">
				{busy && <Loader2 className="h-4 w-4 animate-spin" />}
				{handles.length ? `Add ${handles.length} ${handles.length === 1 ? 'person' : 'people'}` : 'Add people'}
			</button>
		</>
	)
}

/** One person: status, follow-up, details, timeline with notes */
function Person({ row, onClose, onSaved, onRemoved }: { row: OutreachContact; onClose: () => void; onSaved: (c: OutreachContact, message?: string) => void; onRemoved: () => void }) {
	const [note, setNote] = useState('')
	const [info, setInfo] = useState({ handle: row.handle, name: row.name ?? '', followers: row.followers ? String(row.followers) : '', email: row.email ?? '', platform: row.platform })
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const [confirmRemove, setConfirmRemove] = useState(false)
	const link = PLATFORM_URL[row.platform]?.(row.handle)
	const infoChanged = info.handle !== row.handle || info.name !== (row.name ?? '') || info.followers !== (row.followers ? String(row.followers) : '') || info.email !== (row.email ?? '') || info.platform !== row.platform

	async function save(body: object, message?: string) {
		setBusy(true)
		setError('')
		try {
			const { contact } = await send('PATCH', { id: row.id, ...body })
			onSaved(contact, message)
			return true
		} catch (e: any) {
			setError(e.message)
			return false
		} finally {
			setBusy(false)
		}
	}

	async function remove() {
		setBusy(true)
		try {
			await send('DELETE', { id: row.id })
			onRemoved()
		} catch (e: any) {
			setError(e.message)
			setBusy(false)
		}
	}

	const followUp = (day: string | null, label: string) => (
		<button
			type="button"
			onClick={() => save({ follow_up: day }, day ? `Follow up ${date(day)}` : 'Follow-up cleared')}
			className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${row.follow_up === day ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 dark:bg-neutral-800 dark:text-neutral-300'}`}
		>
			{label}
		</button>
	)

	return (
		<>
			<div className="flex items-start justify-between gap-4">
				<div className="flex min-w-0 items-center gap-4">
					<span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-violet-600 p-[2px]">
						<span className="grid h-full w-full place-items-center rounded-full bg-white text-xl font-bold uppercase dark:bg-neutral-900">{row.handle[0]}</span>
					</span>
					<div className="min-w-0">
						<Dialog.Title className="truncate text-2xl font-bold tracking-tight">@{row.handle}</Dialog.Title>
						<p className="mt-0.5 truncate text-sm text-neutral-500">{[row.name, row.followers ? `${compact(row.followers)} followers` : null, `Added ${date(row.created_at)}`].filter(Boolean).join(' · ')}</p>
					</div>
				</div>
				<Close onClose={onClose} />
			</div>

			{link && (
				<a href={link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white">
					<Instagram className="h-4 w-4" />
					Open profile
					<ExternalLink className="h-3.5 w-3.5" />
				</a>
			)}

			<p className="mt-7 text-sm font-semibold">Status</p>
			<div className="mt-2 flex flex-wrap gap-1.5">
				{OUTREACH_STATUSES.map((s) => (
					<button
						key={s}
						type="button"
						disabled={busy}
						onClick={() => s !== row.status && save({ status: s }, `@${row.handle}: ${STATUS[s][0]}`)}
						className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition ${row.status === s ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 dark:bg-neutral-800 dark:text-neutral-300'}`}
					>
						<span className={`h-2 w-2 rounded-full ${STATUS[s][2]}`} />
						{STATUS[s][0]}
					</button>
				))}
			</div>

			{row.status !== 'joined' && row.status !== 'declined' && (
				<>
					<p className="mt-6 text-sm font-semibold">Follow up</p>
					<div className="mt-2 flex flex-wrap items-center gap-1.5">
						{followUp(inDays(1), 'Tomorrow')}
						{followUp(inDays(3), 'In 3 days')}
						{followUp(inDays(7), 'In a week')}
						<input type="date" value={row.follow_up ?? ''} onChange={(e) => save({ follow_up: e.target.value || null }, e.target.value ? `Follow up ${date(e.target.value)}` : 'Follow-up cleared')} className="h-9 rounded-full border-0 bg-neutral-100 px-3 text-sm dark:bg-neutral-800" />
						{row.follow_up && followUp(null, 'Clear')}
					</div>
				</>
			)}

			{/* Timeline: newest first, with a box to add a note */}
			<p className="mt-7 text-sm font-semibold">Timeline</p>
			<div className="mt-2 flex gap-2">
				<input
					value={note}
					onChange={(e) => setNote(e.target.value)}
					onKeyDown={async (e) => {
						if (e.key === 'Enter' && note.trim() && (await save({ note }))) setNote('')
					}}
					placeholder="What happened? e.g. Asked for the media kit"
					className={field}
				/>
				<button type="button" disabled={busy || !note.trim()} onClick={async () => (await save({ note })) && setNote('')} className="h-11 shrink-0 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-950">
					Add
				</button>
			</div>
			<ol className="mt-4 space-y-0">
				{[...row.log].reverse().map((e) => (
					<li key={e.at} className="group relative flex gap-3 pb-4 pl-1 last:pb-0">
						<span className="relative flex flex-col items-center">
							<span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${e.status ? STATUS[e.status][2] : 'bg-neutral-950 dark:bg-white'}`} />
							<span className="mt-1 w-px flex-1 bg-neutral-200 group-last:hidden dark:bg-neutral-800" />
						</span>
						<div className="min-w-0 flex-1">
							<p className="text-xs text-neutral-500">{time(e.at)}</p>
							{e.status && <p className="text-sm font-semibold">→ {STATUS[e.status][0]}</p>}
							{e.text && <p className="whitespace-pre-line text-sm">{e.text}</p>}
						</div>
						<button type="button" onClick={() => save({ removeEventAt: e.at })} aria-label="Remove this line" className="h-7 w-7 shrink-0 place-items-center rounded-full text-neutral-400 opacity-0 transition hover:bg-neutral-100 hover:text-neutral-950 group-hover:opacity-100 sm:grid dark:hover:bg-neutral-800">
							<X className="h-3.5 w-3.5" />
						</button>
					</li>
				))}
			</ol>

			{/* Details */}
			<details className="mt-7 rounded-2xl bg-neutral-50 p-4 dark:bg-neutral-950/50">
				<summary className="cursor-pointer text-sm font-semibold">Details</summary>
				<div className="mt-4 grid gap-2.5 sm:grid-cols-2">
					<label className="text-xs font-semibold text-neutral-500">
						Handle
						<input value={info.handle} onChange={(e) => setInfo({ ...info, handle: e.target.value })} className={`mt-1 ${field}`} />
					</label>
					<label className="text-xs font-semibold text-neutral-500">
						Platform
						<select value={info.platform} onChange={(e) => setInfo({ ...info, platform: e.target.value as OutreachPlatform })} className={`mt-1 ${field}`}>
							<option value="instagram">Instagram</option>
							<option value="tiktok">TikTok</option>
							<option value="youtube">YouTube</option>
							<option value="other">Other</option>
						</select>
					</label>
					<label className="text-xs font-semibold text-neutral-500">
						Name
						<input value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} placeholder="Sofia Rossi" className={`mt-1 ${field}`} />
					</label>
					<label className="text-xs font-semibold text-neutral-500">
						Followers
						<input value={info.followers} onChange={(e) => setInfo({ ...info, followers: e.target.value })} placeholder="e.g. 52k" className={`mt-1 ${field}`} />
					</label>
					<label className="text-xs font-semibold text-neutral-500 sm:col-span-2">
						Email
						<input type="email" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} placeholder="If they gave you one" className={`mt-1 ${field}`} />
					</label>
				</div>
				<button type="button" disabled={busy || !infoChanged} onClick={() => save(info, 'Details saved')} className="mt-3 h-10 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-neutral-950">
					Save details
				</button>
			</details>

			{error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}

			<div className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-800">
				{confirmRemove ? (
					<div className="rounded-2xl bg-red-50 p-4 dark:bg-red-950/40">
						<p className="text-sm font-semibold text-red-800 dark:text-red-200">Remove @{row.handle} and their timeline?</p>
						<div className="mt-3 flex gap-2">
							<button type="button" onClick={() => setConfirmRemove(false)} className="h-10 flex-1 rounded-full bg-white text-sm font-semibold ring-1 ring-red-200 dark:bg-neutral-900 dark:ring-red-900">
								Keep
							</button>
							<button type="button" onClick={remove} disabled={busy} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-semibold text-white disabled:opacity-60">
								{busy && <Loader2 className="h-4 w-4 animate-spin" />}
								Remove
							</button>
						</div>
					</div>
				) : (
					<button type="button" onClick={() => setConfirmRemove(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700">
						<Trash2 className="h-4 w-4" />
						Remove from the list
					</button>
				)}
			</div>
		</>
	)
}
