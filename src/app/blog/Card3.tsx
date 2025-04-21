import type { FC } from 'react'
import PostCardMeta from '@/components/PostCardMeta'
import CategoryBadgeList from '@/components/CategoryBadgeList'
import PostTypeFeaturedIcon from '@/components/PostTypeFeaturedIcon'
import Link from 'next/link'
import Image from 'next/image'
import type { Route } from 'next'

/**
 * Converts a string to a URL-friendly slug
 * - Converts to lowercase
 * - Replaces non-alphanumeric characters with hyphens
 * - Replaces special characters with their Latin equivalents
 * - Removes emojis and replaces with hyphens
 * - Ensures no double hyphens
 */
function slugify(text: string): string {
	// Handle null or undefined input
	if (!text) return ''

	// Replace accented characters with their Latin equivalents
	const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

	// Replace emojis with hyphens
	// This regex attempts to match emoji characters
	const withoutEmojis = normalized.replace(
		/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
		'-',
	)

	// Convert to lowercase and replace non-alphanumeric characters with hyphens
	const slug = withoutEmojis
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens

	// Ensure no double hyphens
	return slug.replace(/-+/g, '-')
}

export interface Card3Props {
	className?: string
	post: any
}

const Card3: FC<Card3Props> = ({ className = 'h-full', post }) => {
	const {
		title,
		href,
		featuredImage,
		excerpt,
		categories,
		author,
		createdAt,
		id,
	}: any = post

	// Generate the slug from the title
	const titleSlug = slugify(title)

	// Create the URL with both ID and slug
	const link = `/blog/${id}?name=${titleSlug}`

	return (
		<div
			className={`nc-Card3 group relative flex flex-col-reverse rounded-[40px] sm:flex-row sm:items-center ${className}`}
		>
			<div className="flex flex-grow flex-col">
				<div className="mb-4 space-y-5">
					<CategoryBadgeList categories={categories} />
					<div>
						<h2
							className={`nc-card-title block text-4xl font-bold text-neutral-900 dark:text-neutral-100`}
						>
							<Link href={link as Route} className="line-clamp-2" title={title}>
								{title}
							</Link>
						</h2>
						<div className="hidden sm:mt-2 sm:block">
							<span className="line-clamp-1 text-base text-neutral-500 dark:text-neutral-400">
								{excerpt}
							</span>
						</div>
					</div>

					<PostCardMeta meta={{ author, date: createdAt, id }} />
				</div>
			</div>

			<div
				className={`mb-5 block flex-shrink-0 overflow-hidden rounded-3xl sm:mb-0 sm:ml-6 sm:w-56`}
			>
				<Link
					href={link as Route}
					className={`aspect-h-9 aspect-w-16 block h-0 w-full sm:aspect-h-16`}
				>
					<Image
						fill
						src={featuredImage || '/placeholder.svg?height=400&width=400'}
						alt={title}
						sizes="(max-width: 768px) 100vw, 400px"
					/>
					<span>
						<PostTypeFeaturedIcon
							className="absolute bottom-2 left-2"
							postType={post.postType || 'standard'}
							wrapSize="w-8 h-8"
							iconSize="w-4 h-4"
						/>
					</span>
				</Link>
			</div>
		</div>
	)
}

export default Card3
