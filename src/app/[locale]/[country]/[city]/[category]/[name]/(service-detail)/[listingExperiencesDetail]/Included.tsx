'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

const Included = () => {
	const { inclusions }: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	const [isOpen, setIsOpen] = useState(false)
	const t = useTranslations('newServicedetailListingExperiencesDetailIncluded')

	if (!inclusions) return null

	const categories = [
		{ title: 'Luxury - Private', items: inclusions.luxury.private },
		{ title: 'Luxury - Shared', items: inclusions.luxury.shared },
		{ title: 'Standard - Private', items: inclusions.standard.private },
		{ title: 'Standard - Shared', items: inclusions.standard.shared },
	]

	// Filter out empty categories
	const nonEmptyCategories = categories.filter(
		(category) => category.items.length > 0,
	)

	const toggleAccordion = () => {
		setIsOpen(!isOpen)
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
							{t('newServicedetailListingExperiencesDetailIncluded_Included')}
						</h2>
						<span className="text-sm text-neutral-500 dark:text-neutral-400">
							{t(
								'newServicedetailListingExperiencesDetailIncluded_Everything_Included_In_Your_Package',
							)}
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
						{nonEmptyCategories.map(({ title, items }) => (
							<div key={title} className="mb-6 last:mb-0">
								<h3 className="mb-3 text-lg font-medium">{title}</h3>
								<ul className="space-y-2">
									{items.map((item: any, idx: number) => (
										<li key={idx} className="flex items-start">
											<Check className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
											<span className="text-sm text-gray-700 dark:text-gray-300">
												{item}
											</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default Included
