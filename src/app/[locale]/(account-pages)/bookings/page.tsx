// My bookings (inside the account area): upcoming trips, bookings still to
// pay, and past trips. Checkouts started but never paid, for dates already
// gone, are left out.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, CreditCard, Users } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { db, T, must } from '@/lib/db'
import { OPEN_STATES } from '@/lib/payments'
import { PHOTOS } from '@/lib/photos'
import { getSessionUser } from '@/lib/session'
import { readTripDates } from '@/lib/tripDates'

export const dynamic = 'force-dynamic'

const TABS = ['upcoming', 'to_pay', 'past'] as const
type Tab = (typeof TABS)[number]
const PAID = ['paid', 'confirmed']
const CLOSED = ['cancelled', 'REFUNDED', 'refunded']

/** Booking total in euros (the line items counted in the price). */
const totalOf = (items: any[]) => items.filter((i) => i.includeInTotal).reduce((sum, i) => sum + (i.totalPrice ?? 0), 0)

type PageProps = { params: { locale: string }; searchParams: { tab?: string } }

export default async function BookingsPage({ params, searchParams }: PageProps) {
	const { locale } = params
	setRequestLocale(locale)
	const t = await getTranslations('Bookings')
	const user = await getSessionUser()
	if (!user) return null // the layout shows the sign-in prompt

	const rows = (must(
		await db
			.from(T.bookings)
			.select(`id, tourId, bookingState, selectedDate, guests, lineItems, bookingReference, orderNumber, createdAt, tour:${T.tours}(name, slugs, translations, images)`)
			.eq('customerId', user.id)
			.order('createdAt', { ascending: false }),
	) ?? []) as any[]

	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const bookings = rows.map((b) => {
		const [start, end] = readTripDates(b.selectedDate)
		const state: string = b.bookingState
		const future = !!start && start >= today
		const tab: Tab | null = CLOSED.includes(state) || (PAID.includes(state) && !future)
			? 'past'
			: PAID.includes(state)
				? 'upcoming'
				: OPEN_STATES.includes(state) && future
					? 'to_pay'
					: null // abandoned checkout for a date already gone
		const tr = (b.tour?.translations ?? []).find((x: any) => x.language === locale)
		const slug = (b.tour?.slugs ?? []).find((s: any) => s.language === locale)?.slug ?? b.tour?.slugs?.[0]?.slug
		return {
			...b,
			start,
			end,
			tab,
			tourName: tr?.name || b.tour?.name || t('tour'),
			tourHref: slug as string | undefined,
			image: b.tour?.images?.[0]?.url as string | undefined,
			total: totalOf(b.lineItems ?? []),
			adults: b.guests?.guestAdults ?? 0,
			children: b.guests?.guestChildren ?? 0,
		}
	}).filter((b) => b.tab)

	const counts = Object.fromEntries(TABS.map((tab) => [tab, bookings.filter((b) => b.tab === tab).length])) as Record<Tab, number>
	// Open the first tab that has something in it, unless one was chosen
	const active: Tab = TABS.includes(searchParams.tab as Tab) ? (searchParams.tab as Tab) : TABS.find((tab) => counts[tab] > 0) ?? 'upcoming'
	const shown = bookings
		.filter((b) => b.tab === active)
		.sort((a, b) => (active === 'past' ? -1 : 1) * ((a.start?.getTime() ?? 0) - (b.start?.getTime() ?? 0)))

	const dateFormat = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
	const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })

	return (
		<div>
			<h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>
			<p className="mt-2 text-neutral-500">{t('subtitle')}</p>

			<nav aria-label={t('title')} className="mt-8 flex gap-2 overflow-x-auto [scrollbar-width:none]">
				{TABS.map((tab) => (
					<Link
						key={tab}
						href={`/${locale}/bookings?tab=${tab}` as any}
						aria-current={tab === active ? 'page' : undefined}
						className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
							tab === active
								? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
								: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
						}`}
					>
						{t(`tab_${tab}`)}
						<span className={tab === active ? 'opacity-60' : 'text-neutral-400'}>{counts[tab]}</span>
					</Link>
				))}
			</nav>

			{shown.length === 0 ? (
				<div className="mt-8 rounded-[28px] bg-neutral-100 px-6 py-14 text-center dark:bg-neutral-900">
					<CalendarDays className="mx-auto h-10 w-10 text-neutral-400" strokeWidth={1.5} />
					<p className="mt-5 text-2xl font-bold tracking-tight">{t(`empty_${active}`)}</p>
					<p className="mx-auto mt-2 max-w-sm text-neutral-500">{t('empty_text')}</p>
					<Link href={`/${locale}/search?query=` as any} className="mt-7 inline-flex h-12 items-center rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
						{t('explore')}
					</Link>
				</div>
			) : (
				<ul className="mt-8 space-y-4">
					{shown.map((b) => {
						const toPay = b.tab === 'to_pay'
						const status = CLOSED.includes(b.bookingState) ? 'status_cancelled' : PAID.includes(b.bookingState) ? 'status_paid' : b.bookingState === 'payment_failed' ? 'status_failed' : 'status_unpaid'
						return (
							<li key={b.id} className="overflow-hidden rounded-3xl ring-1 ring-neutral-200 dark:ring-neutral-800">
								<div className="flex flex-col sm:flex-row">
									<div className="relative aspect-[16/9] bg-neutral-100 sm:aspect-auto sm:w-56 sm:shrink-0 dark:bg-neutral-900">
										<Image src={b.image || PHOTOS.sahara} alt="" fill sizes="(max-width: 640px) 100vw, 224px" className="object-cover" />
									</div>
									<div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
										<div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
											<span
												className={`rounded-full px-2.5 py-1 ${
													status === 'status_paid'
														? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
														: status === 'status_cancelled'
															? 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
															: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
												}`}
											>
												{t(status)}
											</span>
											{(b.bookingReference || b.orderNumber) && <span className="text-neutral-500">{t('reference', { ref: b.bookingReference || b.orderNumber })}</span>}
										</div>
										<h2 className="mt-3 line-clamp-2 text-lg font-bold leading-snug">{b.tourName}</h2>
										<div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-neutral-500">
											{b.start && (
												<span className="inline-flex items-center gap-1.5">
													<CalendarDays className="h-4 w-4" />
													{dateFormat.format(b.start)}
													{b.end && b.end.getTime() !== b.start.getTime() && ` – ${dateFormat.format(b.end)}`}
												</span>
											)}
											<span className="inline-flex items-center gap-1.5">
												<Users className="h-4 w-4" />
												{t('travellers', { adults: b.adults, children: b.children })}
											</span>
										</div>
										<div className="mt-5 flex flex-col gap-3 sm:mt-auto sm:flex-row sm:items-end sm:justify-between sm:pt-5">
											<p className="text-xl font-bold">{money.format(b.total)}</p>
											<div className="flex flex-wrap gap-2">
												{toPay ? (
													<Link
														href={`/${locale}/checkout/checkout?bookingId=${b.id}&serviceId=${b.tourId}` as any}
														className="inline-flex h-11 items-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
													>
														<CreditCard className="h-4 w-4" />
														{t('complete_payment')}
													</Link>
												) : (
													b.tourHref && (
														<Link href={b.tourHref as any} className="inline-flex h-11 items-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
															{t('view_tour')}
															<ArrowRight className="h-4 w-4" />
														</Link>
													)
												)}
											</div>
										</div>
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			)}

			<p className="mt-10 text-sm text-neutral-500">
				{t('help')}{' '}
				<Link href={`/${locale}/contact` as any} className="font-semibold text-neutral-950 underline underline-offset-4 dark:text-white">
					{t('contact')}
				</Link>
			</p>
		</div>
	)
}
