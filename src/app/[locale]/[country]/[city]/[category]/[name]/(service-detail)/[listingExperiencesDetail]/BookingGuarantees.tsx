// Booking promises shown under the overview.
import { BadgeEuro, CalendarCheck, Clock3 } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const BookingGuarantees = () => {
	const t = useTranslations('PremiumTourBenefits')
	const items = [
		[CalendarCheck, 'free_cancellation', 'free_cancellation_description'],
		[Clock3, 'reserve_now_pay_later', 'reserve_now_pay_later_description'],
		[BadgeEuro, 'lowest_price_guaranteed', 'lowest_price_guaranteed_description'],
	] as const

	return (
		<ul className="grid gap-3 sm:grid-cols-3">
			{items.map(([Icon, title, text]) => (
				<li key={title} className="rounded-2xl bg-sand-100 p-5 dark:bg-neutral-900">
					<Icon className="h-6 w-6 text-brand-500" strokeWidth={1.8} />
					<h3 className="mt-3 font-semibold">{t(title)}</h3>
					<p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{t(text)}</p>
				</li>
			))}
		</ul>
	)
}

export default BookingGuarantees
