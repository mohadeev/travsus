'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

interface FAQ {
	question: string
	answer: string
}

interface FAQProps {
	faqs: FAQ[]
}

export default function TourFAQ({ faqs }: FAQProps) {
	const t = useTranslations('listingFaqProps')
	const [isOpen, setIsOpen] = useState(false)
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	if (!faqs || faqs.length === 0) return null

	const toggleAccordion = () => setIsOpen(!isOpen)
	const toggleFAQ = (index: number) =>
		setOpenIndex(openIndex === index ? null : index)

	return (
		<div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
			<div
				className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
				onClick={toggleAccordion}
			>
				<h2 className="text-xl font-semibold">{t('TourlistingFAQ')}</h2>
				{isOpen ? (
					<ChevronUp className="h-5 w-5" />
				) : (
					<ChevronDown className="h-5 w-5" />
				)}
			</div>

			{isOpen && (
				<div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
					{faqs.map((faq, index) => (
						<Card key={index} className="p-4">
							<div
								className="flex cursor-pointer items-start justify-between"
								onClick={() => toggleFAQ(index)}
								role="button"
								aria-expanded={openIndex === index}
								aria-controls={`faq-${index}`}
							>
								<h3 className="font-medium">{faq.question}</h3>
								{openIndex === index ? (
									<ChevronUp className="h-5 w-5 text-primary" />
								) : (
									<ChevronDown className="h-5 w-5 text-primary" />
								)}
							</div>
							{openIndex === index && (
								<div
									id={`faq-${index}`}
									className="mt-2 text-sm text-gray-700 dark:text-gray-300"
								>
									<p>{faq.answer}</p>
								</div>
							)}
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
