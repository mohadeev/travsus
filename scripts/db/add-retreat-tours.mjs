// Adds two calm "retreat" tours from Marrakech: six days to the Merzouga dunes
// (two nights in the Erg Chebbi, one free day) and three days in Essaouira.
// Same structure, prices and inclusions as the existing tours: transport per
// day from the price list, hotels at 100 € (Standard) / 180 € (Luxury) per
// night for a twin room. Photos and stops are reused from existing tours,
// with their credits. Only English is written; run db:translate-tours after.
//
//   node scripts/db/add-retreat-tours.mjs           # dry run: prints the tours
//   node scripts/db/add-retreat-tours.mjs --apply   # adds them (skips names that exist)
import crypto from 'node:crypto'
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'
import { slugify } from 'transliteration'

config({ path: '.env.local', quiet: true })
config({ quiet: true })

const APPLY = process.argv.includes('--apply')

// Existing tours the shared parts come from
const DESERT_BASE = '78abff5c36d791822bdabd68' // 4 Days Marrakech to Merzouga (inclusions)
const ESSAOUIRA_BASE = '3baa50eff029194e1b38cb50' // 4 Days Marrakech, High Atlas and Essaouira (inclusions)
const MARRAKECH_ADDRESS = '67be2b88592a5d0c4b043860'

const CITY = {
	marrakech: ['Marrakech', '67e5a961636b9ead6fb9b280'],
	aitBenHaddou: ['Ait Benhaddou', '67f82f45c15a67565b48cad4'],
	dades: ['Boumalne Dades', '67f82e3cc15a67565b48caca'],
	merzouga: ['Merzouga', '67f68e87bd9a1f73313f467c'],
	ouarzazate: ['Ouarzazate', '67e5747c636b9ead6fb9b16c'],
	essaouira: ['Essaouira', '67e5a8fc636b9ead6fb9b27a'],
}

const TRANSPORT = [
	['SUV (prado)', 1, 5, 'https://res.cloudinary.com/travsus/image/upload/v1745698557/prado_nhgpvq.png'],
	['Mercedes Vito', 6, 8, 'https://res.cloudinary.com/travsus/image/upload/v1745698557/vito_et5qqd.png'],
	['Mini Bus', 9, 19, 'https://res.cloudinary.com/travsus/image/upload/v1745698557/mini-bus_gwoprr.png'],
]

const pricingTiers = (days, perDay) =>
	TRANSPORT.map(([transportType, minSeats, maxSeats, transportImage]) => ({
		pricing: { currency: 'EUR', totalPrice: perDay(maxSeats) * days, pricePerDay: perDay(maxSeats) },
		maxSeats,
		minSeats,
		transportType,
		transportImage,
	}))

const room = (name, description, perNight, nights) => ({
	name,
	description,
	pricingTiers: [
		{
			name,
			maxSeats: 4,
			minSeats: 1,
			bedOptions: [
				{ bedType: 'TWIN', currency: 'EUR', basePrice: perNight * nights, maxOccupancy: 2 },
				{ bedType: 'SINGLE', currency: 'EUR', basePrice: (perNight / 2) * nights, maxOccupancy: 1 },
				{ bedType: 'COUPLE', currency: 'EUR', basePrice: perNight * nights, maxOccupancy: 2 },
			],
		},
	],
})
const accommodations = (nights) => [
	room('Standard', 'Comfortable and affordable accommodation', 100, nights),
	room('Luxury', 'Experience ultimate comfort and elegance', 180, nights),
]

// [stop name in existing tours, duration shown on this tour]
const day = (name, city, description, stops = []) => ({ name, city, description, stops })

