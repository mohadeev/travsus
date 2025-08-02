'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from './language-provider'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
	Users,
	CreditCard,
	Loader2,
	CheckCircle,
	AlertCircle,
} from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import StayDatesRangeInput from '@/app/(service-detail)/[listing-experiences-detail]/StayDatesRangeInput'

// Define the tour object
const tour = {
	id: 'morocco-desert-tour',
	name: '3-Day Desert Tour: Marrakech to Merzouga',
}

// Use the provided authentication hook
const useAuthAction = (action) => {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const [isDateSelected, setIsDateSelected] = useState(true)
	const [isShaking, setIsShaking] = useState(false)
	const [showError, setShowError] = useState(false)
	const [currentStatus, setCurrentStatus] = useState('')
	const [booking, setBooking] = useState(null)

	const handleAction = async () => {
		if (!isDateSelected) {
			setIsShaking(true)
			setShowError(true)
			setTimeout(() => setIsShaking(false), 1500) // 3 flashes in 1.5 seconds
		} else {
			setCurrentStatus('loading')
			const createBooking = async () => {
				setCurrentStatus('loading')
				const response = await fetch('/api/bookings', {
					method: 'POST',
					body: JSON.stringify(booking),
				})

				if (!response.ok) {
					console.error('Failed to create booking')
				}

				return response.json()
			}
			createBooking()
				.then((result) => {
					if (result.id) {
						router.push(
							`/checkout/checkout?bookingId=${result.id}&serviceId=${tour.id}`,
						)
					} else {
						alert('no booking created')
					}
					setCurrentStatus('')
				})
				.catch((error) => {
					setCurrentStatus('')
					console.error('Error:', error)
				})
		}
	}

	return [handleAction, isLoading]
}

// Checkout Form Component
function CheckoutForm({ onSuccess, onError }) {
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		setErrorMessage('')

		try {
			// Simulate payment processing
			await new Promise((resolve) => setTimeout(resolve, 2000))

			// Simulate successful payment
			onSuccess()
		} catch (error) {
			console.error('Payment error:', error)
			setErrorMessage('Failed to process payment. Please try again.')
			onError()
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<div className="rounded-md border p-4">
					<Label htmlFor="cardNumber">Card Number</Label>
					<Input
						id="cardNumber"
						placeholder="4242 4242 4242 4242"
						className="mt-1"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label htmlFor="expiry">Expiry Date</Label>
						<Input id="expiry" placeholder="MM/YY" className="mt-1" />
					</div>
					<div>
						<Label htmlFor="cvc">CVC</Label>
						<Input id="cvc" placeholder="123" className="mt-1" />
					</div>
				</div>
			</div>

			{errorMessage && (
				<div className="mt-2 text-sm text-red-500">{errorMessage}</div>
			)}

			<Button
				type="submit"
				disabled={isLoading}
				className="w-full bg-black hover:bg-gray-800"
			>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Processing...
					</>
				) : (
					'Pay Now'
				)}
			</Button>

			<p className="text-muted-foreground mt-4 text-center text-xs">
				Your payment is secure and encrypted. By proceeding, you agree to our
				terms and conditions.
			</p>
		</form>
	)
}

