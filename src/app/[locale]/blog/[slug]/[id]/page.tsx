'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import ButtonPrimary from '@/shared/ButtonPrimary'
import SocialsList from '@/shared/SocialsList'
import Avatar from '@/shared/Avatar'
import { useState, useEffect } from 'react'
import { useTranslations } from '@/lib/i18n'

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
	const t = useTranslations('BlogPostPage')
	const params = useParams()
	const postId = params?.id as string
	const [post, setPost] = useState<any>(null)
	const [currentUserId, setCurrentUserId] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Fetch post data directly from API
	useEffect(() => {
		const fetchPostData = async () => {
			setIsLoading(true)
			try {
				// Try to get data from window.__INITIAL_DATA__ first (for SSR)
				const initialData = (window as any).__INITIAL_DATA__
				if (initialData?.post?.id === postId) {
					setPost(initialData.post)
					setCurrentUserId(initialData.currentUserId)
					setIsLoading(false)
					return
				}

				// If no initial data or different post, fetch from API
				const response = await fetch(`/api/blog/${postId}`)
				if (!response.ok) {
					throw new Error(`Failed to fetch post: ${response.statusText}`)
				}
				const postData = await response.json()
				setPost(postData)

				// Use the currentUserId from initialData if available
				if (initialData?.currentUserId) {
					setCurrentUserId(initialData.currentUserId)
				}
			} catch (err) {
				console.error('Error fetching post:', err)
				setError(
					err instanceof Error
						? err.message
						: t('blog_slug_page_Post_Not_Found'),
				)
			} finally {
				setIsLoading(false)
			}
		}

		if (postId) {
			fetchPostData()
		}
	}, [postId])

	if (isLoading) {
		return <SkeletonLoader />
	}

	if (error || !post) {
		return (
			<div className="container mx-auto p-4 text-center">
				<h1 className="text-2xl font-bold text-red-500">
					{t('blog_slug_page_Error_Loading_Post')}
				</h1>
				<p className="mt-4">{error || t('blog_slug_page_Post_Not_Found')}</p>
				<Link href="/blog" className="mt-6 inline-block">
					<ButtonPrimary>{t('blog_slug_page_Return_To_Blog')}</ButtonPrimary>
				</Link>
			</div>
		)
	}

	const { author } = post
	const profileImageUrl: any = post?.author?.profileImage?.url
	const isAuthor = currentUserId === post.authorId

	return (
		<div className="container mx-auto p-4">
			<article className="mx-auto max-w-3xl">
				<h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
				<div className="mb-6 flex items-center justify-between text-gray-500">
					<div></div>
					{isAuthor && (
						<Link href={`/editor?id=${post.id}`}>
							<ButtonPrimary>{t('blog_slug_page_Edit_Post')}</ButtonPrimary>
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
								<span className="mx-2 font-semibold">·</span>
								<span className="text-neutral-700 dark:text-neutral-300">
									{/* {t('blog_slug_page_Min_Read')} */}
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
					<h2 className="mb-2 text-xl font-semibold">
						{t('blog_slug_page_Tags')}
					</h2>
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