const TOURS = [
	{
		base: DESERT_BASE,
		images: [
			'aae295b37db7a3106755ce6e:0',
			'aae295b37db7a3106755ce6e:4',
			'aae295b37db7a3106755ce6e:5',
			'aae295b37db7a3106755ce6e:2',
			'aae295b37db7a3106755ce6e:1',
		],
		// 1–5 people 120 €/day, minibus 150 €/day (the price list for 4+ days)
		pricingTiers: pricingTiers(6, (max) => (max > 8 ? 150 : 120)),
		nights: 5,
		name: 'Sahara Retreat from Marrakech: 6 Calm Days with Two Nights in the Merzouga Dunes',
		seoTitle: '6-Day Sahara Retreat from Marrakech to Merzouga',
		metaDescription:
			'A calm 6-day private Sahara retreat from Marrakech: short driving days, kasbah nights, two nights in an Erg Chebbi camp and a free day in the dunes.',
		tags: ['Sahara retreat Morocco', 'calm desert tour from Marrakech', 'Merzouga retreat 6 days'],
		subtitle:
			'A slow, quiet trip to the Sahara: short driving days, nights in kasbahs, two nights in a camp in the Erg Chebbi and a whole day with no driving, just the dunes, the silence and the light.',
		overview: `Most desert tours rush: long days in the car, one night in the dunes, and back on the road before sunrise is over. This retreat does the opposite. The drives are split into short stages, every afternoon leaves time to rest, and you spend two nights in the Erg Chebbi with a free day between them.

On the free day there is nothing to catch. Watch the sunrise from the camp, have a slow breakfast, walk in the dunes, read in the shade, take tea with the camp team and climb a dune for the sunset. Your driver stays nearby for anything you need.

AT A GLANCE
• Duration: 6 days, 5 nights
• Start and finish: Marrakech
• Nights: Ait Ben Haddou, the Dades Valley, two nights in a desert camp, Ouarzazate
• Driving: 3–6 hours on travel days, none on day 4
• Type: private tour with your own driver
• Activity level: easy (short walks, a camel ride you can swap for a 4x4 transfer)

WHO MIGHT PREFER ANOTHER TOUR
If you have less time, see the [4-day Marrakech to Merzouga tour](/en-US/morocco/marrakech/tours/4-days-marrakech-to-merzouga-tour-sahara-loop-with-dades-todra-and-ouarzazate/78abff5c36d791822bdabd68).

PRACTICAL INFORMATION
Bring layers (desert nights are cold from November to March), a scarf for the wind, sunscreen, and a small bag for the two camp nights; the big luggage stays in the car.`,
		highlights: [
			'Two nights in the Erg Chebbi dunes',
			'A free day in the desert with no driving',
			'Sunset walk in Ait Ben Haddou',
			'Walk in the Skoura palm grove',
			'The Todra Gorge on foot',
			'Sunrise over the dunes, twice',
		],
		faq: [
			['What makes this tour a retreat?', 'Short driving stages, free afternoons, and two nights in the dunes with a whole day of rest between them.'],
			['Is it private?', 'Yes. You have your own driver and vehicle for the six days.'],
			['Which meals are included?', 'Dinner and breakfast every night, in the hotels and in the camp.'],
			['What is the camp like?', 'Tents with real beds and blankets, dinner and breakfast. With the Luxury option you sleep in a larger tent with its own bathroom.'],
			['What is the longest drive?', 'About 6 hours on day 5, from Merzouga to Ouarzazate, with stops on the way.'],
		],
		days: [
			day(
				'Day 1: Marrakech to Ait Ben Haddou',
				CITY.aitBenHaddou,
				`An easy first day over the High Atlas, with the afternoon free and a sunset walk in the old ksar.

SCHEDULE (times are estimates)
09:00 – Pick-up at your hotel or riad.
11:30 – Tea stop near the Tizi n'Tichka pass (2,260 m).
14:00 – Arrive in Ait Ben Haddou; lunch (not included), then rest.
17:30 – Walk up through the ksar for the sunset.

INCLUDED: vehicle and driver, hotel with dinner and breakfast.
NOT INCLUDED: lunch, drinks, tips.

WHAT YOU TAKE AWAY: a slow start, and the ksar in the evening light.`,
				[['Ait Ben Haddou at sunset', 'About 1.5 hours']],
			),
			day(
				'Day 2: Ait Ben Haddou to the Dades Valley via Skoura',
				CITY.dades,
				`A short drive, a walk in the shade of the Skoura palm grove, and a quiet evening in the Dades Valley.

SCHEDULE (times are estimates)
09:30 – Depart after a slow breakfast.
11:00 – Skoura: walk between palms, gardens and old kasbahs.
13:00 – Lunch on the way (not included).
15:30 – Kasbah hotel in the Dades Valley; free afternoon.

INCLUDED: vehicle and driver, hotel with dinner and breakfast.
NOT INCLUDED: lunch, drinks, tips.

WHAT YOU TAKE AWAY: the calm of an oasis.`,
				[['Skoura', 'About 1 hour']],
			),
			day(
				'Day 3: Dades Valley to Merzouga via the Todra Gorge',
				CITY.merzouga,
				`A walk between the walls of the Todra Gorge, then on to the dunes. A camel ride takes you to the camp for the first of two nights.

SCHEDULE (times are estimates)
09:00 – Depart.
10:00 – Todra Gorge: walk on the gorge floor (about 45 minutes).
12:30 – Lunch in Tinghir or Alnif (not included).
16:30 – Merzouga; leave the big luggage in the car.
17:00 – Camel ride into the Erg Chebbi (or a 4x4 transfer if you prefer).
19:30 – Dinner at the camp.

INCLUDED: vehicle and driver, camel ride, camp with dinner and breakfast.
NOT INCLUDED: lunch, drinks, tips.

WHAT YOU TAKE AWAY: the first evening in the silence of the dunes.`,
				[
					['Todra Gorge', 'About 45 minutes'],
					['Camel ride into Erg Chebbi', 'About 1 hour'],
				],
			),
			day(
				'Day 4: A free day in the Erg Chebbi',
				CITY.merzouga,
				`No driving today. The day is yours: sunrise from the camp, a slow breakfast, a walk in the dunes, a nap in the shade, tea in the afternoon and the sunset from the top of a dune. Your driver can take you to Khamlia for Gnawa music or to a nomad family if you would like to go out.

SCHEDULE (times are estimates)
06:30 – Sunrise over the dunes.
08:30 – Breakfast at the camp.
Free time – walk, read, rest.
13:00 – Lunch at the camp (not included).
17:30 – Climb a dune for the sunset.
19:30 – Dinner and a second night at the camp.

INCLUDED: camp with dinner and breakfast, driver on call.
NOT INCLUDED: lunch, drinks, optional visits, tips.

WHAT YOU TAKE AWAY: a full day of quiet in the Sahara.`,
				[
					['Sunrise over Erg Chebbi', 'Early morning'],
					['Erg Chebbi sunset', 'About 1 hour'],
				],
			),
			day(
				'Day 5: Merzouga to Ouarzazate',
				CITY.ouarzazate,
				`The longest drive of the trip, broken up with stops, through Rissani, Alnif and the villages of the Jbel Saghro.

SCHEDULE (times are estimates)
08:30 – Breakfast after the sunrise; camel ride or 4x4 back to the car.
09:30 – Depart.
12:30 – Lunch in N'Kob (not included).
15:30 – Ouarzazate; free evening.

INCLUDED: vehicle and driver, hotel with dinner and breakfast.
NOT INCLUDED: lunch, drinks, tips.

WHAT YOU TAKE AWAY: the wide, empty landscapes of the south.`,
				[['Taourirt Kasbah, Ouarzazate', 'About 30 minutes']],
			),
			day(
				'Day 6: Ouarzazate to Marrakech',
				CITY.marrakech,
				`Back over the High Atlas at an easy pace, arriving in Marrakech in the afternoon.

SCHEDULE (times are estimates)
09:30 – Depart.
12:30 – Lunch in the mountains (not included).
15:00 – Drop-off at your hotel or riad in Marrakech.

INCLUDED: vehicle and driver.
NOT INCLUDED: lunch, drinks, tips.

WHAT YOU TAKE AWAY: six days of rest, and the desert still in your head.`,
			),
		],
	},
	{
		base: ESSAOUIRA_BASE,
		images: [
			'e6147f33e475d49aa412a21e:0',
			'1de90eded82dfb301dad3588:4',
			'e6147f33e475d49aa412a21e:1',
			'01679fbf3d2ba2351438f951:0',
			'01679fbf3d2ba2351438f951:4',
		],
		// 150 €/day for every vehicle (the price list for short trips)
		pricingTiers: pricingTiers(3, () => 150),
		nights: 2,
		name: 'Essaouira Retreat from Marrakech: 3 Calm Days by the Atlantic',
		seoTitle: '3-Day Essaouira Retreat from Marrakech',
		metaDescription:
			'A calm 3-day private trip from Marrakech to Essaouira: a riad in the medina, the ramparts at sunset, the port, Sidi Kaouki beach and time to rest.',
		tags: ['Essaouira retreat', 'calm trip from Marrakech', 'Essaouira 3 days'],
		subtitle:
			'Three slow days on the Atlantic: a riad in the medina, the ramparts at sunset, the blue boats of the port, an afternoon on Sidi Kaouki beach and plenty of time to do nothing at all.',
		overview: `Essaouira is the calmest town on Morocco's coast: a white and blue medina inside old ramparts, a fishing port, a long beach and a cool wind from the ocean. A day trip only shows the main streets. Three days let you live at its pace.

You stay two nights in a riad in the medina. Mornings are for walking: the port when the boats come in, the ramparts, the quiet lanes of the Mellah. Afternoons are for the beach at Sidi Kaouki, a hammam, or a terrace with mint tea.

AT A GLANCE
• Duration: 3 days, 2 nights
• Start and finish: Marrakech
• Nights: a riad in the Essaouira medina
• Driving: about 3 hours each way
• Type: private tour with your own driver
• Activity level: easy (short walks)

WHO MIGHT PREFER ANOTHER TOUR
If you only have one day, see the [Essaouira day trip from Marrakech](/en-US/morocco/marrakech/tours/essaouira-day-trip-from-marrakech-atlantic-port-medina-argan-cooperative/1de90eded82dfb301dad3588).

PRACTICAL INFORMATION
Bring a warm layer: the wind from the ocean makes evenings cool, even in summer.`,
		highlights: [
			'Two nights in a riad in the medina',
			'Sunset on the Skala ramparts',
			'The blue boats of the fishing port',
			'An afternoon on Sidi Kaouki beach',
			'A women’s argan cooperative',
			'Free time to rest',
		],
		faq: [
			['What makes this tour a retreat?', 'Two nights in one place, short walks in the morning and free afternoons.'],
			['Is it private?', 'Yes. You have your own driver, who also takes you to Sidi Kaouki on day 2.'],
			['Which meals are included?', 'Dinner and breakfast each night.'],
			['Can I add a hammam or a surf lesson?', 'Yes, ask when you book. They are paid on the spot.'],
		],
		days: [
			day(
				'Day 1: Marrakech to Essaouira',
				CITY.essaouira,
				`An easy drive to the coast with a stop at an argan cooperative, then a free afternoon and the sunset from the ramparts.

SCHEDULE (times are estimates)
09:30 – Pick-up at your hotel or riad.
11:30 – Women's argan cooperative.
12:30 – Arrive in Essaouira; check in to your riad.
Free afternoon – lunch (not included), terraces, the medina.
18:30 – Sunset on the Skala de la Ville.

INCLUDED: vehicle and driver, riad with dinner and breakfast.
NOT INCLUDED: lunch, drinks, tips.

WHAT YOU TAKE AWAY: the ocean air after Marrakech.`,
				[
					['Argan cooperative', 'About 30 minutes'],
					['Skala de la Ville', 'About 1 hour'],
				],
			),
			day(
				'Day 2: A slow day in Essaouira and Sidi Kaouki',
				CITY.essaouira,
				`The port in the morning, the quiet lanes of the Mellah, and an afternoon on the long beach of Sidi Kaouki.

SCHEDULE (times are estimates)
09:00 – The fishing port and boatyard as the boats come in.
10:30 – Walk through the Mellah and the medina.
Lunch – grilled fish at the port stalls (not included).
14:30 – Your driver takes you to Sidi Kaouki beach (25 minutes).
18:00 – Back at the riad; free evening.

INCLUDED: driver for the beach, riad with dinner and breakfast.
NOT INCLUDED: lunch, drinks, tips, optional activities.

WHAT YOU TAKE AWAY: a day at the pace of the ocean.`,
				[
					['Essaouira boatyard and port', 'About 1 hour'],
					['The Mellah', 'About 45 minutes'],
					['Sidi Kaouki beach', 'About 3 hours'],
				],
			),
			day(
				'Day 3: Essaouira to Marrakech',
				CITY.marrakech,
				`A slow morning by the sea, then back to Marrakech in the afternoon.

SCHEDULE (times are estimates)
Morning – free: a walk on the beach or a last coffee in the medina.
13:30 – Depart.
16:30 – Drop-off at your hotel or riad in Marrakech.

INCLUDED: vehicle and driver.
NOT INCLUDED: lunch, drinks, tips.

WHAT YOU TAKE AWAY: three quiet days by the Atlantic.`,
			),
		],
	},
]

