import type { FC } from 'react'
import PostCardMeta from '@/components/PostCardMeta'
import CategoryBadgeList from '@/components/CategoryBadgeList'
import PostTypeFeaturedIcon from '@/components/PostTypeFeaturedIcon'
import Link from 'next/link'
import Image from 'next/image'
import type { Route } from 'next'
// import slugify from '@/utils/slugify'
import { useLocale } from 'next-intl'
import { slugify } from 'transliteration'

/**
 * Converts a string to a URL-friendly slug
 * - Converts to lowercase
 * - Replaces non-alphanumeric characters with hyphens
 * - Replaces special characters with their Latin equivalents
 * - Removes emojis and replaces with hyphens
 * - Ensures no double hyphens
 */

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
	const locale = useLocale()

	// Create the URL with both ID and slug
	const link = `/${locale}/blog/${titleSlug}/${id}`

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
