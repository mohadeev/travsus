'use client'
// Share an article: copy the link, WhatsApp, X, Facebook.
import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ShareButtons({ title }: { title: string }) {
	const t = useTranslations('Blog')
	const [copied, setCopied] = useState(false)
	const url = () => window.location.href.split('?')[0]
	const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer,width=640,height=560')

	const button =
		'inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-neutral-100 px-4 text-sm font-semibold transition hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800'

	return (
		<div className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0" aria-label={t('share')}>
			<button
				type="button"
				className={button}
				onClick={async () => {
					await navigator.clipboard?.writeText(url()).catch(() => {})
					setCopied(true)
					setTimeout(() => setCopied(false), 2000)
				}}
			>
				{copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
				{copied ? t('copied') : t('copy_link')}
			</button>
			<button type="button" className={button} onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url()}`)}`)}>
				WhatsApp
			</button>
			<button type="button" className={button} onClick={() => open(`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url())}`)}>
				X
			</button>
			<button type="button" className={button} onClick={() => open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`)}>
				Facebook
			</button>
		</div>
	)
}
