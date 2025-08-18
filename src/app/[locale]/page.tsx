import { Metadata } from 'next'
import ClientHomePage from './ClientHomePage'
import {getTranslations} from 'next-intl/server';


export const metadata: Metadata = {
	title: 'Travsus - Your Ultimate Tour Provider',
	description:
		'Book exclusive guided tours with Travsus. Explore top destinations with expert guides, seamless planning, and unforgettable experiences.',
	keywords: [
		'guided tours',
		'best travel experiences',
		'private tours',
		'group tours',
		'adventure tours',
		'cultural tours',
		'sightseeing trips',
		'historical tours',
		'nature excursions',
		'VIP travel experiences',
		'custom travel packages',
	],
	openGraph: {
		type: 'website',
		title: 'Travsus - Book Exclusive Guided Tours',
		description:
			'Join expert-led tours for a seamless and unforgettable travel experience. Discover cultural, adventure, and sightseeing tours with Travsus.',
		url: 'https://www.travsus.com',
		siteName: 'Travsus',
		images: [
			{
				url: 'https://res.cloudinary.com/travsus/image/upload/v1740585144/xvqum5xjt3pkqhmff9rb.jpg',
				width: 1200,
				height: 630,
				alt: 'Travsus - Expert Guided Tours',
			},
			{
				url: 'https://res.cloudinary.com/travsus/image/upload/v1740585036/r2vftjk08n7urzo15vbi.jpg',
				width: 800,
				height: 800,
				alt: 'Travsus - Personalized Travel Experiences',
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
		description:
			'Book expertly guided tours and personalized travel experiences with Travsus. Explore top destinations with confidence.',
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

export default function Home() {
	return <ClientHomePage />
}
