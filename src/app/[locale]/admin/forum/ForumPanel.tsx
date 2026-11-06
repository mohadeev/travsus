'use client'
// Forum moderation panel: flagged posts first (scam, illegal, advertising
// link, taken down), search, open a post to read it with its comments, and
// delete the post or any comment.
import { useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { ChevronDown, ExternalLink, Loader2, MessageSquare, Search, ShieldAlert, Trash2 } from 'lucide-react'

export type AdminComment = { id: string; content: string; createdAt: string; author: string; flags: string[] }
export type AdminPost = {
	id: string
	title: string
	content: string
	category: string
	createdAt: string
	author: string
	authorEmail: string
	flags: string[]
	comments: AdminComment[]
}
type Filter = 'flagged' | 'all'

const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function ForumPanel({ initial, loadError }: { initial: AdminPost[]; loadError: string }) {
	const locale = useLocale()
	const [posts, setPosts] = useState(initial)
	const isFlagged = (p: AdminPost) => p.flags.length > 0 || p.comments.some((c) => c.flags.length > 0)
	const [filter, setFilter] = useState<Filter>(initial.some(isFlagged) ? 'flagged' : 'all')
	const [query, setQuery] = useState('')
	const [open, setOpen] = useState<string | null>(null)
	const [busy, setBusy] = useState('')
	const [toast, setToast] = useState('')

	const flaggedCount = useMemo(() => posts.filter(isFlagged).length, [posts]) // eslint-disable-line react-hooks/exhaustive-deps
	const q = query.toLowerCase()
	const shown = posts.filter(
		(p) => (filter === 'all' || isFlagged(p)) && (!q || `${p.title} ${p.content} ${p.author} ${p.authorEmail}`.toLowerCase().includes(q)),
	)

	function notify(message: string) {
		setToast(message)
		setTimeout(() => setToast(''), 4000)
	}

	async function remove(type: 'post' | 'comment', id: string, label: string) {
		if (!window.confirm(`Delete this ${type} for good?\n\n"${label.slice(0, 120)}"`)) return
		setBusy(id)
		const res = await fetch('/api/admin/forum', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ type, id }),
		}).catch(() => null)
		setBusy('')
		if (!res?.ok) {
			const body = await res?.json().catch(() => null)
			notify(body?.error || 'Could not delete. Please try again.')
			return
		}
		if (type === 'post') setPosts((all) => all.filter((p) => p.id !== id))
		else setPosts((all) => all.map((p) => ({ ...p, comments: p.comments.filter((c) => c.id !== id) })))
		notify(type === 'post' ? 'Post deleted' : 'Comment deleted')
	}

	const deleteButton = (type: 'post' | 'comment', id: string, label: string) => (
		<button
			type="button"
			onClick={() => remove(type, id, label)}
			disabled={busy === id}
			className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
		>
			{busy === id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
			Delete
		</button>
	)

	const flagChips = (flags: string[]) =>
		flags.map((flag) => (
			<span key={flag} className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
				<ShieldAlert className="h-3.5 w-3.5" />
				{flag}
			</span>
		))

	return (
		<div className="mx-auto max-w-5xl px-6 pb-24 pt-8 text-ink sm:pt-12 dark:text-white">
			<p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">TRAVSUS</p>
			<h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Forum</h1>
			<p className="mt-2 text-lg text-neutral-500">
				Every discussion and comment. Flagged ones look like a scam, an illegal offer or advertising and are already hidden from visitors; delete them for good here.
			</p>
			{loadError && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-red-700">{loadError}</p>}

			<div className="mt-8 flex flex-wrap items-center gap-3">
				<div className="flex rounded-full bg-neutral-100 p-1 dark:bg-neutral-900">
					{([
						['flagged', `Flagged (${flaggedCount})`],
						['all', `All (${posts.length})`],
					] as const).map(([value, label]) => (
						<button
							key={value}
							type="button"
							onClick={() => setFilter(value)}
							className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
								filter === value ? 'bg-white text-ink shadow-sm dark:bg-neutral-800 dark:text-white' : 'text-neutral-500 hover:text-ink dark:hover:text-white'
							}`}
						>
							{label}
						</button>
					))}
				</div>
				<label className="relative min-w-[220px] flex-1">
					<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search title, text, author"
						className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-neutral-400 focus:outline-none focus:ring-0 dark:border-neutral-800 dark:bg-neutral-950"
					/>
				</label>
			</div>

			<ul className="mt-6 space-y-3">
				{shown.length === 0 && <li className="rounded-3xl bg-neutral-100 px-6 py-10 text-center text-neutral-500 dark:bg-neutral-900">Nothing here.</li>}
				{shown.map((post) => {
					const expanded = open === post.id
					return (
						<li key={post.id} className={`rounded-3xl px-5 py-4 sm:px-6 ${post.flags.length ? 'bg-red-50 ring-1 ring-red-200 dark:bg-red-950/30 dark:ring-red-900' : 'bg-neutral-100 dark:bg-neutral-900'}`}>
							<div className="flex items-start gap-4">
								<button type="button" onClick={() => setOpen(expanded ? null : post.id)} className="min-w-0 flex-1 text-left">
									<div className="flex flex-wrap items-center gap-2">{flagChips(post.flags)}</div>
									<h2 className="mt-1 text-lg font-bold leading-6">{post.title || '(no title)'}</h2>
									<p className="mt-1 text-sm text-neutral-500">
										{post.author}
										{post.authorEmail && ` · ${post.authorEmail}`} · {date(post.createdAt)} · {post.category}
									</p>
									<p className="mt-1 inline-flex items-center gap-1.5 text-sm text-neutral-500">
										<MessageSquare className="h-4 w-4" />
										{post.comments.length} comments
										{post.comments.some((c) => c.flags.length) && <span className="font-semibold text-red-600">(some flagged)</span>}
										<ChevronDown className={`h-4 w-4 transition ${expanded ? 'rotate-180' : ''}`} />
									</p>
								</button>
								{deleteButton('post', post.id, post.title)}
							</div>

							{expanded && (
								<div className="mt-4 space-y-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
									<p className="whitespace-pre-line text-[15px] leading-relaxed">{post.content}</p>
									<a href={`/${locale}/forum/${post.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold underline">
										Open on the site <ExternalLink className="h-3.5 w-3.5" />
									</a>
									{post.comments.length > 0 && (
										<ul className="space-y-2">
											{post.comments.map((comment) => (
												<li key={comment.id} className={`flex items-start gap-3 rounded-2xl px-4 py-3 ${comment.flags.length ? 'bg-red-100/70 dark:bg-red-950/40' : 'bg-white dark:bg-neutral-950'}`}>
													<div className="min-w-0 flex-1">
														<div className="flex flex-wrap items-center gap-2">
															<span className="text-sm font-semibold">{comment.author}</span>
															<span className="text-xs text-neutral-500">{date(comment.createdAt)}</span>
															{flagChips(comment.flags)}
														</div>
														<p className="mt-1 whitespace-pre-line text-sm">{comment.content}</p>
													</div>
													{deleteButton('comment', comment.id, comment.content)}
												</li>
											))}
										</ul>
									)}
								</div>
							)}
						</li>
					)
				})}
			</ul>

			{toast && (
				<p role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-lg">
					{toast}
				</p>
			)}
		</div>
	)
}
