'use client'
// Dashboard menu: a side list on large screens, swipeable tabs on phones.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Building2, CalendarCheck, LayoutGrid, Map, Plus, Users, Wallet, type LucideIcon } from 'lucide-react'

const NAV: [string, string, LucideIcon][] = [
	['/dashboard', 'Overview', LayoutGrid],
	['/dashboard/bookings', 'Bookings', CalendarCheck],
	['/dashboard/tours', 'Tours', Map],
	['/dashboard/customers', 'Customers', Users],
	['/dashboard/finance', 'Finance', Wallet],
	['/dashboard/settings', 'Company', Building2],
]

export default function DashboardNav({ scopeLabel }: { scopeLabel: string }) {
	const locale = useLocale()
	const path = usePathname().replace(`/${locale}`, '') || '/'
	const active = (href: string) => (href === '/dashboard' ? path === href : path === href || path.startsWith(`${href}/`))

	return (
		<nav aria-label="Dashboard" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
			{scopeLabel && (
				<p className="mb-4 hidden px-3 lg:block">
					<span className="block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">Dashboard</span>
					<span className="mt-1 block truncate font-semibold">{scopeLabel}</span>
				</p>
			)}
			<ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
				{NAV.map(([href, label, Icon]) => (
					<li key={href} className="shrink-0">
						<Link
							href={`/${locale}${href}` as any}
							aria-current={active(href) ? 'page' : undefined}
							className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-semibold transition lg:rounded-xl lg:py-3 ${
								active(href)
									? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
									: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 lg:bg-transparent lg:hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 lg:dark:bg-transparent dark:hover:bg-neutral-800'
							}`}
						>
							<Icon className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
							{label}
						</Link>
					</li>
				))}
			</ul>
			<Link
				href={`/${locale}/dashboard/tours/create` as any}
				className="mt-6 hidden items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-3 text-sm font-semibold transition hover:border-neutral-950 lg:flex dark:border-neutral-700 dark:hover:border-white"
			>
				<Plus className="h-4 w-4" />
				New tour
			</Link>
		</nav>
	)
}