const client = new MongoClient(process.env.DATABASE_URL)
await client.connect()
const db = client.db(process.env.MONGODB_DB || 'travsus')
const tours = db.collection('tours')

try {
	// Stops with photos, by name, from the existing tours
	const stopsByName = {}
	for await (const tour of tours.find({}, { projection: { days: 1 } })) {
		for (const d of tour.days ?? []) for (const s of d.stops ?? []) if (s.image && !stopsByName[s.name]) stopsByName[s.name] = s
	}
	const imageOf = async (ref) => {
		const [id, index] = ref.split(':')
		const source = await tours.findOne({ _id: id }, { projection: { images: 1 } })
		const image = source?.images?.[Number(index)]
		if (!image) throw new Error(`No image ${ref}`)
		return image
	}

	for (const spec of TOURS) {
		if (await tours.findOne({ name: spec.name }, { projection: { _id: 1 } })) {
			console.log(`Exists, skipped: ${spec.name}`)
			continue
		}
		const base = await tours.findOne({ _id: spec.base })
		const id = crypto.randomBytes(12).toString('hex')
		const now = new Date()
		const highlights = spec.highlights.map((name) => ({ name }))
		const faq = spec.faq.map(([question, answer]) => ({ question, answer }))
		const days = spec.days.map((d) => ({
			name: d.name,
			stops: d.stops.map(([name, duration]) => {
				const stop = stopsByName[name]
				if (!stop) throw new Error(`No stop "${name}"`)
				return { ...stop, duration }
			}),
			cityId: d.city[1],
			hidden: false,
			cityName: d.city[0],
			description: d.description,
		}))
		const doc = {
			_id: id,
			end: null,
			faq,
			days,
			lang: 'EN',
			name: spec.name,
			tags: spec.tags,
			paths: [],
			price: '',
			slugs: [{ slug: `/en-US/morocco/marrakech/tours/${slugify(spec.name)}/${id}`, language: 'en-US' }],
			start: null,
			images: await Promise.all(spec.images.map(imageOf)),
			people: [],
			places: [],
			tourfor: '',
			updated: true,
			discount: '',
			duration: spec.days.length,
			overview: spec.overview,
			seoTitle: spec.seoTitle,
			services: [],
			subtitle: spec.subtitle,
			createdAt: now,
			creatorId: base.creatorId,
			keyphrase: spec.tags,
			updatedAt: now,
			businessId: base.businessId,
			conclusion: '',
			highlights,
			inclusions: base.inclusions,
			durationType: 'days',
			endAddressId: MARRAKECH_ADDRESS,
			priceGroupId: null,
			pricingTiers: spec.pricingTiers,
			translations: [
				{ faq, days, name: spec.name, language: 'en-US', overview: spec.overview, subtitle: spec.subtitle, conclusion: '', highlights },
			],
			accommodations: accommodations(spec.nights),
			startAddressId: MARRAKECH_ADDRESS,
			metaDescription: spec.metaDescription,
			productCategory: '',
			includesOvernight: true,
		}

		const transport = spec.pricingTiers[0].pricing.totalPrice
		const twin = doc.accommodations[0].pricingTiers[0].bedOptions[0].basePrice
		console.log(`\n${spec.name}\n  ${doc.slugs[0].slug}`)
		console.log(`  ${doc.duration} days, ${spec.nights} nights · ${days.map((d) => d.cityName).join(' → ')}`)
		console.log(`  stops: ${days.flatMap((d) => d.stops.map((s) => s.name)).join(', ')}`)
		console.log(`  price for 2 people, Standard: ${transport} € car + ${twin} € hotels = ${transport + twin} € (${(transport + twin) / 2} € per person)`)

		if (APPLY) {
			await tours.insertOne(doc)
			console.log(`  ADDED ${id}`)
		}
	}
	if (!APPLY) console.log('\nDry run: nothing added. Run with --apply to add the tours.')
} finally {
	await client.close()
}
