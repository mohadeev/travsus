'use client'

import { Plus } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'
import LinkedText from '@/components/text/LinkedText'

interface FAQ {
	question: string
	answer: string
}

interface FAQProps {
	faqs: FAQ[]
}

/**
 * Tour FAQ. Uses native <details> so every question and answer is in the
 * HTML (and matches the FAQPage structured data) while staying collapsible.
 */
export default function TourFAQ({ faqs }: FAQProps) {
	const t = useTranslations('listingFaqProps')

	if (!faqs || faqs.length === 0) return null

	return (
		<section id="faq" aria-labelledby="faq-heading" className="scroll-mt-32">
			<h2 id="faq-heading" className="headline text-[24px] !leading-tight">
				{t('TourlistingFAQ')}
			</h2>
			{/* Rounded grey cards with a round "+" (turns into "×"), as on the affiliate page */}
			<div className="mt-5 space-y-3">
				{faqs.map((faq, index) => (
					<details
						key={index}
						className="group rounded-3xl bg-neutral-100 px-5 transition open:bg-white open:shadow-lg open:ring-1 open:ring-neutral-200 sm:px-6 dark:bg-neutral-900 dark:open:bg-neutral-900 dark:open:ring-neutral-700"
					>
						<summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 [&::-webkit-details-marker]:hidden">
							<h3 className="text-base font-semibold leading-6 sm:text-lg">{faq.question}</h3>
							<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white transition group-open:rotate-45 group-open:bg-neutral-950 group-open:text-white dark:bg-neutral-800 dark:group-open:bg-white dark:group-open:text-ink">
								<Plus className="h-4 w-4" />
							</span>
						</summary>
						<p className="pb-6 pr-6 text-[15px] leading-relaxed text-neutral-500 dark:text-neutral-400">
							<LinkedText text={faq.answer} />
						</p>
					</details>
				))}
			</div>
		</section>
	)
}
