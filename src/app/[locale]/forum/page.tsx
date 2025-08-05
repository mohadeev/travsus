'use client'
import { useTranslations } from '@/lib/i18n'
import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
	Search,
	Compass,
	Globe,
	Map,
	Mountain,
	Plane,
	Tent,
	Umbrella,
	ChevronLeft,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useSelector } from 'react-redux'
import { createForumPost } from '@/app/actions/forum/createPost'
import { addComment } from '@/app/actions/forum/addComment'
import { getRecentPosts } from '@/app/actions/forum/getRecentPosts'
import { getPostById } from '@/app/actions/forum/getPostById'
import { getCategoryCounts } from '@/app/actions/forum/getCategoryCounts'
import { removeComment } from '@/app/actions/forum/removeComment'
import { Comment } from '@/components/forum/comment'
import { useToast } from '@/components/ui/use-toast'

export default function ForumPage() {
	const t = useTranslations('Jan03_Forum_x8k2')
	const [activePage, setActivePage] = useState<'main' | 'category' | 'post'>(
		'main',
	)
	const [activeCategory, setActiveCategory] = useState('')
	const [activePost, setActivePost] = useState<any | null>(null)
	const [isCreatingPost, setIsCreatingPost] = useState(false)
	const [recentPosts, setRecentPosts] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [categories, setCategories] = useState([
		{
			icon: Globe,
			name: t('General_Travel'),
			description: t('General_Travel_Description'),
			posts: 0,
			color: 'text-blue-500',
		},
		{
			icon: Mountain,
			name: t('Adventure_Travel'),
			description: t('Adventure_Travel_Description'),
			posts: 0,
			color: 'text-green-500',
		},
		{
			icon: Umbrella,
			name: t('Beach_Destinations'),
			description: t('Beach_Destinations_Description'),
			posts: 0,
			color: 'text-yellow-500',
		},
		{
			icon: Plane,
			name: t('Air_Travel'),
			description: t('Air_Travel_Description'),
			posts: 0,
			color: 'text-purple-500',
		},
		{
			icon: Tent,
			name: t('Accommodation'),
			description: t('Accommodation_Description'),
			posts: 0,
			color: 'text-red-500',
		},
		{
			icon: Map,
			name: t('Trip_Planning'),
			description: t('Trip_Planning_Description'),
			posts: 0,
			color: 'text-indigo-500',
		},
		{
			icon: Compass,
			name: t('Travel_Guides'),
			description: t('Travel_Guides_Description'),
			posts: 0,
			color: 'text-orange-500',
		},
	])
	const user = useSelector((state: any) => state.userReducer.userData)
	const isLoggedIn = !!user
	const router = useRouter()
	const searchParams = useSearchParams()
	const { toast } = useToast()

	useEffect(() => {
		const fetchCategoryCounts = async () => {
			const result = await getCategoryCounts()
			if (result.success) {
				setCategories((prevCategories) =>
					prevCategories.map((category) => ({
						...category,
						posts: result.counts[category.name] || 0,
					})),
				)
			} else {
				console.error('Error fetching category counts:', result.error)
			}
		}
		fetchCategoryCounts()
	}, [])

	const refreshPosts = async () => {
		setIsLoading(true)
		const result = await getRecentPosts(5)
		if (result.success) {
			setRecentPosts(result.posts)
		} else {
			console.error(result.error)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		const postId = searchParams.get('postId')
		if (postId) {
			fetchPost(postId)
		} else {
			refreshPosts()
		}
	}, [searchParams])

	const fetchPost = async (postId: string) => {
		setIsLoading(true)
		const result = await getPostById(postId)
		if (result.success) {
			setActivePost(result.post)
			setActivePage('post')
		} else {
			console.error(result.error)
			router.push('/404')
		}
		setIsLoading(false)
	}

	const CreatePostForm = ({
		onClose,
		refreshPosts,
	}: {
		onClose: () => void
		refreshPosts: () => Promise<void>
	}) => {
		const [title, setTitle] = useState('')
		const [content, setContent] = useState('')
		const [tags, setTags] = useState('')
		const [category, setCategory] = useState('')

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault()
			const formData = new FormData()
			formData.append('title', title)
			formData.append('content', content)
			formData.append('tags', tags)
			formData.append('category', category)

			const result = await createForumPost(formData)
			if (result.success) {
				setTitle('')
				setContent('')
				setTags('')
				setCategory('')
				await refreshPosts()
				onClose()
			} else {
				toast({
					title: t('Error_Title'),
					description: t('Failed_Create_Post'),
					variant: 'destructive',
				})
			}
		}

		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
				<div className="w-full max-w-2xl rounded-lg bg-white p-6">
					<h2 className="mb-4 text-2xl font-bold">
						{t('Create_New_Discussion')}
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700"
							>
								{t('Title_Label')}
							</label>
							<Input
								id="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								className="mt-1"
								placeholder={t('Title_Placeholder')}
							/>
						</div>
						<div>
							<label
								htmlFor="content"
								className="block text-sm font-medium text-gray-700"
							>
								{t('Content_Label')}
							</label>
							<Textarea
								id="content"
								value={content}
								onChange={(e) => setContent(e.target.value)}
								required
								className="mt-1"
								rows={5}
								placeholder={t('Content_Placeholder')}
							/>
						</div>
						<div>
							<label
								htmlFor="category"
								className="block text-sm font-medium text-gray-700"
							>
								{t('Category_Label')}
							</label>
							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder={t('Select_Category')} />
								</SelectTrigger>
								<SelectContent className="bg-white">
									{categories.map((cat) => (
										<SelectItem key={cat.name} value={cat.name}>
											{cat.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<label
								htmlFor="tags"
								className="block text-sm font-medium text-gray-700"
							>
								{t('Tags_Label')}
							</label>
							<Input
								id="tags"
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								className="mt-1"
								placeholder={t('Tags_Placeholder')}
							/>
						</div>
						<div className="flex justify-end space-x-2">
							<Button type="button" variant="outline" onClick={onClose}>
								{t('Cancel_Button')}
							</Button>
							<Button type="submit">{t('Create_Post_Button')}</Button>
						</div>
					</form>
				</div>
			</div>
		)
	}

	const CommentForm = ({
		postId,
		parentId = null,
		onCommentAdded,
	}: {
		postId: string
		parentId?: string | null
		onCommentAdded: (newComment: any) => void
	}) => {
		const [content, setContent] = useState('')
		const [isSubmitting, setIsSubmitting] = useState(false)

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault()
			if (!content.trim() || isSubmitting) return

			setIsSubmitting(true)

			const optimisticComment = {
				id: 'temp-id-' + Date.now(),
				content,
				createdAt: new Date().toISOString(),
				author: {
					id: user.id,
					username: user.username,
					profileImage: user.profileImage,
				},
				likedByIds: [],
				dislikedByIds: [],
				parentId,
			}

			onCommentAdded(optimisticComment)

			try {
				const formData = new FormData()
				formData.append('postId', postId)
				formData.append('content', content)
				if (parentId) {
					formData.append('parentId', parentId)
				}

				const result = await addComment(formData)
				if (result.success) {
					onCommentAdded(result.comment)
					setContent('')
					toast({
						title: t('Success_Title'),
						description: t('Comment_Added_Success'),
					})
				} else {
					throw new Error(result.error || 'Failed to add comment')
				}
			} catch (error) {
				console.error('Error adding comment:', error)
				toast({
					title: t('Error_Title'),
					description: t('Failed_Add_Comment'),
					variant: 'destructive',
				})
				// Remove the optimistic comment
				onCommentAdded(null)
			} finally {
				setIsSubmitting(false)
			}
		}

		return (
			<form onSubmit={handleSubmit} className="mt-4">
				<Textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder={t('Add_Comment_Placeholder')}
					className="mb-2 w-full"
				/>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting
						? t('Adding_Comment_Progress')
						: t('Add_Comment_Button')}
				</Button>
			</form>
		)
	}

	const ForumHeader = () => (
		<div className="sticky top-0 z-10 border-b bg-white">
			<div className="mx-auto max-w-4xl px-4 py-2">
				<div className="flex items-center gap-4">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
							<Input
								placeholder={t('Search_Discussions')}
								className="h-9 w-full pl-9 text-sm"
							/>
						</div>
					</div>
					<div>
						{isLoggedIn ? (
							<Button
								variant="outline"
								className="h-9 bg-transparent px-3 text-sm"
								onClick={() => setIsCreatingPost(true)}
							>
								{t('Start_New_Discussion')}
							</Button>
						) : (
							<Button
								variant="outline"
								className="h-9 bg-transparent px-3 text-sm"
								onClick={() => {
									/* Add login logic here */
								}}
							>
								{t('Login_Button')}
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	)

	const ForumCategories = () => (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{categories.map((category) => (
				<Card
					key={category.name}
					className="w-full cursor-pointer transition-all hover:shadow-lg"
					onClick={() => {
						setActiveCategory(category.name)
						setActivePage('category')
					}}
				>
					<CardContent className="p-6">
						<div className="flex items-start space-x-4">
							<div
								className={`rounded-full p-2 ${category.color} bg-opacity-10`}
							>
								<category.icon className={`h-6 w-6 ${category.color}`} />
							</div>
							<div className="space-y-1">
								<h3 className="font-semibold">{category.name}</h3>
								<p className="text-sm text-gray-500">{category.description}</p>
								<p className="text-sm text-gray-400">
									{category.posts}{' '}
									{category.posts !== 1
										? t('Posts_Plural')
										: t('Post_Singular')}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)

	const RecentPosts = ({ categoryFilter = '' }) => (
		<div className="space-y-4">
			{isLoading ? (
				<p>{t('Loading_Recent_Posts')}</p>
			) : recentPosts.length === 0 ? (
				<p>{t('No_Recent_Posts')}</p>
			) : (
				recentPosts
					.filter((post) => !categoryFilter || post.category === categoryFilter)
					.map((post) => (
						<Card
							key={post.id}
							className="w-full cursor-pointer transition-all hover:shadow-md"
							onClick={() => {
								router.push(`/forum?postId=${post.id}`)
							}}
						>
							<CardContent className="p-6">
								<div className="flex items-start justify-between">
									<div className="flex items-start space-x-4">
										<Avatar>
											{post.author.profileImage?.url ? (
												<AvatarImage
													src={
														post.author.profileImage.url || '/placeholder.svg'
													}
													alt={post.author.username || 'User'}
													className="object-cover"
												/>
											) : (
												<AvatarFallback>
													{post.author.username
														? post.author.username[0].toUpperCase()
														: 'U'}
												</AvatarFallback>
											)}
										</Avatar>
										<div>
											<h3 className="font-semibold hover:text-blue-600">
												{post.title}
											</h3>
											<p className="mt-1 text-sm text-gray-500">
												{post.excerpt}
											</p>
											<div className="mt-2 flex flex-wrap gap-2">
												{post.tags.map((tag: string) => (
													<span
														key={tag}
														className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
													>
														{tag}
													</span>
												))}
											</div>
											<p className="mt-2 text-sm text-gray-500">
												{post._count.comments}{' '}
												{post._count.comments !== 1
													? t('Comments_Plural')
													: t('Comment_Singular')}
											</p>
										</div>
									</div>
									<span className="text-xs text-gray-500">
										{formatDistanceToNow(new Date(post.createdAt), {
											addSuffix: true,
										})}
									</span>
								</div>
							</CardContent>
						</Card>
					))
			)}
		</div>
	)

	const MainPage = () => (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">{t('Travel_Forum_Title')}</h1>
				<p className="mt-2 text-gray-600">{t('Travel_Forum_Description')}</p>
			</div>
			<div>
				<h2 className="mb-4 text-2xl font-semibold">{t('Categories_Title')}</h2>
				<ForumCategories />
			</div>
			<Separator />
			<div>
				<h2 className="mb-4 text-2xl font-semibold">
					{t('Recent_Discussions_Title')}
				</h2>
				<RecentPosts />
			</div>
		</div>
	)

	const CategoryPage = () => (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button
					variant="outline"
					className="h-9 w-auto bg-transparent px-3 text-sm"
					onClick={() => setActivePage('main')}
				>
					<ChevronLeft className="mr-1 h-4 w-4" />
					{t('Back_To_Travel_Guides')}
				</Button>
			</div>
			<div>
				<h1 className="text-3xl font-bold">{activeCategory}</h1>
				<p className="mt-2 text-gray-600">
					{t('Category_Description', {
						category: activeCategory.toLowerCase(),
					})}
				</p>
			</div>
			<RecentPosts categoryFilter={activeCategory} />
		</div>
	)

	const PostPage = () => {
		if (!activePost) return null

		const handleCommentAdded = (newComment: any) => {
			if (!newComment) return
			setActivePost((prevPost: any) => {
				const updatedComments = [...prevPost.comments]
				if (newComment.parentId) {
					const parentIndex = updatedComments.findIndex(
						(c) => c.id === newComment.parentId,
					)
					if (parentIndex !== -1) {
						newComment.rootParentId =
							newComment.rootParentId || newComment.parentId
						updatedComments.splice(parentIndex + 1, 0, newComment)
					} else {
						updatedComments.push(newComment)
					}
				} else {
					updatedComments.push(newComment)
				}
				return {
					...prevPost,
					comments: updatedComments,
				}
			})
		}

		const handleCommentRemoved = async (commentId: string) => {
			const result = await removeComment(commentId)
			if (result.success) {
				setActivePost((prevPost: any) => ({
					...prevPost,
					comments: prevPost.comments.filter((c: any) => c.id !== commentId),
				}))
				toast({
					title: t('Comment_Removed_Title'),
					description: t('Comment_Removed_Success'),
				})
			} else {
				toast({
					title: t('Error_Title'),
					description: t('Failed_Remove_Comment'),
					variant: 'destructive',
				})
			}
		}

		// Flatten the comments structure
		const flattenedComments = activePost.comments.reduce(
			(acc: any[], comment: any) => {
				acc.push(comment)
				return acc
			},
			[],
		)

		return (
			<div className="space-y-6">
				<div>
					<Button
						variant="outline"
						className="h-9 w-auto bg-transparent px-3 text-sm"
						onClick={() => {
							setActivePage('main')
							router.push('/forum')
						}}
					>
						<ChevronLeft className="mr-1 h-4 w-4" />
						{t('Back_To_Forum')}
					</Button>
				</div>
				<div className="rounded-lg bg-white p-6 shadow-md">
					<h1 className="mb-4 text-3xl font-bold">{activePost.title}</h1>
					<div className="mb-4 flex items-center space-x-4">
						<Avatar>
							{activePost.author.profileImage?.url ? (
								<AvatarImage
									src={activePost.author.profileImage.url || '/placeholder.svg'}
									alt={activePost.author.username || 'User'}
									className="object-cover"
								/>
							) : (
								<AvatarFallback>
									{activePost.author.username
										? activePost.author.username[0].toUpperCase()
										: 'U'}
								</AvatarFallback>
							)}
						</Avatar>
						<div>
							<p className="font-semibold">
								{activePost.author.accountData?.firstname ||
									activePost.author.username ||
									t('Anonymous_User')}
							</p>
							<p className="text-sm text-gray-500">
								{t('Posted_Time')}{' '}
								{formatDistanceToNow(new Date(activePost.createdAt), {
									addSuffix: true,
								})}
							</p>
						</div>
					</div>
					<p className="mb-4 text-gray-700">{activePost.content}</p>
					<div className="flex flex-wrap gap-2">
						{activePost.tags.map((tag: string) => (
							<span
								key={tag}
								className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
							>
								{tag}
							</span>
						))}
					</div>
				</div>
				<div className="rounded-lg bg-white p-6 shadow-md">
					<h2 className="mb-4 text-xl font-semibold">
						{t('Comments_Count', { count: activePost.comments.length })}
					</h2>
					{activePost.comments && activePost.comments.length > 0 ? (
						<div className="space-y-4">
							{activePost.comments
								.filter((comment) => !comment.parentId)
								.map((comment: any) => (
									<Comment
										key={comment.id}
										comment={comment}
										onCommentRemoved={handleCommentRemoved}
										currentUserId={isLoggedIn ? user.id : null}
										postId={activePost.id}
										onReplyAdded={handleCommentAdded}
										allReplies={activePost.comments.filter(
											(reply) =>
												reply.parentId === comment.id ||
												reply.rootParentId === comment.id,
										)}
									/>
								))}
						</div>
					) : (
						<p className="text-gray-600">
							{t('No_Comments_Yet')}{' '}
							{isLoggedIn ? t('Be_First_Comment') : t('Login_To_Comment')}
						</p>
					)}
					{isLoggedIn && (
						<CommentForm
							postId={activePost.id}
							onCommentAdded={handleCommentAdded}
						/>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen">
			<ForumHeader />
			<main className="mx-auto max-w-4xl px-4 py-8">
				{isLoading ? (
					<p>{t('Loading_Text')}</p>
				) : (
					<>
						{activePage === 'main' && <MainPage />}
						{activePage === 'category' && <CategoryPage />}
						{activePage === 'post' && <PostPage />}
					</>
				)}
			</main>
			{isLoggedIn && isCreatingPost && (
				<CreatePostForm
					onClose={() => setIsCreatingPost(false)}
					refreshPosts={refreshPosts}
				/>
			)}
		</div>
	)
}
