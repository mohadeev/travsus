import { toggleTawdWidget } from '@/app/[locale]/GlobalRedux/Features/overlaySlice/overlaySlice'
import { Phone, MessageCircle } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useTranslations } from '@/lib/i18n'

export default function ContactReservations() {
	const dispatch = useDispatch()
	const t = useTranslations('ContactReservations')

	const hanelToggle = () => {
		dispatch(toggleTawdWidget({ value: true }))
	}

	return (
		<div className="mt-6 w-full max-w-md rounded-lg bg-[#F5F5F7] p-8 shadow-sm">
			<h2 className="mb-6 text-base font-semibold text-gray-800">
				{t('questions_about_reservations')}
			</h2>

			<div className="flex flex-col space-y-4 sm:flex-row sm:gap-6 sm:space-y-0">
				<div className="flex items-center gap-3">
					<Phone className="h-5 w-5 text-gray-600" />
					<a
						href="tel:+34643635962"
						className="text-xs font-medium text-gray-700 underline"
					>
						+34 643 63 59 62
					</a>
				</div>

				<button onClick={hanelToggle} className="flex items-center gap-3">
					<MessageCircle className="h-5 w-5 text-gray-600" />
					<span className="text-xs font-medium text-gray-700 underline">
						{t('chat_now')}
					</span>
				</button>
			</div>
		</div>
	)
}
