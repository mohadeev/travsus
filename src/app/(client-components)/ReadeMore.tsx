'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from '@/lib/i18n'

// Texts shorter than this are shown in full without a toggle
const COLLAPSE_AFTER_CHARS = 200

/**
 * Long text with a "Read more" toggle. The full text is always in the HTML
 * (collapsed with CSS), so search engines and AI crawlers can read all of it.
 */
const ReadMore = ({ description }: { description?: string }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const t = useTranslations('ReadMore')

	if (!description) return null

	const collapsible = description.length > COLLAPSE_AFTER_CHARS

	return (
		<div className="relative max-w-3xl">
			<p
				className={`whitespace-pre-line text-sm leading-relaxed text-black md:text-base ${
					collapsible && !isExpanded ? 'line-clamp-4' : ''
				}`}
			>
				{description}
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
