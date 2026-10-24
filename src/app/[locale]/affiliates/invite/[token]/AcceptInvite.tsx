'use client'
// The invitation's action: sign in / create an account first, then accept.
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

type Props = { token: string; signedInAs: string | null; alreadyMember: boolean; areaHref: string }

const primary = 'group inline-flex h-12 w-full items-center justify-between gap-6 rounded-full bg-white pl-6 pr-1.5 text-[15px] font-semibold text-black transition hover:bg-amber-100 active:scale-[0.98] disabled:opacity-60'
const secondary = 'inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10'

export default function AcceptInvite({ token, signedInAs, alreadyMember, areaHref }: Props) {
	const t = useTranslations('AffiliateInvite')
	const router = useRouter()
	const { openSignIn, openSignUp } = useClerk()
	const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>(alreadyMember ? 'done' : 'idle')
	const back = () => ({ forceRedirectUrl: window.location.href })

	if (!signedInAs) {
		return (
			<div>
				<p className="mb-4 text-sm text-white/60">{t('sign_in_first')}</p>
				<div className="grid gap-3 sm:grid-cols-2">
					<button type="button" onClick={() => openSignUp(back())} className={primary}>
						{t('sign_up')}
						<span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white">
							<ArrowUpRight className="h-4 w-4" />
						</span>
					</button>
					<button type="button" onClick={() => openSignIn(back())} className={secondary}>
						{t('sign_in')}
					</button>
				</div>
			</div>
		)
	}

	if (state === 'done') {
		return (
			<div>
				<div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
					<CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />
					<div>
						<p className="font-semibold">{t('accepted_title')}</p>
						<p className="mt-0.5 text-sm text-white/65">{t('accepted_text')}</p>
					</div>
				</div>
				<Link href={areaHref as any} className={`${primary} mt-4`}>
					{t('open_area')}
					<span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white transition-transform group-hover:rotate-45">
						<ArrowUpRight className="h-4 w-4" />
					</span>
				</Link>
			</div>
		)
	}

	async function accept() {
		setState('sending')
		try {
			const res = await fetch('/api/affiliates/invite/accept', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
			if (!res.ok) throw new Error()
			setState('done')
			router.refresh()
		} catch {
			setState('error')
		}
	}

	return (
		<div>
			<button type="button" onClick={accept} disabled={state === 'sending'} className={primary}>
				{t('accept')}
				<span className="grid h-9 w-9 place-items-center rounded-full bg-black text-white transition-transform group-hover:rotate-45">
					{state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
				</span>
			</button>
			<p className="mt-3 text-center text-sm text-white/55">{t('signed_in_as', { email: signedInAs })}</p>
			{state === 'error' && <p className="mt-2 text-center text-sm font-medium text-red-400">{t('error')}</p>}
		</div>
	)
}
