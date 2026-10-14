// Affiliate area: the personal link, clicks, referred bookings, commissions
// and payouts. For accepted affiliates; others see where their request stands.
import Link from 'next/link'
import { headers } from 'next/headers'
import { Handshake, Hourglass } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { db, T, must } from '@/lib/db'
import { getSessionUser } from '@/lib/session'
import { affiliateReport, MIN_PAYOUT, newCode, REF_DAYS, type Affiliate, type ReferralStatus } from '@/lib/affiliates'
import CopyLink from './CopyLink'

export const dynamic = 'force-dynamic'

const BADGE: Record<ReferralStatus, string> = {
	earned: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
	unpaid: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
	cancelled: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300',
}

export default async function AffiliateAccountPage({ params }: { params: { locale: string } }) {
	const { locale } = params
	setRequestLocale(locale)
	const t = await getTranslations('Affiliate')
	const user = await getSessionUser()
	if (!user) return null // the layout shows the sign-in prompt

	let affiliate = must(await db.from(T.affiliates).select('*').eq('email', String(user.email).toLowerCase()).maybeSingle()) as Affiliate | null

	if (!affiliate || affiliate.status !== 'approved') {
		const pending = affiliate?.status === 'pending'
		const Icon = pending ? Hourglass : Handshake
		return (
			<div>
				<h1 className="text-2xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>
				<div className="mt-10 rounded-[28px] bg-neutral-100 px-6 py-14 text-center dark:bg-neutral-900">
					<Icon className="mx-auto h-10 w-10 text-neutral-400" strokeWidth={1.5} />
					<p className="mt-5 text-2xl font-bold tracking-tight">{t(pending ? 'pending_title' : 'join_title')}</p>
					<p className="mx-auto mt-2 max-w-sm text-neutral-500">{t(pending ? 'pending_text' : 'join_text')}</p>
					{!pending && (
						<Link
							href={`/${locale}/affiliates` as any}
							className="mt-7 inline-flex h-12 items-center rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
						>
							{t('join_cta')}
						</Link>
					)}
				</div>
			</div>
		)
	}

	// Accepted before codes existed: give them one now
	if (!affiliate.code) {
		const code = await newCode()
		affiliate = (must(await db.from(T.affiliates).update({ code }).eq('id', affiliate.id).is('code', null).select('*').maybeSingle()) as Affiliate) ?? { ...affiliate, code }
	}

	const r = await affiliateReport(affiliate)
	const h = headers()
	const origin = `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('x-forwarded-host') ?? h.get('host') ?? 'www.travsus.com'}`
	const link = `${origin}/${locale}?ref=${r.code}`
	const euros = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(n)
	const date = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })

	const stats: [string, string, string?][] = [
		[t('stat_clicks'), String(r.clicks.last30), t('stat_clicks_total', { count: r.clicks.total })],
		[t('stat_bookings'), String(r.bookingsCount)],
		[t('stat_earned'), euros(r.earned), t('stat_earned_note')],
		[t('stat_balance'), euros(r.balance), t('stat_balance_note', { min: euros(MIN_PAYOUT) })],
	]

	return (
		<div>
			<h1 className="text-2xl font-bold tracking-tight sm:text-5xl">{t('title')}</h1>
			<p className="mt-2 text-neutral-500">{t('subtitle')}</p>

			<section className="mt-8 rounded-[28px] bg-neutral-950 p-6 text-white sm:p-8 dark:bg-white dark:text-neutral-950">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div>
						<p className="text-sm font-semibold text-white/60 dark:text-neutral-500">{t('link_title')}</p>
						<p className="mt-1 max-w-md text-sm text-white/80 dark:text-neutral-600">{t('link_text', { days: REF_DAYS })}</p>
					</div>
					<div className="text-right">
						<p className="text-4xl font-bold tabular-nums tracking-tight">{r.currentRate}%</p>
						<p className="text-xs text-white/60 dark:text-neutral-500">
							{r.customRate !== null ? t('rate_custom') : r.nextTier ? t('rate_next', { count: r.nextTier.bookingsToGo, rate: r.nextTier.rate }) : t('rate_top')}
						</p>
					</div>
				</div>
				<div className="mt-6">
					<CopyLink link={link} copyLabel={t('copy')} copiedLabel={t('copied')} />
				</div>
				<p className="mt-4 text-xs text-white/60 dark:text-neutral-500">{t('link_tip', { code: r.code ?? '' })}</p>
			</section>

			<dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
				{stats.map(([label, value, note]) => (
					<div key={label} className="rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
						<dt className="text-sm font-medium text-neutral-500">{label}</dt>
						<dd className="mt-2 text-2xl font-bold tabular-nums tracking-tight sm:text-3xl">{value}</dd>
						{note && <dd className="mt-1 text-xs text-neutral-500">{note}</dd>}
					</div>
				))}
			</dl>

			<section className="mt-12">
				<h2 className="text-xl font-bold tracking-tight">{t('bookings_title')}</h2>
				{r.referrals.length === 0 ? (
					<p className="mt-4 rounded-3xl bg-neutral-100 px-6 py-10 text-center text-neutral-500 dark:bg-neutral-900">{t('bookings_empty')}</p>
				) : (
					<ul className="mt-4 divide-y divide-neutral-100 rounded-3xl ring-1 ring-neutral-200 dark:divide-neutral-800 dark:ring-neutral-800">
						{r.referrals.map((b) => (
							<li key={b.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
								<div className="min-w-0 flex-1">
									<p className="truncate font-semibold">{b.tour}</p>
									<p className="text-sm text-neutral-500">
										{t('booked_on', { date: date(b.bookedAt) })}
										{b.start && ` · ${t('trip_on', { date: date(b.start) })}`}
									</p>
								</div>
								<div className="flex items-center gap-3 sm:justify-end">
									<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${BADGE[b.status]}`}>{t(`status_${b.status}`)}</span>
									<span className="text-sm tabular-nums text-neutral-500">{b.rate ? `${b.rate}% × ${euros(b.value)}` : euros(b.value)}</span>
									<span className="ml-auto w-24 text-right font-bold tabular-nums sm:ml-0">{b.commission ? euros(b.commission) : '–'}</span>
								</div>
							</li>
						))}
					</ul>
				)}
			</section>

			<section className="mt-12">
				<h2 className="text-xl font-bold tracking-tight">{t('payouts_title')}</h2>
				<p className="mt-1 text-sm text-neutral-500">{t('payouts_text', { min: euros(MIN_PAYOUT) })}</p>
				{r.payouts.length > 0 && (
					<ul className="mt-4 divide-y divide-neutral-100 rounded-3xl ring-1 ring-neutral-200 dark:divide-neutral-800 dark:ring-neutral-800">
						{r.payouts.map((p: any) => (
							<li key={p.id} className="flex items-center justify-between gap-4 p-4 sm:px-5">
								<span className="text-sm">
									{date(p.paid_at)}
									{p.note && <span className="text-neutral-500"> · {p.note}</span>}
								</span>
								<span className="font-bold tabular-nums">{euros(p.amount)}</span>
							</li>
						))}
					</ul>
				)}
				<p className="mt-4 text-sm text-neutral-500">{t('paid_out_total', { amount: euros(r.paidOut) })}</p>
			</section>
		</div>
	)
}
