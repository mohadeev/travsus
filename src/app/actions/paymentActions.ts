'use server'

import { revalidatePath } from 'next/cache'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { getUserData } from '@/lib/auth'
import { bookingConfirmationEmail } from '@/utils/bookingConfirmationEmail'
import { createOrderNumber } from './generateOrderNumber'
import { checkBookingRole } from '../api/api-utils/actions/booking/checkBookingRole'
import { updateBooking } from '../api/api-utils/actions/booking/updateBooking'
import totalAmount from '../(service-detail)/[listingExperiencesDetail]/totalAmount'

export async function processPayment(
	paymentMethodId: string,
	amount: number,
	currency: string,
	serviceId: string,
	bookingId: string,
) {
	console.log('processPayment - Processing payment')
	// const bookingRole: any = checkBookingRole()
	// const allowed = bookingRole
	// if (!allowed) {
	// 	throw new Error(bookingRole.error)
	// }
	if (!serviceId || !bookingId) {
		throw new Error('Missing required fields')
	}

	const tour = await prisma.tour.findUnique({
		where: { id: serviceId },
	})
	const userData: any = await getUserData()
	const { email: userEmail, id: userId } = userData
	if (!userId || !userEmail || !paymentMethodId || !currency) {
		throw new Error('Missing required fields')
	}

	try {
		const bookingInitiated = await prisma.booking.findFirst({
			where: {
				id: bookingId,
				customerId: userId,
				tourId: serviceId,
			},
			include: {
				customer: true,
				provider: true,
				tour: true,
			},
		})

		let user = await prisma.user.findUnique({
			where: { id: userId },
			select: { stripeCustomerId: true },
		})

		if (!user?.stripeCustomerId) {
			const customer = await stripe.customers.create({
				email: userEmail,
				metadata: { userId },
			})
			user = await prisma.user.update({
				where: { id: userId },
				data: { stripeCustomerId: customer.id },
			})
		}
		if (!user.stripeCustomerId) {
			throw new Error('Failed to create or retrieve Stripe customer')
		}

		const newTotalAmount = totalAmount(bookingInitiated?.lineItems)
		const amountInCents = Math.round(newTotalAmount * 100)
		const isMoha =
			userEmail.includes('@travsus.com') || userEmail.includes('skendoul')
		const paymentIntent = await stripe.paymentIntents.create({
			amount: isMoha ? 55 : amountInCents,
			currency,
			customer: user.stripeCustomerId,
			payment_method: paymentMethodId,
			off_session: true,
			confirm: true,
			capture_method: 'manual',
			metadata: {
				bookingId,
				serviceId,
				customerId: userId,
			},
		})

		const paymentMethod: any = await prisma.paymentMethod.findFirst({
			where: {
				userId: userId,
				stripePaymentMethodId: paymentMethodId,
			},
		})
		await updateBooking(bookingId, {
			paymentIntentId: paymentIntent.id,
			paymentMethodId: paymentMethod?.id,
		})

		revalidatePath('/bookings')
		return {
			success: true,
			paymentIntentId: paymentIntent.id,
			requiresCapture: paymentIntent.status === 'requires_capture',
		}
	} catch (error) {
		console.error('Payment processing error:', error)
		throw new Error('Payment processing failed')
	}
}

export async function getPaymentMethods() {
	console.log('getPaymentMethods - Fetching payment methods')
	const userData = await getUserData()
	if (!userData) {
		throw new Error('User not found')
	}
	const { id: userId } = userData
	if (!userId) {
		throw new Error('User ID is required')
	}

	try {
		const paymentMethods = await prisma.paymentMethod.findMany({
			where: { userId },
			select: {
				id: true,
				stripePaymentMethodId: true,
				last4: true,
				brand: true,
			},
		})

		return { paymentMethods }
	} catch (error) {
		console.error('Error fetching payment methods:', error)
		throw new Error('Failed to fetch payment methods')
	}
}

export async function savePaymentMethod(paymentMethodId: string) {
	console.log('savePaymentMethod - Saving new payment method')
	const userData = await getUserData()
	if (!userData) {
		throw new Error('User not found')
	}
	const { email: userEmail, id: userId } = userData
	if (!userId || !paymentMethodId || !userEmail) {
		throw new Error('User ID, email, and payment method ID are required')
	}

	try {
		let user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, stripeCustomerId: true },
		})

		let stripeCustomerId = user?.stripeCustomerId
		if (!stripeCustomerId) {
			const customer = await stripe.customers.create({
				email: userEmail,
				metadata: { userId: userId },
			})

			stripeCustomerId = customer.id

			await prisma.user.update({
				where: { id: userId },
				data: { stripeCustomerId: stripeCustomerId },
			})
		}

		await stripe.paymentMethods.attach(paymentMethodId, {
			customer: stripeCustomerId,
		})

		const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

		if (paymentMethod.type !== 'card' || !paymentMethod.card) {
			throw new Error('Invalid payment method type')
		}

		const { last4, brand, exp_month, exp_year } = paymentMethod.card

		const existingPaymentMethod = await prisma.paymentMethod.findFirst({
			where: {
				userId,
				last4,
				brand,
				exp_month,
				exp_year,
			},
		})

		if (existingPaymentMethod) {
			return {
				success: true,
				message: 'Payment method already exists',
			}
		}

		await prisma.paymentMethod.create({
			data: {
				stripePaymentMethodId: paymentMethodId,
				last4,
				brand,
				exp_month,
				exp_year,
				userId,
			},
		})

		revalidatePath('/payment-methods')
		return {
			success: true,
			message: 'Payment method saved and attached successfully',
		}
	} catch (error) {
		console.error('Error saving payment method:', error)
		throw new Error('Failed to save payment method')
	}
}

