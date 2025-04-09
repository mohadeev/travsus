'use client'

import { X } from 'lucide-react'
import Logo from '@/shared/Logo'
import { useEffect } from 'react'

interface DiscountSuccessModalProps {
	isOpen: boolean
	onClose: () => void
	discountAmount: number
	discountCode: string
}

export default function DiscountSuccessModal({
	isOpen,
	onClose,
	discountAmount,
	discountCode,
}: DiscountSuccessModalProps) {
	// Format the discount amount as currency
	const formattedDiscount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 2,
	}).format(Math.abs(discountAmount))

	// Prevent scrolling when modal is open
	useEffect(() => {
		if (isOpen) {
			// Disable scrolling on body
			document.body.style.overflow = 'hidden'
		}

		// Cleanup function to re-enable scrolling when modal closes or component unmounts
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="relative w-[90%] max-w-md overflow-hidden rounded-lg bg-white">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute right-4 top-4 z-10 text-black"
				>
					<X className="h-6 w-6" />
				</button>

				{/* Logo at top */}
				<div className="px-8 pt-4">
					<Logo className="h-[40px] w-[100px]" />
				</div>

				{/* Content */}
				<div className="flex flex-col justify-between">
					<div className="px-8 py-6">
						<div className="text-center">
							<h1 className="text-6xl font-black leading-tight text-black">
								Discount Applied!
							</h1>
							<div className="mb-6 mt-4">
								<div className="relative">
									<div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transform bg-gray-200"></div>
									<div className="relative inline-block bg-black px-4 py-1 text-4xl font-extrabold tracking-widest text-white">
										{formattedDiscount}
									</div>
								</div>
							</div>
						</div>

						<p className="mt-8 text-center text-gray-600">
							Congratulations! Your promo code{' '}
							<span className="font-bold">{discountCode}</span> has been
							successfully applied to your booking. Enjoy your savings!
						</p>
					</div>

					{/* Footer */}
					<div className="border-t border-gray-200 bg-white px-8 py-4">
						<button
							onClick={onClose}
							className="w-full rounded bg-black py-3 font-medium text-white hover:bg-gray-800"
						>
							CONTINUE BOOKING
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
