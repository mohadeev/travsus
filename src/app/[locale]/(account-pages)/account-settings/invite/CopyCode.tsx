'use client'
// Your referral code with Copy and Share (phone share sheet when available).
import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function CopyCode({ code, shareText }: { code: string; shareText: string }) {
	const t = useTranslations('Account')
	const [copied, setCopied] = useState(false)

	const copy = async () => {
		await navigator.clipboard?.writeText(code).catch(() => {})
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}
	const share = async () => {
		const text = `${shareText} ${window.location.origin}`
		if (navigator.share) await navigator.share({ text }).catch(() => {})
		else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
	}

	return (
		<div className="flex flex-col gap-3 sm:flex-row">
			<div className="flex h-14 flex-1 items-center justify-between gap-3 rounded-full bg-white pl-6 pr-2 dark:bg-neutral-950">
				<span className="truncate font-mono text-lg font-bold tracking-wider">{code}</span>
				<button type="button" onClick={copy} className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-neutral-100 px-4 text-sm font-semibold transition hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800">
					{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
					{copied ? t('copied') : t('copy')}
				</button>
			</div>
			<button type="button" onClick={share} className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
				<Share2 className="h-4 w-4" />
				{t('share')}
			</button>
		</div>
	)
}
