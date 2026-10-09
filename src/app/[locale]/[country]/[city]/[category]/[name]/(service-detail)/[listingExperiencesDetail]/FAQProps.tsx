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
		<section
			id="faq"
			aria-labelledby="faq-heading"
			className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700"
		>
			<h2 id="faq-heading" className="p-4 text-xl font-semibold">
				{t('TourlistingFAQ')}
			</h2>
			<div className="divide-y divide-gray-200 border-t border-gray-200 dark:divide-gray-700 dark:border-gray-700">
				{faqs.map((faq, index) => (
					<details key={index} className="group px-4 py-3">
						<summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
							<h3 className="font-medium">{faq.question}</h3>
							<ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform group-open:rotate-180" />
						</summary>
						<p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{faq.answer}</p>
					</details>
				))}
			</div>
		</section>
	)
}
