'use client'
// Account menu: a side list on large screens, swipeable tabs on phones.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ACCOUNT_NAV } from './navItems'

export default function AccountNav() {
	const t = useTranslations('Account')
	const locale = useLocale()
	const pathname = usePathname()
	const current = pathname.replace(`/${locale}`, '') || '/'

	return (
		<nav aria-label={t('menu')} className="lg:sticky lg:top-24 lg:self-start">
			<ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
				{ACCOUNT_NAV.map(([href, label, Icon]) => {
					const active = current === href
					return (
						<li key={href} className="shrink-0">
							<Link
								href={`/${locale}${href}` as any}
								aria-current={active ? 'page' : undefined}
								className={`flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-semibold transition lg:rounded-xl lg:py-3 ${
									active
										? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
										: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 lg:bg-transparent lg:hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 lg:dark:bg-transparent dark:hover:bg-neutral-800'
								}`}
							>
								<Icon className="h-4 w-4 lg:h-[18px] lg:w-[18px]" />
								{t(label)}
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
