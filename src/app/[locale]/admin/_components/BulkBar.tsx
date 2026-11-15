'use client'
// Bulk accept / decline for request lists (affiliates, agencies): a row
// checkbox, a "select all shown" checkbox, and a bar at the bottom of the
// screen with Accept / Decline for everything selected. Requests are saved
// one after another through the same PATCH endpoint the single editor uses,
// so codes, decision dates and emails work exactly as they do one by one.
import { useState } from 'react'
import { Check, Loader2, X } from 'lucide-react'

export type Decision = 'approved' | 'declined'

export function RowCheck({ checked, onChange, label }: { checked: boolean; onChange: (on: boolean) => void; label: string }) {
	return (
		<label className="grid h-11 w-8 shrink-0 cursor-pointer place-items-center" onClick={(e) => e.stopPropagation()}>
			<input type="checkbox" aria-label={label} checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 cursor-pointer rounded" style={{ accentColor: '#0a0a0a' }} />
		</label>
	)
}

export function SelectAll({ ids, selected, onChange }: { ids: string[]; selected: Set<string>; onChange: (next: Set<string>) => void }) {
	if (!ids.length) return null
	const all = ids.every((id) => selected.has(id))
	const some = !all && ids.some((id) => selected.has(id))
	return (
		<label className="mt-5 flex w-fit cursor-pointer items-center gap-3 pl-5 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
			<input
				type="checkbox"
				checked={all}
				ref={(el) => {
					if (el) el.indeterminate = some
				}}
				onChange={() => {
					const next = new Set(selected)
					for (const id of ids) all ? next.delete(id) : next.add(id)
					onChange(next)
				}}
				className="h-5 w-5 cursor-pointer rounded"
				style={{ accentColor: '#0a0a0a' }}
			/>
			{all ? 'Unselect all' : `Select all ${ids.length} shown`}
		</label>
	)
}

/**
 * Saves `decision` for each id with `save` (one request at a time) and reports
 * how many worked. `save` returns the updated row, or throws with a message.
 */
export function BulkBar<R>({
	count,
	emailReady,
	onClear,
	save,
	onDone,
}: {
	count: number
	emailReady: boolean
	onClear: () => void
	save: (decision: Decision, notify: boolean) => AsyncGenerator<{ ok: true; row: R; emailed: boolean } | { ok: false; error: string }>
	onDone: (rows: R[], message: string) => void
}) {
	const [notify, setNotify] = useState(true)
	const [busy, setBusy] = useState<Decision | null>(null)
	const [progress, setProgress] = useState(0)
	const [confirm, setConfirm] = useState<Decision | null>(null)
	const [error, setError] = useState('')
	if (!count) return null

	async function run(decision: Decision) {
		setConfirm(null)
		setBusy(decision)
		setProgress(0)
		setError('')
		const rows: R[] = []
		const errors: string[] = []
		let emailed = 0
		for await (const result of save(decision, notify)) {
			if (result.ok) {
				rows.push(result.row)
				if (result.emailed) emailed++
			} else errors.push(result.error)
			setProgress((p) => p + 1)
		}
		setBusy(null)
		const verb = decision === 'approved' ? 'accepted' : 'declined'
		const message = `${rows.length} ${verb}${emailed ? `, ${emailed} ${emailed === 1 ? 'email' : 'emails'} sent` : ''}`
		if (errors.length) setError(`${errors.length} could not be saved: ${errors[0]}`)
		onDone(rows, message)
	}

	return (
		<div className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 sm:bottom-6">
			<div className="w-full max-w-2xl rounded-3xl bg-neutral-950 p-4 text-white shadow-2xl dark:bg-white dark:text-ink">
				<div className="flex flex-wrap items-center gap-3">
					<p className="text-sm font-semibold tabular-nums">{busy ? `Saving ${Math.min(progress + 1, count)} of ${count}…` : `${count} selected`}</p>
					<button type="button" onClick={onClear} disabled={!!busy} className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white disabled:opacity-50 dark:text-neutral-500 dark:hover:text-ink">
						<X className="h-3.5 w-3.5" />
						Clear
					</button>
					<span className="ml-auto flex gap-2">
						<button
							type="button"
							disabled={!!busy}
							onClick={() => setConfirm('declined')}
							className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold ring-1 ring-white/30 transition hover:ring-white disabled:opacity-50 dark:ring-neutral-300 dark:hover:ring-neutral-950"
						>
							{busy === 'declined' && <Loader2 className="h-4 w-4 animate-spin" />}
							Decline
						</button>
						<button
							type="button"
							disabled={!!busy}
							onClick={() => setConfirm('approved')}
							className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-ink transition hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800"
						>
							{busy === 'approved' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
							Accept
						</button>
					</span>
				</div>

				{confirm && (
					<div className="mt-3 rounded-2xl bg-white/10 p-4 dark:bg-neutral-100">
						<p className="text-sm font-semibold">
							{confirm === 'approved' ? 'Accept' : 'Decline'} {count} {count === 1 ? 'request' : 'requests'}?
						</p>
						{confirm === 'approved' ? (
							<label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-white/80 dark:text-neutral-600">
								<input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4 rounded" style={{ accentColor: '#10b981' }} />
								Email each of them that they&apos;re in
								{!emailReady && ' (email isn’t set up yet)'}
							</label>
						) : (
							<p className="mt-1 text-sm text-white/70 dark:text-neutral-600">
								Each one gets the standard polite “no for now” email
								{!emailReady && ' (once email is set up)'}.
							</p>
						)}
						<div className="mt-3 flex gap-2">
							<button type="button" onClick={() => setConfirm(null)} className="h-10 flex-1 rounded-full text-sm font-semibold ring-1 ring-white/30 dark:ring-neutral-300">
								Cancel
							</button>
							<button type="button" onClick={() => run(confirm)} className="h-10 flex-[2] rounded-full bg-white text-sm font-semibold text-ink dark:bg-neutral-950 dark:text-white">
								Yes, {confirm === 'approved' ? 'accept' : 'decline'} {count}
							</button>
						</div>
					</div>
				)}

				{error && <p className="mt-3 rounded-2xl bg-red-500/20 px-3 py-2 text-sm text-red-100 dark:bg-red-50 dark:text-red-700">{error}</p>}
			</div>
		</div>
	)
}
