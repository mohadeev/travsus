import { CheckIcon } from '@heroicons/react/24/solid'
import React, { FC } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { useTranslations } from 'next-intl'

export interface PageSubcriptionProps {}

export interface PricingItem {
	isPopular: boolean
	name: string
	pricing: string
	desc: string
	per: string
	features: string[]
}

const pricings: PricingItem[] = [
	{
		isPopular: false,
		name: 'subscription_page_Starter_Plan_Name',
		pricing: 'subscription_page_Starter_Plan_Price',
		per: 'subscription_page_Starter_Plan_Period',
		features: 'subscription_page_Starter_Plan_Features',
		desc: 'subscription_page_Starter_Plan_Description',
	},
	{
		isPopular: true,
		name: 'subscription_page_Basic_Plan_Name',
		pricing: 'subscription_page_Basic_Plan_Price',
		per: 'subscription_page_Basic_Plan_Period',
		features: 'subscription_page_Basic_Plan_Features',
		desc: 'subscription_page_Basic_Plan_Description',
	},
	{
		isPopular: false,
		name: 'subscription_page_Plus_Plan_Name',
		pricing: 'subscription_page_Plus_Plan_Price',
		per: 'subscription_page_Plus_Plan_Period',
		features: 'subscription_page_Plus_Plan_Features',
		desc: 'subscription_page_Plus_Plan_Description',
	},
]

const PageSubcription: FC<PageSubcriptionProps> = () => {
	const t = useTranslations('subscription_page')
	const renderPricingItem = (pricing: PricingItem, index: number) => {
		return (
			<div
				key={index}
				className={`relative flex h-full flex-col overflow-hidden rounded-3xl border-2 px-6 py-8 ${
					pricing.isPopular
						? 'border-primary-500'
						: 'border-neutral-100 dark:border-neutral-700'
				}`}
			>
				{pricing.isPopular && (
					<span className="absolute right-3 top-3 z-10 rounded-full bg-primary-500 px-3 py-1 text-xs tracking-widest text-white">
						{t('subscription_page_Popular_Label')}
					</span>
				)}
				<div className="mb-8">
					<h3 className="text-neutral-6000 mb-2 block text-sm font-medium uppercase tracking-widest dark:text-neutral-300">
						{t(pricing.name)}
					</h3>
					<h2 className="flex items-center text-5xl leading-none text-neutral-900 dark:text-neutral-300">
						<span>{t(pricing.pricing)}</span>
						<span className="ml-1 text-lg font-normal text-neutral-500">
							{t(pricing.per)}
						</span>
					</h2>
				</div>
				<nav className="mb-8 space-y-4">
					{t(pricing.features, { returnObjects: true }).map((item, index) => (
						<li className="flex items-center" key={index}>
							<span className="text-primary-6000 mr-4 inline-flex flex-shrink-0">
								<CheckIcon className="h-5 w-5" aria-hidden="true" />
							</span>
							<span className="text-neutral-700 dark:text-neutral-300">
								{item}
							</span>
						</li>
					))}
				</nav>
				<div className="mt-auto flex flex-col">
					{pricing.isPopular ? (
						<ButtonPrimary>
							{t('subscription_page_Submit_Button')}
						</ButtonPrimary>
					) : (
						<ButtonSecondary>
							<span className="font-medium">
								{t('subscription_page_Submit_Button')}
							</span>
						</ButtonSecondary>
					)}
					<p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
						{t(pricing.desc)}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className={`nc-PageSubcription container pb-24 lg:pb-32`}>
			<header className="mx-auto my-20 max-w-2xl text-center">
				<h2 className="flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
					<span className="mr-4 text-3xl leading-none md:text-4xl">💎</span>
					{t('subscription_page_Subscription_Title')}
				</h2>
				<span className="mt-2 block text-sm text-neutral-700 dark:text-neutral-200 sm:text-base">
					{t('subscription_page_Pricing_Description')}
				</span>
			</header>
			<section className="overflow-hidden text-sm text-neutral-600 md:text-base">
				<div className="grid gap-5 lg:grid-cols-3 xl:gap-8">
					{pricings.map(renderPricingItem)}
				</div>
			</section>
		</div>
	)
}

export default PageSubcription
