'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ChevronDown, ChevronUp } from 'lucide-react'

const FAQs = () => {
	const { faqs }: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	const [isOpen, setIsOpen] = useState(false)

	if (!faqs || faqs.length === 0) return null

	const toggleAccordion = () => {
		setIsOpen(!isOpen)
	}

	// SEO Schema for FAQs
	const faqSchema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq: any) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer,
			},
		})),
	}

	return (
		<div className="">
			<div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
				<div
					className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
					onClick={toggleAccordion}
				>
					<div>
						<h2 className="text-xl font-semibold">
							Frequently Asked Questions
						</h2>
						<span className="text-sm text-neutral-500 dark:text-neutral-400">
							Common questions about this tour
						</span>
					</div>
					{isOpen ? (
						<ChevronUp className="h-5 w-5" />
					) : (
						<ChevronDown className="h-5 w-5" />
					)}
				</div>

				{isOpen && (
					<div className="border-t border-gray-200 p-4 dark:border-gray-700">
						<div className="space-y-4">
							{faqs.map((faq: any, idx: number) => (
								<div key={idx} className="mb-4 last:mb-0">
									<h3 className="mb-2 font-medium">{faq.question}</h3>
									<p className="text-sm text-gray-700 dark:text-gray-300">
										{faq.answer}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* SEO Structured Data for FAQ */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>
		</div>
	)
}

export default FAQs
