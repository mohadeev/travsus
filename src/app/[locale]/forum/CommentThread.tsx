'use client'
// Comments under a discussion: one level of replies (a reply to a reply joins
// the same thread), "Helpful" votes and deleting your own comments.
import { useMemo, useState, type FormEvent } from 'react'
import { Loader2, ThumbsUp, Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { addComment } from '@/app/actions/forum/addComment'
import { removeComment } from '@/app/actions/forum/removeComment'
import { updateCommentVotes } from '@/app/actions/forum/updateCommentVotes'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import type { ForumComment } from '@/lib/forum'
import Avatar from './Avatar'

type Props = { postId: string; initial: ForumComment[]; viewerId: string | null }

export default function CommentThread({ postId, initial, viewerId }: Props) {
	const t = useTranslations('Forum')
	const [comments, setComments] = useState(initial)
	const [replyTo, setReplyTo] = useState<string | null>(null)

	// Top-level comments, each with the replies under it (oldest first)
	const threads = useMemo(() => {
		const byId = new Map(comments.map((c) => [c.id, c]))
		const rootOf = (c: ForumComment): string => {
			let current = c
			for (let i = 0; current.parentId && byId.has(current.parentId) && i < 20; i++) current = byId.get(current.parentId)!
			return current.id
		}
		const roots = comments.filter((c) => !c.parentId || !byId.has(c.parentId))
		return roots.map((root) => ({ root, replies: comments.filter((c) => c !== root && rootOf(c) === root.id) }))
	}, [comments])

	const added = (comment: ForumComment) => {
		setComments((list) => [...list, comment])
		setReplyTo(null)
	}

	const remove = async (id: string) => {
		const before = comments
		// Replies stay, detached (the server does the same)
		setComments((list) => list.filter((c) => c.id !== id).map((c) => (c.parentId === id ? { ...c, parentId: null } : c)))
		const result = await removeComment(id)
		if (!result.success) setComments(before)
	}

	return (
		<section aria-labelledby="comments" className="mt-14">
			<h2 id="comments" className="text-2xl font-bold tracking-tight sm:text-3xl">
				{t('comments_title', { count: comments.length })}
			</h2>

			<div className="mt-6">
				<Composer postId={postId} viewerId={viewerId} onAdded={added} />
			</div>

			<ul className="mt-8 space-y-8">
				{threads.map(({ root, replies }) => (
					<li key={root.id}>
						<CommentItem comment={root} viewerId={viewerId} onReply={() => setReplyTo(root.id)} onRemove={remove} />
						{(replies.length > 0 || replyTo === root.id) && (
							<div className="ml-5 mt-4 space-y-5 border-l-2 border-neutral-100 pl-5 sm:ml-12 dark:border-neutral-800">
								{replies.map((reply) => (
									<CommentItem
										key={reply.id}
										comment={reply}
										viewerId={viewerId}
										onReply={() => setReplyTo(root.id)}
										onRemove={remove}
										small
									/>
								))}
								{replyTo === root.id && (
									<Composer postId={postId} parentId={root.id} viewerId={viewerId} onAdded={added} autoFocus onCancel={() => setReplyTo(null)} />
								)}
							</div>
						)}
					</li>
				))}
			</ul>
		</section>
	)
}

function CommentItem({
	comment,
	viewerId,
	onReply,
	onRemove,
	small = false,
}: {
	comment: ForumComment
	viewerId: string | null
	onReply: () => void
	onRemove: (id: string) => void
	small?: boolean
}) {
	const t = useTranslations('Forum')
	const locale = useLocale()
	const [likes, setLikes] = useState(comment.likedByIds)
	const liked = !!viewerId && likes.includes(viewerId)

	const toggleLike = useAuthAction(async () => {
		if (!viewerId) return
		const before = likes
		setLikes(liked ? likes.filter((id) => id !== viewerId) : [...likes, viewerId])
		const result = await updateCommentVotes(comment.id, liked ? 'unlike' : 'like')
		if (!result.success) setLikes(before)
	})
	const reply = useAuthAction(onReply)

	const action = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white'

	return (
		<article className="flex gap-3 sm:gap-4">
			<Avatar author={comment.author} size={small ? 32 : 40} />
			<div className="min-w-0 flex-1">
				<p className="text-sm">
					<span className="font-semibold">{comment.author.name || t('anonymous')}</span>
					<span className="text-neutral-500">
						{' · '}
						{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(comment.createdAt))}
					</span>
				</p>
				<p className="mt-1 whitespace-pre-line break-words text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200">
					{comment.content}
				</p>
				<div className="-ml-2.5 mt-1.5 flex items-center gap-1">
					<button type="button" onClick={() => toggleLike(undefined)} aria-pressed={liked} className={`${action} ${liked ? '!text-neutral-950 dark:!text-white' : ''}`}>
						<ThumbsUp className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
						{t('helpful')}
						{likes.length > 0 && <span className="tabular-nums">{likes.length}</span>}
					</button>
					<button type="button" onClick={() => reply(undefined)} className={action}>
						{t('reply')}
					</button>
					{viewerId && viewerId === comment.author.id && (
						<button type="button" onClick={() => onRemove(comment.id)} className={action} aria-label={t('delete')}>
							<Trash2 className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>
		</article>
	)
}

function Composer({
	postId,
	parentId,
	viewerId,
	onAdded,
	onCancel,
	autoFocus,
}: {
	postId: string
	parentId?: string
	viewerId: string | null
	onAdded: (comment: ForumComment) => void
	onCancel?: () => void
	autoFocus?: boolean
}) {
	const t = useTranslations('Forum')
	const [text, setText] = useState('')
	const [sending, setSending] = useState(false)
	const [error, setError] = useState(false)
	const signIn = useAuthAction(() => {})

	if (!viewerId) {
		return (
			<button
				type="button"
				onClick={() => signIn(undefined)}
				className="w-full rounded-3xl bg-neutral-100 px-5 py-4 text-left text-neutral-500 transition hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800"
			>
				{t('sign_in_comment')}
			</button>
		)
	}

	async function submit(e: FormEvent) {
		e.preventDefault()
		if (!text.trim() || sending) return
		setSending(true)
		setError(false)
		const form = new FormData()
		form.append('postId', postId)
		form.append('content', text)
		if (parentId) form.append('parentId', parentId)
		const result = await addComment(form)
		if (result.success && result.comment) {
			onAdded(result.comment as ForumComment)
			setText('')
		} else setError(true)
		setSending(false)
	}

	return (
		<form onSubmit={submit} className="rounded-3xl bg-neutral-100 p-2 focus-within:ring-2 focus-within:ring-neutral-950 dark:bg-neutral-900 dark:focus-within:ring-white">
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				autoFocus={autoFocus}
				rows={parentId ? 2 : 3}
				maxLength={5000}
				placeholder={t(parentId ? 'reply_placeholder' : 'comment_placeholder')}
				className="w-full resize-none border-0 bg-transparent px-3 py-2 text-base placeholder:text-neutral-500 focus:outline-none focus:ring-0"
			/>
			<div className="flex items-center justify-end gap-2 px-1 pb-1">
				{error && <p className="mr-auto px-2 text-sm text-red-500">{t('error_generic')}</p>}
				{onCancel && (
					<button type="button" onClick={onCancel} className="rounded-full px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-950 dark:hover:text-white">
						{t('cancel')}
					</button>
				)}
				<button
					type="submit"
					disabled={!text.trim() || sending}
					className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-40 dark:bg-white dark:text-neutral-950"
				>
					{sending && <Loader2 className="h-4 w-4 animate-spin" />}
					{t(parentId ? 'reply' : 'comment_cta')}
				</button>
			</div>
		</form>
	)
}
