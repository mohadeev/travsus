'use client'
// Start a new tour: creates a blank tour for the company, then opens the
// builder (basics, overview, itinerary, pricing, photos, stays).
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { ArrowLeft, BedDouble, Euro, FileText, Images, ListOrdered, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { initializeBlankTour } from '@/app/actions/tourActions'

const STEPS = [
	[FileText, 'Basics', 'Name, subtitle, language and tags.'],
	[Sparkles, 'Overview', 'What makes it special, in a few lines.'],
	[ListOrdered, 'Itinerary', 'Each day: where you go and what you do.'],
	[Euro, 'Pricing', 'Prices per group size and transport.'],
	[Images, 'Photos', 'The pictures travellers see first.'],
	[BedDouble, 'Stays', 'Where travellers sleep, room by room.'],
] as const

export default function CreateTourPage() {
	const router = useRouter()
	const locale = useLocale()
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')

	async function start() {
		setBusy(true)
		setError('')
		const result: any = await initializeBlankTour().catch((e) => ({ success: false, error: e?.message }))
		if (result?.success && result.tour?.id) {
			router.push(`/${locale}/dashboard/tours/${result.tour.id}/edit` as any)
			return
		}
		setError(result?.error === 'No business found for this user' ? 'Create your company first, then add tours.' : result?.error || 'Could not start a new tour. Please try again.')
		setBusy(false)
	}

	return (
		<div className="max-w-3xl">
			<Link href={`/${locale}/dashboard/tours` as any} className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white">
				<ArrowLeft className="h-4 w-4" />
				All tours
			</Link>
			<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">New tour</h1>
			<p className="mt-2 max-w-xl text-lg text-neutral-500">We&apos;ll create a draft and open the builder. Fill it in at your pace: it&apos;s saved as you go.</p>

			<ol className="mt-10 grid gap-3 sm:grid-cols-2">
				{STEPS.map(([Icon, title, text], i) => (
					<li key={title} className="flex items-start gap-4 rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
						<span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white dark:bg-neutral-950">
							<Icon className="h-5 w-5" />
						</span>
						<span>
							<span className="block font-semibold">
								<span className="mr-1.5 tabular-nums text-neutral-400">{i + 1}</span>
								{title}
							</span>
							<span className="mt-0.5 block text-sm text-neutral-500">{text}</span>
						</span>
					</li>
				))}
			</ol>

			{error && (
				<p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
					{error}{' '}
					{error.startsWith('Create your company') && (
						<Link href={`/${locale}/dashboard/company/create` as any} className="font-semibold underline underline-offset-4">
							Create company
						</Link>
					)}
				</p>
			)}

			<div className="mt-8">
				<Button size="lg" onClick={start} loading={busy} className="w-full sm:w-auto">
					Start a new tour
				</Button>
			</div>
		</div>
	)
}
