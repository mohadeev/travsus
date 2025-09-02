'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from '@/lib/i18n'

const ReadMore = ({ description }: any) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const t = useTranslations('ReadMore')

	const truncateText = (text: string, charLimit: number) => {
		if (!text) return ''
		if (text.length <= charLimit) return text

		// Find the last space within the character limit
		const truncated = text.substring(0, charLimit)
		const lastSpaceIndex = truncated.lastIndexOf(' ')

		// If we found a space, cut there; otherwise use the original limit
		if (lastSpaceIndex > charLimit * 0.8) {
			// Only use word boundary if it's not too short
			return text.substring(0, lastSpaceIndex)
		}

		return truncated
	}

	// Toggle expanded/collapsed state
	const toggleReadMore = () => {
		setIsExpanded(!isExpanded)
	}

	// If no description is provided, return empty div
	if (!description) return <div></div>

	return (
		<div className="relative max-w-3xl">
			<p className="text-sm leading-relaxed text-black md:text-base">
				{isExpanded ? (
					<>
						{description}{' '}
						<span
							onClick={toggleReadMore}
							className="ml-1 inline-flex cursor-pointer items-center text-sm font-medium text-black md:text-base"
						>
							{t('read_less')}{' '}
							<ChevronUp className="ml-1 h-4 w-4 md:h-5 md:w-5" />
						</span>
					</>
				) : (
					<>
						{truncateText(description, 200)}
						<span className="inline">...</span>{' '}
						<span
							onClick={toggleReadMore}
							className="ml-1 inline-flex cursor-pointer items-center rounded-sm bg-white/50 px-2 py-0.5 text-sm font-medium text-black shadow-[0_0_10px_5px_rgba(255,255,255,0.9)] backdrop-blur-sm md:text-base"
						>
							{t('read_more')}{' '}
							<ChevronDown className="ml-1 h-4 w-4 md:h-5 md:w-5" />
						</span>
					</>
				)}
			</p>
		</div>
	)
}

export default ReadMore
