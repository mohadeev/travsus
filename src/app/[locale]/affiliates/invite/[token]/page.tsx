// A personal affiliate invitation (the link in the invitation email).
// Signed out: sign in or create an account first. Signed in: accept, and they
// become an affiliate under their account's email.
import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, LinkIcon } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getSession } from '@/lib/session'
import { inviteByToken } from '@/lib/affiliateInvites'
import { affiliateByEmail } from '@/lib/affiliates'
import AcceptInvite from './AcceptInvite'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Affiliate invitation | TRAVSUS', robots: { index: false, follow: false } }

type Props = { params: { locale: string; token: string } }

export default async function AffiliateInvitePage({ params }: Props) {
	const { locale, token } = params
	setRequestLocale(locale)
	const t = await getTranslations('AffiliateInvite')
	const [invite, session] = await Promise.all([inviteByToken(token), getSession()])
	const areaHref = `/${locale}/account-affiliate`

	if (!invite) {
		return (
			<main className="mx-auto max-w-lg px-5 py-24 text-center text-neutral-950 dark:text-white">
				<LinkIcon className="mx-auto h-10 w-10 text-neutral-400" strokeWidth={1.5} />
				<h1 className="mt-5 text-3xl font-bold tracking-tight">{t('invalid_title')}</h1>
				<p className="mt-2 text-neutral-500">{t('invalid_text')}</p>
				<Link href={`/${locale}/affiliates` as any} className="mt-8 inline-flex h-12 items-center rounded-full border border-neutral-300 px-7 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
					{t('about_program')}
				</Link>
			</main>
		)
	}

	// Already an affiliate with this account: nothing left to accept
	const member = session ? await affiliateByEmail(session.user.email) : null
	const firstName = invite.name?.split(' ')[0]
	const perks = [t('perk_commission'), t('perk_cookie'), t('perk_payouts')]

	return (
		<main className="px-5 py-12 text-neutral-950 sm:py-20 dark:text-white">
			<div className="mx-auto max-w-xl overflow-hidden rounded-[32px] bg-black text-white">
				<div className="relative px-7 py-10 sm:px-12 sm:py-14">
					<div aria-hidden className="pointer-events-none absolute -left-24 -top-32 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
					<p className="relative inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-white/60">
						<span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
						{t('eyebrow')}
					</p>
					<h1 className="relative mt-4 text-[34px] font-bold leading-[1.08] tracking-tight sm:text-5xl">
						{firstName ? t('title_named', { name: firstName }) : t('title')}
					</h1>
					<p className="relative mt-3 text-[15px] leading-relaxed text-white/65 sm:text-base">{t('text')}</p>

					<ul className="relative mt-7 space-y-2.5 border-t border-white/10 pt-7">
						{perks.map((perk) => (
							<li key={perk} className="flex items-center gap-3 text-[15px] font-medium">
								<span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-black">
									<Check className="h-3 w-3" strokeWidth={3} />
								</span>
								{perk}
							</li>
						))}
					</ul>

					<div className="relative mt-9">
						<AcceptInvite token={invite.token} signedInAs={session?.user.email ?? null} alreadyMember={!!member} areaHref={areaHref} />
					</div>
				</div>
			</div>
			<p className="mt-6 text-center text-sm text-neutral-500">
				<Link href={`/${locale}/affiliates` as any} className="underline underline-offset-4 hover:text-neutral-950 dark:hover:text-white">
					{t('about_program')}
				</Link>
			</p>
		</main>
	)
}
