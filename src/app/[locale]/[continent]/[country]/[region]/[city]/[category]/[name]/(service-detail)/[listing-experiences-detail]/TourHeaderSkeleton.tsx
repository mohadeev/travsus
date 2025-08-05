'use client'

import { useTranslations } from '@/lib/i18n'
import { ChevronDown, ChevronRight } from 'lucide-react'

const TourHeaderSkeleton = () => {
	const t = useTranslations('Jan03_TourHeader_x9k2')

	return (
		<div className={`nc-ListingExperiencesDetailPage animate-pulse`}>
			<div>
				<div className="mt-2 flex flex-col px-0 py-2 text-xs md:mt-4 md:flex-row md:items-center md:justify-between md:px-0">
					<div className="mb-1 flex items-center md:mb-0">
						<div className="h-3 w-20 rounded bg-neutral-200"></div>
						<ChevronRight className="mx-1 h-2.5 w-2.5 text-neutral-300" />
						<div className="flex items-center gap-1">
							<div className="h-3 w-16 rounded bg-neutral-200"></div>
							<ChevronRight className="mx-1 h-2.5 w-2.5 text-neutral-300" />
							<div className="h-3 w-24 rounded bg-neutral-200"></div>
							<ChevronDown className="ml-1 h-2.5 w-2.5 text-neutral-300" />
						</div>
					</div>
					<div className="text-neutral-300">
						<div className="h-3 w-32 rounded bg-neutral-200"></div>
					</div>
				</div>
			</div>

			{/* Title and Like/Save Button Section */}
			<div className="mb-4 flex flex-col items-start gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
				<div className="h-8 w-80 rounded bg-neutral-200 md:h-10"></div>
				<div className="flex items-center">
					<div className="h-10 w-10 rounded-full bg-neutral-200 md:h-12 md:w-12"></div>
				</div>
			</div>
		</div>
	)
}

export default TourHeaderSkeleton
