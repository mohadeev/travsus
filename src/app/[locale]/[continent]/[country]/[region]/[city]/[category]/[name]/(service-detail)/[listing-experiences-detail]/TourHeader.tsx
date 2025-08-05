'use client'

import { useTranslations } from '@/lib/i18n'
import LikeSaveBtns from '@/components/LikeSaveBtns'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import TourHeaderSkeleton from './TourHeaderSkeleton'

const TourHeader = () => {
	const t = useTranslations('Jan03_TourHeader_x9k2')
	const {
		name: title,
		region,
		start,
		id,
		images,
		overview,
		reviews,
		days,
		liked,
		startAddress,
		endAddress,
		faq,
		inclusions,
		loading, // Add this to your Redux state to control loading
	}: any = useSelector((state: any) => state.creatingServiceSlice.service)

	const city = startAddress?.city

	// Show skeleton while loading or if essential data is missing
	if (loading || !title || !city) {
		return <TourHeaderSkeleton />
	}

	return (
		<div className={`nc-ListingExperiencesDetailPage`}>
			<div>
				<div className="mt-2 flex flex-col px-0 py-2 text-xs md:mt-4 md:flex-row md:items-center md:justify-between md:px-0">
					<div className="mb-1 flex items-center md:mb-0">
						<Link href="/" className="text-black hover:underline">
							{t('Brand_Name')}
						</Link>
						<ChevronRight className="mx-1 h-2.5 w-2.5 text-black" />
						<Link
							href="#"
							className="flex items-center text-black hover:underline"
						>
							{city}
							<ChevronRight className="mx-1 h-2.5 w-2.5 text-black" />
							{title}
							<ChevronDown className="ml-1 h-2.5 w-2.5" />
						</Link>
					</div>
					<div className="text-black">
						<span>{t('Plan_Trip_Guide', { city })}</span>
					</div>
				</div>
			</div>

			{/* Changed from flex-row to flex-col on mobile, md:flex-row on tablet and up */}
			<div className="mb-4 flex flex-col items-start gap-3 md:mb-6 md:flex-row md:items-center md:justify-between">
				<h1 className="text-3xl font-extrabold text-black md:text-4xl">
					{title}
				</h1>
				<div className="flex items-center">
					<LikeSaveBtns
						className="flex h-10 w-10 items-center justify-center rounded-full border border-black hover:bg-gray-50 md:h-12 md:w-12"
						liked={liked}
					/>
				</div>
			</div>
		</div>
	)
}

export default TourHeader