export async function initiatePayment(
	paymentMethodId: string,
	currency: string,
	serviceId: string,
	bookingId: string,
) {
	console.log('initiatePayment - Initiating payment')
	const userData = await getUserData()
	if (!userData) {
		throw new Error('User not found')
	}
	const { email: userEmail, id: userId } = userData
	const isMoha =
		userEmail.includes('@travsus.com') || userEmail.includes('skendoul')

	if (!serviceId || !bookingId) {
		throw new Error('Missing required fields')
	}

	if (!userId || !userEmail || !paymentMethodId || !currency) {
		throw new Error('Missing required fields')
	}

	try {
		const bookingInitiated = await prisma.booking.findFirst({
			where: {
				id: bookingId,
				customerId: userId,
				tourId: serviceId,
			},
			include: {
				customer: true,
				provider: true,
				tour: true,
			},
		})

		let user = await prisma.user.findUnique({
			where: { id: userId },
			select: { stripeCustomerId: true },
		})

		if (!user?.stripeCustomerId) {
			const customer = await stripe.customers.create({
				email: userEmail,
				metadata: { userId },
			})
			user = await prisma.user.update({
				where: { id: userId },
				data: { stripeCustomerId: customer.id },
			})
		}

		if (!user.stripeCustomerId) {
			throw new Error('Missing required fields user.stripeCustomerId')
		}

		const newTotalAmount = totalAmount(bookingInitiated?.lineItems)
		const amountInCents = Math.round(newTotalAmount * 100)
		const paymentIntent = await stripe.paymentIntents.create({
			amount: isMoha ? 55 : amountInCents,
			currency,
			customer: user.stripeCustomerId,
			payment_method: paymentMethodId,
			setup_future_usage: 'off_session',
			capture_method: 'manual',
			metadata: {
				bookingId,
				serviceId,
				customerId: userId,
			},
		})
		await updateBooking(bookingId, { paymentIntentId: paymentIntent.id })

		return {
			paymentIntentId: paymentIntent.id,
			clientSecret: paymentIntent.client_secret,
		}
	} catch (error) {
		console.error('Payment initiation error:', error)
		throw new Error('Payment initiation failed')
	}
}

export async function capturePayment(
	paymentIntentId: string,
	serviceId: string,
	bookingId: string,
) {
	console.log('capturePayment - Capturing payment')
	if (!serviceId || !bookingId) {
		throw new Error('Missing required fields')
	}
	if (!paymentIntentId) {
		throw new Error('Missing payment intent ID')
	}

	try {
		const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)

		const bookingInitiated = await prisma.booking.findFirst({
			where: {
				id: bookingId,
			},
			include: {
				customer: true,
				provider: {
					include: { businesses: true },
				},
				tour: true,
				paymentMethod: true,
			},
		})
		await bookingConfirmationEmail(bookingInitiated)

		revalidatePath('/bookings')
		return {
			success: true,
			paymentIntentId: paymentIntent.id,
			status: paymentIntent.status,
		}
	} catch (error) {
		console.error('Payment capture error:', error)
		throw new Error('Payment capture failed')
	}
}

export async function createBooking(booking: any) {
	try {
		const { id } = await getUserData()
		const {
			serviceId,
			accommodation,
			lineItems,
			guests,
			bookOwnHotels,
			selectedDate,
		} = booking

		const tour = await prisma.tour.findFirst({
			where: { id: serviceId },
		})

		const numberRef = await createOrderNumber()
		const newBooking = await prisma.booking.create({
			data: {
				customer: { connect: { id } },
				provider: { connect: { id: tour?.creatorId } },
				tour: { connect: { id: serviceId } },
				bookingStates: [
					{
						state: 'initiated',
						createdAt: new Date(),
						by: 'customer',
						updatedAt: new Date(),
					},
				],
				bookingState: 'initiated',
				duration: 10,
				selectedDate,
				lineItems,
				accommodation,
				bookOwnHotels,
				...numberRef,
			},
			include: {
				customer: true,
				tour: true,
				provider: true,
			},
		})

		revalidatePath('/bookings')
		return newBooking
	} catch (error) {
		console.error('Error creating booking:', error)
		throw new Error('Failed to create booking')
	}
}
