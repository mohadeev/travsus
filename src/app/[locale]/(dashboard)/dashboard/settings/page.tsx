import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { CompanySettings } from '@/components/dashboard/company-settings'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

interface PageProps {
	params: Promise<{
		locale: string
	}>
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({
		locale,
		namespace: 'Jan03_CompanySettings_s7m4',
	})

	return {
		title: t('Company_Settings'),
		description: t('Manage_Your_Company_Settings'),
	}
}

function SettingsSkeleton() {
	return (
		<Card>
			<CardHeader className="pb-3">
				<Skeleton className="h-8 w-[200px]" />
				<Skeleton className="mt-2 h-4 w-[300px]" />
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-[100px]" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
				<Skeleton className="h-10 w-[150px]" />
			</CardContent>
		</Card>
	)
}

export default async function SettingsPage({ params }: PageProps) {
	const { locale } = await params
	const t = await getTranslations({
		locale,
		namespace: 'Jan03_CompanySettings_s7m4',
	})

	return (
		<DashboardShell>
			<DashboardHeader
				heading={t('Company_Settings')}
				text={t('Manage_Your_Company_Information')}
			/>
			<Suspense fallback={<SettingsSkeleton />}>
				<CompanySettings />
			</Suspense>
		</DashboardShell>
	)
}
