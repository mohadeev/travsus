'use client'

import { ChevronDown } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

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
			<span aria-hidden className="mb-3 block h-1 w-10 rounded-full bg-brand-500" />
			<h2 id="faq-heading" className="text-2xl font-bold tracking-tight">
				{t('TourlistingFAQ')}
			</h2>
			<div className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
				{faqs.map((faq, index) => (
					<details key={index} className="group py-4">
						<summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
							<h3 className="font-semibold">{faq.question}</h3>
							<ChevronDown className="mt-0.5 h-5 w-5 flex-shrink-0 text-neutral-500 transition-transform group-open:rotate-180 group-open:text-brand-500" />
						</summary>
						<p className="mt-2 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{faq.answer}</p>
					</details>
				))}
			</div>
		</section>
	)
}
