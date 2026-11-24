// Chosen main photos for destinations, used before the photo stored in the
// geography database (geo_countries / geo_cities). Add a country by its
// 2-letter code, a city by its English name in lower case.
// Photos are hosted on Cloudinary; credits as their licences require.
export type DestinationPhoto = { url: string; credit: { author: string; source: string; license: string } }

export const COUNTRY_PHOTOS: Record<string, DestinationPhoto> = {
	// Doha skyline over the Corniche (also the Doha city tour's main photo)
	QA: {
		url: 'https://res.cloudinary.com/travsus/image/upload/v1794866162/tours/5d4ae3fdd64f188d67501c34/c31mj4ab6vkvygpizyah.jpg',
		credit: { author: 'Zairon', source: 'https://commons.wikimedia.org/wiki/File:Doha_Corniche_Skyline_View_2.jpg', license: 'CC BY 4.0' },
	},
}

export const CITY_PHOTOS: Record<string, DestinationPhoto> = {
	// West Bay towers seen from the Corniche, framed by palms
	doha: {
		url: 'https://res.cloudinary.com/travsus/image/upload/v1794888066/tours/5d4ae3fdd64f188d67501c34/yf02fdzdymgkurfyxris.jpg',
		credit: { author: 'Zairon', source: 'https://commons.wikimedia.org/wiki/File:Doha_Corniche_Skyline_View_1.jpg', license: 'CC BY 4.0' },
	},
}

/** Countries where TRAVSUS sells tours today (2-letter codes); the others are shown as coming soon */
export const ACTIVE_COUNTRIES = ['MA', 'QA', 'AE', 'EG', 'TR', 'ES', 'IT', 'FR']

/** A tour is shown and bookable only in an active country (tours without a country code always are). */
export const isTourLive = (tour: { countryCode?: string | null } | null | undefined) =>
	!tour?.countryCode || ACTIVE_COUNTRIES.includes(String(tour.countryCode).toUpperCase())

export const countryPhoto = (code?: string | null) => (code ? COUNTRY_PHOTOS[code.toUpperCase()]?.url ?? null : null)
export const cityPhoto = (name?: string | null) => (name ? CITY_PHOTOS[name.trim().toLowerCase()]?.url ?? null : null)
