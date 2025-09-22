import { useEffect, useState, useCallback } from 'react'
import { JsonEditor } from 'json-edit-react'

type BlogPost = {
	id: string
	translations: string // JSON string
}

type Props = {
	blogPost: BlogPost
}

export default function BlogJsonEditorPage({ blogPost }: Props) {
	const [post, setPost] = useState<BlogPost>(blogPost)
	const [parsedJson, setParsedJson] = useState<Record<string, unknown>>({})
	const [error, setError] = useState<string | null>(null)
	const [isSaving, setIsSaving] = useState<boolean>(false)

	// Re-parse when blogPost changes
	useEffect(() => {
		setPost(blogPost)
		try {
			setParsedJson(blogPost.translations)
			setError(null)
		} catch {
			setParsedJson([])
			setError('Invalid initial JSON')
		}
	}, [blogPost])

	// Handle JsonEditor change
	const handleJsonChange = useCallback((newData: unknown) => {
		try {
			const stringified = JSON.stringify(newData, null, 2)
			setPost((prev) => ({ ...prev, translations: stringified }))
			setParsedJson(newData as Record<string, unknown>)
			setError(null)
		} catch (err) {
			console.error('Error serializing JSON:', err)
			setError('Failed to update JSON')
		}
	}, [])

	const handleSubmit = async () => {
		if (!post.id) {
			alert('Invalid post: missing ID')
			return
		}

		setIsSaving(true)
		const formData = new FormData()
		formData.append('translations', post.translations)
		formData.append('byJson', 'true')
		formData.append('id', post.id)

		try {
			const response = await fetch('/api/saveBlogPost', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error(`HTTP error ${response.status}`)
			}

			const result = await response.json()
			if (result.success) {
				console.log('Post saved:', result.post)
				alert('Post saved successfully!')
			} else {
				console.error(result.error)
				alert('Error saving post: ' + result.error)
			}
		} catch (err) {
			console.error('Error saving post:', err)
			alert('Unexpected error while saving post')
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial' }}>
			<h1>Blog JSON Editor</h1>

			<JsonEditor data={parsedJson} setData={handleJsonChange} />

			{error && <p style={{ color: 'red' }}>{error}</p>}

			{!error && (
				<div style={{ marginTop: '20px' }}>
					<h3>Parsed JSON Preview:</h3>
					<pre
						style={{
							background: '#f5f5f5',
							padding: '10px',
							borderRadius: '5px',
							overflowX: 'auto',
						}}
					>
						{JSON.stringify(parsedJson, null, 2)}
					</pre>
				</div>
			)}

			<button
				onClick={handleSubmit}
				disabled={isSaving || !!error}
				style={{
					marginTop: '20px',
					padding: '10px 20px',
					background: isSaving ? '#888' : '#0070f3',
					color: '#fff',
					border: 'none',
					borderRadius: '5px',
					cursor: isSaving ? 'not-allowed' : 'pointer',
				}}
			>
				{isSaving ? 'Saving...' : 'Save'}
			</button>
		</div>
	)
}
