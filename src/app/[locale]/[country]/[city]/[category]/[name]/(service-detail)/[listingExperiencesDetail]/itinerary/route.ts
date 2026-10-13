// Turns a tour's days into a route on the map: the places it passes through,
// in order, and where each day ends. Places come from the day titles
// ("Day 1: Marrakech to Boumalne Dades") or, failing that, the day's city.

export type Place = { key: string; name: string; lat: number; lng: number }

export type RouteStop = Place & {
	/** Days that end (sleep) here, 1-based */
	days: number[]
	isStart: boolean
	isEnd: boolean
}

export type TourRoute = {
	/** Every place in travel order (consecutive repeats removed) */
	path: Place[]
	/** Unique places with the days that end there */
	stops: RouteStop[]
	/** Places each day goes through (index = day) */
	dayPlaces: Place[][]
}

// [display name, latitude, longitude, other spellings]
const PLACES: [string, number, number, string[]?][] = [
	// Morocco
	['Marrakech', 31.6295, -7.9811, ['marrakesh', 'marrakesch', 'marraquech', 'marrakech-safi']],
	['Boumalne Dades', 31.37, -5.99],
	['Dades Valley', 31.53, -5.92, ['dades gorge', 'gorges du dades', 'valle del dades', 'vallée du dadès', 'dadestal']],
	['Merzouga', 31.0802, -4.0133, ['erg chebbi', 'sahara']],
	['Fes', 34.0181, -5.0078, ['fez', 'fès']],
	['Tinghir', 31.5147, -5.5328],
	['Todra Gorge', 31.588, -5.593, ['todgha', 'gorges du todra']],
	['Sefrou', 33.8305, -4.8353],
	['Bhalil', 33.855, -4.873],
	['Ifrane', 33.5228, -5.11],
	['Azrou', 33.434, -5.221],
	['Meknes', 33.8935, -5.5473, ['meknès', 'mequinez']],
	['Volubilis', 34.0739, -5.5544],
	['Moulay Idriss', 34.055, -5.521],
	['Chefchaouen', 35.1688, -5.2636, ['chaouen', 'chefchaouen province']],
	['Akchour', 35.238, -5.175],
	['Tetouan', 35.5785, -5.3684, ['tétouan', 'tetuán']],
	['Tangier', 35.7595, -5.834, ['tanger', 'tánger', 'tangeri']],
	['Cap Spartel', 35.79, -5.924],
	['Ait Ben Haddou', 31.047, -7.129, ['aït ben haddou', 'ait-ben-haddou']],
	['Ouarzazate', 30.9189, -6.8934, ['uarzazat']],
	['Skoura', 31.061, -6.556],
	['Midelt', 32.6852, -4.7451],
	['Essaouira', 31.5085, -9.7595],
	['Ourika Valley', 31.3, -7.75, ['ourika']],
	["Tizi n'Tichka", 31.285, -7.38, ['tizi n’tichka', 'tichka']],
	['Erfoud', 31.431, -4.228],
	['Rissani', 31.28, -4.265],
	['Alnif', 31.117, -5.167],
	['Draa Valley', 30.695, -6.45, ['drâa', 'agdz']],
	['Zagora', 30.3324, -5.8384],
	['Ziz Valley', 32.0, -4.42],
	['Rabat', 34.0209, -6.8416],
	['Casablanca', 33.5731, -7.5898],
	['Agadir', 30.4278, -9.5981],
	['Imlil', 31.1367, -7.9197],
	['Ouzoud', 32.0153, -6.7189],
	// Albania
	['Tirana', 41.3275, 19.8187],
	['Shkoder', 42.0683, 19.5126, ['shkodër', 'shkodra']],
	['Theth', 42.396, 19.775],
	['Valbona', 42.45, 19.885],
	['Durrës', 41.3231, 19.4414, ['durres']],
	['Ksamil', 39.769, 20.0],
	['Butrint', 39.745, 20.02],
	['Gjirokaster', 40.0756, 20.1389, ['gjirokastër']],
	// Italy
	['Rome', 41.9028, 12.4964, ['roma', 'rom']],
	['Vatican City', 41.9029, 12.4534, ['vatican', 'vaticano']],
	['Florence', 43.7696, 11.2558, ['firenze', 'florencia', 'florenz', 'florença']],
	['Venice', 45.4408, 12.3155, ['venezia', 'venecia', 'venedig', 'venise', 'veneza']],
	['Murano', 45.458, 12.353],
	['Amalfi Coast', 40.634, 14.6027, ['amalfi', 'costiera amalfitana']],
	['Capri', 40.5532, 14.2222],
	// Thailand
	['Bangkok', 13.7563, 100.5018],
	['Ayutthaya', 14.3692, 100.5877],
	['Chiang Mai', 18.7883, 98.9853],
	['Doi Suthep', 18.805, 98.922],
	['Phuket', 7.8804, 98.3923],
	['Krabi', 8.0863, 98.9063],
	['Phi Phi', 7.7407, 98.7784],
	// Maldives
	['Malé', 4.1755, 73.5093, ['male']],
]