export default function PricingCalculator() {
	const { t, getLocalizedHref } = useLanguage()
	const [tourType, setTourType] = useState<'private' | 'shared'>('private')
	const [people, setPeople] = useState<number>(2)
	const [price, setPrice] = useState<number | null>(null)
	const [pricePerPerson, setPricePerPerson] = useState<number | null>(80) // Default to 80€
	const [selectedDates, setSelectedDates] = useState<{
		startDate: number | null
		endDate: number | null
	}>({
		startDate: new Date().getTime(),
		endDate: new Date(new Date().setDate(new Date().getDate() + 2)).getTime(),
	})
	const [isDateSelected, setIsDateSelected] = useState(true) // Default to true since we have default dates
	const [isShaking, setIsShaking] = useState(false)
	const [showError, setShowError] = useState(false)
	const [currentStatus, setCurrentStatus] = useState('')
	const [booking, setBooking] = useState(null)

	// State for checkout flow
	const [checkoutOpen, setCheckoutOpen] = useState(false)
	const [paymentStatus, setPaymentStatus] = useState<
		'idle' | 'processing' | 'success' | 'error'
	>('idle')
	const [bookingReference, setBookingReference] = useState('')

	// Calculate price automatically when people changes
	useEffect(() => {
		// Fixed price of 80€ per person
		const perPerson = 80
		const totalPrice = perPerson * people

		setPrice(totalPrice)
		setPricePerPerson(perPerson)
	}, [people])

	// Handle date change
	const handleDateChange = (dates) => {
		console.log('Date changed:', dates)
		setSelectedDates(dates)
		setIsDateSelected(!!dates.startDate)
		setShowError(false)
	}

	// Create booking object
	const createBookingObject = () => {
		return {
			tourType,
			people,
			totalPrice: price,
			pricePerPerson,
			date: selectedDates.startDate
				? new Date(selectedDates.startDate).toISOString().split('T')[0]
				: null,
			tourName: '3-Day Desert Tour: Marrakech to Merzouga',
			tourId: 'morocco-desert-tour',
		}
	}

	// Handle successful payment
	const handlePaymentSuccess = () => {
		setPaymentStatus('success')
		// Generate a booking reference
		setBookingReference(
			`BKG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
		)

		// In a real app, you would send a confirmation email here
		console.log('Sending confirmation email...')
	}

	// Handle payment error
	const handlePaymentError = () => {
		setPaymentStatus('error')
	}

	// Use the provided authentication hook
	const handleReserveClick = useAuthAction(async () => {
		if (!isDateSelected) {
			setIsShaking(true)
			setShowError(true)
			setTimeout(() => setIsShaking(false), 1500)
			return
		}

		setCurrentStatus('loading')

		try {
			// Create booking (in a real app, this would be an API call)
			const booking = createBookingObject()
			console.log('Creating booking:', booking)

			// Open checkout modal
			setCheckoutOpen(true)
			setPaymentStatus('idle')
		} catch (error) {
			console.error('Error:', error)
		} finally {
			setCurrentStatus('')
		}
	})

	return (
		<section id="pricing" className="bg-gray-50 py-16 md:py-24">
			<div className="container px-4 md:px-6">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						{t('pricing.title')}
					</h2>
					<p className="text-muted-foreground text-lg">
						Book your adventure today at just{' '}
						<span className="font-bold">80€ per person</span>
					</p>
				</div>

				<div className="mx-auto max-w-lg">
					<Card>
						<CardHeader>
							<CardTitle>Book Your Tour</CardTitle>
							<CardDescription>
								Select your preferred tour type, date, and number of travelers
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<RadioGroup
								value={tourType}
								onValueChange={(value) =>
									setTourType(value as 'private' | 'shared')
								}
								className="space-y-3"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="private" id="private" />
									<Label htmlFor="private" className="flex-1">
										<span className="font-medium">{t('pricing.private')}</span>
										<p className="text-muted-foreground text-sm">
											Exclusive tour for your group only
										</p>
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="shared" id="shared" />
									<Label htmlFor="shared" className="flex-1">
										<span className="font-medium">{t('pricing.shared')}</span>
										<p className="text-muted-foreground text-sm">
											Join other travelers (max 8 people per group)
										</p>
									</Label>
								</div>
							</RadioGroup>

							<div className="space-y-2">
								<Label htmlFor="people">{t('pricing.persons')}</Label>
								<div className="flex items-center space-x-2">
									<Users className="text-muted-foreground h-5 w-5" />
									<Input
										id="people"
										type="number"
										min="1"
										max="100"
										value={people}
										onChange={(e) =>
											setPeople(Number.parseInt(e.target.value) || 1)
										}
										className="w-24"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Select Dates</Label>
								<StayDatesRangeInput
									duration={3}
									onChange={handleDateChange}
									value={selectedDates}
									isFlashing={isShaking}
								/>
								{showError && (
									<p className="mt-1 text-sm text-red-500">
										Please select a date for your tour
									</p>
								)}
							</div>

							{price && pricePerPerson && (
								<div className="bg-muted mt-4 rounded-lg p-4">
									<div className="flex justify-between">
										<span>{t('pricing.perPerson')}:</span>
										<span className="font-bold">
											€{pricePerPerson.toFixed(2)}
										</span>
									</div>
									<div className="mt-2 flex justify-between text-lg">
										<span>{t('pricing.total')}:</span>
										<span className="font-bold text-black">
											€{price.toFixed(2)}
										</span>
									</div>
								</div>
							)}
						</CardContent>
						<CardFooter>
							<Button
								onClick={handleReserveClick}
								disabled={!price || currentStatus === 'loading'}
								className="w-full bg-black text-white hover:bg-gray-800"
							>
								{currentStatus === 'loading' ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Processing...
									</>
								) : (
									<>
										<CreditCard className="mr-2 h-4 w-4" />
										Book Now with Secure Payment
									</>
								)}
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>

			{/* Checkout Dialog */}
			<Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						{paymentStatus === 'idle' && (
							<>
								<DialogTitle>Complete Your Booking</DialogTitle>
								<DialogDescription>
									Secure payment for your 3-Day Desert Tour from Marrakech to
									Merzouga
								</DialogDescription>
							</>
						)}

						{paymentStatus === 'success' && (
							<DialogTitle className="flex items-center justify-center text-center">
								<CheckCircle className="mr-2 h-8 w-8 text-green-500" />
								Booking Confirmed!
							</DialogTitle>
						)}

						{paymentStatus === 'error' && (
							<DialogTitle className="flex items-center justify-center text-center">
								<AlertCircle className="mr-2 h-8 w-8 text-red-500" />
								Payment Failed
							</DialogTitle>
						)}
					</DialogHeader>

					{paymentStatus === 'idle' && (
						<>
							<div className="mb-6 space-y-2">
								<div className="flex justify-between">
									<span className="text-muted-foreground text-sm">Tour:</span>
									<span className="font-medium">
										3-Day Desert Tour: Marrakech to Merzouga
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground text-sm">Date:</span>
									<span className="font-medium">
										{selectedDates.startDate
											? new Date(selectedDates.startDate).toLocaleDateString(
													'en-US',
													{
														month: 'short',
														day: '2-digit',
														year: 'numeric',
													},
												)
											: 'Not selected'}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground text-sm">
										Travelers:
									</span>
									<span className="font-medium">{people}</span>
								</div>
								<div className="mt-2 flex justify-between border-t pt-2">
									<span className="text-sm font-medium">Total:</span>
									<span className="font-bold">€{price?.toFixed(2)}</span>
								</div>
							</div>

							<CheckoutForm
								onSuccess={handlePaymentSuccess}
								onError={handlePaymentError}
							/>
						</>
					)}

					{paymentStatus === 'success' && (
						<div className="space-y-4">
							<div className="rounded-lg bg-gray-50 p-4">
								<p className="text-muted-foreground mb-2 text-sm">
									Booking Reference
								</p>
								<p className="font-medium">{bookingReference}</p>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-muted-foreground text-sm">Tour Date</p>
									<p className="font-medium">
										{selectedDates.startDate
											? new Date(selectedDates.startDate).toLocaleDateString(
													'en-US',
													{
														month: 'short',
														day: '2-digit',
													},
												)
											: 'Not selected'}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Travelers</p>
									<p className="font-medium">{people}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Tour Type</p>
									<p className="font-medium capitalize">{tourType}</p>
								</div>
								<div>
									<p className="text-muted-foreground text-sm">Total Amount</p>
									<p className="font-medium">€{price?.toFixed(2)}</p>
								</div>
							</div>

							<p className="text-muted-foreground text-center text-sm">
								A confirmation email has been sent to your email address.
							</p>

							<Button
								onClick={() => setCheckoutOpen(false)}
								className="w-full bg-black hover:bg-gray-800"
							>
								Close
							</Button>
						</div>
					)}

					{paymentStatus === 'error' && (
						<div className="space-y-4">
							<p className="text-center">
								Your payment could not be processed. Please try again or contact
								our support team.
							</p>

							<div className="flex space-x-2">
								<Button
									onClick={() => setPaymentStatus('idle')}
									className="flex-1 bg-black hover:bg-gray-800"
								>
									Try Again
								</Button>
								<Button
									onClick={() => setCheckoutOpen(false)}
									variant="outline"
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</section>
	)
}
