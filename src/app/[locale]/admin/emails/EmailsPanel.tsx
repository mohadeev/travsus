'use client'
// Email gallery: every email grouped by topic, a live preview (computer or
// phone width), who gets it, when, from which address, and a test send.
import { useMemo, useState } from 'react'
import { Check, FileText, Loader2, Mail, Monitor, Send, Smartphone, X } from 'lucide-react'

type Email = { id: string; name: string; category: string; to: string; from: string; when: string; connected: boolean; pdf: boolean; subject: string; html: string }
const ORDER = ['Account', 'Bookings', 'Payments', 'Newsletter', 'Affiliates', 'Team']

export default function EmailsPanel({ emails, brevo, mailrelay, owner }: { emails: Email[]; brevo: boolean; mailrelay: boolean; owner: string }) {
	const [selected, setSelected] = useState(emails[0]?.id)
	const [width, setWidth] = useState<'desktop' | 'phone'>('desktop')
	const [sending, setSending] = useState(false)
	const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
	const email = emails.find((e) => e.id === selected) ?? emails[0]

	const groups = useMemo(() => ORDER.map((c) => [c, emails.filter((e) => e.category === c)] as const).filter(([, list]) => list.length), [emails])

	async function sendTest() {
		setSending(true)
		setResult(null)
		try {
			const res = await fetch('/api/admin/emails/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: email.id }) })
			const data = await res.json().catch(() => ({}))
			setResult(res.ok ? { ok: true, text: `Sent to ${owner}` } : { ok: false, text: data.error || 'Could not send' })
		} catch {
			setResult({ ok: false, text: 'Could not send' })
		}
		setSending(false)
	}

	return (
		<div className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 dark:text-white">
			<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">TRAVSUS</p>
			<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Emails</h1>
			<p className="mt-2 text-lg text-neutral-500">Every email the site sends, how it looks and when it goes out.</p>

			{/* Providers */}
			<div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
				{[
					['Brevo', 'Account, booking and team emails · free up to 300 a day', brevo, 'BREVO_API_KEY'],
					['MailRelay', 'Newsletter subscribers and campaigns · free up to 80,000 a month', mailrelay, 'MAILRELAY_ACCOUNT, MAILRELAY_API_KEY'],
				].map(([name, text, ok, env]) => (
					<div key={name as string} className="flex items-start gap-4 rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
						<span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${ok ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-neutral-950'}`}>{ok ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}</span>
						<div className="min-w-0">
							<p className="font-semibold">
								{name} <span className={`ml-1 text-xs font-semibold ${ok ? 'text-emerald-600' : 'text-amber-600'}`}>{ok ? 'Connected' : 'Not set up'}</span>
							</p>
							<p className="text-sm text-neutral-500">{text as string}</p>
							{!ok && <p className="mt-1 text-xs text-neutral-500">Add {env as string} in Vercel and .env.local.</p>}
						</div>
					</div>
				))}
			</div>

			<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
				{/* List */}
				<nav aria-label="Emails" className="min-w-0">
					<div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:block lg:space-y-6 lg:overflow-visible lg:px-0">
						{groups.map(([category, list]) => (
							<div key={category} className="contents lg:block">
								<p className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 lg:block">{category}</p>
								{list.map((e) => (
									<button
										key={e.id}
										type="button"
										onClick={() => {
											setSelected(e.id)
											setResult(null)
										}}
										className={`flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm font-semibold transition lg:w-full lg:rounded-2xl lg:py-3 ${
											e.id === email.id ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 hover:bg-neutral-200 lg:bg-transparent lg:hover:bg-neutral-100 dark:bg-neutral-900 lg:dark:bg-transparent dark:hover:bg-neutral-800'
										}`}
									>
										<span className={`h-2 w-2 shrink-0 rounded-full ${e.connected ? 'bg-emerald-500' : 'bg-neutral-300'}`} title={e.connected ? 'Sent automatically' : 'Not sent yet'} />
										<span className="truncate">{e.name}</span>
									</button>
								))}
							</div>
						))}
					</div>
				</nav>

				{/* Selected email */}
				<section className="min-w-0">
					<div className="rounded-[28px] p-5 ring-1 ring-neutral-200 sm:p-6 dark:ring-neutral-800">
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div className="min-w-0">
								<p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
									{email.category} · to {email.to.toLowerCase()}
								</p>
								<h2 className="mt-1 text-2xl font-bold tracking-tight">{email.name}</h2>
							</div>
							<span className={`rounded-full px-3 py-1 text-xs font-semibold ${email.connected ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
								{email.connected ? 'Sent automatically' : 'Designed, not sent yet'}
							</span>
						</div>
						<dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-[110px_minmax(0,1fr)]">
							<dt className="text-neutral-500">Subject</dt>
							<dd className="font-semibold">{email.subject}</dd>
							<dt className="text-neutral-500">From</dt>
							<dd className="break-all">{email.from}</dd>
							<dt className="text-neutral-500">When</dt>
							<dd>{email.when}</dd>
							{email.pdf && (
								<>
									<dt className="text-neutral-500">Attachment</dt>
									<dd>
										<a href="/api/admin/emails/pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-4">
											<FileText className="h-4 w-4" />
											Booking confirmation & invoice (PDF)
										</a>
									</dd>
								</>
							)}
						</dl>
						<div className="mt-5 flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={sendTest}
								disabled={sending || !brevo}
								className="inline-flex h-11 items-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-40 dark:bg-white dark:text-neutral-950"
							>
								{sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
								Send me a test
							</button>
							<div className="ml-auto flex rounded-full bg-neutral-100 p-1 dark:bg-neutral-900">
								{(
									[
										['desktop', Monitor, 'Computer'],
										['phone', Smartphone, 'Phone'],
									] as const
								).map(([key, Icon, label]) => (
									<button
										key={key}
										type="button"
										onClick={() => setWidth(key)}
										aria-label={label}
										className={`grid h-9 w-11 place-items-center rounded-full transition ${width === key ? 'bg-white shadow-sm dark:bg-neutral-800' : 'text-neutral-500'}`}
									>
										<Icon className="h-4 w-4" />
									</button>
								))}
							</div>
						</div>
						{result && <p className={`mt-3 text-sm font-medium ${result.ok ? 'text-emerald-600' : 'text-red-600'}`}>{result.text}</p>}
						{!brevo && <p className="mt-3 text-sm text-amber-700">Emails can&apos;t be sent until BREVO_API_KEY is set.</p>}
					</div>

					{/* Preview, like an inbox */}
					<div className="mt-4 overflow-hidden rounded-[28px] bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
						<div className="flex items-center gap-3 border-b border-neutral-200 bg-white px-5 py-3 dark:border-neutral-800 dark:bg-neutral-950">
							<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950">
								<Mail className="h-4 w-4" />
							</span>
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold">{email.subject}</p>
								<p className="truncate text-xs text-neutral-500">{email.from}</p>
							</div>
						</div>
						<div className="flex justify-center p-3 sm:p-6">
							<iframe
								key={email.id + width}
								title={`Preview: ${email.name}`}
								srcDoc={email.html}
								sandbox=""
								className={`h-[760px] rounded-2xl bg-white shadow-sm transition-all ${width === 'phone' ? 'w-[375px] max-w-full' : 'w-full'}`}
							/>
						</div>
					</div>
				</section>
			</div>
		</div>
	)
}
