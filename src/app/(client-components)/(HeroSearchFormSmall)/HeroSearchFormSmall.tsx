'use client'
import React, { FC, useEffect, useState } from 'react'
import { useTranslations } from '@/lib/i18n'
import { ExperiencesSearchFormFields } from '../type'
import ExperiencesSearchForm from './(experiences-search-form)/ExperiencesSearchForm'

export type SearchTab = 'Experiences' | 'Stays' | 'Cars' | 'Flights'

export interface HeroSearchFormSmallProps {
	className?: string
	defaultTab?: SearchTab
	onTabChange?: (tab: SearchTab) => void
	defaultFieldFocus?: ExperiencesSearchFormFields
}

const HeroSearchFormSmall: FC<HeroSearchFormSmallProps> = ({
	className = '',
	defaultTab = 'Experiences',
	onTabChange,
	defaultFieldFocus,
}) => {
	const t = useTranslations('Jan03_HeroSearchFormSmall_m9x4')
	const [tabActive, setTabActive] = useState<SearchTab>(defaultTab)

	useEffect(() => {
		setTabActive(defaultTab)
	}, [defaultTab])

	const TABS: any = [
		{ name: t('Experiences'), key: 'Experiences' },
		//'Stays', 'Cars', 'Flights'
	]

	const renderTab = () => {
		return (
			<ul className="flex h-[88px] justify-center space-x-5 sm:space-x-9">
				{TABS.slice(0, 1).map((tab: any) => {
					const active = tab.key === tabActive
					return (
						<li
							onClick={() => {
								alert('active')
								setTabActive(tab.key)
								onTabChange && onTabChange(tab.key)
							}}
							className={`relative flex flex-shrink-0 cursor-pointer items-center text-base ${
								active
									? 'font-medium text-neutral-900 dark:text-neutral-200'
									: 'text-neutral-500 dark:text-neutral-300'
							} `}
							key={tab.key}
						>
							<div className="relative select-none">
								<span>{tab.name}</span>
								{active && (
									<span className="absolute top-full mr-2 mt-1 block h-0.5 w-full rounded-full bg-neutral-800 dark:bg-neutral-100" />
								)}
							</div>
						</li>
					)
				})}
			</ul>
		)
	}

	const renderForm = () => {
		switch (tabActive) {
			case 'Experiences':
				return <ExperiencesSearchForm />

			default:
				return null
		}
	}

	return (
		<div
			className={`nc-HeroSearchFormSmall ${className}`}
			data-nc-id="HeroSearchFormSmall"
		>
			{renderTab()}
			<div className="mt-2">{renderForm()}</div>
		</div>
	)
}

export default HeroSearchFormSmall
