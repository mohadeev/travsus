export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import travsusSdk from '../api-utils/travsusSdk'
import calculateAccommodationPrice from './calculateAccommodationPrice'
import { countGuests } from '../api-utils/actions/countGuestsFromAccomodation'
import generateGuestsObject from './generateGuestsObject'
import predictAccommodation from './predictAccommodation'
import taxLineItem from './taxLineItem'
import { saveLastBookingUpdates } from '../api-utils/actions/booking/saveLastBookingUpdates'
import { updateLineItemsLogic } from './updateLineItemsLogic'

export async function POST(request: NextRequest) {
	const referer = request.headers.get('referer') || ''
	const url = new URL(referer)
	const searchParams = url.searchParams
	const serviceId = searchParams.get('serviceId')

	if (!serviceId) {
		return null
	}

	const tour = await prisma.tour.findUnique({
		where: { id: serviceId },
	})
	const lineItems: any = []
	const body = await request.json()
	let { guests, accommodation, booking, bookOwnHotels, selectedDate } = body
	const accommodations: any = tour?.accommodations

	let accommodationLineItem: any = {}
	if (accommodation) {
		accommodationLineItem = calculateAccommodationPrice(
			accommodation,
			accommodations,
			true,
		)
		lineItems.push(accommodationLineItem)
		const newGuest = generateGuestsObject(accommodation)
		guests = newGuest
		const totalGuests: number = guests.guestAdults + guests.guestChildren
		const getPriceTier = await travsusSdk({
			subAction: 'findSpisificPricingTiers',
			totalGuests: totalGuests,
			tour,
		})
		let totalPerPerson: any = await handleCalcultePriceForGuests(
			totalGuests,
			getPriceTier?.pricing?.totalPrice,
		)
		const transportLineItem = {
			description: 'transport',
			unitPrice: totalPerPerson.unitPrice,
			totalPrice: totalPerPerson.totalPrice,
			totalGuests: totalPerPerson.totalGuests,
			serviceQuantity: totalPerPerson.serviceQuantity,
			includeInTotal: true,
			currency: 'EUR',
		}
		console.log('transportLineItem:', transportLineItem)
		lineItems.push(transportLineItem)
	} else if (guests) {
		const totalGuests: number = guests.guestAdults + guests.guestChildren
		const getPriceTier = await travsusSdk({
			subAction: 'findSpisificPricingTiers',
			totalGuests: totalGuests,
			tour,
		})
		let totalPerPerson = await handleCalcultePriceForGuests(
			totalGuests,
			getPriceTier?.pricing?.totalPrice,
		)
		const transportLineItem = {
			description: 'transport',
			unitPrice: totalPerPerson?.unitPrice,
			totalPrice: totalPerPerson?.totalPrice,
			totalGuests: totalPerPerson?.totalGuests,
			serviceQuantity: totalPerPerson?.serviceQuantity,
			includeInTotal: true,
			currency: 'EUR',
		}
		const currentAccommodation = booking.accommodation
		const newAccommodation: any = predictAccommodation(
			guests,
			currentAccommodation,
		)
		accommodation = newAccommodation
		accommodationLineItem = calculateAccommodationPrice(
			accommodation,
			accommodations,
			false,
		)
		lineItems.push(accommodationLineItem)
		if (totalPerPerson?.unitPrice && totalPerPerson?.totalGuests) {
			lineItems.push(transportLineItem)
		}
	} else {
		accommodation = {}
		guests = { guestAdults: 2, guestChildren: 0 }

		const totalGuests: number = guests.guestAdults + guests.guestChildren
		const getPriceTier = await travsusSdk({
			subAction: 'findSpisificPricingTiers',
			totalGuests: totalGuests,
			tour,
		})
		let totalPerPerson = await handleCalcultePriceForGuests(
			totalGuests,
			getPriceTier?.pricing?.totalPrice,
		)
		const transportLineItem = {
			description: 'transport',
			unitPrice: totalPerPerson?.unitPrice,
			totalPrice: totalPerPerson?.totalPrice,
			totalGuests: totalPerPerson?.totalGuests,
			serviceQuantity: totalPerPerson?.serviceQuantity,
			includeInTotal: true,
			currency: 'EUR',
		}
		const currentAccommodation = booking.accommodation
		const newAccommodation: any = predictAccommodation(
			guests,
			currentAccommodation,
		)
		accommodation = newAccommodation

		accommodationLineItem = calculateAccommodationPrice(
			accommodation,
			accommodations,
			true,
		)

		lineItems.push(accommodationLineItem)
		if (totalPerPerson?.unitPrice && totalPerPerson?.totalGuests) {
			lineItems.push(transportLineItem)
		}
	}
	const newTaxLineItem = taxLineItem(lineItems)
	lineItems.push(newTaxLineItem)

	// console.log('guests', guests)
	const newbooking = {
		lineItems,
		guests,
		accommodation,
		bookOwnHotels,
		selectedDate,
	}
	// console.log('accommodation', accommodation)
	const newData = await updateLineItemsLogic({ tour, body })
	console.log('newData: ', newData)
	await saveLastBookingUpdates({ request, booking: newbooking })
	return NextResponse.json({ ...newData, ...{ status: 200 } })
}

const handleCalcultePriceForGuests = (totalGuests: number, price: number) => {
	const isMorethen20 = totalGuests > 20 ? calculateBuses(totalGuests) : 1
	const totalPrice = isMorethen20 * price
	const perPerson = Number((totalPrice / totalGuests).toFixed(2))
	return {
		unitPrice: perPerson,
		totalGuests: totalGuests,
		serviceQuantity: isMorethen20,
		totalPrice: totalPrice,
	}
}

function calculateBuses(passengerCount: number) {
	return Math.ceil(passengerCount / 40)
}
