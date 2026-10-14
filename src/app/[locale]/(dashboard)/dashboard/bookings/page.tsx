// Bookings: filter by status, search by reference, customer or tour.
import Image from 'next/image'
import Link from 'next/link'
import { CalendarCheck, Mail, Search } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { BOOKING_FILTERS, bookingsList, dashboardScope, type BookingFilter } from '@/lib/dashboard'
import { PHOTOS } from '@/lib/photos'
import { Empty, NoCompany, StatusBadge, day, euro } from '../../_components/ui'

const LABELS: Record<BookingFilter, string> = {
	all: 'All',
	upcoming: 'Upcoming',
	unpaid: 'Not paid',
	completed: 'Completed',
	cancelled: 'Cancelled',
	abandoned: 'Abandoned',
}

type PageProps = { params: { locale: string }; searchParams: { status?: string; q?: string } }

export default async function BookingsPage({ params, searchParams }: PageProps) {
	const { locale } = params
	const scope = await dashboardScope()
	if (!scope) return null
	if (!scope.all && !scope.businessId) return <NoCompany locale={locale} />

	const filter = (BOOKING_FILTERS as readonly string[]).includes(searchParams.status ?? '') ? (searchParams.status as BookingFilter) : 'all'
	const q = (searchParams.q ?? '').slice(0, 100)
	const { rows, total, counts } = await bookingsList(scope, filter, q)
	const href = (status: BookingFilter) => `/${locale}/dashboard/bookings?status=${status}${q ? `&q=${encodeURIComponent(q)}` : ''}`

	return (
		<div className="space-y-6">
			<DashboardHeader heading="Bookings" text="Every trip booked on your tours." />

			<div className="flex flex-col gap-3 md:flex-row md:items-center">
				<form action={`/${locale}/dashboard/bookings`} className="relative flex-1">
					<input type="hidden" name="status" value={filter} />
					<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input
						name="q"
						defaultValue={q}
						placeholder="Search reference, customer, email or tour…"
						className="h-11 w-full rounded-full border-0 bg-neutral-100 pl-11 pr-4 ring-1 ring-transparent focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
					/>
				</form>
			</div>

			<nav aria-label="Status" className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
				{BOOKING_FILTERS.map((f) => (
					<Link
						key={f}
						href={href(f) as any}
						aria-current={f === filter ? 'page' : undefined}
						className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${f === filter ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300'}`}
					>
						{LABELS[f]}
						<span className="tabular-nums opacity-60">{counts[f]}</span>
					</Link>
				))}
			</nav>
			{filter === 'abandoned' && <p className="text-sm text-neutral-500">Checkouts that were started but never paid, for dates that have passed.</p>}

			{rows.length === 0 ? (
				<Empty icon={CalendarCheck} title={q ? 'No bookings match your search' : 'No bookings here'} text={q ? 'Try another reference, name or email.' : undefined} />
			) : (
				<>
					<ul className="space-y-2">
						{rows.map((b) => (
							<li key={b.id} className="flex flex-col gap-4 rounded-2xl p-4 ring-1 ring-neutral-200 sm:flex-row sm:items-center dark:ring-neutral-800">
								<div className="flex min-w-0 flex-1 items-center gap-4">
									<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
										<Image src={b.tour.image || PHOTOS.sahara} alt="" fill sizes="64px" className="object-cover" />
									</div>
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<StatusBadge status={b.status} />
											<span className="font-mono text-xs text-neutral-500">{b.reference}</span>
										</div>
										<p className="mt-1 truncate font-semibold">{b.tour.name}</p>
										<p className="truncate text-sm text-neutral-500">
											{b.start ? `${day(b.start)}${b.end && b.end.getTime() !== b.start.getTime() ? ` – ${day(b.end)}` : ''}` : 'No date'} · {b.adults} {b.adults === 1 ? 'adult' : 'adults'}
											{b.children ? `, ${b.children} ${b.children === 1 ? 'child' : 'children'}` : ''}
										</p>
									</div>
								</div>
								<div className="flex items-center justify-between gap-4 border-t border-neutral-100 pt-3 sm:border-0 sm:pt-0 dark:border-neutral-800">
									<div className="min-w-0 text-sm sm:w-56">
										{b.customer.name !== b.customer.email && <p className="truncate font-semibold">{b.customer.name}</p>}
										<a href={`mailto:${b.customer.email}`} className="inline-flex max-w-full items-center gap-1 truncate text-neutral-500 hover:text-neutral-950 dark:hover:text-white">
											<Mail className="h-3.5 w-3.5 shrink-0" />
											<span className="truncate">{b.customer.email}</span>
										</a>
									</div>
									<div className="shrink-0 text-right">
										<p className="font-bold tabular-nums">{euro(b.total, true)}</p>
										<p className="text-xs text-neutral-500">booked {day(b.createdAt)}</p>
									</div>
								</div>
							</li>
						))}
					</ul>
					{total > rows.length && <p className="text-center text-sm text-neutral-500">Showing the first {rows.length} of {total}. Use search to find others.</p>}
				</>
			)}
		</div>
	)
}
