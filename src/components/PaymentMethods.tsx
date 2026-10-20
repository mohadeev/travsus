// Footer payment strip: the methods Stripe Checkout takes, as white card-style
// badges, next to a "secure payment" note. Only list what Stripe actually offers.
import type { ReactNode } from 'react'
import { LockKeyhole } from 'lucide-react'
import { useTranslations } from 'next-intl'

const Badge = ({ label, children }: { label: string; children: ReactNode }) => (
	<li
		title={label}
		className="grid h-10 w-[62px] place-items-center rounded-lg bg-white shadow-[0_1px_0_rgb(255_255_255/0.4)_inset,0_6px_16px_-6px_rgb(0_0_0/0.6)] ring-1 ring-white/20 transition hover:-translate-y-0.5"
	>
		<span className="sr-only">{label}</span>
		{children}
	</li>
)

const Visa = () => (
	<span aria-hidden className="text-[17px] font-black italic tracking-tight text-[#1A1F71]">
		VISA
	</span>
)

const Mastercard = () => (
	<svg aria-hidden viewBox="0 0 40 24" className="h-6 w-10">
		<circle cx="15" cy="12" r="9" fill="#EB001B" />
		<circle cx="25" cy="12" r="9" fill="#F79E1B" />
		<path d="M20 4.5a9 9 0 0 1 0 15 9 9 0 0 1 0-15z" fill="#FF5F00" />
	</svg>
)

const Amex = () => (
	<span aria-hidden className="grid h-7 w-12 place-items-center rounded bg-[#2E77BC] text-[10px] font-black tracking-wider text-white">
		AMEX
	</span>
)

const ApplePay = () => (
	<span aria-hidden className="flex items-center gap-0.5 text-[15px] font-semibold text-black">
		<svg viewBox="0 0 24 24" className="-mt-0.5 h-4 w-4 fill-current">
			<path d="M16.37 1.43c0 1.14-.49 2.27-1.18 3.08-.74.9-1.99 1.57-2.99 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.57-2.27 1.21-2.98.8-.94 2.14-1.64 3.25-1.68.03.13.05.28.05.43zm4.56 15.71c-.03.07-.46 1.58-1.52 3.12-.94 1.34-1.94 2.71-3.43 2.71-1.52 0-1.9-.88-3.63-.88-1.7 0-2.3.91-3.67.91-1.38 0-2.33-1.26-3.43-2.8C4.04 18.38 3 15.57 3 12.92c0-4.28 2.8-6.55 5.55-6.55 1.45 0 2.68.95 3.6.95.87 0 2.22-1.01 3.9-1.01.61 0 2.89.06 4.38 2.19-.13.09-2.38 1.37-2.38 4.19 0 3.26 2.85 4.42 2.95 4.45z" />
		</svg>
		Pay
	</span>
)

const GooglePay = () => (
	<span aria-hidden className="flex items-center gap-0.5 text-[15px] font-semibold text-neutral-600">
		<span className="bg-[conic-gradient(from_-45deg,#EA4335_0_25%,#4285F4_0_50%,#34A853_0_75%,#FBBC05_0)] bg-clip-text text-[17px] font-bold text-transparent">
			G
		</span>
		Pay
	</span>
)

export default function PaymentMethods() {
	const t = useTranslations('SiteFooter')

	return (
		<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 ring-1 ring-white/10 sm:p-7">
			<div aria-hidden className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
			<div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex items-start gap-4">
					<span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20">
						<LockKeyhole className="h-5 w-5" />
					</span>
					<div>
						<h3 className="text-base font-semibold text-white">{t('payments_title')}</h3>
						<p className="mt-1 max-w-md text-sm">{t('payments_text')}</p>
					</div>
				</div>

				<ul className="flex flex-wrap items-center gap-2.5">
					<Badge label="Visa"><Visa /></Badge>
					<Badge label="Mastercard"><Mastercard /></Badge>
					<Badge label="American Express"><Amex /></Badge>
					<Badge label="Apple Pay"><ApplePay /></Badge>
					<Badge label="Google Pay"><GooglePay /></Badge>
					<li className="ml-1 flex items-center gap-1.5 text-xs text-neutral-500">
						<span className="text-[11px] uppercase tracking-wider">Powered by</span>
						<span className="text-sm font-bold tracking-tight text-[#8C88FF]">stripe</span>
					</li>
				</ul>
			</div>
		</div>
	)
}
