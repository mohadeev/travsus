// Customers: everyone who booked one of your tours, biggest spenders first.
import { Mail, Search, Users } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { customersList, dashboardScope } from '@/lib/dashboard'
import { Empty, NoCompany, Stat, day, euro } from '../../_components/ui'

type PageProps = { params: { locale: string }; searchParams: { q?: string } }

export default async function CustomersPage({ params, searchParams }: PageProps) {
	const { locale } = params
	const scope = await dashboardScope()
	if (!scope) return null
	if (!scope.all && !scope.businessId) return <NoCompany locale={locale} />

	const q = (searchParams.q ?? '').slice(0, 100)
	const customers = await customersList(scope, q)
	const paying = customers.filter((c) => c.paid > 0)
	const repeat = paying.filter((c) => c.paid > 1).length

	return (
		<div className="space-y-6">
			<DashboardHeader heading="Customers" text="Everyone who booked one of your tours." />

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
				<Stat label="Customers" value={customers.length} hint="with a booking" />
				<Stat label="Paying customers" value={paying.length} hint={`${repeat} booked more than once`} />
				<Stat label="Average spend" value={euro(paying.length ? paying.reduce((s, c) => s + c.spent, 0) / paying.length : 0)} hint="per paying customer" />
			</div>

			<form action={`/${locale}/dashboard/customers`} className="relative">
				<Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
				<input
					name="q"
					defaultValue={q}
					placeholder="Search name or email…"
					className="h-11 w-full rounded-full border-0 bg-neutral-100 pl-11 pr-4 ring-1 ring-transparent focus:bg-white focus:outline-none focus:ring-neutral-950 dark:bg-neutral-900 dark:focus:ring-white"
				/>
			</form>

			{customers.length === 0 ? (
				<Empty icon={Users} title={q ? 'No customers match your search' : 'No customers yet'} />
			) : (
				<div className="overflow-hidden rounded-[28px] ring-1 ring-neutral-200 dark:ring-neutral-800">
					<ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
						{customers.map((c) => (
							<li key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
								<div className="flex min-w-0 flex-1 items-center gap-3">
									{c.image ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={c.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
									) : (
										<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-950 text-sm font-bold text-white dark:bg-white dark:text-neutral-950">{c.name.charAt(0).toUpperCase()}</span>
									)}
									<div className="min-w-0">
										<p className="truncate font-semibold">{c.name !== c.email ? c.name : c.email.split('@')[0]}</p>
										<a href={`mailto:${c.email}`} className="inline-flex max-w-full items-center gap-1 text-sm text-neutral-500 hover:text-neutral-950 dark:hover:text-white">
											<Mail className="h-3.5 w-3.5 shrink-0" />
											<span className="truncate">{c.email}</span>
										</a>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-4 text-sm sm:w-80">
									<div>
										<p className="text-xs text-neutral-500">Bookings</p>
										<p className="font-semibold tabular-nums">
											{c.paid}
											<span className="font-normal text-neutral-400"> / {c.bookings}</span>
										</p>
									</div>
									<div>
										<p className="text-xs text-neutral-500">Spent</p>
										<p className="font-semibold tabular-nums">{euro(c.spent)}</p>
									</div>
									<div>
										<p className="text-xs text-neutral-500">Last</p>
										<p className="font-semibold">{day(c.last)}</p>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
