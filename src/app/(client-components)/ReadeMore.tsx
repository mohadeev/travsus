'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from '@/lib/i18n'
import LinkedText from '@/components/text/LinkedText'

// Texts shorter than this are shown in full without a toggle
const COLLAPSE_AFTER_CHARS = 200

/**
 * Long text with a "Read more" toggle. The full text is always in the HTML
 * (collapsed with CSS), so search engines and AI crawlers can read all of it.
 */
const ReadMore = ({ description, inline = false }: { description?: string; inline?: boolean }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const t = useTranslations('ReadMore')

	if (!description) return null

	const collapsible = description.length > COLLAPSE_AFTER_CHARS

	// TripAdvisor style: 3 lines, the last one fading into "...Read more"
	if (inline) {
		const closed = collapsible && !isExpanded
		return (
			<div className="relative">
				<p className={`whitespace-pre-line text-base leading-7 text-ink-soft dark:text-neutral-300 ${closed ? 'line-clamp-3' : ''}`}>
					<LinkedText text={description} />
				</p>
				{closed ? (
					<button
						type="button"
						onClick={() => setIsExpanded(true)}
						aria-expanded={false}
						className="absolute bottom-0 right-0 bg-gradient-to-r from-transparent via-white via-25% to-white pl-10 text-base leading-7 text-ink dark:via-neutral-950 dark:to-neutral-950 dark:text-white"
					>
						...<span className="font-medium underline underline-offset-2">{t('read_more')}</span>
					</button>
				) : (
					collapsible && (
						<button type="button" onClick={() => setIsExpanded(false)} aria-expanded className="mt-1 text-base font-medium text-ink underline underline-offset-2 dark:text-white">
							{t('read_less')}
						</button>
					)
				)}
			</div>
		)
	}

	return (
		<div className="relative max-w-3xl">
			<p
				className={`whitespace-pre-line text-sm leading-relaxed text-black md:text-base ${
					collapsible && !isExpanded ? 'line-clamp-4' : ''
				}`}
			>
				<LinkedText text={description} />
			</p>
			{collapsible && (
				<button
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					aria-expanded={isExpanded}
					className="mt-1 inline-flex items-center text-sm font-medium text-black underline md:text-base"
				>
					{isExpanded ? t('read_less') : t('read_more')}
					{isExpanded ? (
						<ChevronUp className="ml-1 h-4 w-4 md:h-5 md:w-5" />
					) : (
						<ChevronDown className="ml-1 h-4 w-4 md:h-5 md:w-5" />
					)}
				</button>
			)}
		</div>
	)
}

export default ReadMore
