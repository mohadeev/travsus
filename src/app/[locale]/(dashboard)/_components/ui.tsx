// Small building blocks shared by the dashboard pages.
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Building2, type LucideIcon } from 'lucide-react'

export const euro = (n: number, cents = false) =>
	new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: cents ? 2 : 0, minimumFractionDigits: cents ? 2 : 0 }).format(n)

export const day = (d: Date | string | null | undefined) =>
	d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export function Stat({ label, value, hint, icon: Icon }: { label: string; value: ReactNode; hint?: ReactNode; icon?: LucideIcon }) {
	return (
		<div className="rounded-3xl bg-neutral-100 p-5 dark:bg-neutral-900">
			<p className="flex items-center justify-between gap-2 text-sm font-medium text-neutral-500">
				{label}
				{Icon && <Icon className="h-4 w-4" />}
			</p>
			<p className="mt-2 text-3xl font-bold tabular-nums tracking-tight">{value}</p>
			{hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
		</div>
	)
}

export function Panel({ title, action, children, className = '' }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
	return (
		<section className={`rounded-[28px] p-5 ring-1 ring-neutral-200 sm:p-6 dark:ring-neutral-800 ${className}`}>
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-lg font-bold tracking-tight">{title}</h2>
				{action}
			</div>
			<div className="mt-4">{children}</div>
		</section>
	)
}

const STATUS: Record<string, [string, string]> = {
	upcoming: ['Upcoming', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'],
	completed: ['Completed', 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'],
	unpaid: ['Not paid', 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'],
	abandoned: ['Abandoned', 'bg-neutral-100 text-neutral-500 dark:bg-neutral-900'],
	cancelled: ['Cancelled', 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'],
}
export function StatusBadge({ status }: { status: string }) {
	const [label, cls] = STATUS[status] ?? [status, STATUS.abandoned[1]]
	return <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>
}

export function Empty({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text?: string; action?: ReactNode }) {
	return (
		<div className="rounded-[28px] bg-neutral-100 px-6 py-14 text-center dark:bg-neutral-900">
			<Icon className="mx-auto h-10 w-10 text-neutral-400" strokeWidth={1.5} />
			<p className="mt-4 text-xl font-bold tracking-tight">{title}</p>
			{text && <p className="mx-auto mt-1 max-w-sm text-neutral-500">{text}</p>}
			{action && <div className="mt-6">{action}</div>}
		</div>
	)
}

/** Shown when the signed-in user has no company yet. */
export function NoCompany({ locale }: { locale: string }) {
	return (
		<Empty
			icon={Building2}
			title="Create your company to start"
			text="Your company holds your tours, bookings and payouts. It only takes a minute."
			action={
				<Link href={`/${locale}/dashboard/company/create` as any} className="inline-flex h-12 items-center rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
					Create company
				</Link>
			}
		/>
	)
}

export const button =
	'inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950'
export const buttonOutline =
	'inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 px-5 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white'
