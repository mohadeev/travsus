'use client'
// After paying on Stripe: the result (confirmed / processing / failed), the
// booking with its reference, what was paid, and what happens next.
import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Check, Clock, Copy, Mail, MessageCircle, Ticket, Users, X, type LucideIcon } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import getFetchDataFromApi from '@/utils/getFetchDataFromApi'
import { selectBooking, setBooking } from '@/store/slices/booking'
import { useSearchParams } from 'next/navigation'
import { formatTripDates, readTripDates } from '@/lib/tripDates'
import { PHOTOS } from '@/lib/photos'
import { useLocale, useTranslations } from 'next-intl'
import LineItemsBreakdown from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/LineItems/LineItemsBreakdown'

const PayPage: FC = () => {
	const t = useTranslations('Jan03_PayPage_m5k8')
	const tPay = useTranslations('Payment')
	const locale = useLocale()
	const booking: any = useAppSelector(selectBooking)
	const searchParams = useSearchParams()
	const dispatch = useAppDispatch()
	const bookingId = searchParams.get('bookingId')
	const [payment, setPayment] = useState<{ status: string; plan?: string } | null>(null)
	const [copied, setCopied] = useState(false)

	// Ask the server for the result (it also records the payment if Stripe's
	// webhook hasn't arrived yet). Bank transfers etc. can take a moment.
	useEffect(() => {
		if (!bookingId) return
		let stopped = false
		let tries = 0
		const check = async () => {
			const response = await fetch(`/api/bookings/${bookingId}/payment`)
			const data = await response.json().catch(() => ({}))
			if (stopped) return
			// Just back from Stripe the payment can take a few seconds to show up
			const pending = ['processing', 'unpaid', 'unknown'].includes(data.status)
			setPayment({ status: response.ok ? (pending ? 'processing' : data.status) : 'error', plan: data?.plan })
			if (pending && tries++ < 20) setTimeout(check, 3000)
		}
		check()
		return () => {
			stopped = true
		}
	}, [bookingId])

	useEffect(() => {
		;(async () => {
			try {
				const bookingData = await getFetchDataFromApi('/api/booking/get/booking-data?', { bookingId })
				if (bookingData) dispatch(setBooking(bookingData))
			} catch (error) {
				console.error(error)
			}
		})()
	}, [bookingId, dispatch])

	const status = payment?.status
	const state: 'loading' | 'paid' | 'processing' | 'failed' | 'missing' = !payment
		? 'loading'
		: status === 'succeeded'
			? 'paid'
			: status === 'processing'
				? 'processing'
				: status === 'error'
					? 'missing'
					: 'failed'

	const tour = booking?.tour
	const tourName = (tour?.translations ?? []).find((x: any) => x.language === locale)?.name || tour?.name
	const tourHref = (tour?.slugs ?? []).find((s: any) => s.language === locale)?.slug ?? tour?.slugs?.[0]?.slug
	const image = tour?.images?.[0]?.url || PHOTOS.sahara
	const reference: string | undefined = booking?.bookingReference || booking?.orderNumber
	const email: string | undefined = booking?.customer?.email
	const guests = booking?.guests
	const loaded = !!bookingId && booking?.id === bookingId
	// Book now, pay later: reserved with the deposit, the rest is charged on the first tour day
	const reserved = payment?.plan === 'deposit' || booking?.bookingState === 'deposit_paid'
	const money = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(n)
	const dueDay = booking?.balanceDueAt ? new Date(booking.balanceDueAt).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) : ''

	const copyRef = async () => {
		if (!reference) return
		await navigator.clipboard?.writeText(reference).catch(() => {})
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	// The big result at the top
	const hero = {
		loading: {
			icon: <span className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-950 dark:border-neutral-800 dark:border-t-white" />,
			ring: 'bg-neutral-100 dark:bg-neutral-900',
			title: tPay('confirming'),
			text: '',
		},
		paid: {
			icon: <Check className="h-12 w-12 text-white" strokeWidth={3} />,
			ring: 'bg-emerald-500 shadow-[0_0_0_12px_rgba(16,185,129,0.15)] motion-safe:animate-[pop_0.5s_ease-out_both]',
			title: reserved ? tPay('reserved_title') : tPay('succeeded_title'),
			text: reserved
				? tPay('reserved_text', { paid: money(Number(booking?.depositAmount) || 20), rest: money(Number(booking?.balanceAmount) || 0), date: dueDay })
				: tPay('thanks'),
		},
		processing: {
			icon: <Clock className="h-11 w-11 text-white" />,
			ring: 'bg-amber-500 shadow-[0_0_0_12px_rgba(245,158,11,0.15)]',
			title: tPay('processing_title'),
			text: tPay('processing_text'),
		},
		failed: {
			icon: <X className="h-12 w-12 text-white" strokeWidth={3} />,
			ring: 'bg-red-500 shadow-[0_0_0_12px_rgba(239,68,68,0.15)]',
			title: tPay('failed_title'),
			text: tPay('failed_text'),
		},
		missing: { icon: <X className="h-12 w-12 text-white" strokeWidth={3} />, ring: 'bg-neutral-400', title: tPay('missing_booking'), text: '' },
	}[state]

	const steps: [LucideIcon, string][] = [
		[Mail, email ? tPay('next_email', { email }) : tPay('confirmation_email')],
		[Ticket, tPay('next_bookings')],
		[MessageCircle, tPay('next_contact')],
	]
	const secondary =
		'inline-flex h-12 sm:flex-1 items-center justify-center rounded-full border border-neutral-300 px-7 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white'
	const primary =
		'inline-flex h-12 sm:flex-1 items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950'

	return (
		<main className="mx-auto max-w-3xl px-5 pb-24 pt-10 text-neutral-950 sm:pt-16 dark:text-white">
			<style>{'@keyframes pop { from { transform: scale(0.4); opacity: 0 } to { transform: scale(1); opacity: 1 } }'}</style>

			{/* Result */}
			<section className="text-center">
				<div className={`mx-auto grid h-24 w-24 place-items-center rounded-full ${hero.ring}`}>{hero.icon}</div>
				<h1 className="mx-auto mt-8 max-w-xl text-3xl font-bold tracking-tight [text-wrap:balance] sm:text-5xl">{hero.title}</h1>
				{hero.text && <p className="mx-auto mt-3 max-w-md text-lg text-neutral-500">{hero.text}</p>}

				{reference && (state === 'paid' || state === 'processing') && (
					<button
						type="button"
						onClick={copyRef}
						className="mx-auto mt-6 inline-flex max-w-full items-center gap-3 rounded-full bg-neutral-100 py-2 pl-5 pr-2 text-sm transition hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
					>
						<span className="hidden text-neutral-500 sm:inline">{tPay('booking_ref')}</span>
						<span className="truncate font-mono font-bold tracking-wide">{reference}</span>
						<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white dark:bg-neutral-950">
							{copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
						</span>
					</button>
				)}

				{(state === 'failed' || state === 'missing') && (
					<div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
						{state === 'failed' && (
							<Link href={`/${locale}/checkout/checkout?bookingId=${bookingId}${booking?.tourId ? `&serviceId=${booking.tourId}` : ''}` as any} className={primary}>
								{tPay('try_again')}
								<ArrowRight className="h-4 w-4" />
							</Link>
						)}
						<Link href={`/${locale}/contact` as any} className={secondary}>
							{tPay('contact')}
						</Link>
					</div>
				)}
			</section>

			{/* The booking */}
			{loaded && (
				<section className="mt-12 overflow-hidden rounded-[28px] ring-1 ring-neutral-200 sm:mt-16 dark:ring-neutral-800">
					<div className="relative aspect-[16/8] bg-neutral-100 sm:aspect-[16/7] dark:bg-neutral-900">
						<Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
						<div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">{t('your_booking')}</p>
							<h2 className="mt-1 line-clamp-2 text-xl font-bold leading-snug sm:text-2xl">{tourName}</h2>
						</div>
					</div>

					<div className="grid divide-y divide-neutral-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 dark:divide-neutral-800">
						{(
							[
								[CalendarDays, t('date'), formatTripDates(...readTripDates(booking?.selectedDate), locale)],
								[Users, t('guests'), t('guests_count', { adults: guests?.guestAdults || 0, children: guests?.guestChildren || 0 })],
							] as [LucideIcon, string, string][]
						).map(([Icon, label, value]) => (
							<div key={label} className="flex items-center gap-4 p-5 sm:p-6">
								<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-900">
									<Icon className="h-5 w-5" />
								</span>
								<span className="min-w-0">
									<span className="block text-sm text-neutral-500">{label}</span>
									<span className="mt-0.5 block font-semibold">{value}</span>
								</span>
							</div>
						))}
					</div>

					<div className="border-t border-neutral-200 bg-neutral-50 p-5 sm:p-7 dark:border-neutral-800 dark:bg-neutral-900/50">
						<p className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">{state === 'paid' ? tPay('total_paid') : tPay('total')}</p>
						<LineItemsBreakdown lineItems={booking?.lineItems ?? []} />
					</div>
				</section>
			)}

			{/* What happens next */}
			{state === 'paid' && (
				<section className="mt-12 sm:mt-16">
					<h2 className="text-2xl font-bold tracking-tight">{tPay('next_title')}</h2>
					<ol className="mt-6 grid gap-3 sm:grid-cols-3">
						{steps.map(([Icon, text], i) => (
							<li key={i} className="rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
								<span className="grid h-10 w-10 place-items-center rounded-full bg-white dark:bg-neutral-950">
									<Icon className="h-5 w-5" />
								</span>
								<p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{text}</p>
							</li>
						))}
					</ol>

					<div className="mt-10 flex flex-col gap-3 sm:flex-row">
						<Link href={`/${locale}/bookings` as any} className={primary}>
							{tPay('my_bookings')}
							<ArrowRight className="h-4 w-4" />
						</Link>
						{tourHref && (
							<Link href={tourHref as any} className={secondary}>
								{tPay('view_tour')}
							</Link>
						)}
						<Link href={`/${locale}/search?query=` as any} className={secondary}>
							{tPay('explore')}
						</Link>
					</div>
				</section>
			)}
		</main>
	)
}

export default PayPage
