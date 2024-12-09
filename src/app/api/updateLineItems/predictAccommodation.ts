type Guests = {
	guestAdults: number
	guestChildren: number
}

type RoomAllocation = {
	single: { adult: number; child: number }
	twin: { adult: number; child: number }
	couple: { adult: number; child: number }
}

type Accommodation = {
	Standard: RoomAllocation
	Luxury: RoomAllocation
}

function predictAccommodation(
	guests: Guests,
	accommodation: Accommodation | null,
) {
	const { guestAdults, guestChildren } = guests

	// Handle null or empty accommodation object
	if (!accommodation || Object.keys(accommodation).length === 0) {
		accommodation = {
			Standard: {
				single: { adult: 0, child: 0 },
				twin: { adult: 0, child: 0 },
				couple: { adult: 0, child: 0 },
			},
			Luxury: {
				single: { adult: 0, child: 0 },
				twin: { adult: 0, child: 0 },
				couple: { adult: 0, child: 0 },
			},
		}
	}

	let remainingAdults = guestAdults
	let remainingChildren = guestChildren

	// Allocate Standard accommodations for adults
	accommodation.Standard.couple.adult = Math.floor(remainingAdults / 2) // Pair as many adults as possible
	remainingAdults %= 2 // Remainder adults

	accommodation.Standard.single.adult = remainingAdults // Put remaining adults in single rooms

	// Allocate Standard accommodations for children
	accommodation.Standard.twin.child = Math.floor(remainingChildren / 2) // Pair as many children as possible
	remainingChildren %= 2 // Remainder children

	accommodation.Standard.single.child = remainingChildren // Put remaining children in single rooms

	// Luxury accommodations can be filled similarly if needed
	// Assuming Standard takes priority and Luxury is for overflow
	return accommodation
}

// Example Usage
const guests: Guests = { guestAdults: 3, guestChildren: 5 }
console.log(
	predictAccommodation(guests, null), // Handles null
)

export default predictAccommodation
