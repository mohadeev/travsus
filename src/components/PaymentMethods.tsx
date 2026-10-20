// Footer payment row: a short trust line with Stripe's security marks on the
// left, the accepted methods as glossy brand-colour card marks on the right.
// Only list what Stripe Checkout actually offers.
import type { ReactNode } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'

const Mark = ({ label, className, children }: { label: string; className: string; children: ReactNode }) => (
	<li
		title={label}
		className={`relative grid h-[38px] w-[60px] place-items-center overflow-hidden rounded-[7px] shadow-[0_8px_20px_-8px_rgb(0_0_0/0.8)] ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_-10px_rgb(0_0_0/0.9)] ${className}`}
	>
		<span className="sr-only">{label}</span>
		{children}
		{/* Gloss */}
		<span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
	</li>
)

const AppleLogo = () => (
	<svg aria-hidden viewBox="0 0 24 24" className="-mt-0.5 h-[15px] w-[15px] fill-current">
		<path d="M16.37 1.43c0 1.14-.49 2.27-1.18 3.08-.74.9-1.99 1.57-2.99 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.57-2.27 1.21-2.98.8-.94 2.14-1.64 3.25-1.68.03.13.05.28.05.43zm4.56 15.71c-.03.07-.46 1.58-1.52 3.12-.94 1.34-1.94 2.71-3.43 2.71-1.52 0-1.9-.88-3.63-.88-1.7 0-2.3.91-3.67.91-1.38 0-2.33-1.26-3.43-2.8C4.04 18.38 3 15.57 3 12.92c0-4.28 2.8-6.55 5.55-6.55 1.45 0 2.68.95 3.6.95.87 0 2.22-1.01 3.9-1.01.61 0 2.89.06 4.38 2.19-.13.09-2.38 1.37-2.38 4.19 0 3.26 2.85 4.42 2.95 4.45z" />
	</svg>
)

const MARKS = (
	<>
		<Mark label="Visa" className="bg-gradient-to-br from-[#2A3BB7] to-[#141B6B] ring-white/15">
			<span aria-hidden className="text-[16px] font-black italic tracking-tight text-white">
				VISA
			</span>
		</Mark>
		<Mark label="Mastercard" className="bg-gradient-to-br from-neutral-800 to-black ring-white/15">
			<svg aria-hidden viewBox="0 0 40 24" className="h-[22px] w-9">
				<circle cx="15" cy="12" r="9" fill="#EB001B" />
				<circle cx="25" cy="12" r="9" fill="#F79E1B" />
				<path d="M20 4.5a9 9 0 0 1 0 15 9 9 0 0 1 0-15z" fill="#FF5F00" />
			</svg>
		</Mark>
		<Mark label="American Express" className="bg-gradient-to-br from-[#1F8FE5] to-[#0060B6] ring-white/15">
			<span aria-hidden className="text-center text-[9px] font-black uppercase leading-[1.05] tracking-[0.12em] text-white">
				American
				<br />
				Express
			</span>
		</Mark>
		<Mark label="Apple Pay" className="bg-black ring-white/25">
			<span aria-hidden className="flex items-center text-[14px] font-semibold text-white">
				<AppleLogo />
				Pay
			</span>
		</Mark>
		<Mark label="Google Pay" className="bg-white ring-black/5">
			<span aria-hidden className="flex items-center gap-[1px] text-[14px] font-semibold text-[#5F6368]">
				<span className="bg-[conic-gradient(from_-45deg,#EA4335_0_25%,#4285F4_0_50%,#34A853_0_75%,#FBBC05_0)] bg-clip-text text-[16px] font-bold text-transparent">
					G
				</span>
				Pay
			</span>
		</Mark>
	</>
)

export default function PaymentMethods() {
	const t = useTranslations('SiteFooter')

	return (
		<div className="relative py-9">
			{/* Glowing divider */}
			<span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />

			<div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex items-center gap-4">
					<span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-300 to-emerald-600 text-neutral-950 shadow-[0_0_30px_-4px_rgb(52_211_153/0.6)]">
						<ShieldCheck className="h-6 w-6" strokeWidth={2.2} />
					</span>
					<div>
						<p className="text-[15px] font-semibold text-white">
							{t('payments_title')}{' '}
							<span className="font-normal text-neutral-500">·</span>{' '}
							<span className="font-normal text-neutral-400">
								Powered by <span className="font-bold tracking-tight text-[#A29BFE]">stripe</span>
							</span>
						</p>
						<ul className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-medium uppercase tracking-wider text-emerald-200/90">
							{['256-bit SSL', 'PCI DSS', '3D Secure'].map((chip) => (
								<li key={chip} className="rounded-full bg-emerald-400/10 px-2.5 py-1 ring-1 ring-emerald-300/20">
									{chip}
								</li>
							))}
						</ul>
					</div>
				</div>

				<ul className="flex flex-wrap items-center gap-2.5">{MARKS}</ul>
			</div>
		</div>
	)
}
