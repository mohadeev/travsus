// Company: the business behind the tours (name, contact, bank details).
import Link from 'next/link'
import { Building2, Mail, MapPin, PenLine, Phone, Plus } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { db, T, must } from '@/lib/db'
import { dashboardScope } from '@/lib/dashboard'
import { Empty, button, buttonOutline } from '../../_components/ui'

export default async function CompanyPage({ params }: { params: { locale: string } }) {
	const { locale } = params
	const scope = await dashboardScope()
	if (!scope) return null

	const companies = (must(
		await db
			.from(T.businesses)
			.select(`id, name, adminName, email, phoneNumber, address, country, type, isActive, createdAt, tours:${T.tours}(count)`)
			.eq('creatorId', scope.user.id)
			.order('createdAt', { ascending: true }),
	) ?? []) as any[]
	const create = (
		<Link href={`/${locale}/dashboard/company/create` as any} className={button}>
			<Plus className="h-4 w-4" />
			New company
		</Link>
	)

	return (
		<div className="space-y-6">
			<DashboardHeader heading="Company" text="The business behind your tours: name, contact and payout details.">
				{companies.length > 0 && create}
			</DashboardHeader>

			{companies.length === 0 ? (
				<Empty icon={Building2} title="No company yet" text="Create your company to add tours and receive bookings." action={create} />
			) : (
				<ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{companies.map((c) => (
						<li key={c.id} className="rounded-[28px] p-6 ring-1 ring-neutral-200 dark:ring-neutral-800">
							<div className="flex items-start justify-between gap-3">
								<div className="flex min-w-0 items-center gap-3">
									<span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-neutral-950 text-lg font-bold text-white dark:bg-white dark:text-neutral-950">
										{String(c.name || '?').charAt(0).toUpperCase()}
									</span>
									<div className="min-w-0">
										<p className="truncate text-lg font-bold">{c.name}</p>
										<p className="text-sm text-neutral-500">
											{c.tours?.[0]?.count ?? 0} tours{c.type ? ` · ${c.type}` : ''}
										</p>
									</div>
								</div>
								{c.isActive && <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Active</span>}
							</div>
							<ul className="mt-5 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
								{c.email && (
									<li className="flex items-center gap-2">
										<Mail className="h-4 w-4 shrink-0" />
										<span className="truncate">{c.email}</span>
									</li>
								)}
								{c.phoneNumber && (
									<li className="flex items-center gap-2">
										<Phone className="h-4 w-4 shrink-0" />
										{c.phoneNumber}
									</li>
								)}
								{(c.address || c.country) && (
									<li className="flex items-center gap-2">
										<MapPin className="h-4 w-4 shrink-0" />
										<span className="truncate">{[c.address, c.country].filter(Boolean).join(', ')}</span>
									</li>
								)}
							</ul>
							<Link href={`/${locale}/dashboard/company/${c.id}/edit` as any} className={`${buttonOutline} mt-6 w-full`}>
								<PenLine className="h-4 w-4" />
								Edit company
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
