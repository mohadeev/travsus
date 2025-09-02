import React, { HTMLAttributes, ReactNode } from 'react'
import { FC } from 'react'
import { useTranslations } from '@/lib/i18n'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
	fontClass?: string
	desc?: ReactNode
	isCenter?: boolean
}

const Heading: React.FC<HeadingProps> = ({
	children,
	desc,
	className = 'mb-10 text-neutral-900 dark:text-neutral-50',
	isCenter = false,
	...args
}) => {
	const t = useTranslations('shared_Heading')

	return (
		<div className={`nc-Section-Heading relative ${className}`}>
			<div
				className={
					isCenter ? 'mx-auto mb-4 w-full max-w-2xl text-center' : 'max-w-2xl'
				}
			>
				<h2
					className={`mb-4 text-balance text-3xl font-bold text-gray-900`}
					{...args}
				>
					{children || t('shared_Heading_Section_Heading')}
				</h2>
				{(desc !== undefined
					? desc
					: t('shared_Heading_Default_Description')) && (
					<span className="mt-2 block text-base font-normal text-neutral-500 dark:text-neutral-400 sm:text-lg md:mt-3">
						{desc !== undefined
							? desc
							: t('shared_Heading_Default_Description')}
					</span>
				)}
			</div>
		</div>
	)
}

export default Heading

export interface HeadingSkeletonProps {
	className?: string
	isCenter?: boolean
}
export const HeadingSkeleton: FC<HeadingSkeletonProps> = ({
	className = 'mb-10',
	isCenter = false,
}) => {
	return (
		<div className={`nc-Section-Heading relative ${className} animate-pulse`}>
			<div
				className={
					isCenter ? 'mx-auto mb-4 w-full max-w-2xl text-center' : 'max-w-2xl'
				}
			>
				<div
					className={`h-8 w-3/4 rounded bg-gray-300 ${isCenter ? 'mx-auto' : ''}`}
				></div>
				<div
					className={`mt-3 h-5 w-1/2 rounded bg-gray-300 ${isCenter ? 'mx-auto' : ''}`}
				></div>
			</div>
		</div>
	)
}
