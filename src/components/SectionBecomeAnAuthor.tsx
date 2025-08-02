import React, { FC } from 'react'
import rightImgDemo from '@/images/BecomeAnAuthorImg.png'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Logo from '@/shared/Logo'
import Image from 'next/image'
import { useTranslations } from '@/lib/i18n'

export interface SectionBecomeAnAuthorProps {
	className?: string
	rightImg?: string
}

const SectionBecomeAnAuthor: FC<SectionBecomeAnAuthorProps> = ({
	className = '',
	rightImg = rightImgDemo,
}) => {
	const t = useTranslations("components_SectionBecomeAnAuthor");

	return (
		<div
			className={`nc-SectionBecomeAnAuthor relative flex flex-col items-center lg:flex-row ${className}`}
			data-nc-id="SectionBecomeAnAuthor"
		>
			<div className="mb-16 flex-shrink-0 lg:mb-0 lg:mr-10 lg:w-2/5">
				<Logo className="w-20" />
				<h2 className="mt-6 text-3xl font-semibold sm:mt-11 sm:text-4xl">
					{t('components_SectionBecomeAnAuthor_Why_Did_You_Choose_Us')}
				</h2>
				<span className="mt-6 block text-neutral-500 dark:text-neutral-400">
					{t('components_SectionBecomeAnAuthor_Accompanying_Us_You_Have_A_Trip')}
				</span>
				<ButtonPrimary className="mt-6 sm:mt-11">
					{t('components_SectionBecomeAnAuthor_Become_An_Author')}
				</ButtonPrimary>
			</div>
			<div className="flex-grow">
				<Image alt="" src={rightImg} />
			</div>
		</div>
	)
}

export default SectionBecomeAnAuthor