import React from 'react'
import { Calendar, CheckCircle, DollarSign } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const PremiumTourBenefits: React.FC = () => {
	const t = useTranslations('PremiumTourBenefits')

	return (
		<div className="bg-white">
			{/* Free Cancellation */}
			<div className="flex items-start pb-4">
				<Calendar className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
				<div>
					<h3 className="font-medium text-gray-900">
						{t('free_cancellation')}
					</h3>
					<p className="mt-1 text-sm text-gray-600">
						{t('free_cancellation_description')}
					</p>
				</div>
			</div>

			{/* Reserve Now, Pay Later */}
			<div className="flex items-start pb-4 pt-4">
				<CheckCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
				<div>
					<h3 className="font-medium text-gray-900">
						{t('reserve_now_pay_later')}
					</h3>
					<p className="mt-1 text-sm text-gray-600">
						{t('reserve_now_pay_later_description')}
					</p>
				</div>
			</div>

			{/* Lowest Price Guaranteed */}
			<div className="flex items-start pt-4">
				<DollarSign className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-gray-600" />
				<div>
					<h3 className="font-medium text-gray-900">
						{t('lowest_price_guaranteed')}
					</h3>
					<p className="mt-1 text-sm text-gray-600">
						{t('lowest_price_guaranteed_description')}
					</p>
				</div>
			</div>
		</div>
	)
}

export default PremiumTourBenefits
