'use client'
// Agency requests from the agencies page: filter by status, search, then open
// one to accept or decline it and add a private note. Accepting can email
// them how to add their company and tours; declining always sends the
// standard "no for now" email. A request can also be removed.
import { Fragment, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Building2, Check, ExternalLink, Loader2, Mail, MapPin, Search, Trash2, X } from 'lucide-react'

export type Agency = {
	id: string
	email: string
	company: string
	location: string
	website: string | null
	locale: string | null
	status: Status
	note: string | null
	created_at: string
	decided_at: string | null
}
type Status = 'pending' | 'approved' | 'declined'
type Filter = Status | 'all'

const FILTERS: [Filter, string][] = [
	['pending', 'To review'],
	['approved', 'Accepted'],
	['declined', 'Declined'],
	['all', 'All'],
]
const BADGE: Record<Status, [string, string]> = {
	pending: ['To review', 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'],
	approved: ['Accepted', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'],
	declined: ['Declined', 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'],
}

const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const site = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`)

export default function AgenciesPanel({ initial, loadError, emailReady }: { initial: Agency[]; loadError: string; emailReady: boolean }) {
	const [rows, setRows] = useState(initial)
	const [filter, setFilter] = useState<Filter>(initial.some((r) => r.status === 'pending') ? 'pending' : 'all')
	const [query, setQuery] = useState('')
	const [open, setOpen] = useState<{ row: Agency; status: Status } | null>(null)
	const [toast, setToast] = useState('')

	const counts = useMemo(() => {
		const c: Record<string, number> = { all: rows.length, pending: 0, approved: 0, declined: 0 }
		for (const r of rows) c[r.status]++
		return c
	}, [rows])

	const matches = (text: string) => !query || text.toLowerCase().includes(query.toLowerCase())
	const shown = rows.filter((r) => (filter === 'all' || r.status === filter) && matches(`${r.company} ${r.email} ${r.location} ${r.website ?? ''} ${r.note ?? ''}`))

	function notify(message: string) {
		setToast(message)
		setTimeout(() => setToast(''), 4000)
	}

	function saved(row: Agency, message: string) {
		setRows((all) => all.map((r) => (r.id === row.id ? row : r)))
		setOpen(null)
		notify(message)
	}

	function removed(row: Agency) {
		setRows((all) => all.filter((r) => r.id !== row.id))
		setOpen(null)
		notify(`${row.company} removed`)
	}

	return (
		<div className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 dark:text-white">
			<div>
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">TRAVSUS</p>
				<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Agencies</h1>
				<p className="mt-2 text-lg text-neutral-500">Tour agencies and guides who asked to list their tours, from the agencies page. Accept or decline them.</p>
			</div>

			{!emailReady && <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">Emails can&apos;t be sent until the SMTP login (SMTP_HOST, SMTP_USER, SMTP_PASS) is set.</p>}

			<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
					{FILTERS.map(([key, label]) => (
						<button
							key={key}
							type="button"
							onClick={() => setFilter(key)}
							className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
								filter === key ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 dark:bg-neutral-900 dark:text-neutral-400'
							}`}
						>
							{label}
							<span className={`tabular-nums ${filter === key ? 'opacity-60' : 'text-neutral-400'}`}>{counts[key]}</span>
						</button>
					))}
				</div>
				<label className="relative sm:w-72">
					<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search company, email or city"
						className="h-11 w-full rounded-full border-0 bg-neutral-100 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
					/>
				</label>
			</div>

			{loadError && <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{loadError}</p>}

			<ul className="mt-5 space-y-2.5">
				{shown.map((r) => (
					<li key={r.id} className="flex flex-col gap-4 rounded-3xl p-5 ring-1 ring-neutral-200 transition hover:ring-neutral-400 sm:flex-row sm:items-center dark:ring-neutral-800">
						<button type="button" onClick={() => setOpen({ row: r, status: r.status })} className="flex min-w-0 flex-1 items-center gap-4 text-left">
							<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-neutral-100 text-base font-bold uppercase dark:bg-neutral-900">{r.company[0]}</span>
							<span className="min-w-0">
								<span className="block truncate font-semibold">{r.company}</span>
								<span className="mt-0.5 block truncate text-sm text-neutral-500">{[r.email, r.location, `Asked ${date(r.created_at)}`, r.locale].filter(Boolean).join(' · ')}</span>
							</span>
						</button>
						<div className="flex flex-wrap items-center gap-2 sm:justify-end">
							<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE[r.status][1]}`}>{BADGE[r.status][0]}</span>
							{r.status === 'pending' && (
								<span className="ml-auto flex gap-2 sm:ml-2">
									<button type="button" onClick={() => setOpen({ row: r, status: 'declined' })} className="h-10 rounded-full px-4 text-sm font-semibold ring-1 ring-neutral-300 transition hover:ring-neutral-950 dark:ring-neutral-700 dark:hover:ring-white">
										Decline
									</button>
									<button type="button" onClick={() => setOpen({ row: r, status: 'approved' })} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
										<Check className="h-4 w-4" />
										Accept
									</button>
								</span>
							)}
						</div>
					</li>
				))}
			</ul>

			{!shown.length && !loadError && (
				<div className="mt-5 rounded-[28px] bg-neutral-100 px-6 py-16 text-center dark:bg-neutral-900">
					<Building2 className="mx-auto h-8 w-8 text-neutral-400" />
					<p className="mt-3 font-semibold">{query ? 'Nothing matches your search' : filter === 'pending' ? 'No requests to review' : 'No requests here yet'}</p>
					<p className="mt-1 text-sm text-neutral-500">New requests from the agencies page show up here.</p>
				</div>
			)}

			<Transition show={!!open} as={Fragment}>
				<Dialog className="relative z-50" onClose={() => setOpen(null)}>
					<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
						<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
					</Transition.Child>
					<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
						<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="translate-y-8 opacity-0" enterTo="translate-y-0 opacity-100" leave="ease-in duration-150" leaveFrom="translate-y-0 opacity-100" leaveTo="translate-y-8 opacity-0">
							<Dialog.Panel className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 text-neutral-950 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8 dark:bg-neutral-900 dark:text-white">
								{open && <EditorForm key={open.row.id + open.status} {...open} onClose={() => setOpen(null)} onSaved={saved} onRemoved={removed} />}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>

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

function EditorForm({
	row,
	status: initialStatus,
	onClose,
	onSaved,
	onRemoved,
}: {
	row: Agency
	status: Status
	onClose: () => void
	onSaved: (row: Agency, message: string) => void
	onRemoved: (row: Agency) => void
}) {
	const [status, setStatus] = useState<Status>(initialStatus)
	const [note, setNote] = useState(row.note ?? '')
	const [notify, setNotify] = useState(true)
	const [confirmRemove, setConfirmRemove] = useState(false)
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const statusChanged = status !== row.status

	async function save() {
		setBusy(true)
		setError('')
		try {
			const res = await fetch('/api/admin/agencies', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: row.id, status, note, notify: statusChanged && status === 'approved' && notify }),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data.error || 'Could not save. Please try again.')
			const verb = data.agency.status === 'approved' ? 'accepted' : data.agency.status === 'declined' ? 'declined' : 'saved'
			onSaved(data.agency, `${row.company} ${statusChanged ? verb : 'saved'}${data.emailed ? ', email sent' : ''}`)
		} catch (e: any) {
			setError(e.message)
			setBusy(false)
		}
	}

	async function remove() {
		setBusy(true)
		setError('')
		try {
			const res = await fetch('/api/admin/agencies', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: row.id }) })
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data.error || 'Could not remove. Please try again.')
			onRemoved(row)
		} catch (e: any) {
			setError(e.message)
			setBusy(false)
		}
	}

	const choice = (active: boolean) =>
		`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold ring-1 transition ${
			active ? 'bg-neutral-950 text-white ring-neutral-950 dark:bg-white dark:text-neutral-950 dark:ring-white' : 'ring-neutral-200 hover:ring-neutral-400 dark:ring-neutral-700'
		}`

	return (
		<>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<Dialog.Title className="truncate text-2xl font-bold tracking-tight">{row.company}</Dialog.Title>
					<p className="mt-1 text-sm text-neutral-500">
						Asked {date(row.created_at)}
						{row.decided_at && row.status !== 'pending' && ` · ${BADGE[row.status][0]} ${date(row.decided_at)}`}
					</p>
				</div>
				<button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-800">
					<X className="h-4 w-4" />
				</button>
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				<a href={`mailto:${row.email}`} className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium dark:bg-neutral-800">
					<Mail className="h-3.5 w-3.5 shrink-0" />
					<span className="truncate">{row.email}</span>
				</a>
				<span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium dark:bg-neutral-800">
					<MapPin className="h-3.5 w-3.5 shrink-0" />
					<span className="truncate">{row.location}</span>
				</span>
				{row.website && (
					<a href={site(row.website)} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium dark:bg-neutral-800">
						<span className="truncate">{row.website}</span>
						<ExternalLink className="h-3.5 w-3.5 shrink-0" />
					</a>
				)}
			</div>

			<p className="mt-7 text-sm font-semibold">Decision</p>
			<div className="mt-2 flex gap-2">
				<button type="button" onClick={() => setStatus('approved')} className={choice(status === 'approved')}>Accept</button>
				<button type="button" onClick={() => setStatus('declined')} className={choice(status === 'declined')}>Decline</button>
				<button type="button" onClick={() => setStatus('pending')} className={choice(status === 'pending')}>Later</button>
			</div>

			<label className="mt-7 block">
				<span className="text-sm font-semibold">Private note</span>
				<textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					rows={3}
					placeholder="Only you see this"
					className="mt-2 w-full rounded-2xl border-0 bg-neutral-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-800 dark:focus:ring-white"
				/>
			</label>

			{statusChanged && status === 'declined' && (
				<p className="mt-5 flex items-start gap-3 rounded-2xl bg-neutral-100 p-4 text-sm dark:bg-neutral-800">
					<Mail className="mt-0.5 h-5 w-5 shrink-0" />
					<span>
						<span className="block font-semibold">{row.email} gets the standard email</span>
						<span className="text-neutral-500">A polite “no for now”, no reason given.</span>
					</span>
				</p>
			)}

			{statusChanged && status === 'approved' && (
				<label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-800">
					<input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="mt-0.5 h-5 w-5 rounded" style={{ accentColor: '#0a0a0a' }} />
					<span className="text-sm">
						<span className="block font-semibold">Email {row.email}</span>
						<span className="text-neutral-500">Tell them they’re in and how to add their company and tours.</span>
					</span>
				</label>
			)}

			{error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}

			<div className="mt-7 flex gap-2">
				<button type="button" onClick={onClose} className="h-12 flex-1 rounded-full text-sm font-semibold ring-1 ring-neutral-300 dark:ring-neutral-700">
					Cancel
				</button>
				<button type="button" onClick={save} disabled={busy} className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-full bg-neutral-950 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-neutral-950">
					{busy && <Loader2 className="h-4 w-4 animate-spin" />}
					{statusChanged ? (status === 'approved' ? 'Accept' : status === 'declined' ? 'Decline' : 'Move back to review') : 'Save'}
				</button>
			</div>

			{/* Remove: asks once more before deleting */}
			<div className="mt-6 border-t border-neutral-200 pt-5 dark:border-neutral-800">
				{confirmRemove ? (
					<div className="rounded-2xl bg-red-50 p-4 dark:bg-red-950/40">
						<p className="text-sm font-semibold text-red-800 dark:text-red-200">Remove {row.company}?</p>
						<p className="mt-1 text-sm text-red-700/80 dark:text-red-300/80">Their request is deleted. This can&apos;t be undone.</p>
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
						Remove request
					</button>
				)}
			</div>
		</>
	)
}
