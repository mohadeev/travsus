'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { useRouter } from 'next/navigation'
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Code,
	Quote,
	Minus,
	ImageIcon,
	Save,
	Eye,
	AlignLeft,
	AlignCenter,
	AlignRight,
	ChevronDown,
	FileCode,
} from 'lucide-react'
import { uploadImage } from '@/app/actions/uploadImage'
import { Button } from '@/components/ui/button'
import BlogJsonEditorPage from './BlogJsonEditorPage'

const MenuBar = ({
	editor,
	isHtmlMode,
	toggleHtmlMode,
}: {
	editor: any
	isHtmlMode: boolean
	toggleHtmlMode: () => void
}) => {
	if (!editor && !isHtmlMode) {
		return null
	}

	const HeadingDropdown = ({ editor }: { editor: any }) => {
		const headingLevels = [1, 2, 3, 4, 5, 6]
		const [isOpen, setIsOpen] = useState(false)

		return (
			<div className="relative inline-block text-left">
				<div>
					<button
						type="button"
						className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
						id="heading-menu"
						aria-expanded="true"
						aria-haspopup="true"
						onClick={() => setIsOpen(!isOpen)}
					>
						Heading
						<ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
					</button>
				</div>
				{isOpen && (
					<div
						className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="heading-menu"
					>
						<div className="py-1" role="none">
							{headingLevels.map((level) => (
								<button
									key={level}
									onClick={() => {
										editor.chain().focus().toggleHeading({ level }).run()
										setIsOpen(false)
									}}
									className={`${
										editor.isActive('heading', { level })
											? 'bg-gray-100 text-gray-900'
											: 'text-gray-700'
									} block w-full px-4 py-2 text-left text-sm`}
									role="menuitem"
								>
									Heading {level}
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		)
	}

	async function addImage() {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = 'image/*'
		input.onchange = async () => {
			if (input.files?.length) {
				const file = input.files[0]
				try {
					const result = await uploadImage(file)
					editor.chain().focus().setImage({ src: result.url }).run()
				} catch (error) {
					console.error('Error uploading image:', error)
				}
			}
		}
		input.click()
	}

	return (
		<div className="menu-bar mb-4 flex flex-wrap gap-2 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
			<button
				onClick={toggleHtmlMode}
				className={`rounded p-2 ${isHtmlMode ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
				title={isHtmlMode ? 'Switch to visual editor' : 'Switch to HTML mode'}
			>
				<FileCode size={18} />
			</button>

			{!isHtmlMode && editor && (
				<>
					<button
						onClick={() => editor.chain().focus().setParagraph().run()}
						className={`rounded p-2 ${editor.isActive('paragraph') ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						P
					</button>
					<button
						onClick={() => editor.chain().focus().toggleBold().run()}
						className={`rounded p-2 ${editor.isActive('bold') ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						<Bold size={18} />
					</button>
					<button
						onClick={() => editor.chain().focus().toggleItalic().run()}
						className={`rounded p-2 ${editor.isActive('italic') ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						<Italic size={18} />
					</button>
					<HeadingDropdown editor={editor} />
					<button
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						className={`rounded p-2 ${editor.isActive('bulletList') ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						<List size={18} />
					</button>
					<button
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						className={`rounded p-2 ${editor.isActive('orderedList') ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						<ListOrdered size={18} />
					</button>
					<button
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
						className={`rounded p-2 ${editor.isActive('codeBlock') ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						<Code size={18} />
					</button>
					<button
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
						className={`rounded p-2 ${editor.isActive('blockquote') ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						<Quote size={18} />
					</button>
					<button
						onClick={() => editor.chain().focus().setHorizontalRule().run()}
						className="rounded bg-white p-2 dark:bg-neutral-700"
					>
						<Minus size={18} />
					</button>
					<button
						onClick={addImage}
						className="rounded bg-white p-2 dark:bg-neutral-700"
					>
						<ImageIcon size={18} />
					</button>
					<button
						onClick={() => editor.chain().focus().setTextAlign('left').run()}
						className={`rounded p-2 ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						<AlignLeft size={18} />
					</button>
					<button
						onClick={() => editor.chain().focus().setTextAlign('center').run()}
						className={`rounded p-2 ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						<AlignCenter size={18} />
					</button>
					<button
						onClick={() => editor.chain().focus().setTextAlign('right').run()}
						className={`rounded p-2 ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary-200 dark:bg-primary-700' : 'bg-white dark:bg-neutral-700'}`}
					>
						<AlignRight size={18} />
					</button>
				</>
			)}
		</div>
	)
}

export default function BlogEditor({
	postId,
	userId,
}: {
	postId?: string
	userId: string
}) {
	const [title, setTitle] = useState('')
	const [excerpt, setExcerpt] = useState('')
	const [tags, setTags] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [authorUsername, setAuthorUsername] = useState('')
	const [authorId, setAuthorId] = useState('')
	const [isHtmlMode, setIsHtmlMode] = useState(false)
	const [htmlContent, setHtmlContent] = useState('')
	const [visualContent, setVisualContent] = useState('')
	const [blogPost, setBlogPost] = useState({})

	const router = useRouter()

	// Create editor only when in visual mode
	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({
				HTMLAttributes: {
					class: 'max-w-full h-auto mx-auto',
				},
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
		content: visualContent,
		editorProps: {
			attributes: {
				class:
					'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
			},
		},
		onUpdate: ({ editor }) => {
			// Store the current content for visual mode
			setVisualContent(editor.getHTML())
		},
	})

	// Load post data
	useEffect(() => {
		if (postId) {
			setIsLoading(true)
			fetch(`/api/getPostById?id=${postId}`)
				.then((response) => response.json())
				.then((post) => {
					if (post) {
						setBlogPost(post)
						setTitle(post.title)
						setExcerpt(post.excerpt)

						// Set both content states
						setVisualContent(post.content)
						setHtmlContent(post.content)

						// If editor exists, set its content
						if (editor) {
							editor.commands.setContent(post.content)
						}

						setTags(post.tags.join(', '))
						setAuthorUsername(post.author.username || 'Unknown Author')
						setAuthorId(post.author.id)
					}
					setIsLoading(false)
				})
				.catch((error) => {
					console.error('Error fetching post:', error)
					setIsLoading(false)
				})
		}
	}, [postId, editor])

	// Toggle between HTML and visual modes
	const toggleHtmlMode = () => {
		if (isHtmlMode) {
			// Switching from HTML to visual mode
			setVisualContent(htmlContent)

			// If editor exists, update its content
			if (editor) {
				editor.commands.setContent(htmlContent)
			}
		} else {
			// Switching from visual to HTML mode
			// Get the latest content from the editor
			if (editor) {
				setHtmlContent(editor.getHTML())
			}
		}

		// Toggle the mode
		setIsHtmlMode(!isHtmlMode)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (postId && authorId !== userId) {
			console.error('You are not authorized to edit this post')
			return
		}
		setIsLoading(true)
		const formData = new FormData()
		formData.append('title', title)
		formData.append('excerpt', excerpt)

		// Use the appropriate content based on the current mode
		const content = isHtmlMode
			? htmlContent
			: editor
				? editor.getHTML()
				: visualContent
		formData.append('content', content)

		formData.append('tags', tags)
		if (postId) formData.append('id', postId)

		try {
			const response = await fetch('/api/saveBlogPost', {
				method: 'POST',
				body: formData,
			})
			const result = await response.json()
			if (result.success) {
				console.log('Post saved:', result.post)
				if (!postId) {
					router.push(`/editor?id=${result.post.id}`)
				} else {
					router.refresh()
				}
			} else {
				console.error(result.error)
			}
		} catch (error) {
			console.error('Error saving post:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const customStyles = `
    .ProseMirror {
      font-size: 16px;
      line-height: 1.5;
    }
  `

	return (
		<div className="nc-box-has-hover nc-dark-box-bg-has-hover container mx-auto max-w-4xl p-4">
			<h1 className="nc-card-title mb-6 text-3xl font-semibold">
				{postId ? 'Edit Blog Post' : 'Create New Blog Post'}
			</h1>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<label
							htmlFor="title"
							className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200"
						>
							Title
						</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full rounded border p-2 focus:ring focus:ring-primary-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
							required
						/>
					</div>
					<div>
						<label className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200">
							Author Username
						</label>
						<p className="rounded border bg-neutral-100 p-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
							{authorUsername}
						</p>
					</div>
				</div>
				<div>
					<label
						htmlFor="excerpt"
						className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200"
					>
						Excerpt
					</label>
					<textarea
						id="excerpt"
						value={excerpt}
						onChange={(e) => setExcerpt(e.target.value)}
						className="w-full rounded border p-2 focus:ring focus:ring-primary-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
						rows={3}
						required
					></textarea>
				</div>
				<div>
					<label
						htmlFor="content"
						className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200"
					>
						Content
					</label>
					<MenuBar
						editor={editor}
						isHtmlMode={isHtmlMode}
						toggleHtmlMode={toggleHtmlMode}
					/>

					{isHtmlMode ? (
						<textarea
							value={htmlContent}
							onChange={(e) => setHtmlContent(e.target.value)}
							className="font-mono min-h-[300px] w-full rounded border p-2 text-sm focus:ring focus:ring-primary-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
							rows={15}
						/>
					) : (
						<EditorContent
							editor={editor}
							className="min-h-[300px] rounded border p-2 focus:ring focus:ring-primary-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
						/>
					)}
				</div>
				<div>
					<label
						htmlFor="tags"
						className="mb-1 block font-medium text-neutral-700 dark:text-neutral-200"
					>
						Tags (comma-separated)
					</label>
					<input
						type="text"
						id="tags"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
						className="w-full rounded border p-2 focus:ring focus:ring-primary-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
						required
					/>
				</div>
				<BlogJsonEditorPage blogPost={blogPost} />
				<div className="flex items-center gap-4">
					<Button
						type="submit"
						disabled={isLoading || (postId && authorId !== userId)}
						className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#6366f1] py-3 text-white hover:bg-[#4f46e5]"
					>
						<Save className="h-5 w-5" />
						<span>{isLoading ? 'Saving...' : 'Save Post'}</span>
					</Button>
					{postId && (
						<Button
							asChild
							className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#6366f1] py-3 text-white hover:bg-[#4f46e5]"
						>
							<a
								href={`/blog/${postId}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Eye className="h-5 w-5" />
								<span>View Post</span>
							</a>
						</Button>
					)}
				</div>
			</form>
			<style jsx global>
				{customStyles}
			</style>
		</div>
	)
}
