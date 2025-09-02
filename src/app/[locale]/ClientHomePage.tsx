'use client'
import React from 'react'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import SectionGridFilterCard from './(experience-listings)/SectionGridFilterCard'
import { JsonLd } from 'react-schemaorg'
import Home from './test/page'
import Roulette from '@/components/Roulette/Roulette'
import ItemsCardList from '@/components/ItemsCardList'
import SectionGridFeaturePlaces from '@/components/SectionGridFeaturePlaces'
import { useTranslations } from '@/lib/i18n'
import ExperiencesCard from '@/components/ExperiencesCard'
import TravelBanner from './TravelBanner'
import BannerHome from './BannerHome'
import TourCards from './TourCards'
import BookNowAndPayLaterBanner from './BookNowAndPayLaterBanner'
import Testimonials from '@/components/Testimonials'

function ClientHomePage() {
	const DUMMY_EXPERIENCE = {
		id: 'tour123',
		name: '3-Day Sahara Desert Adventure',
		images: [
			'/images/tours/sahara1.jpg',
			'/images/tours/sahara2.jpg',
			'/images/tours/sahara3.jpg',
		],
		address: {
			country: 'Morocco',
			city: 'Merzouga',
			street: 'Sahara Desert Road',
		},
		startAddress: {
			country: 'Morocco',
			city: 'Errachidia',
			street: 'Airport Pickup',
		},
		region: [
			{
				city: 'Merzouga',
				country: 'Morocco',
				location: {
					lat: 31.1001,
					lng: -4.0006,
				},
			},
		],
		start: {
			name: 'Errachidia',
			location: {
				lat: 31.9311,
				lng: -4.4245,
			},
		},
		liked: false,
		like: 14,
		saleOff: true,
		isAds: false,
		price: 300,
		reviewStart: 4.7,
		reviewCount: 83,
	}

	const t = useTranslations('app_locale_ClientHomePage')

	return (
		<>
			<JsonLd<any>
				item={{
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: 'Travsus',
					url: 'https://www.travsus.com',
					logo: 'https://www.travsus.com/logo.png',
					sameAs: [
						'https://www.facebook.com/travsus',
						'https://www.instagram.com/travsus',
						'https://www.twitter.com/travsus',
						'https://www.linkedin.com/company/travsus',
					],
					description: t(
						'app_locale_ClientHomePage_Premium_Travel_Experiences',
					),
					slogan: t('app_locale_ClientHomePage_Your_Journey_You_Deserve'),
					award: [
						t('app_locale_ClientHomePage_Best_Price_Guarantee'),
						t('app_locale_ClientHomePage_No_Hidden_Fees'),
						t('app_locale_ClientHomePage_5_Star_Service_Quality'),
					],
				}}
			/>
			<JsonLd<any>
				item={{
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: 'Travsus',
					url: 'https://www.travsus.com',
					potentialAction: {
						'@type': 'SearchAction',
						target: {
							'@type': 'EntryPoint',
							urlTemplate:
								'https://www.travsus.com/search?q={search_term_string}',
						},
						'query-input': 'required name=search_term_string',
					},
				}}
			/>
			<JsonLd<any>
				item={{
					'@context': 'https://schema.org',
					'@type': 'TravelAgency',
					name: 'Travsus',
					url: 'https://www.travsus.com',
					description: t('app_locale_ClientHomePage_Expert_Travel_Planning'),
					areaServed: t('app_locale_ClientHomePage_Worldwide'),
					hasOfferCatalog: {
						'@type': 'OfferCatalog',
						name: t('app_locale_ClientHomePage_Travel_Services'),
						itemListElement: [
							{
								'@type': 'Offer',
								itemOffered: {
									'@type': 'Service',
									name: t('app_locale_ClientHomePage_Expert_Travel_Planning'),
									description: t(
										'app_locale_ClientHomePage_Personalized_Travel_Planning',
									),
								},
							},
							{
								'@type': 'Offer',
								itemOffered: {
									'@type': 'Service',
									name: t('app_locale_ClientHomePage_Luxury_Accommodations'),
									description: t('app_locale_ClientHomePage_Premium_Hotels'),
								},
							},
							{
								'@type': 'Offer',
								itemOffered: {
									'@type': 'Service',
									name: t('app_locale_ClientHomePage_VIP_Services'),
									description: t('app_locale_ClientHomePage_Exclusive_Perks'),
								},
							},
						],
					},
					aggregateRating: {
						'@type': 'AggregateRating',
						ratingValue: '5',
						bestRating: '5',
						ratingCount: '1000',
					},
				}}
			/>
			<main className="nc-PageHome3 relative">
				<div className="mb-24 px-0 sm:px-0">
					<Home />
					{/* <TourCards /> */}
				</div>
				<div className="container p-0 px-0">
					{/* <SectionGridFeaturePlaces /> */}
					{/* <SectionGridFilterCard layout="row" /> */}
					<ItemsCardList locationType="tour" layout={'row'} />
					{/* <ItemsCardList locationType="country" layout="row" /> */}
				</div>
				<div className="lg:container">
					<BookNowAndPayLaterBanner />
				</div>
				<div className="container">
					<ItemsCardList
						locationType="city"
						countryId="67e120b734623c9e568da348"
						layout="row"
						heading={t('app_locale_ClientHomePage_Popular_Cities')}
					/>
					{/* <ItemsCardList
						locationType="place"
						cityId="67e5a961636b9ead6fb9b280"
						layout="row"
					/> */}
					{/* <TravelBanner /> */}

					{/* <BannerHome /> */}
				</div>
				<Testimonials />
				<div className="container">
					<ItemsCardList
						locationType="place"
						cityId="67e5a961636b9ead6fb9b280"
						layout="row"
					/>
					{/* <ItemsCardList
						locationType="city"
						// countryId={}
						layout="row"
						locationName={}
					/> */}
				</div>
				<SectionSubscribe2 />
			</main>
		</>
	)
}

export default ClientHomePage
