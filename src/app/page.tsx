// 'use client'
import React from 'react'
import SectionSubscribe2 from '@/components/SectionSubscribe2'
import BackgroundSection from '@/components/BackgroundSection'
import BgGlassmorphism from '@/components/BgGlassmorphism'
import { TaxonomyType } from '@/data/types'
import SectionGridAuthorBox from '@/components/SectionGridAuthorBox'
import SectionGridCategoryBox from '@/components/SectionGridCategoryBox'
import SectionHero3 from '@/app/(server-components)/SectionHero3'
import CardCategory6 from '@/components/CardCategory6'
import SectionGridFeaturePlaces from '@/components/SectionGridFeaturePlaces'
import SectionGridFilterCard from './(experience-listings)/SectionGridFilterCard'
import { headers } from 'next/headers'
import sendEmail from '@/utils/email/sendMail'
import VarticalExperiencesCard from '@/components/cards/VarticalExperiencesCard'
import { Metadata } from 'next'
import { JsonLd } from 'react-schemaorg'
import { getAppPaths } from '@/utils/getAppPaths'

// Detailed metadata only for homepage
export const metadata: Metadata = {
	title: 'Travsus - New Generation of Booking',
	description: 'Booking tax-free from platform. Keep calm & travel on.',
	keywords: [
		'Morocco travel',
		'global tours',
		'authentic experiences',
		'adventure travel',
		'cultural tours',
	],
	openGraph: {
		type: 'website',
		title: 'Travsus - New Generation of Booking',
		description: 'Booking tax-free from platform. Keep calm & travel on.',
		url: 'https://www.travsus.com',
		siteName: 'Travsus',
		images: [
			{
				url: '/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'Travsus - New Generation of Booking',
			},
		],
	},
}

async function PageHome3() {
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
						'https://www.instagram.com/travsusofficial',
						'https://www.twitter.com/travsus',
					],
					description:
						'New generation of booking. Booking tax-free from platform. Keep calm & travel on.',
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
			<main className="nc-PageHome3 relative overflow-hidden">
				{/* GLASSMOPHIN */}
				<BgGlassmorphism />
				{/* <SectionGridFilterCard className="pb-24 lg:pb-28" /> */}
				{/* SECTION HERO */}
				<div className="container mb-24 px-1 sm:px-4">
					<SectionHero3 className="" />
				</div>
				<div className="container relative mb-24 space-y-24">
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

					{/* <SectionGridFeaturePlaces /> */}
					<SectionGridFilterCard />

					{/* SECTION */}
					<SectionSubscribe2 />
					{/* <WellcomeTemplate /> */}
					{/* <VarticalExperiencesCard /> */}
					{/* <SectionGridVerticalCard /> */}
				</div>
			</main>
		</>
	)
}

export default PageHome3
