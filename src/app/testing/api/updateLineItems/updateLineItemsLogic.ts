import travsusSdk from '../api-utils/travsusSdk'
import calculateAccommodationPrice from './calculateAccommodationPrice'
import generateGuestsObject from './generateGuestsObject'
import predictAccommodation from './predictAccommodation'
import taxLineItem from './taxLineItem'

interface TourData {
	tour: any
	body: {
		guests?: { guestAdults: number; guestChildren: number }
		accommodation?: any
		booking?: { accommodation: any }
		bookOwnHotels?: boolean
		selectedDate?: string
	}
}

export interface LineItem {
	description: string
	unitPrice: number
	totalPrice: number
	totalGuests: number
	serviceQuantity: number
	includeInTotal: boolean
	currency: string
}

export async function updateLineItemsLogic(data: TourData) {
	const { tour, body } = data
	const lineItems: LineItem[] = []
	let { guests, accommodation, booking } = body
	const accommodations: any = tour?.accommodations

	let accommodationLineItem: any = {}
	if (accommodation) {
		accommodationLineItem = calculateAccommodationPrice(
			accommodation,
			accommodations,
			true,
		)
		lineItems.push(accommodationLineItem)
		guests = generateGuestsObject(accommodation)
		const totalGuests = guests.guestAdults + guests.guestChildren
		const getPriceTier = await travsusSdk({
			subAction: 'findSpisificPricingTiers',
			totalGuests,
			tour,
		})
		const totalPerPerson = await handleCalcultePriceForGuests(
			totalGuests,
			getPriceTier?.pricing?.totalPrice,
		)
		const transportLineItem: LineItem = {
			description: 'transport',
			unitPrice: totalPerPerson.unitPrice,
			totalPrice: totalPerPerson.totalPrice,
			totalGuests: totalPerPerson.totalGuests,
			serviceQuantity: totalPerPerson.serviceQuantity,
			includeInTotal: true,
			currency: 'EUR',
		}
		lineItems.push(transportLineItem)
	} else if (guests) {
		const totalGuests = guests.guestAdults + guests.guestChildren
		const getPriceTier = await travsusSdk({
			subAction: 'findSpisificPricingTiers',
			totalGuests,
			tour,
		})
		const totalPerPerson = await handleCalcultePriceForGuests(
			totalGuests,
			getPriceTier?.pricing?.totalPrice,
		)
		const transportLineItem: LineItem = {
			description: 'transport',
			unitPrice: totalPerPerson.unitPrice,
			totalPrice: totalPerPerson.totalPrice,
			totalGuests: totalPerPerson.totalGuests,
			serviceQuantity: totalPerPerson.serviceQuantity,
			includeInTotal: true,
			currency: 'EUR',
		}
		const currentAccommodation = booking?.accommodation
		accommodation = predictAccommodation(guests, currentAccommodation)
		accommodationLineItem = calculateAccommodationPrice(
			accommodation,
			accommodations,
			false,
		)
		lineItems.push(accommodationLineItem)
		if (totalPerPerson.unitPrice && totalPerPerson.totalGuests) {
			lineItems.push(transportLineItem)
		}
	} else {
		accommodation = {}
		guests = { guestAdults: 2, guestChildren: 0 }
		const totalGuests = guests.guestAdults + guests.guestChildren
		const getPriceTier = await travsusSdk({
			subAction: 'findSpisificPricingTiers',
			totalGuests,
			tour,
		})
		const totalPerPerson = await handleCalcultePriceForGuests(
			totalGuests,
			getPriceTier?.pricing?.totalPrice,
		)
		const transportLineItem: LineItem = {
			description: 'transport',
			unitPrice: totalPerPerson.unitPrice,
			totalPrice: totalPerPerson.totalPrice,
			totalGuests: totalPerPerson.totalGuests,
			serviceQuantity: totalPerPerson.serviceQuantity,
			includeInTotal: true,
			currency: 'EUR',
		}
		const currentAccommodation = booking?.accommodation
		accommodation = predictAccommodation(guests, currentAccommodation)
		accommodationLineItem = calculateAccommodationPrice(
			accommodation,
			accommodations,
			true,
		)
		lineItems.push(accommodationLineItem)
		if (totalPerPerson.unitPrice && totalPerPerson.totalGuests) {
			lineItems.push(transportLineItem)
		}
	}

	const newTaxLineItem = taxLineItem(lineItems)
	lineItems.push(newTaxLineItem)

	const newbooking = {
		lineItems,
		guests,
		accommodation,
	}
	return { ...newbooking, status: 200 }
}

const handleCalcultePriceForGuests = (totalGuests: number, price: number) => {
	const isMoreThan20 = totalGuests > 20 ? calculateBuses(totalGuests) : 1
	const totalPrice = isMoreThan20 * price
	const perPerson = Number((totalPrice / totalGuests).toFixed(2))
	return {
		unitPrice: perPerson,
		totalGuests,
		serviceQuantity: isMoreThan20,
		totalPrice,
	}
}

function calculateBuses(passengerCount: number) {
	return Math.ceil(passengerCount / 40)
}
