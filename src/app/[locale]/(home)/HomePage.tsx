'use client'

import ItemsCardList from '@/components/ItemsCardList'
import Testimonials from '@/components/Testimonials'
import { useTranslations } from '@/lib/i18n'
import BookNowBanner from './BookNowBanner'
import HomeHero from './HomeHero'
import HomeStructuredData from './HomeStructuredData'
import ReferralBanner from './ReferralBanner'

// Country whose cities are shown in "Popular Cities"
const POPULAR_CITIES_COUNTRY_ID = '67e120b734623c9e568da348'

/**
 * Home page layout. Each section is its own component in this folder —
 * reorder, add or remove sections below.
 */
export default function HomePage() {
	const t = useTranslations('app_locale_ClientHomePage')

	return (
		<>
			<HomeStructuredData />

			<main className="relative space-y-20 pb-24 lg:space-y-28">
				<HomeHero />

				<div className="container">
					<ItemsCardList locationType="tour" layout="row" />
				</div>

				<div className="container">
					<BookNowBanner />
				</div>

				<div className="container">
					<ItemsCardList
						locationType="city"
						countryId={POPULAR_CITIES_COUNTRY_ID}
						layout="row"
						heading={t('app_locale_ClientHomePage_Popular_Cities')}
					/>
				</div>

				<Testimonials />

				<div className="container">
					<ReferralBanner />
				</div>
			</main>
		</>
	)
}
