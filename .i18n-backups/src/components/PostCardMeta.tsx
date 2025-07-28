import React, { FC } from 'react'
import Avatar from '@/shared/Avatar'
import { PostDataType } from '@/data/types'
import Link from 'next/link'
import { Route } from 'next'

export interface PostCardMetaProps {
	className?: string
	meta?: any
	hiddenAvatar?: boolean
	size?: 'large' | 'normal'
}

const PostCardMeta: FC<PostCardMetaProps> = ({
	className = 'leading-none',
	meta,
	hiddenAvatar = false,
	size = 'normal',
}) => {
	const { date, author, id }: any = meta
	const profileImageUrl: any = author?.profileImage?.url
	const postLink = `/blog/${id}`
	return (
		<div
			className={`nc-PostCardMeta fledx-wrap inline-flex items-center text-neutral-800 dark:text-neutral-200 ${
				size === 'normal' ? 'text-sm' : 'text-base'
			} ${className}`}
			data-nc-id="PostCardMeta"
		>
			<Link
				href={postLink as Route}
				className="relative flex flex-shrink-0 items-center space-x-2"
			>
				{!hiddenAvatar && (
					<Avatar
						radius="rounded-full"
						sizeClass={
							size === 'normal' ? 'h-7 w-7 text-sm' : 'h-10 w-10 text-xl'
						}
						imgUrl={profileImageUrl}
						userName={
							author?.username ||
							author?.accountData?.firstname + author?.accountData?.lastname
						}
					/>
				)}
				<span className="text-neutral-6000 block font-medium hover:text-black dark:text-neutral-300 dark:hover:text-white">
					{author?.username ||
						author?.accountData?.firstname + author?.accountData?.lastname}
				</span>
			</Link>
			<>
				<span className="mx-[6px] font-medium text-neutral-500 dark:text-neutral-400">
					·
				</span>
				<span className="line-clamp-1 font-normal text-neutral-500 dark:text-neutral-400">
					{new Date(date).toLocaleDateString()}
				</span>
			</>
		</div>
	)
}

export default PostCardMeta
