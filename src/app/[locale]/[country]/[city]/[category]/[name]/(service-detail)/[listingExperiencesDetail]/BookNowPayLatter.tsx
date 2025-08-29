// components/BookNowPayLater.tsx
import { FC } from 'react'
import { CalendarX, CreditCard, Clock, LockKeyhole } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const BookNowPayLater: FC = () => {
	const t = useTranslations('BookNowPayLater')

	return (
		<div className="mx-auto w-full max-w-md">
			{/* Booking Component */}
			<div className="overflow-hidden rounded-xl border bg-white">
				{/* Content */}
				<div className="p-4">
					{/* Free cancellation */}
					<div className="mb-4 flex items-start">
						<div className="mr-3 flex-shrink-0 rounded-full bg-[#28a745] p-2">
							<CalendarX className="text-white" size={16} />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-800">
								{t('free_cancellation')}
							</p>
							<div className="mt-0.5 flex items-center text-xs text-gray-500">
								<Clock className="mr-1" size={12} />
								{t('experience_starts')}
							</div>
						</div>
					</div>

					{/* Reserve now */}
					<div className="flex items-start">
						<div className="mr-3 flex-shrink-0 rounded-full bg-[#28a745] p-2">
							<CreditCard className="text-white" size={16} />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-800">
								{t('reserve_now_pay_later')}
							</p>
							<div className="mt-0.5 flex items-center text-xs text-gray-500">
								<LockKeyhole className="mr-1" size={12} />
								{t('secure_spot_flexible')}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BookNowPayLater
