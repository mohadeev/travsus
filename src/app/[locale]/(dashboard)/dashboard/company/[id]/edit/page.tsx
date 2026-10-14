// Edit a company (only its creator can).
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { CompanyForm } from '@/components/dashboard/company-form'
import { db, T, must } from '@/lib/db'
import { dashboardScope } from '@/lib/dashboard'

export const metadata = { title: 'Edit company | TRAVSUS' }

export default async function EditCompanyPage({ params }: { params: { locale: string; id: string } }) {
	const scope = await dashboardScope()
	if (!scope) return null
	const company = must(
		await db.from(T.businesses).select('id, name, type, email, phoneNumber, address, country, registrationNumber, adminName').match({ id: params.id, creatorId: scope.user.id }).maybeSingle(),
	)
	if (!company) notFound()

	return (
		<div className="max-w-3xl">
			<Link href={`/${params.locale}/dashboard/settings` as any} className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white">
				<ArrowLeft className="h-4 w-4" />
				Company
			</Link>
			<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{company.name}</h1>
			<p className="mt-2 text-lg text-neutral-500">Update your company details.</p>
			<div className="mt-10">
				<CompanyForm company={company} />
			</div>
		</div>
	)
}
