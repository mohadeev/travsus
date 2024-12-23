import { Metadata } from 'next'
import ClientHomePage from './ClientHomePage'

export const metadata: Metadata = {
	title:
		'Travsus - Luxury Travel Experiences | Expert Travel Planning & Exclusive Perks',
	description:
		'Experience the journey of a lifetime with Travsus. Discover expert travel planning, exclusive perks, and stress-free luxury adventures. Book your unforgettable journey today.',
	keywords: [
		'luxury travel',
		'expert travel planning',
		'exclusive travel perks',
		'luxury adventures',
		'stress-free travel',
		'premium travel experiences',
		'personalized journeys',
		'luxury accommodations',
		'VIP travel services',
		'global destinations',
	],
	openGraph: {
		type: 'website',
		title: 'Travsus - Your Journey, You Deserve the Best',
		description:
			'Experience luxury travel with expert planning, exclusive perks, and stress-free adventures. Unlock a world of premium experiences with Travsus.',
		url: 'https://www.travsus.com',
		siteName: 'Travsus',
		images: [
			{
				url: '/hero-image.jpg',
				width: 1200,
				height: 630,
				alt: 'Travsus Luxury Travel Experiences',
			},
			{
				url: '/features-image.jpg',
				width: 800,
				height: 800,
				alt: 'Travsus Premium Services',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		site: '@travsus',
		creator: '@travsus',
		title: 'Travsus - Luxury Travel Experiences',
		description:
			'Expert travel planning with exclusive perks and stress-free adventures.',
		images: ['/hero-image.jpg'],
	},
	alternates: {
		canonical: 'https://www.travsus.com',
		languages: {
			'en-US': 'https://www.travsus.com/en-US',
			'fr-FR': 'https://www.travsus.com/fr-FR',
			'ar-AE': 'https://www.travsus.com/ar-AE',
		},
	},
}

export default function Home() {
	return <ClientHomePage />
}
