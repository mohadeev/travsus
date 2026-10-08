'use client'

import { JsonLd } from 'react-schemaorg'
import { useTranslations } from '@/lib/i18n'

const SITE_URL = 'https://www.travsus.com'

// SEO schema.org data for the home page (not visible on screen)
export default function HomeStructuredData() {
	const t = useTranslations('app_locale_ClientHomePage')

	const service = (name: string, description: string) => ({
		'@type': 'Offer',
		itemOffered: {
			'@type': 'Service',
			name: t(name),
			description: t(description),
		},
	})

	return (
		<>
			<JsonLd<any>
				item={{
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: 'Travsus',
					url: SITE_URL,
					logo: `${SITE_URL}/logo.png`,
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
					url: SITE_URL,
					potentialAction: {
						'@type': 'SearchAction',
						target: {
							'@type': 'EntryPoint',
							urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
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
					url: SITE_URL,
					description: t('app_locale_ClientHomePage_Expert_Travel_Planning'),
					areaServed: t('app_locale_ClientHomePage_Worldwide'),
					hasOfferCatalog: {
						'@type': 'OfferCatalog',
						name: t('app_locale_ClientHomePage_Travel_Services'),
						itemListElement: [
							service(
								'app_locale_ClientHomePage_Expert_Travel_Planning',
								'app_locale_ClientHomePage_Personalized_Travel_Planning',
							),
							service(
								'app_locale_ClientHomePage_Luxury_Accommodations',
								'app_locale_ClientHomePage_Premium_Hotels',
							),
							service(
								'app_locale_ClientHomePage_VIP_Services',
								'app_locale_ClientHomePage_Exclusive_Perks',
							),
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
		</>
	)
}
