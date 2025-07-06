'use client'
import React from 'react'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import SectionGridFilterCard from './(experience-listings)/SectionGridFilterCard'
import { JsonLd } from 'react-schemaorg'
import Home from './test/page'
import Roulette from '@/components/Roulette/Roulette'
import ItemsCardList from '@/components/ItemsCardList'

function ClientHomePage() {
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
				{/* GLASSMOPHIN */}
				{/* <BgGlassmorphism /> */}
				{/* <SectionGridFilterCard className="pb-24 lg:pb-28" /> */}
				{/* SECTION HERO */}

				<div className="mb-24 px-0 sm:px-0">
					{/* <Roulette /> */}
					<Home />

					{/* <SectionHero3 className="" /> */}
				</div>
				<div className="container p-0 px-0">
					{/* SECTION 1 */}
					{/* <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 flex sm:col-span-6 lg:col-span-4">
              <CardCategory6 taxonomy={DEMO_CATS_2[0]} />
            </div>
            <div className="col-span-12 grid grid-rows-2 gap-6 sm:col-span-6 lg:col-span-4">
              <CardCategory6 taxonomy={DEMO_CATS_2[3]} />
              <CardCategory6 taxonomy={DEMO_CATS_2[1]} />
            </div>
            <div className="col-span-12 flex sm:col-span-6 lg:col-span-4">
              <CardCategory6 taxonomy={DEMO_CATS_2[4]} />
            </div>
          </div> */}
					{/* SECTION */}
					{/* <SectionGridCategoryBox /> */}

					{/* SECTION */}
					{/* <div className="relative py-16">
            <BackgroundSection />
            <SectionGridAuthorBox boxCard="box2" />
          </div> */}
					<ItemsCardList
						locationType="tour"
						heading="Popular Tours"
						// subHeading="Discover exciting tours and experiences"
						currentPage={1}
						layout="row"
					/>

					{/* <SectionGridFeaturePlaces /> */}
					{/* <SectionGridFilterCard layout="row" /> */}
					{/* 
					<ItemsCardList locationType="country" layout="row" />

					<ItemsCardList
						locationType="city"
						countryId="67e120b734623c9e568da348"
						layout="row"
						heading="Popular Cities"
					/> */}

					{/* <ItemsCardList
						locationType="place"
						cityId="67e120b734623c9e568da348"
						layout="row"
					/> */}
					{/* SECTION */}
					{/* <WellcomeTemplate /> */}
					{/* <VarticalExperiencesCard /> */}
					{/* <SectionGridVerticalCard /> */}
				</div>
				<SectionSubscribe2 />
			</main>
		</>
	)
}

export default ClientHomePage
