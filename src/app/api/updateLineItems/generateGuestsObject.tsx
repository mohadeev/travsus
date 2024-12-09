const peopleData = {
	Standard: {
		single: { adult: 5, child: 0 },
		twin: { adult: 0, child: 0 },
		couple: { adult: 1, child: 0 },
	},
	Luxury: {
		single: { adult: 0, child: 1 },
		twin: { adult: 0, child: 0 },
		couple: { adult: 0, child: 0 },
	},
}

export function generateGuestsObject(data: any) {
	let guestAdults = 0
	let guestChildren = 0

	for (const category in data) {
		for (const roomType in data[category]) {
			const { adult, child } = data[category][roomType]
			if (roomType === 'single') {
				guestAdults += adult
				guestChildren += child
			} else if (roomType === 'twin' || roomType === 'couple') {
				guestAdults += adult * 2
				guestChildren += child * 2
			}
		}
	}

	return {
		guestAdults,
		guestChildren,
	}
}

export default generateGuestsObject
// Output: { guests: { guestAdults: 7, guestChildren: 1 } }
