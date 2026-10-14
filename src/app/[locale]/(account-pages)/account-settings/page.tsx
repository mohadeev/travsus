// Account overview: who you are, then one tile per section.
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSessionUser } from '@/lib/session'
import { ACCOUNT_NAV } from '../_components/navItems'

export const dynamic = 'force-dynamic'

export default async function AccountOverviewPage({ params }: { params: { locale: string } }) {
	const { locale } = params
	setRequestLocale(locale)
	const t = await getTranslations('Account')
	const [user, clerk] = await Promise.all([getSessionUser(), currentUser()])
	if (!user) return null // the layout shows the sign-in prompt

	const name =
		[user.accountData?.firstname, user.accountData?.lastname].filter(Boolean).join(' ') || clerk?.fullName || user.username || ''
	const image = user.profileImage?.url || clerk?.imageUrl
	const tiles = ACCOUNT_NAV.slice(1) // all sections but this one

	return (
		<div>
			<header className="flex items-center gap-4 sm:gap-5">
				{image ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={image} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover sm:h-20 sm:w-20" />
				) : (
					<span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-neutral-950 text-xl font-bold text-white sm:h-20 sm:w-20 dark:bg-white dark:text-neutral-950">
						{(name || user.email).charAt(0).toUpperCase()}
					</span>
				)}
				<div className="min-w-0">
					<h1 className="truncate text-2xl font-bold tracking-tight sm:text-5xl">{name ? t('hello', { name: name.split(' ')[0] }) : t('title')}</h1>
					<p className="mt-1 truncate text-neutral-500">{user.email}</p>
				</div>
			</header>

			<ul className="mt-8 grid gap-2 sm:mt-10 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
				{tiles.map(([href, key, Icon]) => (
					<li key={href}>
						<Link
							href={`/${locale}${href}` as any}
							className="group flex h-full items-center gap-4 rounded-2xl bg-neutral-100 p-4 transition hover:bg-neutral-200 sm:flex-col sm:items-start sm:gap-0 sm:rounded-3xl sm:p-6 dark:bg-neutral-900 dark:hover:bg-neutral-800"
						>
							<span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white dark:bg-neutral-950">
								<Icon className="h-5 w-5" />
							</span>
							<span className="min-w-0 flex-1 sm:mt-5 sm:w-full">
								<span className="flex items-center justify-between gap-2 font-semibold sm:text-lg">
									{t(key)}
									<ArrowRight className="h-4 w-4 shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 sm:opacity-0 sm:group-hover:opacity-100" />
								</span>
								<span className="mt-0.5 block truncate text-sm text-neutral-500 sm:mt-1 sm:whitespace-normal">{t(`${key}_text`)}</span>
							</span>
						</Link>
					</li>
				))}
			</ul>

			<p className="mt-12 text-sm text-neutral-500">
				{t('delete_hint')}{' '}
				<Link href={`/${locale}/account-settings/deactivate` as any} className="font-semibold text-neutral-950 underline underline-offset-4 dark:text-white">
					{t('delete_link')}
				</Link>
			</p>
		</div>
	)
}
