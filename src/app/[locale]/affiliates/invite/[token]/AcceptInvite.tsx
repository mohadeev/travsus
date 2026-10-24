'use client'
// The invitation's action: one tap accepts it and shows their link, then an
// invitation to create the account (with the invited email) that shows earnings.
import { useState } from 'react'
import Link from 'next/link'
import { useClerk } from '@clerk/nextjs'
import { ArrowUpRight, Check, Copy, Loader2, Share2, Sparkles, TrendingUp } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

type Props = { token: string; email: string; acceptedLink: string | null; signedIn: boolean; areaHref: string }

const arrow = (spinning = false) => (
	<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-white transition-transform group-hover:rotate-45">
		{spinning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
	</span>
)
/** "https://www.travsus.com/en-US?ref=k4x9qm" → "travsus.com/…?ref=k4x9qm" (the code stays visible on phones) */
const shortLink = (link: string) => {
	const url = new URL(link)
	return `${url.host.replace(/^www\./, '')}/…${url.search}`
}
const primary = 'group inline-flex h-12 w-full items-center justify-between gap-6 rounded-full bg-white pl-6 pr-1.5 text-[15px] font-semibold text-black transition hover:bg-amber-100 active:scale-[0.98] disabled:opacity-60'

export default function AcceptInvite({ token, email, acceptedLink, signedIn, areaHref }: Props) {
	const t = useTranslations('AffiliateInvite')
	const locale = useLocale()
	const { openSignUp, openSignIn } = useClerk()
	const [link, setLink] = useState(acceptedLink)
	const [sending, setSending] = useState(false)
	const [error, setError] = useState(false)
	const [copied, setCopied] = useState(false)

	async function accept() {
		setSending(true)
		setError(false)
		try {
			const res = await fetch('/api/affiliates/invite/accept', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, locale }) })
			const data = await res.json().catch(() => ({}))
			if (!res.ok || !data.link) throw new Error()
			setLink(data.link)
		} catch {
			setError(true)
		}
		setSending(false)
	}

	async function copy() {
		if (!link) return
		await navigator.clipboard?.writeText(link).catch(() => {})
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	async function share() {
		if (!link) return
		if (navigator.share) await navigator.share({ title: 'TRAVSUS', url: link }).catch(() => {})
		else copy()
	}

	if (!link) {
		return (
			<div>
				<button type="button" onClick={accept} disabled={sending} className={primary}>
					{t('accept')}
					{arrow(sending)}
				</button>
				<p className="mt-3 text-center text-sm text-white/50">{t('accept_note')}</p>
				{error && <p className="mt-2 text-center text-sm font-medium text-red-400">{t('error')}</p>}
			</div>
		)
	}

	// Their account page reads the earnings of the invited email
	const toArea = () => ({ forceRedirectUrl: `${window.location.origin}${areaHref}`, initialValues: { emailAddress: email } })

	return (
		<div>
			<div className="flex items-center gap-3">
				<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-400 text-black">
					<Check className="h-5 w-5" strokeWidth={3} />
				</span>
				<div>
					<p className="text-lg font-bold leading-tight">{t('accepted_title')}</p>
					<p className="text-sm text-white/60">{t('accepted_text')}</p>
				</div>
			</div>

			{/* Their link */}
			<p className="mt-7 text-[12px] font-medium uppercase tracking-[0.16em] text-white/50">{t('link_title')}</p>
			<div className="mt-2 flex items-center gap-2 rounded-full bg-white/10 p-1.5 pl-5 ring-1 ring-white/15">
				<span className="min-w-0 flex-1 truncate font-mono text-[14px] text-white/90">{shortLink(link)}</span>
				<button type="button" onClick={copy} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-amber-100 active:scale-95">
					{copied ? <Check className="h-4 w-4" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
					{copied ? t('copied') : t('copy')}
				</button>
			</div>
			<button type="button" onClick={share} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white">
				<Share2 className="h-4 w-4" />
				{t('share')}
			</button>
			<p className="mt-2 flex items-start gap-2 text-sm text-white/50">
				<Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
				{t('link_tip')}
			</p>

			{/* Earnings: needs an account with the invited email */}
			<div className="mt-8 rounded-3xl bg-white p-5 text-black sm:p-6">
				<div className="flex items-start gap-3">
					<span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-400">
						<TrendingUp className="h-5 w-5" strokeWidth={2.4} />
					</span>
					<div className="min-w-0">
						<p className="font-bold leading-snug">{t('earnings_title')}</p>
						<p className="mt-1 text-sm text-neutral-600">{t('earnings_text', { email })}</p>
					</div>
				</div>
				{signedIn ? (
					<Link href={areaHref as any} className="group mt-5 inline-flex h-12 w-full items-center justify-between gap-6 rounded-full bg-black pl-6 pr-1.5 text-[15px] font-semibold text-white transition hover:bg-neutral-800">
						{t('open_area')}
						<span className="grid h-9 w-9 place-items-center rounded-full bg-white text-black transition-transform group-hover:rotate-45">
							<ArrowUpRight className="h-4 w-4" />
						</span>
					</Link>
				) : (
					<div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
						<button type="button" onClick={() => openSignUp(toArea())} className="group inline-flex h-12 w-full items-center justify-between gap-6 rounded-full bg-black pl-6 pr-1.5 text-[15px] font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]">
							{t('sign_up')}
							<span className="grid h-9 w-9 place-items-center rounded-full bg-white text-black transition-transform group-hover:rotate-45">
								<ArrowUpRight className="h-4 w-4" />
							</span>
						</button>
						<button type="button" onClick={() => openSignIn(toArea())} className="h-12 rounded-full px-6 text-[15px] font-semibold text-neutral-700 ring-1 ring-neutral-300 transition hover:ring-neutral-950">
							{t('sign_in')}
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
