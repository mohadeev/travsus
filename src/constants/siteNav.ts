// Links in the mobile menu (categories and cities): edit here to change them.
// `label` is a key in messages/<locale>.json → "Home" (categories) or a plain city name.

export type SiteNavLink = { label: string; href: string; translate: boolean }

const search = (query: string) => `/search?query=${encodeURIComponent(query)}`

export const CATEGORY_LINKS: SiteNavLink[] = [
	{ label: 'interest_desert', href: search('desert'), translate: true },
	{ label: 'interest_multi_day', href: search('days'), translate: true },
	{ label: 'interest_mountains', href: search('atlas'), translate: true },
	{ label: 'interest_day_trips', href: search('day trip'), translate: true },
	{ label: 'interest_coast', href: search('coast'), translate: true },
]

export const CITY_LINKS: SiteNavLink[] = ['Marrakech', 'Fes', 'Merzouga', 'Essaouira'].map(
	(city) => ({ label: city, href: search(city), translate: false }),
)

export const ACCOUNT_LINKS = {
	account: '/account-settings',
	bookings: '/bookings',
	saved: '/account-savelists',
	help: '/contact',
	partner: '/affiliates',
	listBusiness: '/list-my-business',
	blog: '/blog',
} as const
