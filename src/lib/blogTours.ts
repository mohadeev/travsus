// Tours shown inside blog articles (the "Tours for this trip" cards, placed in
// the middle of the article and at its end).
//
// Relevance first: an article gets tours only when they really match it.
// - BLOG_TOURS: hand-picked tours for the articles people find on Google
//   (ids from Search Console). An empty list means "no tours" (off-topic posts).
// - Any other article: matched from its English title (the city, the desert,
//   the length of the trip); when nothing clearly fits, no tours are shown.
// To pick tours for another article, add its id here with the tour ids.
import type { HomeTour } from '@/lib/homeData'

const MARRAKECH_MERZOUGA = ['680bc6a5aa6f43072c7700f6', '2e51d4c52a96cd8b7470b86a', '1c54e53122babcbd16f98cfd', '53d59f0efda73e5dad4bc972']
const FES_MERZOUGA = ['fd911b2445339490376b13c6', '680bc6b6aa6f43072c7700f8', 'ef9e89754f81897c29489983', 'd233b5b77f2f33cefabf48c7']
const MERZOUGA_CAMPS = ['cdba9d9aa746e1f5add261ba', '2d6d33546c153b0ce4a045d3', 'aae295b37db7a3106755ce6e', '7e84282d0daccc0cd2580d64']
const DESERT_CHOICE = ['680bc6a5aa6f43072c7700f6', '685bd1a47aecbeecb2a4a7d9', 'a9fc8e47b087f2ad47d501fb', 'eac78164d77c38930eafc4be']
const AIT_BEN_HADDOU = ['45d0644c7db29b3b7b7123f6', '7c3f043cd0b560a6f555e9c0', '3ef3b0ce0392e15b60d63b2c']
const FIRST_TRIP = ['98b723b510f8be4177aa51a2', '7468e4edffd820c004dc080e', '42b39aa2514ec1d698b944bf', '680bc6a5aa6f43072c7700f6']
const PACKING = ['680bc6a5aa6f43072c7700f6', '1c54e53122babcbd16f98cfd', '7468e4edffd820c004dc080e']
const WELLNESS = ['a9ddcbee748eeda8f2c5c802', '842ccdcddffef5963c6eed09', '6f45be283794207d044ff8e5']

