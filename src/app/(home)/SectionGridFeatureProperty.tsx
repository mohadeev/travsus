import React, { FC, ReactNode } from 'react'
import { DEMO_STAY_LISTINGS } from '@/data/listings'
import { StayDataType } from '@/data/types'
import ButtonPrimary from '@/shared/ButtonPrimary'
import PropertyCardH from '@/components/PropertyCardH'
import HeaderFilter from '@/components/HeaderFilter'

// OTHER DEMO WILL PASS PROPS
const DEMO_DATA: StayDataType[] = DEMO_STAY_LISTINGS.filter((_, i) => i < 8)
//
export interface SectionGridFeaturePropertyProps {
	stayListings?: StayDataType[]
	gridClass?: string
	heading?: ReactNode
	subHeading?: ReactNode
	headingIsCenter?: boolean
	tabs?: string[]
}

const SectionGridFeatureProperty: FC<SectionGridFeaturePropertyProps> = ({
	stayListings = DEMO_DATA,
	gridClass = '',
	heading = 'Featured places to stay',
	subHeading = 'Popular places to stay that Travsus recommends for you',
	headingIsCenter,
	tabs = ['New York', 'Tokyo', 'Paris', 'London'],
}) => {
	const renderCard = (stay: StayDataType, index: number) => {
		return <PropertyCardH key={index} className="h-full" data={stay} />
	}

	return (
		<div className="nc-SectionGridFeatureProperty relative">
			<HeaderFilter
				tabActive={'New York'}
				subHeading={subHeading}
				tabs={tabs}
				heading={heading}
			/>
			<div
				className={`grid grid-cols-1 gap-6 sm:grid-cols-1 md:gap-8 xl:grid-cols-2 ${gridClass}`}
			>
				{stayListings.map(renderCard)}
			</div>
			<div className="mt-16 flex items-center justify-center">
				<ButtonPrimary loading>Show me more</ButtonPrimary>
			</div>
		</div>
	)
}

export default SectionGridFeatureProperty
