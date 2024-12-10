interface Booking {
	id: string
	selectedDate: { startDate: number; endDate: number }
	customer: {
		accountData: { firstname: string; lastname: string }
		email: string
		phone?: string
	}
	createdAt: string
	provider: {
		accountData: { firstname: string; lastname: string }
		email: string
	}
	tour: {
		name: string
		overview: string
		duration: number
		price: string
		highlights: string[]
		start: { date: string }
		end: { date: string }
		images: { url: string }[]
	}
	lineItems: {
		description: string
		unitPrice: number
		totalPrice: number
		currency: string
	}[]
	accommodation: {
		Standard: Record<string, { adult: number; child: number }>
		Luxury: Record<string, { adult: number; child: number }>
	}
	guests: {
		guestAdults: number
		guestChildren: number
	}
	totalPrice?: number
	paymentIntentId?: string
	bookingState: string
	duration: number
	invoiceNumber?: string
	receiptNumber?: string
	orderNumber?: String
	bookingReference?: String
}

interface BookingSummary {
	bookingId: string
	bookingState: string
	dates: { startDate: string; endDate: string }
	orderDate?: String
	customer: { name: string; email: string; phone: string }
	provider: { name: string; email: string }
	tour: {
		name: string
		overview: string
		duration: string
		price: string
		highlights: string[]
		start: string
		end: string
		images: string[]
	}
	accommodation: {
		Standard: Record<string, { adult: number; child: number }>
		Luxury: Record<string, { adult: number; child: number }>
	}
	guests: {
		adults: number
		children: number
		total: number
	}
	lineItems: {
		description: string
		unitPrice: number
		totalPrice: number
		currency: string
	}[]
	totalPrice: number
	paymentIntentId: string
	invoiceNumber?: string
	receiptNumber?: string
	orderNumber?: String
	bookingReference?: String
}
interface Obj {
	booking: Booking
	paymentIntent?: any
}

export const extractBookingDetails = async ({ booking }: Obj) => {
	if (!booking) {
		console.error('Booking data is missing')
	}

	const {
		id,
		selectedDate,
		customer,
		provider,
		tour,
		lineItems,
		accommodation,
		guests,
		totalPrice,
		paymentIntentId,
		bookingState,
		duration,
		invoiceNumber,
		receiptNumber,
		orderNumber,
		bookingReference,
	} = booking

	return {
		bookingId: id,
		bookingState: bookingState || 'Unknown',
		dates: {
			startDate: new Date(selectedDate?.startDate) || 'N/A',
			endDate: new Date(selectedDate?.endDate) || 'N/A',
		},
		orderDate: new Date(booking?.createdAt).toLocaleDateString(),
		customer: {
			name:
				`${customer?.accountData?.firstname} ${customer?.accountData?.lastname}` ||
				'Unknown',
			email: customer?.email || 'N/A',
			phone: customer?.phone || 'N/A',
		},
		provider: {
			name:
				`${provider?.accountData?.firstname} ${provider?.accountData?.lastname}` ||
				'Unknown',
			email: provider?.email || 'N/A',
		},
	}
}
