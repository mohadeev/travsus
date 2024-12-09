import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { getUserData } from '@/lib/auth'
import travsusSdk from '../api-utils/travsusSdk'

export async function POST(request: NextRequest) {
	main()
		.then(() => console.log('All tours updated successfully'))
		.catch((error) => console.error('Error in main function:', error))
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
	const duration = tour?.days.length || 0
	// console.log(tour?.pricingTiers)
	// const getPriceTier = await travsusSdk({
	// 	subAction: 'findSpisificPricingTiers',
	// 	range: duration,
	// 	tour,
	// })
	// console.log(getPriceTier)

	// const tourId = serviceId
	const price = Number(tour?.price || 0)
	const body = await request.json()
	const { totalGuests } = body
	const totalPerPerson = handleCalcultePriceForGuests(
		totalGuests,
		price,
		duration,
	)
	const lineItems = [
		{
			description: 'transport',
			unitPrice: totalPerPerson.unitPrice,
			totalPrice: totalPerPerson.totalPrice,
			totalGuests: totalPerPerson.totalGuests,
			serviceQuantity: totalPerPerson.serviceQuantity,
		},
	]
	return NextResponse.json({ lineItems }, { status: 200 })
}

const handleCalcultePriceForGuests = (
	totalGuests: number,
	pricePerDay: number,
	dueartion: number,
) => {
	const totalPrice = Number((pricePerDay * dueartion).toFixed(2))
	const perPerson = Number((totalPrice / totalGuests).toFixed(2))
	const isMorethen20 = totalGuests > 20 ? calculateBuses(totalGuests) : 1

	return {
		unitPrice: perPerson,
		totalGuests: totalGuests,
		serviceQuantity: isMorethen20,
		totalPrice: totalPrice,
	}
}

function generateAndLogRandomNumber() {
	const min = 500
	const max = 1000
	const randomNumber = Math.floor(Math.random() * (max - min + 1) + min)

	console.log(`Generated random number: ${randomNumber}`)

	return randomNumber
}

function analyzeTransport(number: number) {
	if (number <= 20) {
		console.log(`${number} is not greater than 50.`)
		return 1
	}
	calculateBuses(number)
}

function calculateBuses(passengerCount: number) {
	return Math.ceil(passengerCount / 40)
}

// async function findAllTours() {
// 	try {
// 		const tours = await prisma.tour.findMany()
// 		// console.log('All tours:', tours)
// 		return tours
// 	} catch (error) {
// 		console.error('Error finding tours:', error)
// 		throw error
// 	}
// }

// async function main() {
// 	try {
// 		const allTours = await findAllTours()
// 		console.log(`Found ${allTours.length} tours`)
// 	} catch (error) {
// 		console.error('An error occurred:', error)
// 	} finally {
// 		await prisma.$disconnect()
// 	}
// }

// main()

// // Test cases
// console.log('10 passengers:', calculateBuses(10))
// console.log('20 passengers:', calculateBuses(20))
// console.log('35 passengers:', calculateBuses(35))
// console.log('40 passengers:', calculateBuses(40))
// console.log('41 passengers:', calculateBuses(41))
// console.log('79 passengers:', calculateBuses(79))
// console.log('80 passengers:', calculateBuses(80))
// console.log('81 passengers:', calculateBuses(81))
// console.log('120 passengers:', calculateBuses(120))
// console.log('200 passengers:', calculateBuses(200))
async function updateTourPricingTiers(tourId: string, newPricingTiers: any[]) {
	return prisma.$transaction(async (tx) => {
		// First, remove existing pricing tiers
		await tx.tour.update({
			where: { id: tourId },
			data: { pricingTiers: { set: [] } },
		})

		// Then, add new pricing tiers one by one
		for (const tier of newPricingTiers) {
			await tx.tour.update({
				where: { id: tourId },
				data: {
					pricingTiers: {
						push: tier,
					},
				},
			})
		}

		// Finally, fetch and return the updated tour
		return tx.tour.findUnique({
			where: { id: tourId },
			include: { pricingTiers: true },
		})
	})
}

async function findAllTours() {
	return prisma.tour.findMany({
		select: { id: true, days: true },
	})
}

async function main() {
	try {
		const allTours = await findAllTours()

		for (const { days, id } of allTours) {
			const daysLength = days.length
			if (daysLength >= 4) {
				const tx = 120
				const vito = 130
				const miniBus = 180
				const bigBus = 500
				const txTotal = 450
				const vitoTotal = 500
				const miniBusTotal = 600
				const bigBusTotal = 800
				const dataUp3Days = [
					{
						minSeats: 1,
						maxSeats: 5,
						pricing: {
							pricePerDay: parseFloat((txTotal / daysLength).toFixed(2)),
							totalPrice: parseFloat(txTotal.toFixed(2)),
							currency: 'EUR',
						},
					},
					{
						minSeats: 6,
						maxSeats: 9,
						pricing: {
							pricePerDay: parseFloat((vitoTotal / daysLength).toFixed(2)),
							totalPrice: parseFloat(vitoTotal.toFixed(2)),
							currency: 'EUR',
						},
					},
					{
						minSeats: 10,
						maxSeats: 19,
						pricing: {
							pricePerDay: parseFloat((miniBusTotal / daysLength).toFixed(2)),
							totalPrice: parseFloat(miniBusTotal.toFixed(2)),
							currency: 'EUR',
						},
					},
					{
						minSeats: 20,
						maxSeats: 40,
						pricing: {
							pricePerDay: parseFloat((bigBusTotal / daysLength).toFixed(2)),
							totalPrice: parseFloat(bigBusTotal.toFixed(2)),
							currency: 'EUR',
						},
					},
				]
				const dataUp4Days = [
					{
						minSeats: 1,
						maxSeats: 5,
						pricing: {
							pricePerDay: tx, ////parseFloat((tx / daysLength).toFixed(2)),
							totalPrice: parseFloat((tx * daysLength).toFixed(2)),
							currency: 'EUR',
						},
					},
					{
						minSeats: 6,
						maxSeats: 9,
						pricing: {
							pricePerDay: vito, //parseFloat((vito / daysLength).toFixed(2)),
							totalPrice: parseFloat((vito * daysLength).toFixed(2)),
							currency: 'EUR',
						},
					},
					{
						minSeats: 10,
						maxSeats: 19,
						pricing: {
							pricePerDay: miniBus, //parseFloat((miniBus / daysLength).toFixed(2)),
							totalPrice: parseFloat((miniBus * daysLength).toFixed(2)),
							currency: 'EUR',
						},
					},
					{
						minSeats: 20,
						maxSeats: 40,
						pricing: {
							pricePerDay: bigBus, //parseFloat((bigBus / daysLength).toFixed(2)),
							totalPrice: parseFloat((bigBus * daysLength).toFixed(2)),
							currency: 'EUR',
						},
					},
				]

				// const updatedTour = await updateTourPricingTiers(id, dataUp3Days)
				const updatedTour = await updateTourPricingTiers(id, dataUp4Days)

				console.log(
					`Tour ${id} updated successfully:`,
					updatedTour.pricingTiers,
				)
			}
		}
	} catch (error) {
		console.error('Failed to update tours:', error)
	} finally {
		await prisma.$disconnect()
	}
}
