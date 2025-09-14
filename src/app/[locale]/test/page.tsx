'use client'

import type React from 'react'
import { useTranslations } from '@/lib/i18n'

import { useState, useEffect } from 'react'
import { Plane, Calendar, RefreshCcw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function HomeBanner() {
	const t = useTranslations('app_locale_test_page')
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		setIsVisible(true)
	}, [])

	const handlePageChange = () => {
		const experiencesContainer = document.getElementById(
			'experiences_container',
		)
		if (experiencesContainer) {
			experiencesContainer.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	return (
		<div className="relative w-full py-12">
			<div className="relative z-20 flex min-h-[auto] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
				<div
					className={cn(
						'max-w-5xl transition-all duration-1000',
						isVisible
							? 'translate-y-0 opacity-100'
							: 'translate-y-10 opacity-0',
					)}
				>
					<h1 className="font-serif mb-6 text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-[100px] lg:font-extrabold">
						{t('app_locale_test_page_Travel_With_Ultimate_Flexibility')}
					</h1>
					<p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-black sm:text-xl md:text-2xl">
						{t('app_locale_test_page_Book_Cancel_Refund_Anytime_Anywhere')}
					</p>
				</div>

				<div
					className={cn(
						'transition-all delay-500 duration-1000',
						isVisible
							? 'translate-y-0 opacity-100'
							: 'translate-y-10 opacity-0',
					)}
				>
					<Button
						size="lg"
						className="rounded-full bg-primary text-lg font-medium shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
						onClick={handlePageChange}
					>
						{t('app_locale_test_page_Plan_Your_Flexible_Trip')}
					</Button>
				</div>
			</div>
		</div>
	)
}

function FeatureItem({
	icon,
	title,
	description,
	onClick,
}: {
	icon: React.ReactNode
	title: string
	description: string
	onClick: () => void
}) {
	const t = useTranslations('app_locale_test_page')

	return (
		<div
			className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl bg-gray-50 p-6 transition-all hover:bg-gray-100 hover:shadow-lg"
			onClick={onClick}
		>
			<div className="rounded-full bg-primary/20 p-3 text-primary transition-all group-hover:bg-primary/30">
				{icon}
			</div>
			<div className="flex flex-col items-center">
				<span className="text-xl font-semibold text-black">{t(title)}</span>
				<span className="text-sm text-gray-600">{t(description)}</span>
			</div>
		</div>
	)
}
