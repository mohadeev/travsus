'use client'
// For accepted affiliates on a tour page: their personal link to this tour
// (?ref=CODE), with copy and share. The code is also added to the address bar,
// so copying the URL or using any share button keeps it.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Copy, Handshake, Share2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

// One request per page load, shared by every bar on the page
let me: Promise<string | null> | null = null
const myCode = () =>
	(me ??= fetch('/api/affiliates/me', { cache: 'no-store' })
		.then((r) => r.json())
		.then((d) => (typeof d.code === 'string' ? d.code : null))
		.catch(() => null))

export default function AffiliateShareBar({ title }: { title?: string }) {
	const t = useTranslations('AffiliateShare')
	const locale = useLocale()
	const [link, setLink] = useState('')
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		let alive = true
		myCode().then((code) => {
			if (!alive || !code) return
			const url = new URL(window.location.href)
			if (url.searchParams.get('ref') !== code) {
				url.searchParams.set('ref', code)
				window.history.replaceState(window.history.state, '', url)
			}
			setLink(`${url.origin}${url.pathname}?ref=${code}`)
		})
		return () => {
			alive = false
		}
	}, [])

	if (!link) return null

	const copy = async () => {
		await navigator.clipboard.writeText(link).catch(() => {})
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}
	const share = () => navigator.share?.({ title, url: link }).catch(() => {})

	return (
		<div className="mt-4 flex flex-col gap-3 rounded-3xl bg-neutral-950 p-4 text-white sm:flex-row sm:items-center sm:p-3 sm:pl-5 dark:bg-white dark:text-neutral-950">
			<div className="flex min-w-0 flex-1 items-center gap-3">
				<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 dark:bg-neutral-100">
					<Handshake className="h-[18px] w-[18px]" />
				</span>
				<div className="min-w-0">
					<p className="text-sm font-semibold">
						{t('label')}{' '}
						<Link href={`/${locale}/account-affiliate` as any} className="font-normal text-white/60 underline-offset-4 hover:underline dark:text-neutral-500">
							{t('earnings')}
						</Link>
					</p>
					<p className="truncate font-mono text-xs text-white/70 dark:text-neutral-600" title={link}>
						{link.replace(/^https?:\/\//, '')}
					</p>
				</div>
			</div>
			<div className="flex shrink-0 gap-2">
				<button
					type="button"
					onClick={copy}
					className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 sm:flex-none dark:bg-neutral-950 dark:text-white"
				>
					{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
					{copied ? t('copied') : t('copy')}
				</button>
				{typeof navigator !== 'undefined' && 'share' in navigator && (
					<button
						type="button"
						onClick={share}
						aria-label={t('share')}
						className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20 dark:bg-neutral-100 dark:hover:bg-neutral-200"
					>
						<Share2 className="h-4 w-4" />
					</button>
				)}
			</div>
		</div>
	)
}
