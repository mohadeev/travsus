import { Metadata } from 'next'
import ClientHomePage from './ClientHomePage'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('TourPageMetadata')

	return {
		title: t('title'),
		description: t('description'),
		keywords: [
			t('guided_tours'),
			t('best_travel_experiences'),
			t('private_tours'),
			t('group_tours'),
			t('adventure_tours'),
			t('cultural_tours'),
			t('sightseeing_trips'),
			t('historical_tours'),
			t('nature_excursions'),
			t('vip_travel_experiences'),
			t('custom_travel_packages'),
		],
		openGraph: {
			type: 'website',
			title: t('openGraph_title'),
			description: t('openGraph_description'),
			url: 'https://www.travsus.com',
			siteName: 'Travsus',
			images: [
				{
					url: 'https://res.cloudinary.com/travsus/image/upload/v1740585144/xvqum5xjt3pkqhmff9rb.jpg',
					width: 1200,
					height: 630,
					alt: t('openGraph_image1_alt'),
				},
				{
					url: 'https://res.cloudinary.com/travsus/image/upload/v1740585036/r2vftjk08n7urzo15vbi.jpg',
					width: 800,
					height: 800,
					alt: t('openGraph_image2_alt'),
				},
			],
		},
		alternates: {
			canonical: 'https://www.travsus.com',
		},
		structuredData: {
			'@context': 'https://schema.org',
			'@type': 'TourOperator',
			name: 'Travsus',
			url: 'https://www.travsus.com',
			logo: 'https://res.cloudinary.com/travsus/image/upload/v1741705203/unnamed_12_bwhvkl.png',
			description: t('structuredData_description'),
			telephone: '+34 614 52 04 61',
			email: 'contact@travsus.com',
			address: {
				'@type': 'PostalAddress',
				streetAddress: 'Unit 1A Heatherview Business Park Athlone Road #8144',
				addressLocality: 'Longford',
				addressRegion: 'Co Longford',
				postalCode: 'N39KD82',
				addressCountry: 'Ireland',
			},
			sameAs: ['https://www.instagram.com/travsusofficial/'],
			openingHours: '24/7',
			priceRange: '$$',
			geo: {
				'@type': 'GeoCoordinates',
				latitude: '53.727',
				longitude: '-7.793',
			},
			contactPoint: {
				'@type': 'ContactPoint',
				telephone: '+34 614 52 04 61',
				email: 'contact@travsus.com',
				contactType: 'customer service',
			},
		},
	}
}

export default function Home() {
	return <ClientHomePage />
}
