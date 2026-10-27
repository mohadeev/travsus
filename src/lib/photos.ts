// Photos used on the site, kept on our Cloudinary ("site/…"). All are free
// photos from Unsplash (Unsplash License: unsplash.com/license); the source of
// each is noted next to it. Swap a URL here to change the picture everywhere.
const cloudinary = (path: string) => `https://res.cloudinary.com/travsus/image/upload/${path}`

export const PHOTOS = {
	/** Friends celebrating on a mountain at sunset · source: images.unsplash.com/photo-1520880867055-1e30d1cb001c */
	hero: cloudinary('v1793059304/site/hero.jpg'),
	/** Arms raised at sunset · source: images.unsplash.com/photo-1529333166437-7750a6dd5a70 */
	bookNow: cloudinary('v1793059305/site/bookNow.jpg'),
	/** Friends laughing together · source: images.unsplash.com/photo-1622352496174-9e1d969b1945 */
	referral: cloudinary('v1793059306/site/referral.jpg'),
	/** Camel caravan in the Sahara dunes · source: images.unsplash.com/photo-1697723831958-63bbdbe09962 */
	sahara: cloudinary('v1793059309/site/sahara.jpg'),
	/** Friends hiking in the Dolomites · source: images.unsplash.com/photo-1539635278303-d4002c07eae3 */
	hiking: cloudinary('v1793059310/site/hiking.jpg'),
	/** Group hug watching the sunset · source: images.unsplash.com/photo-1511632765486-a01980e01a18 */
	sunsetHug: cloudinary('v1793059311/site/sunsetHug.jpg'),
	/** Friends laughing outdoors · source: images.unsplash.com/photo-1511988617509-a57c8a288659 */
	laughing: cloudinary('v1793059313/site/laughing.jpg'),
} as const
