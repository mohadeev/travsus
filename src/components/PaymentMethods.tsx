// Footer payment row, Apple-style: a hairline, one quiet line of text and the
// accepted methods as monochrome marks in thin outlined tiles. No colour, no glow.
// Only list what Stripe Checkout actually offers.
import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'

const Mark = ({ label, children }: { label: string; children: ReactNode }) => (
	<li
		title={label}
		className="grid h-8 w-[52px] place-items-center rounded-md border border-white/15 text-neutral-300 transition-colors duration-300 hover:border-white/40 hover:text-white"
	>
		<span className="sr-only">{label}</span>
		{children}
	</li>
)

export default function PaymentMethods() {
	const t = useTranslations('SiteFooter')

	return (
		<div className="flex flex-col gap-5 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
			<p className="flex items-center gap-2 text-xs text-neutral-400">
				<Lock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
				<span>
					<span className="text-neutral-200">{t('payments_title')}</span>
					<span className="mx-1.5 text-neutral-600">·</span>
					Stripe
				</span>
			</p>

			<ul className="flex flex-wrap items-center gap-2" aria-label={t('payments_title')}>
				<Mark label="Visa">
					<span aria-hidden className="text-[13px] font-extrabold italic tracking-tight">
						VISA
					</span>
				</Mark>
				<Mark label="Mastercard">
					<svg aria-hidden viewBox="0 0 32 20" className="h-4 w-7">
						<circle cx="12" cy="10" r="7" fill="currentColor" opacity="0.55" />
						<circle cx="20" cy="10" r="7" fill="currentColor" opacity="0.9" />
					</svg>
				</Mark>
				<Mark label="American Express">
					<span aria-hidden className="text-[10px] font-bold tracking-[0.14em]">
						AMEX
					</span>
				</Mark>
				<Mark label="Apple Pay">
					<span aria-hidden className="flex items-center text-[12px] font-medium">
						<svg viewBox="0 0 24 24" className="-mt-0.5 h-3 w-3 fill-current">
							<path d="M16.37 1.43c0 1.14-.49 2.27-1.18 3.08-.74.9-1.99 1.57-2.99 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.57-2.27 1.21-2.98.8-.94 2.14-1.64 3.25-1.68.03.13.05.28.05.43zm4.56 15.71c-.03.07-.46 1.58-1.52 3.12-.94 1.34-1.94 2.71-3.43 2.71-1.52 0-1.9-.88-3.63-.88-1.7 0-2.3.91-3.67.91-1.38 0-2.33-1.26-3.43-2.8C4.04 18.38 3 15.57 3 12.92c0-4.28 2.8-6.55 5.55-6.55 1.45 0 2.68.95 3.6.95.87 0 2.22-1.01 3.9-1.01.61 0 2.89.06 4.38 2.19-.13.09-2.38 1.37-2.38 4.19 0 3.26 2.85 4.42 2.95 4.45z" />
						</svg>
						Pay
					</span>
				</Mark>
				<Mark label="Google Pay">
					<span aria-hidden className="text-[12px] font-medium">
						<span className="font-semibold">G</span> Pay
					</span>
				</Mark>
			</ul>
		</div>
	)
}
