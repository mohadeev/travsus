'use client'
// Bar on top of every admin page: back to the admin home and between panels.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import { BarChart3, Building2, Handshake, Languages, LayoutGrid, MapPin, type LucideIcon } from 'lucide-react'

export const ADMIN_LINKS: [string, string, LucideIcon][] = [
	['Home', '/admin', LayoutGrid],
	['Analytics', '/admin/analytics', BarChart3],
	['Site texts', '/admin/translations', Languages],
	['Places', '/cms-admin', MapPin],
	['Affiliates', '/admin/affiliates', Handshake],
	['Business dashboard', '/dashboard', Building2],
]

export default function AdminNav() {
	const locale = useLocale()
	const pathname = usePathname()
	const here = pathname.replace(`/${locale}`, '') || '/'

	return (
		<nav aria-label="Admin" className="sticky top-0 z-30 border-b border-neutral-200 bg-white/85 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/85">
			<div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none]">
				<span className="mr-2 shrink-0 rounded-full bg-neutral-950 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-white dark:bg-white dark:text-neutral-950">
					Admin
				</span>
				{ADMIN_LINKS.map(([label, href, Icon]) => {
					const active = href === '/admin' ? here === href : here.startsWith(href)
					return (
						<Link
							key={href}
							href={`/${locale}${href}` as any}
							aria-current={active ? 'page' : undefined}
							className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
								active
									? 'bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white'
									: 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-900 dark:hover:text-white'
							}`}
						>
							<Icon className="h-4 w-4" />
							{label}
						</Link>
					)
				})}
			</div>
		</nav>
	)
}
