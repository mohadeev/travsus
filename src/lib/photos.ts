// Photos used on the site (free, Unsplash License: unsplash.com/license).
// Swap a URL here to change the picture everywhere it is used.
const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2000&q=80`

export const PHOTOS = {
	/** Friends celebrating on a mountain at sunset */
	hero: unsplash('photo-1520880867055-1e30d1cb001c'),
	/** Arms raised at sunset */
	bookNow: unsplash('photo-1529333166437-7750a6dd5a70'),
	/** Friends laughing together */
	referral: unsplash('photo-1622352496174-9e1d969b1945'),
	/** Camel caravan in the Sahara dunes */
	sahara: unsplash('photo-1697723831958-63bbdbe09962'),
	/** Friends hiking in the Dolomites */
	hiking: unsplash('photo-1539635278303-d4002c07eae3'),
	/** Group hug watching the sunset */
	sunsetHug: unsplash('photo-1511632765486-a01980e01a18'),
	/** Friends laughing outdoors */
	laughing: unsplash('photo-1511988617509-a57c8a288659'),
} as const
