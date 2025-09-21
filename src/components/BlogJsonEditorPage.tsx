import { useEffect, useState } from 'react'
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
	useEffect(() => {
		setPost(blogPost)
	}, [blogPost])
	const [parsedJson, setParsedJson] = useState<any>(() => {
		try {
			return JSON.parse(blogPost.translations)
		} catch {
			return {}
		}
	})
	const [error, setError] = useState<string | null>(null)

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value
		setPost((prev) => ({ ...prev, translations: value }))

		try {
			const parsed = JSON.parse(value)
			setParsedJson(parsed)
			setError(null)
		} catch {
			setError('Invalid JSON')
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		if (!post.id) {
			console.log('data here please')
			return null
		}

		const formData = new FormData()
		formData.append('translations', post.translations)
		formData.append('byJson', 'true')
		formData.append('id', post.id)

		try {
			const response = await fetch('/api/saveBlogPost', {
				method: 'POST',
				body: formData,
			})
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
			alert('Error saving post')
		}
	}

	return (
		<div style={{ padding: '20px', fontFamily: 'Arial' }}>
			<h1>Blog JSON Editor</h1>
			<div>
				{/* <textarea
					value={JSON.stringify(post.translations)}
					onChange={handleChange}
					rows={15}
					cols={60}
					style={{
						fontFamily: 'monospace',
						fontSize: '14px',
						width: '100%',
						marginBottom: '10px',
					}}
				/> */}
				<JsonEditor
					data={post.translations}
					setData={handleChange} // optional
					// {...otherProps}
				/>
				);
				{error && <p style={{ color: 'red' }}>{error}</p>}
				{!error && (
					<div style={{ marginTop: '20px' }}>
						<h3>Parsed JSON Preview:</h3>
						<pre
							style={{
								background: '#f5f5f5',
								padding: '10px',
								borderRadius: '5px',
							}}
						>
							{JSON.stringify(parsedJson, null, 2)}
						</pre>
					</div>
				)}
				<button
					onClick={handleSubmit}
					style={{
						marginTop: '20px',
						padding: '10px 20px',
						background: '#0070f3',
						color: '#fff',
						border: 'none',
						borderRadius: '5px',
						cursor: 'pointer',
					}}
				>
					Save
				</button>
			</div>
		</div>
	)
}
