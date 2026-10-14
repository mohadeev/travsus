'use client'
// The affiliate's link with a copy button.
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyLink({ link, copyLabel, copiedLabel }: { link: string; copyLabel: string; copiedLabel: string }) {
	const [copied, setCopied] = useState(false)
	const copy = async () => {
		await navigator.clipboard.writeText(link).catch(() => {})
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}
	return (
		<div className="flex flex-col gap-2 sm:flex-row">
			<p className="flex h-12 min-w-0 flex-1 items-center rounded-full bg-white/10 px-5 font-mono text-sm dark:bg-neutral-100">
				<span className="truncate">{link.replace(/^https?:\/\//, '')}</span>
			</p>
			<button
				type="button"
				onClick={copy}
				className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 dark:bg-neutral-950 dark:text-white"
			>
				{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
				{copied ? copiedLabel : copyLabel}
			</button>
		</div>
	)
}
