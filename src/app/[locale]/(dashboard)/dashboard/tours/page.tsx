// Tours: every tour with its paid bookings and revenue; open, edit or create.
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Map, PenLine, Plus } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard/header'
import { dashboardScope, toursList } from '@/lib/dashboard'
import { PHOTOS } from '@/lib/photos'
import { Empty, NoCompany, button, day, euro } from '../../_components/ui'

export default async function ToursPage({ params }: { params: { locale: string } }) {
	const { locale } = params
	const scope = await dashboardScope()
	if (!scope) return null
	if (!scope.all && !scope.businessId) return <NoCompany locale={locale} />

	const tours = await toursList(scope)
	const create = (
		<Link href={`/${locale}/dashboard/tours/create` as any} className={button}>
			<Plus className="h-4 w-4" />
			New tour
		</Link>
	)

	return (
		<div className="space-y-6">
			<DashboardHeader heading="Tours" text={`${tours.length} ${tours.length === 1 ? 'tour' : 'tours'}`}>
				{create}
			</DashboardHeader>

			{tours.length === 0 ? (
				<Empty icon={Map} title="No tours yet" text="Create your first tour: photos, day-by-day itinerary and prices." action={create} />
			) : (
				<ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{tours.map((t) => (
						<li key={t.id} className="flex flex-col overflow-hidden rounded-[24px] ring-1 ring-neutral-200 dark:ring-neutral-800">
							<div className="relative aspect-[16/10] bg-neutral-100 dark:bg-neutral-900">
								<Image src={t.image || PHOTOS.sahara} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" />
								{t.days > 0 && <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-neutral-950">{t.days} {t.days === 1 ? 'day' : 'days'}</span>}
							</div>
							<div className="flex flex-1 flex-col p-4">
								<h2 className="line-clamp-2 font-semibold leading-snug">{t.name}</h2>
								<div className="mt-3 grid grid-cols-3 gap-2 text-sm">
									<div>
										<p className="text-xs text-neutral-500">Paid</p>
										<p className="font-semibold tabular-nums">{t.bookings}</p>
									</div>
									<div>
										<p className="text-xs text-neutral-500">Revenue</p>
										<p className="font-semibold tabular-nums">{euro(t.revenue)}</p>
									</div>
									<div>
										<p className="text-xs text-neutral-500">Updated</p>
										<p className="font-semibold">{day(t.updatedAt)}</p>
									</div>
								</div>
								<div className="mt-4 flex gap-2 pt-1">
									<Link href={`/${locale}/dashboard/tours/${t.id}/edit` as any} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
										<PenLine className="h-4 w-4" />
										Edit
									</Link>
									{t.slug && (
										<Link href={t.slug as any} target="_blank" className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
											View
											<ExternalLink className="h-4 w-4" />
										</Link>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