export const BLOG_TOURS: Record<string, string[]> = {
	// Top 8 Morocco Tours That Will Change How You Travel Forever
	'68650ff9d466dcc749615bf1': ['27421756fae1a661441872ae', '680bc6a5aa6f43072c7700f6', '98b723b510f8be4177aa51a2', '94bd18ec87675d9247c69963'],
	// 14 Days in Morocco: The Ultimate 2-Week Itinerary
	'228e39bc86c05e707ae0766a': ['0f6606724ffd187942ee9da5', '1f14605f1ce4f2a38903a121', 'c6570f30e9116f8c83041232'],
	// Moroccan Mint Tea: History, the Pouring Ritual and How to Make It at Home
	'920747b3a375252dc5198278': ['6f45be283794207d044ff8e5', '7a92ba831e3df9ff246f0f97', '65842569ca59a2ef4bf25af4'],
	// Flights to Merzouga: How to Reach Morocco's Desert Jewel by Air
	'68cbcd2f9dce272f31a65441': ['53d59f0efda73e5dad4bc972', ...MERZOUGA_CAMPS.slice(0, 3)],
	// Tipping in Morocco
	'644aa0038b15ada0a610a5ee': ['7953dd0dd55f26571a4a5834', '680bc6a5aa6f43072c7700f6', '27421756fae1a661441872ae'],
	// Best Cities to Visit in Morocco
	'68cd1bc95aa8b0e2dda7e304': ['17826a17bff6486b7d300675', 'c02dc6b8b1c7f4ef21f368ab', '467c9a5d56d5cdd1f33e86da'],
	// Moroccan Hammam for First-Timers
	'2bb295e2ace30ac9c4cfc88d': ['7953dd0dd55f26571a4a5834', '6f202fcf3425696f2d20fb3f', '6f45be283794207d044ff8e5'],
	// 3 Days in Marrakech Itinerary
	'29e6ee2e77281167c7aa5127': ['7953dd0dd55f26571a4a5834', 'a9fc8e47b087f2ad47d501fb', '45d0644c7db29b3b7b7123f6', '6f45be283794207d044ff8e5'],
	// 10 Days in Morocco Itinerary: The Perfect Grand Tour
	'3c7626afb7dfbab4b7569784': ['27421756fae1a661441872ae', '98b723b510f8be4177aa51a2', '6853df192b32f46587f2b787', '59f7ea95444e8387960d1e5c'],
	// Christmas and New Year 2026 in Morocco
	'68cd781875383299ce3ecd88': ['628f02eac45c22c88f958bca', '31d06c73cf6cf329225762a3', '680bc6a5aa6f43072c7700f6'],
	// What to Wear in Morocco (dress guide / packing lists)
	'fb434040bfba7162e7b73850': PACKING,
	'0c565aaa42df803c2d621b11': PACKING,
	'ecb91a6f238832a144d2d8e3': PACKING,
	// Best Time to Visit Morocco: Month-by-Month Guide
	'1dcc9f9b635fc489e2c7156c': ['680bc6a5aa6f43072c7700f6', '94bd18ec87675d9247c69963', '27421756fae1a661441872ae'],
	// Morocco Travel Tips: 35 Things to Know Before You Go
	'29a394c73e62eedd7d28bf0f': FIRST_TRIP.slice(0, 3),
	// Is Morocco Safe for Tourists?
	'38a1b18bae2f884340d77065': ['7953dd0dd55f26571a4a5834', '860eeb5d66b9bb5398927803', '98b723b510f8be4177aa51a2'],
	// Things to Do in Casablanca
	'79d65df1105da40608834bb9': ['9fafbcbca1a96a1f83710339', 'da6c1755500285a3c79985ed', '840861a12c1c08ce5d006300'],
	// 7 Day Morocco Itinerary: Imperial Cities & Sahara Desert
	'94e381b52931216d78385859': ['94bd18ec87675d9247c69963', '0a461be89b65a578e08b9248', '57a5dbebfaa010b8b01a1e2e', 'bb81ecc7b756334d063212c5'],
	// Wellness articles
	'68650e61d466dcc749615bef': WELLNESS,
	'6863de27bcf217fd62b93952': WELLNESS,
	// Merzouga Travel Guide / Is Merzouga Safe / Best Time to Visit Merzouga
	'4c1192cf71b87ed6b6533457': ['cdba9d9aa746e1f5add261ba', '2d6d33546c153b0ce4a045d3', '46c301320347b1ffcb714b82', '7e84282d0daccc0cd2580d64'],
	'b958efb7ba67c05772c813e5': MERZOUGA_CAMPS.slice(0, 3),
	'e1ddcdfecea02888dbcbb1fe': ['680bc6a5aa6f43072c7700f6', 'cdba9d9aa746e1f5add261ba', '1c54e53122babcbd16f98cfd'],
	// Ait Ben Haddou & Ouarzazate guides
	'c9df2fac797088920a0879f8': AIT_BEN_HADDOU,
	'709274f463b9de29067e6058': AIT_BEN_HADDOU,
	// Things to Do in Chefchaouen
	'ee7280ef8399573624c2630a': ['e9756d4ee3066bef766d267e', 'ac7be027090964df7cb918c0', 'f060e67c5add437da3fd5309', 'd149f340b31bc9a9297ab68c'],
	// Things to Do in Essaouira
	'84ea62cbeec564a302114880': ['66a67a1f8eb6c855052f58bd', '1de90eded82dfb301dad3588', '01679fbf3d2ba2351438f951'],
	// Marrakech to Merzouga guides (distance, bus / car / flight / tour)
	'6965791d9a083501211a1fe0': MARRAKECH_MERZOUGA,
	'a9d9af14f642247a1a29687f': MARRAKECH_MERZOUGA,
	'04c8f4c2659528fa6ca050bd': MARRAKECH_MERZOUGA,
	'c14116cd33bfaa04d76d5b35': ['2e51d4c52a96cd8b7470b86a', '680bc6a5aa6f43072c7700f6', '1c54e53122babcbd16f98cfd', '860eeb5d66b9bb5398927803'],
	// Best Luxury Hotels in Marrakech
	'e9435f7f52989c2f60d6f33c': ['dd9de5a476038459cba57f76', 'aae295b37db7a3106755ce6e', '7953dd0dd55f26571a4a5834'],
	// 4-Day Marrakech to Merzouga & Fes Tour
	'6965791f9a083501211a1fe2': ['685bced911aec55f866a967f', '6d8be0da12b0699ca15687d4', '1c54e53122babcbd16f98cfd'],
	// Fes to Merzouga Desert Tour: 2 or 3 Days?
	'8f7a07b54d92a8820e1df730': FES_MERZOUGA,
	'87095d74fd36b1b07a54e272': FES_MERZOUGA,
	// Erg Chebbi vs Erg Chigaga / which Moroccan desert
	'3befd8ab5a5c87cdd1e1f36d': DESERT_CHOICE,
	'da1825426a737beeaafb4fcc': DESERT_CHOICE,
	'4134625a0ba7fef550f4d69b': DESERT_CHOICE,
	// How to Reach Merzouga by Land
	'68d3d092911edf7fc9448f93': ['680bc6a5aa6f43072c7700f6', '680bc6b6aa6f43072c7700f8', '57a5dbebfaa010b8b01a1e2e', '53d59f0efda73e5dad4bc972'],
	// Things to Do in Fes
	'4179ccd0834382cd429237fd': ['821c4315aa80478b0e322adb', '7a92ba831e3df9ff246f0f97', 'bf42f86b52a477d92143db09', 'f060e67c5add437da3fd5309'],
	// The Perfect 7-Day Morocco Itinerary: Marrakech, the Sahara and Fes
	'482c8f4c859236ba07f06255': ['94bd18ec87675d9247c69963', '8554a299aa7d61298b13807e', 'c86857ebe884bf992ee33035'],
	// Things to Do in Marrakech
	'baf83217da0d13eec120fd10': ['7953dd0dd55f26571a4a5834', '4ebfec8539098b1c3452d60a', 'a9fc8e47b087f2ad47d501fb', '6f45be283794207d044ff8e5'],
	// Morocco travel guides / first trip / top places
	'68c7cfd5a658401a3a097460': ['27421756fae1a661441872ae', '98b723b510f8be4177aa51a2', '680bc6a5aa6f43072c7700f6'],
	'6863daddcd1d805eeb1e90ec': FIRST_TRIP.slice(0, 3),
	'6865044db357315dcdb4c98a': ['27421756fae1a661441872ae', '0f6606724ffd187942ee9da5', '1dc582876c31387bc26b818b'],
	// Standard vs Luxury Desert Camp in Merzouga
	'46efc0598fb84c1677a6926e': ['aae295b37db7a3106755ce6e', '2d6d33546c153b0ce4a045d3', 'dd9de5a476038459cba57f76', '554c6534117f9f8e830d0865'],
	// 3-day Marrakech to Merzouga tour guides
	'680f3c2ef345996a2b6d1993': ['680bc6a5aa6f43072c7700f6', 'aecff5d83950a669fdca2f9d', 'dc79362bd19f87f66b6f55ce', '860eeb5d66b9bb5398927803'],
	'75c3cefd0c00497d5d9099f8': ['680bc6a5aa6f43072c7700f6', 'aecff5d83950a669fdca2f9d', 'dc79362bd19f87f66b6f55ce', '860eeb5d66b9bb5398927803'],
	// Best Day Trips from Marrakech
	'fccc6a6d956a1c453f87a30c': ['66a67a1f8eb6c855052f58bd', 'd2df4a5be3d5ccba57c5289a', 'a202a717f649051d9c639356', '45d0644c7db29b3b7b7123f6'],
	// Off topic for our tours: no cards
	'680e6141524b0f091f274301': [], // Discover Tunisia
	'680588185997cd6169001f02': [], // Top 10 travel destinations 2025
	'68062c076c07031b1901b099': [], // Hidden gem destinations 2025
	'680628836c07031b1901b094': [], // Planning your dream vacation 2025
	'680f73f860d0c2253ba842d9': [], // Power outages across Spain and Portugal
}

