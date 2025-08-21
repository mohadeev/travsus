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
	const t = useTranslations("app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_FAQProps");
	if (!faqs) {
		return null
	}
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index)
	}

	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity:
			faqs && faqs.length > 0
				? faqs.map((faq) => ({
						'@type': 'Question',
						name: faq.question,
						acceptedAnswer: {
							'@type': 'Answer',
							text: faq.answer,
						},
					}))
				: [],
	}

	return (
		<>
			{faqs.length >= 1 ? (
				<section className="listingSection__wrap_no_border_color">
					<h2 className="mb-8 text-2xl font-semibold">
						{t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_FAQProps_Frequently_Asked_Questions')}
					</h2>
					<div className="space-y-4">
						{faqs?.map((faq, index) => (
							<Card
								key={index}
								className="p-6 transition-shadow hover:shadow-lg"
							>
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
										className="text-muted-foreground mt-4"
									>
										<p>{faq.answer}</p>
									</div>
								)}
							</Card>
						))}
					</div>

					{/* SEO Structured Data for FAQ */}
					<script
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
					/>
				</section>
			) : null}
		</>
	)
}