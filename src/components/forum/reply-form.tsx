'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addComment } from '@/app/actions/forum/addComment'
import { useToast } from '@/components/ui/use-toast'

interface ReplyFormProps {
	postId: string
	parentId: string
	onReplyAdded: (newReply: any) => void
	currentUserId: string
}

export function ReplyForm({
	postId,
	parentId,
	onReplyAdded,
	currentUserId,
}: ReplyFormProps) {
	const [content, setContent] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { toast } = useToast()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!content.trim() || isSubmitting) return

		setIsSubmitting(true)

		const optimisticReply = {
			id: 'temp-id-' + Date.now(),
			content,
			createdAt: new Date().toISOString(),
			author: {
				id: currentUserId,
				username: 'You',
				profileImage: null,
			},
			likedByIds: [],
			dislikedByIds: [],
			replies: [],
		}

		onReplyAdded(optimisticReply)

		try {
			const formData = new FormData()
			formData.append('postId', postId)
			formData.append('content', content)
			formData.append('parentId', parentId)

			const result = await addComment(formData)

			if (result.success) {
				onReplyAdded(result.comment)
				setContent('')
			} else {
				throw new Error(result.error || 'Failed to add reply')
			}
		} catch (error) {
			console.error('Error adding reply:', error)
			toast({
				title: 'Error',
				description: 'Failed to add reply. Please try again.',
				variant: 'destructive',
			})
			onReplyAdded(null)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-2">
			<Textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Write your reply..."
				className="w-full"
			/>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Submitting...' : 'Submit Reply'}
			</Button>
		</form>
	)
}
