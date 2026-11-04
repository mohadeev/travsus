// The questions people ask before they book, answered with real facts (deposit,
// cancellation, payment, who we are, how to reach us). Plain <details>, so it
// works without JavaScript; the same answers go to Google as FAQ data.
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { companyProfile } from '@/constants/companyProfile'
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@/constants/contact'
import styles from './home.module.css'

const QUESTIONS = ['1', '2', '3', '4', '5', '6']

/** `schema`: also send the FAQ data to Google (only the home page does, so it isn't duplicated). */
export default function HomeFaq({ schema = true }: { schema?: boolean }) {
	const t = useTranslations('Landing')
	const values = { number: companyProfile.registrationNumber ?? '', phone: SUPPORT_PHONE, email: SUPPORT_EMAIL }
	const faqs = QUESTIONS.map((n) => ({ q: t(`q${n}`), a: t(`a${n}`, values) }))

	return (
		<section className={`${styles.reveal} grid gap-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16`} aria-labelledby="faq-title">
			<div>
				<h2 id="faq-title" className="headline text-2xl sm:text-[32px]">
					{t('faq_title')}
				</h2>
				<p className="mt-1 text-sm text-neutral-500 sm:mt-2 sm:text-base">{t('faq_sub')}</p>
			</div>

			<div className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
				{faqs.map(({ q, a }, i) => (
					<details key={q} className="group" open={i === 0}>
						<summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-semibold sm:text-lg [&::-webkit-details-marker]:hidden">
							{q}
							<ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-180" aria-hidden />
						</summary>
						<p className="-mt-1 pb-5 pr-8 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{a}</p>
					</details>
				))}
			</div>

			{schema && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							'@context': 'https://schema.org',
							'@type': 'FAQPage',
							mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
						}).replace(/</g, '\\u003c'),
					}}
				/>
			)}
		</section>
	)
}
