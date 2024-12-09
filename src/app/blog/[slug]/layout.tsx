import { getBlogPost } from '@/app/actions/getBlogPost'
import getUserData from '@/app/api/user/getUserData'
import { Metadata } from 'next'

export async function generateMetadata({
	params,
}: {
	params: { slug: string }
}): Promise<Metadata> {
	const post: any = (await getBlogPost(params.slug)) || {}

	if (!post) {
		return {
			title: 'Post Not Found',
		}
	}

	const { title, excerpt, author }: any = post
	const authorName: any =
		author?.username ||
		`${author?.accountData?.firstname} ${author?.accountData?.lastname}`

	return {
		title: `${title} | Travsus`,
		description: excerpt,
		openGraph: {
			title: title,
			description: excerpt,
			type: 'article',
			authors: [authorName],
			publishedTime: `${post.createdAt}`,
			images: [
				{
					url: post.featuredImage || 'https://travsus.com/default-og-image.jpg',
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: title,
			description: excerpt,
			images: [
				post.featuredImage || 'https://travsus.com/default-twitter-image.jpg',
			],
		},
		alternates: {
			canonical: `https://travsus.com/blog/${params.slug}`,
		},
	}
}

export default async function BlogPostLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: { slug: string }
}) {
	const post = await getBlogPost(params.slug)
	const { id: currentUserId } = (await getUserData()) || {}

	if (!post) {
		return null // or a 404 component
	}
	const { author }: any = post

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		author: {
			'@type': 'Person',
			name:
				post.author?.username ||
				`${author?.accountData?.firstname} ${author?.accountData?.lastname}`,
		},
		datePublished: post.createdAt,
		image: post.featuredImage || 'https://travsus.com/default-schema-image.jpg',
		publisher: {
			'@type': 'Organization',
			name: 'Your Blog Name',
			logo: {
				'@type': 'ImageObject',
				url: 'https://travsus.com/logo.png',
			},
		},
	}

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			{children}
			<script
				dangerouslySetInnerHTML={{
					__html: `window.__INITIAL_DATA__ = ${JSON.stringify({
						post,
						currentUserId,
					})}`,
				}}
			/>
		</>
	)
}
