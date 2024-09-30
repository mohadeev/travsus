'use client'

import addAndRemoveToWishList from '@/utils/api-utils/addAndRemoveToWishList'
import React, { FC, useState } from 'react'

export interface BtnLikeIconProps {
	className?: string
	colorClass?: string
	isLiked?: boolean
	onClick?: any
	serviceId?: string
}

const BtnLikeIcon: FC<BtnLikeIconProps> = ({
	className = '',
	colorClass = 'text-white bg-black bg-opacity-30 hover:bg-opacity-50',
	isLiked = false,
	onClick,
	serviceId,
}) => {
	const [likedState, setLikedState] = useState(isLiked)

	const handleAddToWishList = async () => {  
		await addAndRemoveToWishList({ serviceId })
	}

	return (
		<div
			className={`nc-BtnLikeIcon flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ${
				likedState ? 'nc-BtnLikeIcon--liked' : ''
			} ${colorClass} ${className}`}
			data-nc-id="BtnLikeIcon"
			title="Save"
			onClick={() => {
				handleAddToWishList()
				setLikedState(!likedState)
			}}
			// onClick={() => setLikedState(!likedState)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-5 w-5"
				fill={likedState ? 'currentColor' : 'none'}
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
				/>
			</svg>
		</div>
	)
}

export default BtnLikeIcon
