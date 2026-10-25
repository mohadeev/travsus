'use client'
// Affiliate requests: filter by status, search, then open one to accept or
// decline it, give it a custom commission (or keep the standard tiers from
// the affiliates page), add a private note, and optionally email the person.
// Accepted affiliates: their link code, earnings, and recording payouts.
// "Send invitation" opens the invitation form in a dialog, on this page.
// An affiliate can also be removed (their link stops counting).
import { Fragment, useMemo, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Check, ExternalLink, Handshake, Link2, Loader2, Percent, Search, Send, Trash2, Wallet, X } from 'lucide-react'
import InviteForm from '../_components/InviteForm'
import { cleanCode, CODE_MAX } from '@/lib/affiliateCode'

export type Affiliate = {
	id: string
	email: string
	code: string | null
	website: string | null
	locale: string | null
	status: Status
	rate: number | string | null
	note: string | null
	created_at: string
	decided_at: string | null
}
type Status = 'pending' | 'approved' | 'declined'
type Tier = { rate: number; from: number; to: number | null }
type Stats = { clicks: number; bookings: number; upcoming: number; earned: number; paidOut: number; balance: number }

const FILTERS: [Status | 'all', string][] = [
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
const tierRange = (tiers: Tier[]) => `${tiers[0].rate}–${tiers[tiers.length - 1].rate}%`
const euros = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(n)

export default function AffiliatesPanel({ initial, stats: initialStats, tiers, loadError, emailReady }: { initial: Affiliate[]; stats: Record<string, Stats>; tiers: Tier[]; loadError: string; emailReady: boolean }) {
	const [rows, setRows] = useState(initial)
	const [stats, setStats] = useState(initialStats)
	const [filter, setFilter] = useState<Status | 'all'>(initial.some((r) => r.status === 'pending') ? 'pending' : 'all')
	const [query, setQuery] = useState('')
	const [open, setOpen] = useState<{ row: Affiliate; status: Status } | null>(null)
	const [toast, setToast] = useState('')
	const [inviting, setInviting] = useState(false)

	const counts = useMemo(() => {
		const c: Record<string, number> = { all: rows.length, pending: 0, approved: 0, declined: 0 }
		for (const r of rows) c[r.status]++
		return c
	}, [rows])

	const shown = rows.filter(
		(r) => (filter === 'all' || r.status === filter) && (!query || `${r.email} ${r.website ?? ''} ${r.note ?? ''}`.toLowerCase().includes(query.toLowerCase())),
	)

	function notify(message: string) {
		setToast(message)
		setTimeout(() => setToast(''), 4000)
	}

	function removed(row: Affiliate) {
		setRows((all) => all.filter((r) => r.id !== row.id))
		setOpen(null)
		notify(`${row.email} removed`)
	}

	function saved(row: Affiliate, message: string, rowStats?: Stats) {
		setRows((all) => all.map((r) => (r.id === row.id ? row : r)))
		if (rowStats) setStats((all) => ({ ...all, [row.id]: rowStats }))
		setOpen(null)
		notify(message)
	}

	const commission = (r: Affiliate) => (r.rate === null ? `Standard ${tierRange(tiers)}` : `${Number(r.rate)}%`)

	return (
		<div className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 dark:text-white">
			<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">TRAVSUS</p>
					<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Affiliates</h1>
					<p className="mt-2 text-lg text-neutral-500">Requests from the affiliates page. Accept or decline them and set each one&apos;s commission.</p>
				</div>
				<button
					type="button"
					onClick={() => setInviting(true)}
					className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950"
				>
					<Send className="h-4 w-4" />
					Send invitation
				</button>
			</div>

			{/* The standard commission, as shown on the affiliates page */}
			<section className="mt-8 rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8 dark:bg-white dark:text-neutral-950">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-semibold text-white/60 dark:text-neutral-500">Standard commission</p>
						<p className="mt-1 max-w-sm text-sm text-white/80 dark:text-neutral-600">Every affiliate gets this unless you set a custom rate. It grows with their bookings, as on the affiliates page.</p>
					</div>
					<div className="grid grid-cols-3 gap-2 sm:gap-3">
						{tiers.map((t) => (
							<div key={t.rate} className="rounded-2xl bg-white/10 px-4 py-3 text-center dark:bg-neutral-100">
								<p className="text-2xl font-bold tabular-nums sm:text-3xl">{t.rate}%</p>
								<p className="mt-0.5 text-xs text-white/60 dark:text-neutral-500">{t.to ? `${t.from}–${t.to}` : `${t.from}+`} bookings</p>
							</div>
						))}
					</div>
				</div>
			</section>

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
						placeholder="Search email or website"
						className="h-11 w-full rounded-full border-0 bg-neutral-100 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
					/>
				</label>
			</div>

			{loadError && <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{loadError}</p>}

			<ul className="mt-5 space-y-2.5">
				{shown.map((r) => (
					<li key={r.id} className="flex flex-col gap-4 rounded-3xl p-5 ring-1 ring-neutral-200 transition hover:ring-neutral-400 sm:flex-row sm:items-center dark:ring-neutral-800">
						<button type="button" onClick={() => setOpen({ row: r, status: r.status })} className="flex min-w-0 flex-1 items-center gap-4 text-left">
							<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-neutral-100 text-base font-bold uppercase dark:bg-neutral-900">{r.email[0]}</span>
							<span className="min-w-0">
								<span className="block truncate font-semibold">{r.email}</span>
								<span className="mt-0.5 block truncate text-sm text-neutral-500">
									{[r.website, `Asked ${date(r.created_at)}`, r.locale].filter(Boolean).join(' · ')}
								</span>
							</span>
						</button>
						<div className="flex flex-wrap items-center gap-2 sm:justify-end">
							<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE[r.status][1]}`}>{BADGE[r.status][0]}</span>
							{r.status === 'approved' && r.code && (
								<span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 font-mono text-xs font-semibold text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
									<Link2 className="h-3 w-3" />
									{r.code}
								</span>
							)}
							{stats[r.id] && stats[r.id].balance > 0 && (
								<span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
									{euros(stats[r.id].balance)} due
								</span>
							)}
							<span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">{commission(r)}</span>
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
					<Handshake className="mx-auto h-8 w-8 text-neutral-400" />
					<p className="mt-3 font-semibold">{query ? 'Nothing matches your search' : filter === 'pending' ? 'No requests to review' : 'No requests here yet'}</p>
					<p className="mt-1 text-sm text-neutral-500">New requests from the affiliates page show up here.</p>
				</div>
			)}

			<Editor current={open} stats={open ? stats[open.row.id] : undefined} tiers={tiers} onClose={() => setOpen(null)} onSaved={saved} onRemoved={removed} />

			<Transition show={inviting} as={Fragment}>
				<Dialog className="relative z-50" onClose={() => setInviting(false)}>
					<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
						<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
					</Transition.Child>
					<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
						<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="translate-y-8 opacity-0" enterTo="translate-y-0 opacity-100" leave="ease-in duration-150" leaveFrom="translate-y-0 opacity-100" leaveTo="translate-y-8 opacity-0">
							<Dialog.Panel className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 text-neutral-950 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8 dark:bg-neutral-900 dark:text-white">
								<div className="flex items-start justify-between gap-4">
									<div>
										<Dialog.Title className="text-2xl font-bold tracking-tight">Send invitation</Dialog.Title>
										<p className="mt-1 text-sm text-neutral-500">They get a personal link: one tap to accept and they have their affiliate link.</p>
									</div>
									<button type="button" onClick={() => setInviting(false)} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700">
										<X className="h-4 w-4" />
									</button>
								</div>
								<div className="mt-6">
									<InviteForm
										heading={false}
										disabled={!emailReady}
										onSent={(count) => {
											setInviting(false)
											notify(`Invitation sent to ${count} ${count === 1 ? 'person' : 'people'}`)
										}}
									/>
								</div>
								{!emailReady && <p className="mt-3 text-sm text-amber-700">Emails can&apos;t be sent until the SMTP login (SMTP_HOST, SMTP_USER, SMTP_PASS) is set.</p>}
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

type OnSaved = (row: Affiliate, message: string, stats?: Stats) => void
type OnRemoved = (row: Affiliate) => void

function Editor({
	current,
	stats,
	tiers,
	onClose,
	onSaved,
	onRemoved,
}: {
	current: { row: Affiliate; status: Status } | null
	stats?: Stats
	tiers: Tier[]
	onClose: () => void
	onSaved: OnSaved
	onRemoved: OnRemoved
}) {
	return (
		<Transition show={!!current} as={Fragment}>
			<Dialog className="relative z-50" onClose={onClose}>
				<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
					<div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
				</Transition.Child>
				<div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
					<Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="translate-y-8 opacity-0" enterTo="translate-y-0 opacity-100" leave="ease-in duration-150" leaveFrom="translate-y-0 opacity-100" leaveTo="translate-y-8 opacity-0">
						<Dialog.Panel className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 text-neutral-950 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8 dark:bg-neutral-900 dark:text-white">
							{current && <EditorForm key={current.row.id + current.status} {...current} stats={stats} tiers={tiers} onClose={onClose} onSaved={onSaved} onRemoved={onRemoved} />}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}

function EditorForm({
	row,
	status: initialStatus,
	stats,
	tiers,
	onClose,
	onSaved,
	onRemoved,
}: {
	row: Affiliate
	status: Status
	stats?: Stats
	tiers: Tier[]
	onClose: () => void
	onSaved: OnSaved
	onRemoved: OnRemoved
}) {
	const [code, setCode] = useState(row.code ?? '')
	const [confirmRemove, setConfirmRemove] = useState(false)
	const [status, setStatus] = useState<Status>(initialStatus)
	const [custom, setCustom] = useState(row.rate !== null)
	const [rate, setRate] = useState(row.rate === null ? String(tiers[0].rate) : String(Number(row.rate)))
	const [note, setNote] = useState(row.note ?? '')
	const statusChanged = status !== row.status
	const [notify, setNotify] = useState(true)
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')

	const rateNumber = Number(rate)
	const rateValid = !custom || (rate.trim() !== '' && Number.isFinite(rateNumber) && rateNumber >= 0 && rateNumber <= 100)

	async function save() {
		if (!rateValid) return setError('The commission must be between 0 and 100%.')
		setBusy(true)
		setError('')
		try {
			const res = await fetch('/api/admin/affiliates', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: row.id, status, rate: custom ? rateNumber : null, note, code: code.trim() || undefined, notify: statusChanged && status !== 'pending' && notify }),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data.error || 'Could not save. Please try again.')
			const verb = data.affiliate.status === 'approved' ? 'accepted' : data.affiliate.status === 'declined' ? 'declined' : 'saved'
			onSaved(data.affiliate, `${row.email} ${statusChanged ? verb : 'saved'}${data.emailed ? ', email sent' : ''}`)
		} catch (e: any) {
			setError(e.message)
			setBusy(false)
		}
	}

	async function remove() {
		setBusy(true)
		setError('')
		try {
			const res = await fetch('/api/admin/affiliates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: row.id }) })
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
					<Dialog.Title className="truncate text-2xl font-bold tracking-tight">{row.email}</Dialog.Title>
					<p className="mt-1 text-sm text-neutral-500">
						Asked {date(row.created_at)}
						{row.decided_at && row.status !== 'pending' && ` · ${BADGE[row.status][0]} ${date(row.decided_at)}`}
					</p>
				</div>
				<button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-800">
					<X className="h-4 w-4" />
				</button>
			</div>

			{row.website && (
				<a href={site(row.website)} target="_blank" rel="noopener noreferrer nofollow" className="mt-4 inline-flex max-w-full items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium dark:bg-neutral-800">
					<span className="truncate">{row.website}</span>
					<ExternalLink className="h-3.5 w-3.5 shrink-0" />
				</a>
			)}

			{stats && row.status === 'approved' && <Earnings row={row} stats={stats} onSaved={onSaved} />}

			<p className="mt-7 text-sm font-semibold">Decision</p>
			<div className="mt-2 flex gap-2">
				<button type="button" onClick={() => setStatus('approved')} className={choice(status === 'approved')}>Accept</button>
				<button type="button" onClick={() => setStatus('declined')} className={choice(status === 'declined')}>Decline</button>
				<button type="button" onClick={() => setStatus('pending')} className={choice(status === 'pending')}>Later</button>
			</div>

			<p className="mt-7 text-sm font-semibold">Commission</p>
			<div className="mt-2 flex gap-2">
				<button type="button" onClick={() => setCustom(false)} className={choice(!custom)}>
					Standard <span className="font-normal opacity-70">{tierRange(tiers)}</span>
				</button>
				<button type="button" onClick={() => setCustom(true)} className={choice(custom)}>
					Custom
				</button>
			</div>
			{custom ? (
				<label className="relative mt-3 block">
					<span className="sr-only">Commission in percent</span>
					<input
						type="number"
						inputMode="decimal"
						min={0}
						max={100}
						step={0.5}
						value={rate}
						onChange={(e) => setRate(e.target.value)}
						autoFocus
						className={`h-14 w-full rounded-2xl border-0 bg-neutral-100 px-4 pr-12 text-2xl font-bold tabular-nums focus:outline-none focus:ring-2 dark:bg-neutral-800 ${rateValid ? 'focus:ring-neutral-950 dark:focus:ring-white' : 'ring-2 ring-red-500'}`}
					/>
					<Percent className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
				</label>
			) : (
				<p className="mt-3 text-sm text-neutral-500">
					{tiers.map((t) => `${t.rate}% from ${t.from} booking${t.from > 1 ? 's' : ''}`).join(' · ')}
				</p>
			)}

			{status === 'approved' && (
				<label className="mt-7 block">
					<span className="text-sm font-semibold">Link code</span>
					<span className="relative mt-2 flex items-center">
						<span className="pointer-events-none absolute left-4 font-mono text-sm text-neutral-400">?ref=</span>
						<input
							value={code}
							onChange={(e) => setCode(cleanCode(e.target.value))}
							maxLength={CODE_MAX}
							placeholder={row.code ? '' : 'Made automatically'}
							className="h-12 w-full rounded-2xl border-0 bg-neutral-100 pl-16 pr-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-800 dark:focus:ring-white"
						/>
					</span>
					<span className="mt-1.5 block text-xs text-neutral-500">Anything you like, e.g. their Instagram name: letters, digits, dots, underscores and dashes (3 to 30). Changing it stops old links from counting.</span>
				</label>
			)}

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

			{statusChanged && status !== 'pending' && (
				<label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-800">
					<input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="mt-0.5 h-5 w-5 rounded" style={{ accentColor: '#0a0a0a' }} />
					<span className="text-sm">
						<span className="block font-semibold">Email {row.email}</span>
						<span className="text-neutral-500">{status === 'approved' ? 'Tell them they’re in, with their commission.' : 'Tell them politely it’s a no for now.'}</span>
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
						<p className="text-sm font-semibold text-red-800 dark:text-red-200">Remove {row.email}?</p>
						<p className="mt-1 text-sm text-red-700/80 dark:text-red-300/80">Their link stops counting, and their clicks and booking credits are deleted. Payouts you recorded are kept. This can&apos;t be undone.</p>
						<div className="mt-3 flex gap-2">
							<button type="button" onClick={() => setConfirmRemove(false)} disabled={busy} className="h-10 flex-1 rounded-full bg-white text-sm font-semibold ring-1 ring-red-200 dark:bg-transparent dark:ring-red-800">
								Keep
							</button>
							<button type="button" onClick={remove} disabled={busy} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
								{busy && <Loader2 className="h-4 w-4 animate-spin" />}
								Remove
							</button>
						</div>
					</div>
				) : (
					<button type="button" onClick={() => setConfirmRemove(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400">
						<Trash2 className="h-4 w-4" />
						Remove affiliate
					</button>
				)}
			</div>
		</>
	)
}

/** Accepted affiliate: what they earned, and recording a payout */
function Earnings({ row, stats, onSaved }: { row: Affiliate; stats: Stats; onSaved: OnSaved }) {
	const [amount, setAmount] = useState(stats.balance > 0 ? String(stats.balance) : '')
	const [note, setNote] = useState('')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')

	async function pay() {
		setBusy(true)
		setError('')
		try {
			const res = await fetch('/api/admin/affiliates/payouts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ affiliateId: row.id, amount: Number(amount), note }),
			})
			const data = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(data.error || 'Could not save the payout.')
			onSaved(row, `Payout of ${euros(Number(amount))} recorded for ${row.email}`, data.stats)
		} catch (e: any) {
			setError(e.message)
			setBusy(false)
		}
	}

	const numbers: [string, string][] = [
		['Clicks', String(stats.clicks)],
		['Bookings', String(stats.bookings)],
		['Earned', euros(stats.earned)],
		['Trips ahead', euros(stats.upcoming)],
		['Paid out', euros(stats.paidOut)],
		['Balance', euros(stats.balance)],
	]

	return (
		<div className="mt-6 rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-800">
			<dl className="grid grid-cols-3 gap-x-3 gap-y-4">
				{numbers.map(([label, value]) => (
					<div key={label}>
						<dt className="text-xs text-neutral-500">{label}</dt>
						<dd className="mt-0.5 font-bold tabular-nums">{value}</dd>
					</div>
				))}
			</dl>
			<p className="mt-4 text-xs text-neutral-500">Commissions count as soon as a booking is paid. &ldquo;Trips ahead&rdquo; is the part for trips not taken yet: if one is cancelled, its commission goes away.</p>
			<div className="mt-4 flex gap-2">
				<label className="relative w-32 shrink-0">
					<span className="sr-only">Amount paid in euros</span>
					<span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">€</span>
					<input
						type="number"
						inputMode="decimal"
						min={0}
						step={0.01}
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder="0.00"
						className="h-11 w-full rounded-full border-0 bg-white pl-8 pr-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
					/>
				</label>
				<input
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder="Reference (PayPal, bank…)"
					maxLength={200}
					className="h-11 min-w-0 flex-1 rounded-full border-0 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
				/>
			</div>
			<button
				type="button"
				onClick={pay}
				disabled={busy || !(Number(amount) > 0)}
				className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
			>
				{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
				Record payout
			</button>
			<p className="mt-2 text-xs text-neutral-500">Send the money by PayPal or bank first; this keeps the record and lowers their balance.</p>
			{error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">{error}</p>}
		</div>
	)
}
