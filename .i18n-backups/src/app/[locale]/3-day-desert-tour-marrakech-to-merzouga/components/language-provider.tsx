'use client'

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Language = 'en' | 'es' | 'it' | 'pt' | 'zh' | 'eu'

interface LanguageContextType {
	language: Language
	setLanguage: (lang: Language) => void
	t: (key: string) => string
	getLocalizedHref: (path: string) => string
}

const translations = {
	en: {
		// Header
		'nav.home': 'Home',
		'nav.itinerary': 'Itinerary',
		'nav.pricing': 'Pricing',
		'nav.faq': 'FAQ',
		'nav.contact': 'Contact',
		'nav.book': 'Book Now',

		// Hero
		'hero.title': '3-Day Desert Tour: Marrakech to Merzouga',
		'hero.subtitle':
			'Experience the magic of the Sahara desert with our expert guides',
		'hero.cta': 'Book Now',
		'hero.price': '80€ per person',

		// Overview
		'overview.title': 'Tour Overview',
		'overview.description':
			'Join us on an unforgettable 3-day journey from the vibrant city of Marrakech to the majestic sand dunes of Merzouga. Travel through the spectacular High Atlas Mountains, visit ancient kasbahs, and experience the breathtaking Sahara Desert with a camel trek and overnight stay in a traditional Berber camp.',
		'overview.highlights': 'Tour Highlights',

		// Itinerary
		'itinerary.title': 'Your 3-Day Adventure',
		'itinerary.day1.title': 'Day 1: Marrakech to Dades Valley',
		'itinerary.day1.description':
			"Begin your journey from Marrakech, crossing the High Atlas Mountains via the Tizi n'Tichka pass with spectacular views. Visit the UNESCO World Heritage site of Ait Ben Haddou Kasbah and continue to Ouarzazate, known as the 'Hollywood of Morocco'. Drive through the Valley of Roses and end your day in the stunning Dades Valley.",
		'itinerary.day2.title': 'Day 2: Dades Valley to Merzouga Desert',
		'itinerary.day2.description':
			'After breakfast, travel through Todra Gorge with its impressive 300m high cliffs. Continue to Erfoud, famous for its fossil crafts, and finally reach the golden dunes of Merzouga. Enjoy a camel trek to watch the sunset over the Sahara before spending the night in a traditional desert camp under the stars.',
		'itinerary.day3.title': 'Day 3: Merzouga to Marrakech',
		'itinerary.day3.description':
			'Wake up early to enjoy the magnificent sunrise over the dunes. Return by camel to Merzouga and begin your journey back to Marrakech, taking an alternative route to experience different landscapes. Arrive in Marrakech in the evening, with memories to last a lifetime.',

		// Pricing
		'pricing.title': 'Tour Pricing',
		'pricing.private': 'Private Tour',
		'pricing.shared': 'Shared Tour',
		'pricing.persons': 'Persons',
		'pricing.privatePerPersonLabel':
			'Private: €25 in Merzouga + €25 in Dades + €450 for transport',
		'pricing.sharedPerPersonLabel':
			'Shared: €25 in Merzouga + €25 in Dades + €30 per person for transport',
		'pricing.calculateButton': 'Calculate Price',
		'pricing.perPerson': 'per person',
		'pricing.total': 'Total',

		// FAQ
		'faq.title': 'Frequently Asked Questions',
		'faq.q1': 'What should I bring on this tour?',
		'faq.a1':
			'We recommend bringing sunscreen, hat, sunglasses, comfortable shoes, warm clothes for night (desert gets cold), camera, and personal medications. A small backpack for the overnight in the desert is useful.',
		'faq.q2': 'Is this tour suitable for children?',
		'faq.a2':
			'Yes, this tour is suitable for children. However, for very young children, please contact us in advance to discuss arrangements.',
		'faq.q3': 'What type of accommodation is provided?',
		'faq.a3':
			"In Dades Valley, you'll stay in a comfortable hotel/guesthouse. In Merzouga, you'll experience a traditional desert camp with private tents, beds, and shared bathroom facilities.",
		'faq.q4': 'Are meals included?',
		'faq.a4':
			'Yes, the tour includes breakfast and dinner each day. Lunch is not included and will be at your own expense at local restaurants during the journey.',
		'faq.q5': 'How much walking/physical activity is involved?',
		'faq.a5':
			'This tour involves a moderate amount of walking, including on sand dunes. The camel trek is approximately 1 hour each way. If you have mobility issues, please contact us to discuss options.',

		// Booking CTA
		'booking.title': 'Ready for an Unforgettable Desert Adventure?',
		'booking.subtitle': 'Book your 3-day Marrakech to Merzouga tour today',
		'booking.button': 'Book Now',

		// Gallery
		'gallery.title': 'Tour Gallery',
		'gallery.subtitle':
			'Preview the breathtaking landscapes and experiences of our 3-day Morocco tour',

		// Footer
		'footer.rights': 'All rights reserved',
		'footer.terms': 'Terms & Conditions',
		'footer.privacy': 'Privacy Policy',
		'footer.contact': 'Contact Us',
	},
	es: {
		// Header
		'nav.home': 'Inicio',
		'nav.itinerary': 'Itinerario',
		'nav.pricing': 'Precios',
		'nav.faq': 'Preguntas',
		'nav.contact': 'Contacto',
		'nav.book': 'Reservar Ahora',

		// Hero
		'hero.title': 'Tour de 3 Días por el Desierto: Marrakech a Merzouga',
		'hero.subtitle':
			'Experimenta la magia del desierto del Sahara con nuestros guías expertos',
		'hero.cta': 'Reservar Ahora',
		'hero.price': '80€ por persona',

		// Overview
		'overview.title': 'Descripción del Tour',
		'overview.description':
			'Únete a nosotros en un inolvidable viaje de 3 días desde la vibrante ciudad de Marrakech hasta las majestuosas dunas de arena de Merzouga. Viaja a través de las espectaculares Montañas del Alto Atlas, visita antiguas kasbah y experimenta el impresionante desierto del Sahara con un paseo en camello y una noche en un campamento tradicional bereber.',
		'overview.highlights': 'Destacados del Tour',

		// Itinerary
		'itinerary.title': 'Tu Aventura de 3 Días',
		'itinerary.day1.title': 'Día 1: Marrakech al Valle de Dades',
		'itinerary.day1.description':
			'Comienza tu viaje desde Marrakech, cruzando las Montañas del Alto Atlas...',
		'itinerary.day2.title': 'Día 2: Valle de Dades al Desierto de Merzouga',
		'itinerary.day2.description':
			'Después del desayuno, viaja a través de la Garganta del Todra...',
		'itinerary.day3.title': 'Día 3: Merzouga a Marrakech',
		'itinerary.day3.description':
			'Despierta temprano para disfrutar de la magnífica salida del sol sobre las dunas...',

		// Pricing
		'pricing.title': 'Precios del Tour',
		'pricing.private': 'Tour Privado',
		'pricing.shared': 'Tour Compartido',
		'pricing.persons': 'Personas',
		'pricing.privatePerPersonLabel':
			'Privado: €25 en Merzouga + €25 en Dades + €450 para transporte',
		'pricing.sharedPerPersonLabel':
			'Compartido: €25 en Merzouga + €25 en Dades + €30 por persona para transporte',
		'pricing.calculateButton': 'Calcular Precio',
		'pricing.perPerson': 'por persona',
		'pricing.total': 'Total',

		// FAQ
		'faq.title': 'Preguntas Frecuentes',
		'faq.q1': '¿Qué debo llevar a este tour?',
		'faq.a1':
			'Recomendamos traer protector solar, sombrero, gafas de sol, zapatos cómodos...',

		// Gallery
		'gallery.title': 'Galería del Tour',
		'gallery.subtitle':
			'Vista previa de los impresionantes paisajes y experiencias de nuestro tour de 3 días por Marruecos',

		// Booking CTA
		'booking.title': '¿Listo para una Aventura Inolvidable en el Desierto?',
		'booking.subtitle': 'Reserva hoy tu tour de 3 días de Marrakech a Merzouga',
		'booking.button': 'Reservar Ahora',
	},
	it: {
		// Italian translations
		'nav.home': 'Home',
		'nav.itinerary': 'Itinerario',
		'nav.pricing': 'Prezzi',
		'nav.faq': 'FAQ',
		'nav.contact': 'Contatto',
		'nav.book': 'Prenota Ora',
		'hero.title': 'Tour di 3 Giorni nel Deserto: da Marrakech a Merzouga',
		'hero.subtitle':
			'Vivi la magia del deserto del Sahara con le nostre guide esperte',
		'hero.cta': 'Prenota Ora',
		'hero.price': '80€ a persona',
		'gallery.title': 'Galleria del Tour',
		'gallery.subtitle':
			'Anteprima dei paesaggi mozzafiato e delle esperienze del nostro tour di 3 giorni in Marocco',
		// More Italian translations would go here
	},
	pt: {
		// Portuguese translations
		'nav.home': 'Início',
		'nav.itinerary': 'Itinerário',
		'nav.pricing': 'Preços',
		'nav.faq': 'Perguntas',
		'nav.contact': 'Contato',
		'nav.book': 'Reserve Agora',
		'hero.title': 'Tour de 3 Dias pelo Deserto: Marrakech a Merzouga',
		'hero.subtitle':
			'Experimente a magia do deserto do Saara com nossos guias especializados',
		'hero.cta': 'Reserve Agora',
		'hero.price': '80€ por pessoa',
		'gallery.title': 'Galeria do Tour',
		'gallery.subtitle':
			'Visualize as paisagens deslumbrantes e experiências do nosso tour de 3 dias pelo Marrocos',
		// More Portuguese translations would go here
	},
	zh: {
		// Chinese translations
		'nav.home': '首页',
		'nav.itinerary': '行程',
		'nav.pricing': '价格',
		'nav.faq': '常见问题',
		'nav.contact': '联系我们',
		'nav.book': '立即预订',
		'hero.title': '3天沙漠之旅：马拉喀什到梅尔祖卡',
		'hero.subtitle': '与我们的专业向导一起体验撒哈拉沙漠的魔力',
		'hero.cta': '立即预订',
		'hero.price': '每人80€',
		'gallery.title': '旅游图库',
		'gallery.subtitle': '预览我们3天摩洛哥之旅的壮丽景观和体验',
		// More Chinese translations would go here
	},
	eu: {
		// Euskera/Basque translations
		'nav.home': 'Hasiera',
		'nav.itinerary': 'Ibilbidea',
		'nav.pricing': 'Prezioak',
		'nav.faq': 'Galderak',
		'nav.contact': 'Kontaktua',
		'nav.book': 'Erreserbatu Orain',
		'hero.title': '3 Eguneko Basamortu Ibilbidea: Marrakech-etik Merzouga-ra',
		'hero.subtitle':
			'Bizi ezazu Sahara basamortuaren magia gure gidari adituekin',
		'hero.cta': 'Erreserbatu Orain',
		'hero.price': '80€ pertsonako',
		'gallery.title': 'Ibilbidearen Galeria',
		'gallery.subtitle':
			'Gure 3 eguneko Maroko ibilbidearen paisaia zoragarrien eta esperientzien aurreikuspena',
		// More Euskera translations would go here
	},
}

