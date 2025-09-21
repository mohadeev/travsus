import React, { useState } from 'react'

type PostData = {
	[key: string]: any // Post may have more fields
	title?: string
	content?: string
	excerpt?: string
	tags?: string[]
}

type Props = {
	post: PostData
}

export default function JsonViewer({ post }: Props) {
	const [copied, setCopied] = useState(false)

	// Pick only the 4 fields we want
	const displayedData = {
		title: post.title || '',
		content: post.content || '',
		excerpt: post.excerpt || '',
		tags: post.tags || [],
	}

	const handleCopy = () => {
		navigator.clipboard.writeText(JSON.stringify(displayedData, null, 2))
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div
			style={{
				padding: '20px',
				fontFamily: 'Arial',
				border: '1px solid #ddd',
				borderRadius: '8px',
				maxWidth: '600px',
				margin: '0 auto',
				backgroundColor: '#f9f9f9',
			}}
		>
			<h2>JSON Viewer</h2>
			<pre
				style={{
					background: '#272822',
					color: '#f8f8f2',
					padding: '15px',
					borderRadius: '5px',
					overflowX: 'auto',
				}}
			>
				{JSON.stringify({ 'en-US': displayedData }, null, 2)}
			</pre>
			<button
				onClick={handleCopy}
				style={{
					marginTop: '10px',
					padding: '8px 16px',
					background: '#0070f3',
					color: '#fff',
					border: 'none',
					borderRadius: '5px',
					cursor: 'pointer',
				}}
			>
				{copied ? 'Copied!' : 'Copy JSON'}
			</button>
		</div>
	)
}
