import Link from 'next/link'
import { ArrowLeft, CalendarCheck, Map, Wallet } from 'lucide-react'
import { CreateCompanyForm } from '@/components/dashboard/create-company-form'

export const metadata = { title: 'Create your company | TRAVSUS' }

// [icon, title, text]: what a company unlocks
const PERKS = [
	[Map, 'Publish tours', 'Photos, day-by-day itinerary and prices.'],
	[CalendarCheck, 'Get bookings', 'Travellers book and pay online.'],
	[Wallet, 'Track revenue', 'Every payment in one place.'],
] as const

export default function CreateCompanyPage({ params }: { params: { locale: string } }) {
	return (
		<div className="max-w-3xl">
			<Link href={`/${params.locale}/dashboard/settings` as any} className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white">
				<ArrowLeft className="h-4 w-4" />
				Company
			</Link>
			<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Create your company</h1>
			<p className="mt-2 max-w-xl text-lg text-neutral-500">It takes a minute. You can change everything later.</p>

			<ul className="mt-8 grid gap-3 sm:grid-cols-3">
				{PERKS.map(([Icon, title, text]) => (
					<li key={title} className="flex items-start gap-3 rounded-2xl p-4 ring-1 ring-neutral-200 dark:ring-neutral-800">
						<Icon className="mt-0.5 h-5 w-5 shrink-0" />
						<span>
							<span className="block text-sm font-semibold">{title}</span>
							<span className="block text-xs text-neutral-500">{text}</span>
						</span>
					</li>
				))}
			</ul>

			<div className="mt-10">
				<CreateCompanyForm />
			</div>
		</div>
	)
}
