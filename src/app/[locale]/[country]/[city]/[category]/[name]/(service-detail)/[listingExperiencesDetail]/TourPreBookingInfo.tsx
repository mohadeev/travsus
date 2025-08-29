import {
	Accessibility,
	Phone,
	MessageCircle,
	Info,
	CircleQuestionMark,
	RotateCcw,
} from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { toggleTawdWidget } from '@/app/[locale]/GlobalRedux/Features/overlaySlice/overlaySlice'
import { useDispatch } from 'react-redux'

export default function BookingInfo() {
	const t = useTranslations('BookingInfo')
	const dispatch = useDispatch()
	const hanelToggle = () => {
		dispatch(toggleTawdWidget({ value: true }))
	}
	const textclassName = 'text-xs font-medium text-black underline'

	return (
		<div className="grid grid-cols-1 gap-10 rounded-2xl bg-white p-8 text-gray-800 shadow-sm md:grid-cols-2">
			{/* Accessibility */}
			<div className="flex items-start space-x-3">
				<span className="rounded-full border-2 border-black p-2">
					<Accessibility className="h-6 w-6 shrink-0 text-black" />
				</span>
				<div>
					<h2 className="mb-2 text-lg font-semibold text-black">
						{t('accessibility')}
					</h2>
					<ul className="list-disc space-y-1 pl-5 text-base text-black">
						<li>{t('not_wheelchair_accessible')}</li>
						<li>{t('child_seats_available')}</li>
					</ul>
				</div>
			</div>

			{/* Cancellation Policy */}
			<div className="flex items-start space-x-3">
				<span className="rounded-full border-2 border-black p-2">
					<RotateCcw className="h-6 w-6 shrink-0 text-black" />
				</span>
				<div>
					<h2 className="mb-2 text-lg font-semibold text-black">
						{t('cancellation_policy')}
					</h2>
					<p className={textclassName}>
						{t('cancellation_policy_description')}
					</p>
					<ul className="mt-2 list-disc space-y-1 pl-5 text-base text-black">
						<li>{t('cancellation_less_than_24h')}</li>
					</ul>
					<a
						href="#"
						className="mt-2 inline-block font-semibold text-black hover:underline"
					>
						{t('read_more')}
					</a>
				</div>
			</div>

			{/* Help */}
			<div className="flex items-start space-x-3">
				<span className="rounded-full border-2 border-black p-2">
					<CircleQuestionMark className="h-6 w-6 shrink-0 text-black" />
				</span>
				<div>
					<h2 className="mb-2 text-lg font-semibold text-black">{t('help')}</h2>
					<p className="text-xs font-medium text-black">
						{t('help_description')}{' '}
						<span className="font-semibold">110964P11</span>
					</p>
					<div className="mt-3 space-y-2">
						<p className="flex items-center space-x-2 text-xs font-medium text-black">
							<Phone className="h-5 w-5 text-black" />
							<a
								href="tel:+34911776743"
								className="font-semibold text-black hover:underline"
							>
								+34 643 63 5962
							</a>
						</p>
						<p className="flex items-center space-x-2 text-xs font-medium text-black">
							<MessageCircle className="h-5 w-5 text-black" />
							<button
								onClick={hanelToggle}
								className="font-semibold text-black hover:underline"
							>
								{t('chat_now')}
							</button>
						</p>
					</div>
				</div>
			</div>

			{/* Additional Information */}
			<div className="flex items-start space-x-3">
				<span className="rounded-full border-2 border-black p-2">
					<Info className="h-6 w-6 shrink-0 text-black" />
				</span>
				<div>
					<h2 className="mb-2 text-lg font-semibold text-black">
						{t('additional_information')}
					</h2>
					<ul className="list-disc space-y-1 pl-5 text-base text-black">
						<li>{t('confirmation_received')}</li>
						<li>{t('most_travelers_can_participate')}</li>
						<li>{t('max_travelers')}</li>
					</ul>
				</div>
			</div>

			{/* Final Note */}
			<div className="col-span-1 mt-6 text-sm text-black md:col-span-2">
				{t('earnings_disclaimer')}{' '}
				<a href="#" className="font-semibold text-black hover:underline">
					{t('learn_more')}
				</a>
			</div>
		</div>
	)
}
