'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
	MessageSquare,
	MoreHorizontal,
	ChevronDown,
	ChevronUp,
} from 'lucide-react'
import {
	VscThumbsup,
	VscThumbsupFilled,
	VscThumbsdown,
	VscThumbsdownFilled,
} from 'react-icons/vsc'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { updateCommentVotes } from '@/app/actions/forum/updateCommentVotes'
import { useToast } from '@/components/ui/use-toast'
// import { CommentForm } from '@/app/forum/page'

interface CommentProps {
	comment: any
	onCommentRemoved: (commentId: string) => void
	currentUserId: string | null
	postId: string
	onReplyAdded: (newReply: any) => void
	allReplies: any[]
}

export function Comment({
	comment,
	onCommentRemoved,
	currentUserId,
	postId,
	onReplyAdded,
	allReplies,
}: CommentProps) {
	const [isReplying, setIsReplying] = useState(false)
	const [likes, setLikes] = useState(comment.likedByIds?.length || 0)
	const [dislikes, setDislikes] = useState(comment.dislikedByIds?.length || 0)
	const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(
		() => {
			if (!currentUserId) return null
			if (comment.likedByIds?.includes(currentUserId)) return 'like'
			if (comment.dislikedByIds?.includes(currentUserId)) return 'dislike'
			return null
		},
	)
	const [isUpdating, setIsUpdating] = useState(false)
	const [showReplies, setShowReplies] = useState(true)
	const { toast } = useToast()

	const replies = allReplies.filter(
		(reply) =>
			reply.parentId === comment.id ||
			(reply.rootParentId === comment.id && reply.parentId !== comment.id),
	)

	const handleVote = async (action: 'like' | 'dislike') => {
		if (!currentUserId || isUpdating) return

		setIsUpdating(true)
		const previousAction = userAction
		const previousLikes = likes
		const previousDislikes = dislikes

		// Optimistic update
		if (action === 'like') {
			if (userAction === 'like') {
				setUserAction(null)
				setLikes(likes - 1)
			} else {
				setUserAction('like')
				setLikes(likes + 1)
				if (userAction === 'dislike') {
					setDislikes(dislikes - 1)
				}
			}
		} else {
			if (userAction === 'dislike') {
				setUserAction(null)
				setDislikes(dislikes - 1)
			} else {
				setUserAction('dislike')
				setDislikes(dislikes + 1)
				if (userAction === 'like') {
					setLikes(likes - 1)
				}
			}
		}

		let serverAction: 'like' | 'dislike' | 'unlike' | 'undislike'
		if (action === 'like') {
			serverAction = userAction === 'like' ? 'unlike' : 'like'
		} else {
			serverAction = userAction === 'dislike' ? 'undislike' : 'dislike'
		}

		try {
			const result = await updateCommentVotes(comment.id, serverAction)

			if (!result.success) {
				throw new Error(result.error || 'Failed to update vote')
			}

			// Update with server response
			setLikes(result.likes)
			setDislikes(result.dislikes)
		} catch (error) {
			console.error('Failed to update vote:', error)
			toast({
				title: 'Error',
				description: 'Failed to update vote. Please try again.',
				variant: 'destructive',
			})
			// Revert to previous state
			setUserAction(previousAction)
			setLikes(previousLikes)
			setDislikes(previousDislikes)
		} finally {
			setIsUpdating(false)
		}
	}

	const handleReplyAdded = (newReply: any) => {
		onReplyAdded(newReply)
		setIsReplying(false)
	}

	return (
		<div className="space-y-4">
			<div className="flex gap-3">
				<Avatar className="h-8 w-8">
					{comment.author.profileImage?.url ? (
						<AvatarImage
							src={comment.author.profileImage.url}
							alt={comment.author.username || 'User'}
							className="object-cover"
						/>
					) : (
						<AvatarFallback>
							{comment.author.username
								? comment.author.username[0].toUpperCase()
								: 'U'}
						</AvatarFallback>
					)}
				</Avatar>

				<div className="flex-1 space-y-1">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-sm">
							<span className="font-medium">
								{comment.author.accountData?.firstname ||
									comment.author.username ||
									'Anonymous'}
							</span>
							<span className="text-muted-foreground">
								{formatDistanceToNow(new Date(comment.createdAt), {
									addSuffix: true,
								})}
							</span>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-32">
								{currentUserId && comment.author.id === currentUserId ? (
									<DropdownMenuItem
										className="text-destructive focus:text-destructive"
										onClick={() => onCommentRemoved(comment.id)}
									>
										Remove
									</DropdownMenuItem>
								) : (
									<DropdownMenuItem>Report</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<p className="max-w-full break-all text-sm leading-relaxed">
						{comment.content}
					</p>

					<div className="flex items-center gap-2 pt-0.5">
						<div className="flex items-center">
							<Button
								size="sm"
								className={cn(
									'h-8 bg-transparent px-2 text-black shadow-none hover:bg-transparent',
									isUpdating && 'cursor-not-allowed opacity-50',
								)}
								onClick={() => handleVote('like')}
								disabled={isUpdating}
							>
								{userAction === 'like' ? (
									<VscThumbsupFilled className="h-4 w-4 text-black" />
								) : (
									<VscThumbsup className="h-4 w-4 text-black" />
								)}
								<span className="ml-1 text-xs text-black">
									{likes > 0 && likes}
								</span>
							</Button>
						</div>

						<div className="flex items-center">
							<Button
								size="sm"
								className={cn(
									'h-8 bg-transparent px-2 text-black shadow-none hover:bg-transparent',
									isUpdating && 'cursor-not-allowed opacity-50',
								)}
								onClick={() => handleVote('dislike')}
								disabled={isUpdating}
							>
								{userAction === 'dislike' ? (
									<VscThumbsdownFilled className="h-4 w-4 text-black" />
								) : (
									<VscThumbsdown className="h-4 w-4 text-black" />
								)}
								<span className="ml-1 text-xs text-black">
									{dislikes > 0 && dislikes}
								</span>
							</Button>
						</div>

						<span
							className="flex cursor-pointer items-center text-sm font-bold text-black"
							onClick={() => setIsReplying(!isReplying)}
						>
							<MessageSquare className="mr-1.5 h-4 w-4" />
							Reply
						</span>

						{replies.length > 0 && (
							<span
								className="flex cursor-pointer items-center text-sm font-bold text-black"
								onClick={() => setShowReplies(!showReplies)}
							>
								{showReplies ? (
									<ChevronUp className="mr-1.5 h-4 w-4" />
								) : (
									<ChevronDown className="mr-1.5 h-4 w-4" />
								)}
								{replies.length} {replies.length === 1 ? 'reply' : 'replies'}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* {isReplying && currentUserId && (
				<CommentForm
					postId={postId}
					parentId={comment.id}
					onCommentAdded={handleReplyAdded}
				/>
			)} */}

			{showReplies && replies.length > 0 && (
				<div className="ml-8 mt-4 space-y-4">
					{replies.map((reply: any) => (
						<Comment
							key={reply.id}
							comment={reply}
							onCommentRemoved={onCommentRemoved}
							currentUserId={currentUserId}
							postId={postId}
							onReplyAdded={onReplyAdded}
							allReplies={[]}
						/>
					))}
				</div>
			)}
		</div>
	)
}
