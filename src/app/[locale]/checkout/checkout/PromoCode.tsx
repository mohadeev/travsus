'use client'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { updateBookingLineItems } from '@/app/[locale]/GlobalRedux/Features/bookingSlice/bookingSlice'
import { useDispatch } from 'react-redux'
import confetti from 'canvas-confetti'
import DiscountSuccessModal from './DiscountSuccessModal'
import { useTranslations } from '@/lib/i18n'

export default function PromoCodeForm() {
	const t = useTranslations('Jan03_PromoCode_r5n8')
	const searchParams = useSearchParams()
	const bookingId = searchParams.get('bookingId') // Get bookingId from URL
	const [promoCode, setPromoCode] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [message, setMessage] = useState('')
	const [showConfetti, setShowConfetti] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [discountAmount, setDiscountAmount] = useState(0)
	const dispatch = useDispatch()

	// Define custom shapes
	const getCustomShapes = () => {
		// Pumpkin shape
		const pumpkin = confetti.shapeFromPath({
			path: 'M449.4 142c-5 0-10 .3-15 1a183 183 0 0 0-66.9-19.1V87.5a17.5 17.5 0 1 0-35 0v36.4a183 183 0 0 0-67 19c-4.9-.6-9.9-1-14.8-1C170.3 142 105 219.6 105 315s65.3 173 145.7 173c5 0 10-.3 14.8-1a184.7 184.7 0 0 0 169 0c4.9.7 9.9 1 14.9 1 80.3 0 145.6-77.6 145.6-173s-65.3-173-145.7-173zm-220 138 27.4-40.4a11.6 11.6 0 0 1 16.4-2.7l54.7 40.3a11.3 11.3 0 0 1-7 20.3H239a11.3 11.3 0 0 1-9.6-17.5zM444 383.8l-43.7 17.5a17.7 17.7 0 0 1-13 0l-37.3-15-37.2 15a17.8 17.8 0 0 1-13 0L256 383.8a17.5 17.5 0 0 1 13-32.6l37.3 15 37.2-15c4.2-1.6 8.8-1.6 13 0l37.3 15 37.2-15a17.5 17.5 0 0 1 13 32.6zm17-86.3h-82a11.3 11.3 0 0 1-6.9-20.4l54.7-40.3a11.6 11.6 0 0 1 16.4 2.8l27.4 40.4a11.3 11.3 0 0 1-9.6 17.5z',
			matrix: [
				0.020491803278688523, 0, 0, 0.020491803278688523, -7.172131147540983,
				-5.9016393442622945,
			],
		})

		// Tree shape
		const tree = confetti.shapeFromPath({
			path: 'M120 240c-41,14 -91,18 -120,1 29,-10 57,-22 81,-40 -18,2 -37,3 -55,-3 25,-14 48,-30 66,-51 -11,5 -26,8 -45,7 20,-14 40,-30 57,-49 -13,1 -26,2 -38,-1 18,-11 35,-25 51,-43 -13,3 -24,5 -35,6 21,-19 40,-41 53,-67 14,26 32,48 54,67 -11,-1 -23,-3 -35,-6 15,18 32,32 51,43 -13,3 -26,2 -38,1 17,19 36,35 56,49 -19,1 -33,-2 -45,-7 19,21 42,37 67,51 -19,6 -37,5 -56,3 25,18 53,30 82,40 -30,17 -79,13 -120,-1l0 41 -31 0 0 -41z',
			matrix: [
				0.03597122302158273, 0, 0, 0.03597122302158273, -4.856115107913669,
				-5.071942446043165,
			],
		})

		// Heart shape
		const heart = confetti.shapeFromPath({
			path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
			matrix: [
				0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666,
				-5.533333333333333,
			],
		})

		return { pumpkin, tree, heart }
	}

	// Function to trigger confetti celebration with custom shapes
	useEffect(() => {
		if (showConfetti) {
			const { pumpkin, tree, heart } = getCustomShapes()
			const defaults = {
				scalar: 2,
				spread: 180,
				particleCount: 30,
				origin: { y: 0 }, // Start from the top of the screen
				startVelocity: 35,
			}

			// Launch pumpkin shapes
			confetti({
				...defaults,
				shapes: [pumpkin],
				colors: ['#ff9a00', '#ff7400', '#ff4d00'],
			})

			// Launch tree shapes
			confetti({
				...defaults,
				shapes: [tree],
				colors: ['#8d960f', '#be0f10', '#445404'],
			})

			// Launch heart shapes
			confetti({
				...defaults,
				shapes: [heart],
				colors: ['#f93963', '#a10864', '#ee0b93'],
			})

			// Reset the state after animation
			setTimeout(() => {
				setShowConfetti(false)
			}, 2000)
		}
	}, [showConfetti])

	const handleApplyPromo = async () => {
		if (!promoCode) {
			setMessage(t('Please_Enter_Promo_Code'))
			return
		}

		setIsSubmitting(true)
		setMessage('')

		try {
			const response = await fetch('/api/promo/apply-discount', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: promoCode }), // Only send promo code
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || t('Failed_Apply_Promo_Code'))
			}

			if (data) {
				dispatch(
					updateBookingLineItems({
						value: data.lineItems,
					}),
				)

				// Get the discount amount from the last line item
				if (data.lineItems && data.lineItems.length > 0) {
					const lastLineItem = data.lineItems[data.lineItems.length - 1]
					setDiscountAmount(lastLineItem.totalPrice)
				}
			}

			console.log('updatedBooking: ', data)
			setMessage(t('Promo_Code_Applied_Successfully'))

			// Check if discount was applied successfully
			if (data.discountApplied) {
				// Trigger celebration animation and show modal
				setShowConfetti(true)
				setShowModal(true)
			}
		} catch (error) {
			setMessage(error.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<>
			{/* Success Modal */}
			<DiscountSuccessModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				discountAmount={discountAmount}
				discountCode={promoCode}
			/>
			<Card className="mx-auto my-4 w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						{t('Promo_Code')}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center space-x-2">
						<Input
							id="promoCode"
							placeholder={t('Enter_Promo_Code_Placeholder')}
							className="flex-grow"
							value={promoCode}
							onChange={(e) => setPromoCode(e.target.value)}
							disabled={isSubmitting}
						/>
						<Button
							variant="outline"
							onClick={handleApplyPromo}
							disabled={isSubmitting}
						>
							{isSubmitting ? t('Applying') : t('Apply')}
						</Button>
					</div>
					{message && (
						<p
							className={`mt-2 text-sm ${
								message.includes(t('Promo_Code_Applied_Successfully'))
									? 'text-green-500'
									: 'text-red-500'
							}`}
						>
							{message}
						</p>
					)}
				</CardContent>
			</Card>
		</>
	)
}
