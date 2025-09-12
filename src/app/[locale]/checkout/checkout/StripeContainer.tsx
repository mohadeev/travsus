'use client'
import type React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CustomStripeForm from './CustomStripeForm'

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

interface StripeContainerProps {
	userId?: string
	userEmail?: string
	booking?: any
}

const StripeContainer: React.FC<StripeContainerProps> = ({
	userId,
	userEmail,
	booking,
}) => {
	return (
		<Elements stripe={stripePromise}>
			<CustomStripeForm
				userId={userId}
				booking={booking}
				userEmail={userEmail}
			/>
		</Elements>
	)
}

export default StripeContainer
