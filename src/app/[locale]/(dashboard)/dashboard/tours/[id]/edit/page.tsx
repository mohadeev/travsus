import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import EasyTourEditor from '@/components/dashboard/tour/easy/EasyTourEditor'
import { db, T, must } from '@/lib/db'
import { dashboardScope } from '@/lib/dashboard'

export const metadata: Metadata = { title: 'Edit tour | TRAVSUS' }

/** The tour's public page, in the editor's language when it has one */
const previewOf = (tour: any, locale: string) => {
	const slugs: { language: string; slug: string }[] = tour.slugs ?? []
	return (slugs.find((s) => s.language === locale) ?? slugs.find((s) => s.language === 'en-US') ?? slugs[0])?.slug ?? null
}

export default async function EditTourPage({ params }: { params: { locale: string; id: string } }) {
	const scope = await dashboardScope()
	const tour: any = must(await db.from(T.tours).select('*').eq('id', params.id).maybeSingle())
	// Only the site owner, or the business the tour belongs to
	if (!scope || !tour || !(scope.all || (scope.businessId && tour.businessId === scope.businessId))) notFound()

	return (
		<DashboardShell>
			<Link href={`/${params.locale}/dashboard/tours` as any} className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white">
				<ArrowLeft className="h-4 w-4" />
				All tours
			</Link>
			<DashboardHeader heading={tour.name || 'New trip'} text="Answer one question at a time. Everything saves by itself." />
			<EasyTourEditor initial={tour} previewHref={previewOf(tour, params.locale)} backHref={`/${params.locale}/dashboard/tours`} />
		</DashboardShell>
	)
}
