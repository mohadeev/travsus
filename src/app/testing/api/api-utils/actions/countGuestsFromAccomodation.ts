export function countGuests(roomData: any) {
	let guestAdults = 0
	let guestChildren = 0

	// Helper function to add guests
	function addGuests(data) {
		if (typeof data === 'number') {
			guestAdults += data
		} else {
			guestAdults += data.adult || 0
			guestChildren += data.child || 0
		}
	}

	// Iterate through room types and configurations
	for (const roomType in roomData) {
		for (const bedType in roomData[roomType]) {
			const bedData = roomData[roomType][bedType]

			if (bedType === 'couple') {
				// For couple, count as 2 adults if it's a number
				if (typeof bedData === 'number') {
					guestAdults += 2 * bedData
				} else {
					addGuests(bedData)
				}
			} else {
				addGuests(bedData)
			}
		}
	}

	return {
		guestAdults,
		guestChildren,
		guestInfants: 0, // As per your example, infants are always 0
	}
}