// Words that tie an English title to the tours (city names, the desert)
const PLACES: [RegExp, (t: HomeTour) => boolean][] = [
	[/merzouga|erg chebbi|sahara|desert|dunes?|camel/i, (t) => /merzouga|sahara|desert|erg chebbi|zagora|agafay/i.test(t.name)],
	[/marrakech|marrakesh/i, (t) => t.city === 'Marrakech'],
	[/\bfes\b|\bfez\b/i, (t) => t.city === 'Fes'],
	[/chefchaouen|blue city/i, (t) => /chefchaouen/i.test(t.name)],
	[/essaouira/i, (t) => /essaouira/i.test(t.name)],
	[/casablanca/i, (t) => t.city === 'Casablanca'],
	[/tangier/i, (t) => t.city === 'Tangier'],
	[/ouarzazate|ait ben haddou/i, (t) => /ouarzazate|ait ben haddou/i.test(t.name)],
	[/agadir/i, (t) => t.city === 'Agadir'],
	[/atlas|toubkal|ourika|imlil/i, (t) => /atlas|toubkal|ourika|imlil/i.test(t.name)],
]

/**
 * Tours for an article: its hand-picked list, else the tours that clearly
 * match its English title (a place it is about, plus the same number of days
 * when it is an itinerary). Up to `max` tours; [] when nothing fits.
 */
export function toursForArticle(postId: string, englishTitle: string, tours: HomeTour[], max = 4): HomeTour[] {
	const byId = new Map(tours.map((t) => [t.id, t]))
	if (postId in BLOG_TOURS) return BLOG_TOURS[postId].map((id) => byId.get(id)).filter((t): t is HomeTour => !!t).slice(0, max)

	const title = englishTitle || ''
	const tests = PLACES.filter(([words]) => words.test(title)).map(([, test]) => test)
	if (!tests.length) return []
	const dayMatch = /(\d+)[\s-]*days?\b/i.exec(title)
	const weekMatch = /(\d+)[\s-]*weeks?\b/i.exec(title)
	const days = dayMatch ? Number(dayMatch[1]) : weekMatch ? Number(weekMatch[1]) * 7 : 0
	return tours
		.map((tour) => {
			const places = tests.filter((test) => test(tour)).length
			const score = places * 2 + (days && tour.days === days ? 3 : 0) + (tour.popular ? 1 : 0)
			return { tour, score, places }
		})
		.filter((x) => x.places > 0) // must share a place with the article
		.sort((a, b) => b.score - a.score)
		.slice(0, max)
		.map((x) => x.tour)
}
