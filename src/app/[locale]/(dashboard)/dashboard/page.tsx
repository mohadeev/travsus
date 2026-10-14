// Dashboard overview: the key numbers, revenue per month, upcoming trips,
// latest bookings and best-selling tours. All from real bookings.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarCheck, Clock, Map, Star, Users, Wallet } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { dashboardScope, overview } from '@/lib/dashboard'
import { PHOTOS } from '@/lib/photos'
import RevenueChart from '../_components/RevenueChart'
import { Empty, NoCompany, Panel, Stat, StatusBadge, button, day, euro } from '../_components/ui'

export default async function DashboardPage({ params }: { params: { locale: string } }) {
	const { locale } = params
	const scope = await dashboardScope()
	if (!scope) return null
	if (!scope.all && !scope.businessId) return <NoCompany locale={locale} />

	const o = await overview(scope)
	const first = scope.user?.accountData?.firstname
	const link = (path: string) => `/${locale}${path}` as any

	return (
		<div className="space-y-8">
			<DashboardHeader heading={first ? `Hi, ${first}` : 'Overview'} text={`${scope.label} · ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`}>
				<Link href={link('/dashboard/tours/create')} className={button}>
					New tour
				</Link>
			</DashboardHeader>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<Stat label="Revenue (30 days)" value={euro(o.revenue30)} hint={`${euro(o.revenueTotal)} all time`} icon={Wallet} />
				<Stat label="Upcoming trips" value={o.upcomingCount} hint={`${o.paidCount} paid bookings in total`} icon={CalendarCheck} />
				<Stat label="Waiting for payment" value={o.unpaidCount} hint={o.unpaidCount ? `${euro(o.unpaidValue)} in open checkouts` : 'No open checkouts'} icon={Clock} />
				<Stat
					label="Rating"
					value={o.rating ? o.rating.toFixed(1) : '—'}
					hint={`${o.reviewsCount} ${o.reviewsCount === 1 ? 'review' : 'reviews'} · ${o.toursCount} tours · ${o.customersCount} ${o.customersCount === 1 ? 'customer' : 'customers'}`}
					icon={Star}
				/>
			</div>

			<Panel title="Revenue" action={<Link href={link('/dashboard/finance')} className="text-sm font-semibold underline underline-offset-4">Finance</Link>}>
				{o.paidCount ? <RevenueChart data={o.months} /> : <p className="py-10 text-center text-neutral-500">No paid bookings yet. Revenue will show here.</p>}
			</Panel>

			<div className="grid gap-6 xl:grid-cols-2">
				<Panel title="Upcoming trips" action={<Link href={link('/dashboard/bookings?status=upcoming')} className="text-sm font-semibold underline underline-offset-4">All</Link>}>
					{o.upcoming.length ? (
						<ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
							{o.upcoming.map((b) => (
								<li key={b.id} className="flex items-center gap-3 py-3">
									<span className="grid w-14 shrink-0 place-items-center rounded-2xl bg-neutral-100 py-2 text-center dark:bg-neutral-900">
										<span className="text-[10px] font-semibold uppercase text-neutral-500">{b.start?.toLocaleDateString('en-GB', { month: 'short' })}</span>
										<span className="text-lg font-bold leading-none">{b.start?.getDate()}</span>
									</span>
									<span className="min-w-0 flex-1">
										<span className="block truncate font-semibold">{b.tour.name}</span>
										<span className="block truncate text-sm text-neutral-500">
											{b.customer.name} · {b.adults + b.children} {b.adults + b.children === 1 ? 'traveller' : 'travellers'}
										</span>
									</span>
									<span className="shrink-0 text-sm font-semibold tabular-nums">{euro(b.total)}</span>
								</li>
							))}
						</ul>
					) : (
						<p className="py-8 text-center text-neutral-500">No upcoming trips.</p>
					)}
				</Panel>

				<Panel title="Latest bookings" action={<Link href={link('/dashboard/bookings')} className="text-sm font-semibold underline underline-offset-4">All</Link>}>
					{o.recent.length ? (
						<ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
							{o.recent.map((b) => (
								<li key={b.id} className="flex items-center gap-3 py-3">
									<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-950 text-sm font-bold text-white dark:bg-white dark:text-neutral-950">
										{b.customer.name.charAt(0).toUpperCase()}
									</span>
									<span className="min-w-0 flex-1">
										<span className="block truncate font-semibold">{b.customer.name}</span>
										<span className="block truncate text-sm text-neutral-500">
											{b.tour.name} · {day(b.createdAt)}
										</span>
									</span>
									<StatusBadge status={b.status} />
								</li>
							))}
						</ul>
					) : (
						<p className="py-8 text-center text-neutral-500">No bookings yet.</p>
					)}
				</Panel>
			</div>

			<Panel title="Best-selling tours" action={<Link href={link('/dashboard/tours')} className="text-sm font-semibold underline underline-offset-4">All tours</Link>}>
				{o.topTours.length ? (
					<ul className="grid grid-cols-2 gap-3 lg:grid-cols-5">
						{o.topTours.map((t, i) => (
							<li key={t.id} className="overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
								<div className="relative aspect-[4/3]">
									<Image src={t.image || PHOTOS.sahara} alt="" fill sizes="(max-width: 640px) 100vw, 20vw" className="object-cover" />
									<span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-neutral-950">{i + 1}</span>
								</div>
								<div className="p-3">
									<p className="line-clamp-2 text-sm font-semibold leading-snug">{t.name}</p>
									<p className="mt-1 text-sm text-neutral-500">
										{euro(t.revenue)} · {t.bookings} paid
									</p>
								</div>
							</li>
						))}
					</ul>
				) : (
					<Empty icon={Map} title="No sales yet" text="Your best-selling tours will appear here once bookings are paid." />
				)}
			</Panel>

			<p className="flex items-center gap-2 text-sm text-neutral-500">
				<Users className="h-4 w-4" />
				<Link href={link('/dashboard/customers')} className="font-semibold text-neutral-950 underline underline-offset-4 dark:text-white">
					See all customers
				</Link>
				<ArrowRight className="h-4 w-4" />
			</p>
		</div>
	)
}
