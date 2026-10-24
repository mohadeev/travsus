'use client'
// The affiliate invitation form (Admin → Emails and Admin → Affiliates): one or
// more addresses ("Name <email>" or plain, one per line) and an optional
// personal note, sent through /api/admin/emails/invite. Each person gets their
// own invitation link (src/lib/affiliateInvites.ts).
import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'

/** Send the affiliate invitation to one or more people, with an optional personal note. */
export default function InviteForm({ disabled = false, heading = true, onSent }: { disabled?: boolean; heading?: boolean; onSent?: (count: number) => void }) {
	const [recipients, setRecipients] = useState('')
	const [message, setMessage] = useState('')
	const [sending, setSending] = useState(false)
	const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
	const count = new Set(recipients.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.includes('@'))).size

	async function send() {
		setSending(true)
		setResult(null)
		try {
			const res = await fetch('/api/admin/emails/invite', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recipients, message }) })
			const data = await res.json().catch(() => ({}))
			if (!res.ok && !data.sent) setResult({ ok: false, text: data.error || 'Could not send' })
			else {
				const failed: { email: string }[] = data.failed ?? []
				setResult({ ok: !failed.length, text: `Invitation sent to ${data.sent} ${data.sent === 1 ? 'person' : 'people'}${failed.length ? ` · failed: ${failed.map((f) => f.email).join(', ')}` : ''}` })
				if (!failed.length) setRecipients('')
				if (data.sent) onSent?.(data.sent)
			}
		} catch {
			setResult({ ok: false, text: 'Could not send' })
		}
		setSending(false)
	}

	const field = 'w-full rounded-2xl bg-neutral-100 px-4 py-3 text-sm outline-none ring-1 ring-transparent transition placeholder:text-neutral-400 focus:bg-white focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:bg-neutral-950 dark:focus:ring-white'

	return (
		<div className={heading ? 'mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-800' : ''}>
			{heading && <h3 className="text-lg font-bold tracking-tight">Invite people</h3>}
			<p className={`${heading ? 'mt-1' : ''} text-sm text-neutral-500`}>One per line. Add a name to greet them by their first name: Sofia Martin &lt;sofia@example.com&gt;</p>
			<label className="mt-4 block">
				<span className="mb-1.5 block text-sm font-semibold">Email addresses</span>
				<textarea value={recipients} onChange={(e) => setRecipients(e.target.value)} rows={4} placeholder={'Sofia Martin <sofia@example.com>\ncreator@example.com'} className={field} />
			</label>
			<label className="mt-3 block">
				<span className="mb-1.5 block text-sm font-semibold">
					Personal note <span className="font-normal text-neutral-500">(optional)</span>
				</span>
				<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} maxLength={2000} placeholder="I love your travel videos about Morocco…" className={field} />
			</label>
			<div className="mt-4 flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={send}
					disabled={disabled || sending || !count}
					className="inline-flex h-11 items-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-40 dark:bg-white dark:text-neutral-950"
				>
					{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
					{count > 1 ? `Send ${count} invitations` : 'Send invitation'}
				</button>
				{result && <p className={`text-sm font-medium ${result.ok ? 'text-emerald-600' : 'text-red-600'}`}>{result.text}</p>}
			</div>
		</div>
	)
}