const normalize = (text: string) =>
	text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[’']/g, "'")

// Every spelling → place, longest first so "Boumalne Dades" wins over "Dades"
const SPELLINGS = PLACES.flatMap(([name, lat, lng, aliases = []]) =>
	[name, ...aliases].map((spelling) => ({
		spelling: normalize(spelling),
		place: { key: normalize(name), name, lat, lng },
	})),
).sort((a, b) => b.spelling.length - a.spelling.length)

/** Known places mentioned in `text`, in the order they appear. */
function placesIn(text: string): Place[] {
	let rest = normalize(text)
	const found: { at: number; place: Place }[] = []
	for (const { spelling, place } of SPELLINGS) {
		const pattern = new RegExp(`(^|[^a-z])${spelling.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z])`)
		const match = pattern.exec(rest)
		if (!match) continue
		const at = match.index + match[1].length
		found.push({ at, place })
		// Blank it out so shorter spellings inside it don't match again
		rest = rest.slice(0, at) + ' '.repeat(spelling.length) + rest.slice(at + spelling.length)
	}
	return found.sort((a, b) => a.at - b.at).map(({ place }) => place)
}

const findPlace = (name?: string | null) => (name ? placesIn(name)[0] : undefined)

/**
 * Places in a day title, in travel order:
 * - "A to B via C and D"  → A, C, D, B
 * - "Trip to B from A"    → A, B
 * - "Day trip to B" from A → A, B, A (you come back)
 */
function placesInTitle(title: string, previous?: Place): Place[] {
	const text = normalize(title)
	let places: Place[]

	const via = text.search(/\s\(?(via|vía|über|par)\s/)
	const from = text.search(/\s(from|desde|depuis|von|da|de)\s/)
	if (via > 0) {
		const main = placesIn(text.slice(0, via))
		const waypoints = placesIn(text.slice(via))
		places = main.length >= 2 ? [...main.slice(0, -1), ...waypoints, main[main.length - 1]] : [...main, ...waypoints]
	} else if (from > 0 && placesIn(text.slice(0, from)).length && placesIn(text.slice(from)).length) {
		places = [...placesIn(text.slice(from)), ...placesIn(text.slice(0, from))]
	} else {
		places = placesIn(text)
	}

	// A day trip leaves from where you are (or the "from" place) and comes back there
	if (/day trip|excursion/.test(text)) {
		const base = from > 0 ? places[0] : previous ?? places[0]
		if (base) {
			if (places[0]?.key !== base.key) places = [base, ...places]
			if (places[places.length - 1].key !== base.key) places = [...places, base]
		}
	}
	return places
}

/** Places for one day: from its title, else its city, else where the last day ended. */
function placesForDay(day: any, previous?: Place): Place[] {
	const fromTitle = placesInTitle(day?.name ?? '', previous)
	if (fromTitle.length) return fromTitle
	const city = findPlace(day?.cityName) ?? findPlace(day?.city)
	if (city) return [city]
	return previous ? [previous] : []
}

export function buildRoute(days: any[] = []): TourRoute {
	const dayPlaces: Place[][] = []
	let previous: Place | undefined
	for (const day of days) {
		let places = placesForDay(day, previous)
		// A day starts where the one before ended
		if (previous && places.length && places[0].key !== previous.key && dayPlaces.length) {
			places = [previous, ...places]
		}
		dayPlaces.push(places)
		previous = places[places.length - 1] ?? previous
	}

	const path: Place[] = []
	for (const place of dayPlaces.flat()) {
		if (path[path.length - 1]?.key !== place.key) path.push(place)
	}

	const stops = new Map<string, RouteStop>()
	for (const place of path) {
		if (!stops.has(place.key)) stops.set(place.key, { ...place, days: [], isStart: false, isEnd: false })
	}
	dayPlaces.forEach((places, index) => {
		const end = places[places.length - 1]
		if (end) stops.get(end.key)?.days.push(index + 1)
	})
	if (path.length) {
		stops.get(path[0].key)!.isStart = true
		stops.get(path[path.length - 1].key)!.isEnd = true
	}

	return { path, stops: Array.from(stops.values()), dayPlaces }
}
