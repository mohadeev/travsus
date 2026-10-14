// Invite friends: your referral code. Friends enter it at checkout for a
// discount; you earn a commission on their booking.
import Link from 'next/link'
import { Gift } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createReferralLink } from '@/app/api/user/userData/createReferralLink'
import { db, T, must } from '@/lib/db'
import { getSessionUser } from '@/lib/session'
import CopyCode from './CopyCode'

export const dynamic = 'force-dynamic'

export default async function InvitePage({ params }: { params: { locale: string } }) {
	const { locale } = params
	setRequestLocale(locale)
	const t = await getTranslations('Account')
	const user = await getSessionUser()
	if (!user) return null // the layout shows the sign-in prompt

	// Every account gets one code, created the first time it's needed
	const existing = must(await db.from(T.referralLinks).select('*').eq('userId', user.id).limit(1).maybeSingle())
	const link: any = existing ?? (await createReferralLink(user.id).catch(() => null))

	const discount = link?.clientDiscount ?? 0
	const commission = link?.commissionValue ?? 0

	return (
		<div className="max-w-3xl">
			<h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{t('nav_invite')}</h1>
			<p className="mt-2 text-neutral-500">{t('invite_text')}</p>

			{link ? (
				<div className="mt-10 rounded-[28px] bg-neutral-100 p-6 sm:p-10 dark:bg-neutral-900">
					<Gift className="h-8 w-8" strokeWidth={1.75} />
					<p className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">{t('invite_offer', { discount, commission })}</p>
					<p className="mt-2 text-neutral-500">{t('invite_how')}</p>
					<div className="mt-8">
						<CopyCode code={link.code} shareText={t('invite_share_text', { code: link.code, discount })} />
					</div>
				</div>
			) : (
				<p className="mt-10 rounded-3xl bg-neutral-100 px-6 py-8 text-neutral-500 dark:bg-neutral-900">{t('invite_error')}</p>
			)}

			<ol className="mt-10 grid gap-3 sm:grid-cols-3">
				{(['invite_step1', 'invite_step2', 'invite_step3'] as const).map((key, i) => (
					<li key={key} className="rounded-3xl border border-neutral-200 p-6 dark:border-neutral-800">
						<span className="text-3xl font-bold text-neutral-300 dark:text-neutral-700">{i + 1}</span>
						<p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{t(key, { discount, commission })}</p>
					</li>
				))}
			</ol>

			<p className="mt-8 text-sm text-neutral-500">
				{t('invite_more')}{' '}
				<Link href={`/${locale}/affiliates` as any} className="font-semibold text-neutral-950 underline underline-offset-4 dark:text-white">
					{t('invite_affiliates')}
				</Link>
			</p>
		</div>
	)
}
