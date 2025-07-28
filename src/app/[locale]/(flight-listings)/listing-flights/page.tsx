import SectionHeroArchivePage from '@/app/(server-components)/SectionHeroArchivePage'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import SectionSliderNewCategories from '@/components/SectionSliderNewCategories'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import React, { FC } from 'react'
import SectionGridFilterCard from '../SectionGridFilterCard'
import { useTranslations } from 'next-intl'

export interface ListingFlightsPageProps {}

const ListingFlightsPage: FC<ListingFlightsPageProps> = ({}) => {
	const t = useTranslations('flightlistings_listingflights_page')
	return (
		<div className={`nc-ListingFlightsPage relative overflow-hidden`}>
			<BgGlassmorphism />

			<div className="container relative">
				{/* SECTION HERO */}
				<SectionHeroArchivePage
					currentPage={t('flightlistings_listingflights_page_Flights')}
					currentTab={t('flightlistings_listingflights_page_Flights')}
					listingType={
						<>
							<i className="las la-plane-departure text-2xl"></i>
							<span className="ml-2.5">
								{t('flightlistings_listingflights_page_Number_Of_Flights')}
							</span>
						</>
					}
					className="pb-24 pt-10 lg:pb-28 lg:pt-16"
				/>

				{/* SECTION */}
				{/* <SectionGridFilterCard className="pb-24 lg:pb-28" /> */}

				{/* SECTION 1 */}
				<SectionSliderNewCategories
					heading={t(
						'flightlistings_listingflights_page_Explore_Top_Destination',
					)}
					subHeading={t(
						'flightlistings_listingflights_page_Explore_Thousands_Of_Destinations',
					)}
					categoryCardType="card4"
					itemPerRow={4}
				/>

				{/* SECTION */}
				<SectionSubscribe2 className="py-24 lg:py-28" />
			</div>
		</div>
	)
}

export default ListingFlightsPage
