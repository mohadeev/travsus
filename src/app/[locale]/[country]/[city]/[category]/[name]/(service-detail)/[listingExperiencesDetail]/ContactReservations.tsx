'use client'
// "Questions?" box under the booking card: call or open the live chat.
import { MessageCircle, Phone } from 'lucide-react'
import { openChat } from '@/store/slices/ui'
import { useAppDispatch } from '@/store/hooks'
import { useTranslations } from '@/lib/i18n'

export default function ContactReservations() {
	const dispatch = useAppDispatch()
	const t = useTranslations('ContactReservations')
	const actionClass =
		'flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-3 py-2.5 text-sm font-semibold ring-1 ring-neutral-200 transition hover:ring-neutral-950 dark:bg-neutral-950 dark:ring-neutral-800'

	return (
		<div className="mt-4 rounded-3xl bg-sand-100 p-5 dark:bg-neutral-900">
			<p className="text-sm font-semibold">{t('questions_about_reservations')}</p>
			<div className="mt-3 flex gap-2">
				<a href="tel:+34614520461" className={actionClass}>
					<Phone className="h-4 w-4" />
					+34 614 52 04 61
				</a>
				<button type="button" onClick={() => dispatch(openChat())} className={actionClass}>
					<MessageCircle className="h-4 w-4" />
					{t('chat_now')}
				</button>
			</div>
		</div>
	)
}
