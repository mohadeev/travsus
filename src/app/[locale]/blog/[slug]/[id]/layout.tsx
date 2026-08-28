export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import type React from 'react'
import getUserData from '@/app/api/user/getUserData'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'

// Helper function to fetch post data from API
async function getPostFromApi(id: string) {
	const locale = await getLocale()
	console.log('locale:::::::::::::::::::::::::::', locale)
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/blog/${id}?locale=${locale}`,
		{
			cache: 'no-store',
		},
	)

	if (!response.ok) {
		if (response.status === 404) {
			return null
		}
		throw new Error(`Failed to fetch post: ${response.statusText}`)
	}

	return response.json()
}

export async function generateMetadata({
	params,
}: {
	params: { id: string }
}): Promise<Metadata> {
	// console.log('id:', params.id)
	const post = await getPostFromApi(params.id)
	post.translations = null
	// console.log('post:', post)
	if (!post) {
		return {
			title: 'Post Not Found',
		}
	}

	const { title, excerpt, author } = post
	const authorName =
		author?.username ||
		`${author?.accountData?.firstname} ${author?.accountData?.lastname}`

	return {
		title: `${title} | TRAVSUS`,
		description: excerpt,
		openGraph: {
			title: title,
			description: excerpt,
			type: 'article',
			authors: [authorName],
			publishedTime: post.createdAt,
			images: [
				{
					url:
						post.featuredImage || 'https://yourblog.com/default-og-image.jpg',
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
				post.featuredImage || 'https://yourblog.com/default-twitter-image.jpg',
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
	params: { id: string }
}) {
	const post = await getPostFromApi(params.id)
	const { id: currentUserId } = (await getUserData()) || {}

	if (!post) {
		notFound()
	}

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: post.title,
		description: post.excerpt,
		author: {
			'@type': 'Person',
			name:
				post.author?.username ||
				`${post.author?.accountData?.firstname} ${post.author?.accountData?.lastname}`,
		},
		datePublished: post.createdAt,
		image: post?.featuredImage,
		publisher: {
			'@type': 'Organization',
			name: 'TRAVSUS LTD',
			logo: {
				'@type': 'ImageObject',
				url: 'https://www.travsus.com/_next/static/media/logo.d4fff429.png',
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