const LanguageContext = createContext<LanguageContextType>({
	language: 'en-US',
	setLanguage: () => {},
	t: (key: string) => key,
	getLocalizedHref: (path: string) => path,
})

export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	const [language, setLanguageState] = useState<Language>('en')
	const router = useRouter()
	const searchParams = useSearchParams()

	// Extract language from URL query parameter on initial load
	useEffect(() => {
		const langParam = searchParams.get('lang')
		if (langParam && ['en', 'es', 'it', 'pt', 'zh', 'eu'].includes(langParam)) {
			setLanguageState(langParam as Language)
		}
	}, [searchParams])

	// Function to set language and update URL query parameter
	const setLanguage = (lang: Language) => {
		setLanguageState(lang)

		// Create a new URL with the updated language parameter
		const url = new URL(window.location.href)
		url.searchParams.set('lang', lang)

		// Use window.history to update the URL without a full page reload
		window.history.pushState({}, '', url.toString())
	}

	// Function to get a URL with the current language parameter
	const getLocalizedHref = (path: string): string => {
		// Handle paths with hash fragments
		const [basePath, hash] = path.split('#')

		// Process the base path (before any hash)
		let newPath = basePath

		// If path already has query parameters
		if (newPath.includes('?')) {
			// Check if it already has a lang parameter
			if (newPath.includes('lang=')) {
				// Replace the existing lang parameter
				newPath = newPath.replace(/lang=[^&]+/, `lang=${language}`)
			} else {
				// Add the lang parameter
				newPath = `${newPath}&lang=${language}`
			}
		} else {
			// Add the lang parameter as the first query parameter
			newPath = `${newPath}?lang=${language}`
		}

		// Reattach the hash fragment if it exists
		if (hash) {
			newPath = `${newPath}#${hash}`
		}

		return newPath
	}

	const t = (key: string): string => {
		return (
			translations[language][
				key as keyof (typeof translations)[typeof language]
			] || key
		)
	}

	return (
		<LanguageContext.Provider
			value={{ language, setLanguage, t, getLocalizedHref }}
		>
			{children}
		</LanguageContext.Provider>
	)
}
