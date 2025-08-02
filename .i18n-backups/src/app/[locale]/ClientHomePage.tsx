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

	const t = useTranslations('HomePage')

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
					description:
						'Premium travel experiences with expert planning and exclusive perks.',
					slogan: 'Your Journey, You Deserve the Best',
					award: [
						'Best Price Guarantee',
						'No Hidden Fees',
						'5-Star Service Quality',
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
					description:
						'Expert travel planning with luxury experiences and exclusive perks.',
					areaServed: 'Worldwide',
					hasOfferCatalog: {
						'@type': 'OfferCatalog',
						name: 'Travel Services',
						itemListElement: [
							{
								'@type': 'Offer',
								itemOffered: {
									'@type': 'Service',
									name: 'Expert Travel Planning',
									description: 'Personalized travel planning by experts',
								},
							},
							{
								'@type': 'Offer',
								itemOffered: {
									'@type': 'Service',
									name: 'Luxury Accommodations',
									description: 'Premium hotels and exclusive properties',
								},
							},
							{
								'@type': 'Offer',
								itemOffered: {
									'@type': 'Service',
									name: 'VIP Services',
									description: 'Exclusive perks and insider access',
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
				</div>
				<div className="container p-0 px-0">
					<ItemsCardList
						locationType="tour"
						heading="Popular Tours"
						subHeading="Discover exciting tours and experiences"
						currentPage={1}
						layout="row"
					/>

					{/* <SectionGridFeaturePlaces /> */}
					{/* <SectionGridFilterCard layout="row" /> */}
					<ItemsCardList locationType="country" layout="row" />
					<ItemsCardList
						locationType="city"
						countryId="67e120b734623c9e568da348"
						layout="row"
						heading="Popular Cities"
					/>
					<ItemsCardList
						locationType="place"
						cityId="67e120b734623c9e568da348"
						layout="row"
					/>
				</div>

				<SectionSubscribe2 />
			</main>
		</>
	)
}

export default ClientHomePage
