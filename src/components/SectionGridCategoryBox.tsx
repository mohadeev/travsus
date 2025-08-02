'use client'
import CardCategoryBox1 from '@/components/CardCategoryBox1'
import Heading, { HeadingSkeleton } from '@/shared/Heading'
import { TaxonomyType } from '@/data/types'
import React, { useEffect, useState } from 'react'
import { getFamoustCitiesArround } from '@/utils/getFamoustCitiesArround'
import ContainerCardCategoryBox1Skeleton from './ContainerCardCategoryBox1Skeleton'
import { useTranslations } from '@/lib/i18n'

export interface SectionGridCategoryBoxProps {
	categories?: TaxonomyType[]
	headingCenter?: boolean
	categoryCardType?: 'card1'
	className?: string
	gridClassName?: string
}

const DEMO_CATS: TaxonomyType[] = [
	// ... (omitted for brevity)
]

const SectionGridCategoryBox: React.FC<SectionGridCategoryBoxProps> = ({
	categories = DEMO_CATS,
	categoryCardType = 'card1',
	headingCenter = true,
	className = '',
	gridClassName = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}) => {
	const t = useTranslations("components_SectionGridCategoryBox");
	const [newCatecories, setNewCatecories] = useState([])
	let CardComponentName = CardCategoryBox1
	switch (categoryCardType) {
		case 'card1':
			CardComponentName = CardCategoryBox1
			break

		default:
			CardComponentName = CardCategoryBox1
	}
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// ... (omitted for brevity)
	}, [])

	return (
		<div className={`nc-SectionGridCategoryBox relative ${className}`}>
			{loading ? (
				<HeadingSkeleton isCenter={headingCenter} />
			) : (
				<Heading
					desc={t('components_SectionGridCategoryBox_Discover_Great_Places')}
					isCenter={headingCenter}
				>
					{t('components_SectionGridCategoryBox_Explore_Nearby')}
				</Heading>
			)}
			newCatecories{newCatecories?.length}
			<div className={`grid ${gridClassName} gap-5 sm:gap-6 md:gap-8`}>
				{newCatecories?.map((item, i) => (
					<CardComponentName key={i} taxonomy={item} />
				))}
				{loading && <ContainerCardCategoryBox1Skeleton />}
			</div>
		</div>
	)
}

export default SectionGridCategoryBox