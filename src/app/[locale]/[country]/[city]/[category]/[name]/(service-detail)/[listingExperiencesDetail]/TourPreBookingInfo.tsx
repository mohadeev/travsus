'use client'
// "Good to know" before booking: cancellation, private tour, accessibility and
// help, as four short cards. Only what is true for every TRAVSUS tour.
import type { ReactNode } from 'react'
import { Accessibility, MessageCircle, Phone, RotateCcw, Users } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import { openChat } from '@/store/slices/ui'
import { useAppDispatch } from '@/store/hooks'

const PHONE = '+34 643 63 59 62'

export default function BookingInfo() {
	const t = useTranslations('BookingInfo')
	const dispatch = useAppDispatch()

	return (
		<section>
			<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
			<h2 className="text-2xl font-bold tracking-tight">{t('good_to_know')}</h2>

			<div className="mt-6 grid gap-4 sm:grid-cols-2">
				<Card icon={<RotateCcw className="h-5 w-5" />} title={t('free_cancel_title')}>
					<p>{t('free_cancel_text')}</p>
					<p className="mt-1.5 text-neutral-500">{t('weather_text')}</p>
				</Card>

				<Card icon={<Users className="h-5 w-5" />} title={t('private_title')}>
					<p>{t('private_text')}</p>
				</Card>

				<Card icon={<Accessibility className="h-5 w-5" />} title={t('accessibility')}>
					<p>
						{t('not_wheelchair_accessible')}. {t('child_seats_available')}.
					</p>
				</Card>

				<Card icon={<MessageCircle className="h-5 w-5" />} title={t('help_title')}>
					<p>{t('help_text')}</p>
					<div className="mt-3 flex flex-wrap gap-2">
						<a href={`tel:${PHONE.replace(/\s/g, '')}`} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-300 px-3.5 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
							<Phone className="h-4 w-4" />
							{PHONE}
						</a>
						<button type="button" onClick={() => dispatch(openChat())} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
							<MessageCircle className="h-4 w-4" />
							{t('chat_now')}
						</button>
					</div>
				</Card>
			</div>
		</section>
	)
}

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
	return (
		<div className="flex gap-4 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
			<span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-neutral-900">{icon}</span>
			<div className="min-w-0 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
				<h3 className="mb-1 font-semibold text-neutral-950 dark:text-white">{title}</h3>
				{children}
			</div>
		</div>
	)
}
