'use client'
// "Good to know" before booking. Free cancellation and the private tour are
// already promised in the overview, so here: the cancellation rules in full,
// accessibility, and a "Questions?" card with the phone number and the chat.
import type { ReactNode } from 'react'
import { Accessibility, CloudSun, MessageCircle, Phone } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { openChat } from '@/store/slices/ui'
import { useAppDispatch } from '@/store/hooks'

const PHONE = '+34 614 52 04 61'

export default function BookingInfo() {
	const t = useTranslations('BookingInfo')
	const dispatch = useAppDispatch()

	return (
		<section>
			<h2 className="headline text-[24px] !leading-tight">{t('good_to_know')}</h2>

			<div className="mt-5 grid gap-3 sm:grid-cols-2">
				<Card icon={<CloudSun className="h-5 w-5" strokeWidth={2} />} title={t('cancellation_policy')}>
					{t('free_cancel_text')} {t('weather_text')}
				</Card>
				<Card icon={<Accessibility className="h-5 w-5" strokeWidth={2} />} title={t('accessibility')}>
					{t('not_wheelchair_accessible')}. {t('child_seats_available')}.
				</Card>
			</div>

			{/* Questions: as TripAdvisor's "Have booking questions?" card */}
			<div className="mt-3 rounded-3xl bg-neutral-100 p-5 sm:p-6 dark:bg-neutral-900">
				<h3 className="text-base font-bold leading-6">{t('help_title')}</h3>
				<p className="mt-1 text-sm leading-5 text-ink-soft dark:text-neutral-400">{t('help_text')}</p>
				<div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-base font-semibold">
					<a href={`tel:${PHONE.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 underline underline-offset-4 hover:opacity-70">
						<Phone className="h-5 w-5" strokeWidth={1.8} />
						{PHONE}
					</a>
					<button type="button" onClick={() => dispatch(openChat())} className="inline-flex items-center gap-2 underline underline-offset-4 hover:opacity-70">
						<MessageCircle className="h-5 w-5" strokeWidth={1.8} />
						{t('chat_now')}
					</button>
				</div>
			</div>
		</section>
	)
}

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
	return (
		<div className="rounded-3xl bg-neutral-100 p-5 sm:p-6 dark:bg-neutral-900">
			<span className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink dark:bg-neutral-800 dark:text-white">{icon}</span>
			<h3 className="mt-3 text-base font-bold leading-6">{title}</h3>
			<p className="mt-1 text-sm leading-5 text-ink-soft dark:text-neutral-400">{children}</p>
		</div>
	)
}
