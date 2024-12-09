'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import ButtonPrimary from '@/shared/ButtonPrimary'
import SocialsList from '@/shared/SocialsList'
import Avatar from '@/shared/Avatar'
import { useState, useEffect } from 'react'

export const SkeletonLoader = () => {
	return (
		<div className="container mx-auto p-4">
			<article className="mx-auto max-w-3xl">
				<div className="mb-4 h-10 w-3/4 animate-pulse rounded-md bg-gray-200"></div>
				<div className="mb-6 flex justify-end">
					<div className="h-10 w-24 animate-pulse rounded-md bg-gray-200"></div>
				</div>
				<div className="mb-6 flex flex-col items-baseline sm:flex-row sm:justify-between">
					<div className="flex animate-pulse items-center">
						<div className="h-11 w-11 rounded-full bg-gray-200"></div>
						<div className="ml-3">
							<div className="h-4 w-24 rounded bg-gray-200"></div>
							<div className="mt-2 h-3 w-32 rounded bg-gray-200"></div>
						</div>
					</div>
					<div className="mt-3 flex animate-pulse space-x-2 sm:ml-3 sm:mt-0">
						{[1, 2, 3].map((i) => (
							<div key={i} className="h-8 w-8 rounded-full bg-gray-200"></div>
						))}
					</div>
				</div>
				<div className="space-y-4">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-4 w-full animate-pulse rounded bg-gray-200"
						></div>
					))}
					<div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
				</div>
				<div className="mt-6">
					<div className="mb-2 h-6 w-16 animate-pulse rounded bg-gray-200"></div>
					<div className="flex flex-wrap gap-2">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-6 w-16 animate-pulse rounded-full bg-gray-200"
							></div>
						))}
					</div>
				</div>
			</article>
		</div>
	)
}

export default function BlogPostPage() {
	const [post, setPost] = useState<any>(null)
	const [currentUserId, setCurrentUserId] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const data = (window as any).__INITIAL_DATA__
		if (data) {
			setPost(data.post)
			setCurrentUserId(data.currentUserId)
			setTimeout(() => setIsLoading(false), 100) // Ensure skeleton shows for at least 100ms
		}
	}, [])

	if (isLoading) {
		return <SkeletonLoader />
	}

	if (!post) {
		notFound()
	}

	const { author } = post
	const profileImageUrl: any = post?.author?.profileImage?.url
	const isAuthor = currentUserId === post.authorId

	return (
		<div className="container mx-auto p-4">
			<article className="mx-auto max-w-3xl">
				<h1 className="mb-4 text-5xl font-extrabold">{post.title}</h1>
				<div className="mb-6 flex items-center justify-between text-gray-500">
					<div></div>
					{isAuthor && (
						<Link href={`/editor?id=${post.id}`}>
							<ButtonPrimary>Edit Post</ButtonPrimary>
						</Link>
					)}
				</div>
				<div className="flex flex-col items-baseline sm:flex-row sm:justify-between">
					<div className="nc-PostMeta2 flex flex-shrink-0 flex-wrap items-center text-left text-sm leading-none text-neutral-700 dark:text-neutral-200">
						<Avatar
							imgUrl={profileImageUrl}
							containerClassName="flex-shrink-0"
							sizeClass="w-8 h-8 sm:h-11 sm:w-11 "
						/>
						<div className="ml-3">
							<div className="flex items-center">
								<p className="block font-semibold">
									{author?.username ||
										author?.accountData?.firstname +
											author?.accountData?.lastname}
								</p>
							</div>
							<div className="mt-[6px] text-xs">
								<span className="text-neutral-700 dark:text-neutral-300">
									{new Date(post.createdAt).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</span>
							</div>
						</div>
					</div>
					<div className="mt-3 sm:ml-3 sm:mt-0">
						<SocialsList />
					</div>
				</div>
				<div
					className="prose max-w-none"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>
				<div className="mt-6">
					<h2 className="mb-2 text-xl font-semibold">Tags</h2>
					<div className="flex flex-wrap gap-2">
						{post.tags.map((tag: any) => (
							<span
								key={tag}
								className="rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-700"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
			</article>
		</div>
	)
}
