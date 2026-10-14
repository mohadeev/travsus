// Finance: revenue from paid bookings, month by month, and every payment.
// Payouts and refunds themselves happen in Stripe.
import { ExternalLink, Wallet } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { dashboardScope, finance } from '@/lib/dashboard'
import RevenueChart from '../../_components/RevenueChart'
import { Empty, NoCompany, Panel, Stat, day, euro } from '../../_components/ui'

export default async function FinancePage({ params }: { params: { locale: string } }) {
	const { locale } = params
	const scope = await dashboardScope()
	if (!scope) return null
	if (!scope.all && !scope.businessId) return <NoCompany locale={locale} />

	const f = await finance(scope)

	return (
		<div className="space-y-6">
			<DashboardHeader heading="Finance" text="Revenue from paid bookings.">
				{scope.all && (
					<a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
						Open Stripe
						<ExternalLink className="h-4 w-4" />
					</a>
				)}
			</DashboardHeader>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<Stat label="Total revenue" value={euro(f.total)} hint="all paid bookings" />
				<Stat label={`Revenue ${new Date().getFullYear()}`} value={euro(f.thisYear)} />
				<Stat label="Paid bookings" value={f.count} />
				<Stat label="Average booking" value={euro(f.average)} />
			</div>

			<Panel title="Last 12 months">{f.count ? <RevenueChart data={f.months} height={300} /> : <p className="py-10 text-center text-neutral-500">No paid bookings yet.</p>}</Panel>

			<Panel title="Payments">
				{f.payments.length === 0 ? (
					<Empty icon={Wallet} title="No payments yet" />
				) : (
					<div className="-mx-5 overflow-x-auto sm:mx-0">
						<table className="w-full min-w-[640px] text-left text-sm">
							<thead className="text-neutral-500">
								<tr>
									<th className="px-5 pb-3 font-medium sm:pl-0">Paid on</th>
									<th className="pb-3 pr-4 font-medium">Reference</th>
									<th className="pb-3 pr-4 font-medium">Customer</th>
									<th className="pb-3 pr-4 font-medium">Tour</th>
									<th className="pb-3 pr-5 text-right font-medium sm:pr-0">Amount</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
								{f.payments.map((b) => (
									<tr key={b.id}>
										<td className="whitespace-nowrap px-5 py-3 sm:pl-0">{day(b.paidAt ?? b.createdAt)}</td>
										<td className="whitespace-nowrap py-3 pr-4 font-mono text-xs">{b.reference}</td>
										<td className="max-w-[180px] truncate py-3 pr-4">{b.customer.name}</td>
										<td className="max-w-[260px] truncate py-3 pr-4 text-neutral-500">{b.tour.name}</td>
										<td className="whitespace-nowrap py-3 pr-5 text-right font-semibold tabular-nums sm:pr-0">{euro(b.total, true)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</Panel>
			<p className="text-xs text-neutral-500">Amounts are booking totals. Stripe fees, refunds and payouts are shown in Stripe.</p>
		</div>
	)
}
