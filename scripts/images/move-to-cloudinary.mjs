// Moves the photos the site still loads from other websites onto Cloudinary,
// and keeps where each one came from:
//   • the site photos in src/lib/photos.ts (Unsplash) → Cloudinary "site/…";
//     prints the new addresses to paste into photos.ts
//   • place and city photos in the database still hotlinked from Pexels →
//     Cloudinary "places/place_<id>" / "cities/city_<id>", like the others;
//     the database row keeps the source page (uploadFrom) and gets a credit
//
//   node scripts/images/move-to-cloudinary.mjs           # dry run: lists what would move
//   node scripts/images/move-to-cloudinary.mjs --apply   # uploads, backs up the rows, saves
import fs from 'node:fs'
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

config({ path: '.env.local', quiet: true })
config({ quiet: true })
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
})

const APPLY = process.argv.includes('--apply')
const UNSPLASH = 'Unsplash License (https://unsplash.com/license)'
const PEXELS = 'Pexels License (https://www.pexels.com/license/)'

// The keys of PHOTOS in src/lib/photos.ts and their Unsplash photo ids
const SITE_PHOTOS = {
	hero: 'photo-1520880867055-1e30d1cb001c',
	bookNow: 'photo-1529333166437-7750a6dd5a70',
	referral: 'photo-1622352496174-9e1d969b1945',
	sahara: 'photo-1697723831958-63bbdbe09962',
	hiking: 'photo-1539635278303-d4002c07eae3',
	sunsetHug: 'photo-1511632765486-a01980e01a18',
	laughing: 'photo-1511988617509-a57c8a288659',
}

const upload = (from, publicId) => cloudinary.uploader.upload(from, { public_id: publicId, overwrite: true, resource_type: 'image' })

const main = new MongoClient(process.env.DATABASE_URL)
const geo = new MongoClient(process.env.DATABASE_URL_PLACES)
await Promise.all([main.connect(), geo.connect()])

try {
	// 1. Site photos
	console.log('Site photos (src/lib/photos.ts):')
	const site = {}
	for (const [key, id] of Object.entries(SITE_PHOTOS)) {
		const from = `https://images.unsplash.com/${id}?auto=format&fit=max&w=2400&q=85`
		if (APPLY) {
			const result = await upload(from, `site/${key}`)
			site[key] = { url: result.secure_url, source: `https://images.unsplash.com/${id}`, license: UNSPLASH }
		}
		console.log(`  ${key.padEnd(10)} ${from}${APPLY ? `\n             → ${site[key].url}` : ''}`)
	}

	// 2. Database photos still on Pexels
	const pexels = { 'image.url': /^https:\/\/images\.pexels\.com\// }
	const targets = [
		[main.db(process.env.MONGODB_DB || 'travsus').collection('geo_places'), 'places/place_'],
		[geo.db('travsusPlaces').collection('City'), 'cities/city_'],
	]
	const backup = {}
	for (const [collection, folder] of targets) {
		const rows = await collection.find(pexels, { projection: { image: 1 } }).toArray()
		console.log(`\n${collection.collectionName}: ${rows.length} photos on Pexels`)
		backup[collection.collectionName] = rows
		for (const row of rows) {
			const from = row.image.url.split('?')[0] + '?auto=compress&cs=tinysrgb&w=2000'
			const source = row.image.uploadFrom || from
			console.log(`  ${row._id}  ${source}`)
			if (!APPLY) continue
			const result = await upload(from, `${folder}${row._id}`)
			await collection.updateOne(
				{ _id: row._id },
				{ $set: { image: { url: result.secure_url, public_id: result.public_id, uploadFrom: source, credit: { source, license: PEXELS } } } },
			)
			console.log(`    → ${result.secure_url}`)
		}
	}

	if (APPLY) {
		const date = new Date().toISOString().slice(0, 10)
		fs.writeFileSync(`scripts/db/backups/pexels-photos-${date}.json`, JSON.stringify(backup, null, 1))
		fs.writeFileSync(`scripts/images/site-photos-${date}.json`, JSON.stringify(site, null, 1))
		console.log(`\nBackup: scripts/db/backups/pexels-photos-${date}.json · site photo addresses: scripts/images/site-photos-${date}.json`)
	} else {
		console.log('\nDry run: nothing uploaded or changed. Run with --apply to move them.')
	}
} finally {
	await Promise.all([main.close(), geo.close()])
}
