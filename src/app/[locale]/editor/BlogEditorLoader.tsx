'use client'

import dynamic from 'next/dynamic'

// Tiptap is large. Load it in the browser only so it stays out of the Worker bundle.
const BlogEditor = dynamic(() => import('@/components/BlogEditor'), { ssr: false })

export default function BlogEditorLoader(props: { postId?: string; userId?: string }) {
	return <BlogEditor {...props} />
}
