'use client'
// Blog writing studio: a full-page editor in the style of Medium / Notion.
//
// - Top bar: back, save status, word count, preview, save (⌘/Ctrl+S)
// - Canvas: cover photo, title, summary and the article (Tiptap) with a sticky
//   toolbar, a menu on selected text and a "+" menu on empty lines
// - Images: upload, paste or drop; resized in the browser, stored on Cloudinary
// - Sidebar: languages (edit every translation here), tags, Google preview,
//   article health (headings, images without alt text, links) and raw JSON
// - Unsaved work is kept in this browser and offered back after a reload
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEditor, EditorContent, BubbleMenu, FloatingMenu, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import LinkExtension from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Highlight from '@tiptap/extension-highlight'
import Youtube from '@tiptap/extension-youtube'
import { slugify } from 'transliteration'
import {
	AlignCenter, AlignLeft, AlignRight, ArrowLeft, Bold, Check, ChevronDown, Code, Code2, Eraser, ExternalLink, Eye,
	FileCode, Globe, Heading2, Heading3, Highlighter, ImageIcon, ImagePlus, Italic, Link2, Link2Off, List, ListOrdered,
	Loader2, Minus, Plus, Quote, Redo2, Save, Strikethrough, Tag, Type, Underline as UnderlineIcon, Undo2, X, Youtube as YoutubeIcon,
} from 'lucide-react'
import { uploadBlogImage } from '@/app/actions/uploadBlogImage'
import BlogJsonEditorPage from './BlogJsonEditorPage'

const SOURCE = 'en-US'
const LANGUAGES: [string, string][] = [
	['en-US', 'English'], ['fr-FR', 'Français'], ['es-ES', 'Español'], ['de-DE', 'Deutsch'], ['it-IT', 'Italiano'],
	['pt-PT', 'Português'], ['ru-RU', 'Русский'], ['ja-JP', '日本語'], ['ko-KR', '한국어'], ['zh-CN', '中文'],
]
const TITLE_MAX = 60 // what Google shows of a title
const SUMMARY_MAX = 160 // and of a description

type Version = { title: string; excerpt: string; content: string; tags: string[] }
const EMPTY: Version = { title: '', excerpt: '', content: '', tags: [] }
type Notice = { kind: 'ok' | 'error'; text: string } | null
type Draft = { versions: Record<string, Version>; cover: string; at: number }

const plain = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()
const hasText = (v?: Version) => !!v && plain(v.content).length > 0 && !!v.title.trim()
const ago = (date: Date) => {
	const s = Math.round((Date.now() - date.getTime()) / 1000)
	return s < 45 ? 'just now' : s < 3600 ? `${Math.round(s / 60)} min ago` : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** Resize big photos in the browser (max 2000 px, WebP) so uploads stay small. */
async function shrink(file: File): Promise<File> {
	if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file
	const bitmap = await createImageBitmap(file)
	const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height))
	if (scale === 1 && file.size < 1_500_000) return file
	const canvas = document.createElement('canvas')
	canvas.width = Math.round(bitmap.width * scale)
	canvas.height = Math.round(bitmap.height * scale)
	canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
	const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
	return blob ? new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' }) : file
}

const pickFile = () =>
	new Promise<File | null>((resolve) => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = 'image/*'
		input.onchange = () => resolve(input.files?.[0] ?? null)
		input.click()
	})

/* ───────────────────────── small UI pieces ───────────────────────── */

function ToolButton({ onClick, active, disabled, title, children }: { onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: ReactNode }) {
	return (
		<button
			type="button"
			title={title}
			aria-label={title}
			aria-pressed={active}
			disabled={disabled}
			onMouseDown={(e) => e.preventDefault()}
			onClick={onClick}
			className={`grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-sm transition disabled:opacity-30 ${
				active ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
			}`}
		>
			{children}
		</button>
	)
}

const Divider = () => <span aria-hidden className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-700" />

/** A button that opens a one-field form (link, video, alt text…). */
function InputPopover({ icon, title, placeholder, initial = '', onApply, onRemove, active }: {
	icon: ReactNode; title: string; placeholder: string; initial?: string; onApply: (value: string) => void; onRemove?: () => void; active?: boolean
}) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState(initial)
	useEffect(() => { if (open) setValue(initial) }, [open, initial])
	return (
		<span className="relative">
			<ToolButton title={title} active={active || open} onClick={() => setOpen(!open)}>{icon}</ToolButton>
			{open && (
				<form
					onSubmit={(e) => { e.preventDefault(); onApply(value.trim()); setOpen(false) }}
					className="absolute left-0 top-10 z-40 flex w-80 items-center gap-1.5 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-neutral-700 dark:bg-neutral-900"
				>
					<input autoFocus value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
						className="min-w-0 flex-1 rounded-lg border-0 bg-neutral-100 px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-800" />
					<button type="submit" className="grid h-8 w-8 place-items-center rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950" title="Apply"><Check className="h-4 w-4" /></button>
					{onRemove && <button type="button" onClick={() => { onRemove(); setOpen(false) }} className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950" title="Remove"><X className="h-4 w-4" /></button>}
				</form>
			)}
		</span>
	)
}

const BLOCKS = [
	{ label: 'Text', icon: Type, is: (e: Editor) => e.isActive('paragraph'), run: (e: Editor) => e.chain().focus().setParagraph().run() },
	{ label: 'Heading', icon: Heading2, is: (e: Editor) => e.isActive('heading', { level: 2 }), run: (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run() },
	{ label: 'Subheading', icon: Heading3, is: (e: Editor) => e.isActive('heading', { level: 3 }), run: (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run() },
	{ label: 'Small heading', icon: Heading3, is: (e: Editor) => e.isActive('heading', { level: 4 }), run: (e: Editor) => e.chain().focus().toggleHeading({ level: 4 }).run() },
	{ label: 'Quote', icon: Quote, is: (e: Editor) => e.isActive('blockquote'), run: (e: Editor) => e.chain().focus().toggleBlockquote().run() },
	{ label: 'Code block', icon: Code2, is: (e: Editor) => e.isActive('codeBlock'), run: (e: Editor) => e.chain().focus().toggleCodeBlock().run() },
]

function BlockMenu({ editor }: { editor: Editor }) {
	const [open, setOpen] = useState(false)
	const current = BLOCKS.find((b) => b.is(editor)) ?? BLOCKS[0]
	return (
		<span className="relative">
			<button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setOpen(!open)}
				className="inline-flex h-8 w-36 items-center justify-between gap-1 rounded-lg px-2.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
				{current.label}<ChevronDown className="h-4 w-4 text-neutral-400" />
			</button>
			{open && (
				<div className="absolute left-0 top-10 z-40 w-48 rounded-xl border border-neutral-200 bg-white p-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
					{BLOCKS.map((b) => (
						<button key={b.label} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { b.run(editor); setOpen(false) }}
							className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 ${b.is(editor) ? 'font-semibold' : ''}`}>
							<b.icon className="h-4 w-4 text-neutral-500" />{b.label}
						</button>
					))}
				</div>
			)}
		</span>
	)
}

function SidebarCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
	return (
		<section className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
			<h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">{icon}{title}</h3>
			{children}
		</section>
	)
}

/* ───────────────────────────── editor ───────────────────────────── */

export default function BlogEditor({ postId, userId }: { postId?: string; userId: string }) {
	const router = useRouter()
	const { locale = SOURCE } = useParams<{ locale: string }>()
	const [post, setPost] = useState<any>(null)
	const [versions, setVersions] = useState<Record<string, Version>>({ [SOURCE]: EMPTY })
	const [lang, setLang] = useState(SOURCE)
	const [cover, setCover] = useState('')
	const [loading, setLoading] = useState(!!postId)
	const [saving, setSaving] = useState(false)
	const [uploading, setUploading] = useState(0)
	const [dirty, setDirty] = useState(false)
	const [coverDirty, setCoverDirty] = useState(false)
	const [savedAt, setSavedAt] = useState<Date | null>(null)
	const [notice, setNotice] = useState<Notice>(null)
	const [draft, setDraft] = useState<Draft | null>(null)
	const [htmlMode, setHtmlMode] = useState(false)
	const [html, setHtml] = useState('')
	const [tagInput, setTagInput] = useState('')
	const [, tick] = useState(0)
	const langRef = useRef(lang)
	langRef.current = lang
	const editorRef = useRef<Editor | null>(null)
	const draftKey = `travsus:blog-draft:${postId || 'new'}`

	const version = versions[lang] ?? EMPTY
	const update = useCallback((patch: Partial<Version>, forLang = langRef.current) => {
		setVersions((all) => ({ ...all, [forLang]: { ...(all[forLang] ?? EMPTY), ...patch } }))
		setDirty(true)
	}, [])

	const say = (kind: 'ok' | 'error', text: string) => {
		setNotice({ kind, text })
		setTimeout(() => setNotice((n) => (n?.text === text ? null : n)), 4000)
	}

	/* Images: upload one file, return its URL */
	const upload = useCallback(async (file: File) => {
		setUploading((n) => n + 1)
		try {
			const form = new FormData()
			form.append('file', await shrink(file))
			const result = await uploadBlogImage(form)
			if ('error' in result) { say('error', result.error); return null }
			return result.url
		} catch {
			say('error', 'Upload failed. Please try again.')
			return null
		} finally {
			setUploading((n) => n - 1)
		}
	}, [])

	const insertImages = useCallback(async (files: File[], at?: number) => {
		for (const file of files.filter((f) => f.type.startsWith('image/'))) {
			const url = await upload(file)
			const editor = editorRef.current
			if (!url || !editor) continue
			const alt = file.name.replace(/\.\w+$/, '').replace(/[-_]+/g, ' ')
			if (at != null) editor.chain().focus().insertContentAt(at, { type: 'image', attrs: { src: url, alt } }).run()
			else editor.chain().focus().setImage({ src: url, alt }).run()
		}
	}, [upload])

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }), // h1 kept for older posts (the page shows it as h2),
			ImageExtension.configure({ HTMLAttributes: { class: 'mx-auto h-auto max-w-full rounded-2xl' } }),
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			LinkExtension.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer', target: null } }),
			Underline,
			Highlight,
			Youtube.configure({ nocookie: true, HTMLAttributes: { class: 'aspect-video h-auto w-full rounded-2xl' } }),
			CharacterCount,
			Placeholder.configure({
				placeholder: ({ node }) => (node.type.name === 'heading' ? 'Heading' : 'Write your story… (type, paste or drop photos)'),
			}),
		],
		content: '',
		editorProps: {
			attributes: {
				class: 'prose prose-neutral prose-lg max-w-none dark:prose-invert focus:outline-none min-h-[45vh] prose-headings:tracking-tight prose-img:rounded-2xl prose-a:text-brand-600',
			},
			handlePaste: (_view, event) => {
				const files = Array.from(event.clipboardData?.files ?? [])
				if (!files.some((f) => f.type.startsWith('image/'))) return false
				event.preventDefault()
				void insertImages(files)
				return true
			},
			handleDrop: (view, event) => {
				const files = Array.from((event as DragEvent).dataTransfer?.files ?? [])
				if (!files.some((f) => f.type.startsWith('image/'))) return false
				event.preventDefault()
				const pos = view.posAtCoords({ left: (event as DragEvent).clientX, top: (event as DragEvent).clientY })?.pos
				void insertImages(files, pos)
				return true
			},
		},
		onUpdate: ({ editor }) => update({ content: editor.getHTML() }),
	})
	editorRef.current = editor

	/* Load the post and every language it has */
	useEffect(() => {
		if (!postId) return
		fetch(`/api/getPostById?id=${postId}`)
			.then((r) => r.json())
			.then((p) => {
				if (!p?.id) return say('error', 'Could not load this post.')
				const all: Record<string, Version> = {}
				const own = (p.translations ?? []).find((t: any) => t?.language === SOURCE)
				all[SOURCE] = {
					title: own?.title || p.title || '',
					excerpt: own?.excerpt || p.excerpt || '',
					content: plain(own?.content ?? '').length >= 300 ? own.content : p.content || '',
					tags: (own?.tags?.length ? own.tags : p.tags) ?? [],
				}
				for (const t of p.translations ?? []) {
					if (!t?.language || t.language === SOURCE) continue
					all[t.language] = { title: t.title ?? '', excerpt: t.excerpt ?? '', content: t.content ?? '', tags: t.tags ?? [] }
				}
				setPost(p)
				setVersions(all)
				setCover(p.featuredImage || '')
				setSavedAt(null)
				setDirty(false)
			})
			.catch(() => say('error', 'Could not load this post.'))
			.finally(() => setLoading(false))
	}, [postId])

	/* Put the current language's text into the editor (on load and when switching) */
	useEffect(() => {
		if (!editor || loading) return
		const content = versions[lang]?.content ?? ''
		if (editor.getHTML() !== content) editor.commands.setContent(content, false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editor, lang, loading])

	/* Offer back unsaved work kept in this browser */
	useEffect(() => {
		if (loading) return
		try {
			const saved: Draft | null = JSON.parse(localStorage.getItem(draftKey) || 'null')
			if (saved?.versions) setDraft(saved)
		} catch {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading])

	useEffect(() => {
		if (!dirty) return
		const timer = setTimeout(() => {
			try { localStorage.setItem(draftKey, JSON.stringify({ versions, cover, at: Date.now() } satisfies Draft)) } catch {}
		}, 800)
		return () => clearTimeout(timer)
	}, [versions, cover, dirty, draftKey])

	const restoreDraft = () => {
		if (!draft) return
		setVersions(draft.versions)
		setCover(draft.cover)
		editor?.commands.setContent(draft.versions[lang]?.content ?? '', false)
		setDirty(true)
		setCoverDirty(true)
		setDraft(null)
	}
	const discardDraft = () => {
		try { localStorage.removeItem(draftKey) } catch {}
		setDraft(null)
	}

	/* Warn before leaving with unsaved changes; refresh the "saved x min ago" text */
	useEffect(() => {
		const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = '' } }
		window.addEventListener('beforeunload', warn)
		const timer = setInterval(() => tick((n) => n + 1), 30_000)
		return () => { window.removeEventListener('beforeunload', warn); clearInterval(timer) }
	}, [dirty])

	/* Saving */
	const currentContent = (forLang: string) => (htmlMode && forLang === lang ? html : forLang === lang && editor ? editor.getHTML() : versions[forLang]?.content ?? '')

	const save = useCallback(async () => {
		if (saving) return
		const en = { ...(versions[SOURCE] ?? EMPTY), content: currentContent(SOURCE) }
		const mine = { ...version, content: currentContent(lang) }
		if (!mine.title.trim()) return say('error', 'Add a title first.')
		if (lang === SOURCE && plain(mine.content).length < 1) return say('error', 'Write something first.')
		setSaving(true)
		try {
			let saved = post
			// English (and the cover photo) live on the post itself
			if (lang === SOURCE || coverDirty) {
				const form = new FormData()
				form.append('title', en.title)
				form.append('excerpt', en.excerpt)
				form.append('content', en.content)
				form.append('tags', en.tags.join(','))
				form.append('featuredImage', cover)
				if (postId) form.append('id', postId)
				const res = await fetch('/api/saveBlogPost', { method: 'POST', body: form }).then((r) => r.json())
				if (!res.success) throw new Error(res.error || 'Could not save')
				saved = res.post
				if (!postId) {
					try { localStorage.removeItem(draftKey) } catch {}
					setDirty(false)
					router.replace(`/${locale}/editor?id=${res.post.id}` as any)
					return
				}
			}
			// Other languages (and a stored English copy, if the post has one) live in `translations`
			const list: any[] = [...(saved?.translations ?? post?.translations ?? [])]
			const upsert = (language: string, v: Version) => {
				const i = list.findIndex((t) => t?.language === language)
				const entry = { ...(i >= 0 ? list[i] : {}), language, title: v.title, excerpt: v.excerpt, content: v.content, tags: v.tags }
				if (i >= 0) list[i] = entry
				else list.push(entry)
			}
			const hasEnglishCopy = list.some((t) => t?.language === SOURCE)
			if (lang !== SOURCE) upsert(lang, mine)
			if (lang === SOURCE && hasEnglishCopy) upsert(SOURCE, en)
			if (lang !== SOURCE || hasEnglishCopy) {
				const form = new FormData()
				form.append('id', postId!)
				form.append('byJson', 'true')
				form.append('translations', JSON.stringify(list))
				const res = await fetch('/api/saveBlogPost', { method: 'POST', body: form }).then((r) => r.json())
				if (!res.success) throw new Error(res.error || 'Could not save')
				saved = res.post
			}
			setPost(saved)
			setDirty(false)
			setCoverDirty(false)
			setSavedAt(new Date())
			try { localStorage.removeItem(draftKey) } catch {}
			say('ok', 'Saved')
		} catch (error: any) {
			say('error', error?.message === 'Unauthorized' ? 'Only the author can edit this post.' : 'Could not save. Your work is kept in this browser; try again.')
		} finally {
			setSaving(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [saving, versions, version, lang, cover, coverDirty, post, postId, html, htmlMode, editor])

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); void save() }
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [save])

	/* Switching language / HTML mode */
	const switchLang = (next: string) => {
		if (next === lang) return
		if (htmlMode) { update({ content: html }); setHtmlMode(false) }
		setLang(next)
	}
	const copyEnglish = () => {
		const en = versions[SOURCE] ?? EMPTY
		update({ ...en, content: currentContent(SOURCE) })
		editor?.commands.setContent(en.content, false)
	}
	const toggleHtml = () => {
		if (!editor) return
		if (htmlMode) {
			editor.commands.setContent(html, true)
		} else {
			setHtml(editor.getHTML().replace(/<\/(p|h[2-4]|li|blockquote|ul|ol|pre|figure)>/g, '</$1>\n'))
		}
		setHtmlMode(!htmlMode)
	}

	/* Tags */
	const addTag = (raw: string) => {
		const tags = raw.split(',').map((t) => t.trim()).filter(Boolean)
		if (!tags.length) return
		update({ tags: Array.from(new Set([...version.tags, ...tags])) })
		setTagInput('')
	}

	/* Numbers for the sidebar */
	const stats = useMemo(() => {
		const content = htmlMode ? html : version.content
		const words = plain(content).split(' ').filter(Boolean).length
		const images = content.match(/<img\b[^>]*>/g) ?? []
		return {
			words,
			minutes: Math.max(1, Math.round(words / 220)),
			headings: (content.match(/<h[2-4]\b/g) ?? []).length,
			images: images.length,
			noAlt: images.filter((img) => !/\balt="[^"]+"/.test(img)).length,
			links: (content.match(/<a\b/g) ?? []).length,
		}
	}, [version.content, html, htmlMode])

	const slug = slugify(version.title || 'article') || 'article'
	const liveUrl = postId ? `/${lang}/blog/${slug}/${postId}` : null
	const translated = (code: string) => code === SOURCE || hasText(versions[code])

	if (!userId) {
		return (
			<div className="mx-auto max-w-md px-5 py-24 text-center">
				<h1 className="text-2xl font-bold">Sign in to write</h1>
				<p className="mt-2 text-neutral-500">The blog editor is for signed-in writers.</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white">
			{/* Top bar */}
			<header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
				<div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4">
					<Link href={`/${locale}/blog` as any} className="grid h-9 w-9 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800" title="Back to the blog">
						<ArrowLeft className="h-5 w-5" />
					</Link>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-semibold">{version.title || (postId ? 'Untitled' : 'New story')}</p>
						<p className="text-xs text-neutral-500">
							{loading ? 'Loading…' : saving ? 'Saving…' : uploading ? 'Uploading photo…' : dirty ? 'Unsaved changes' : savedAt ? `Saved ${ago(savedAt)}` : postId ? 'All changes saved' : 'Draft'}
							<span className="mx-1.5">·</span>{stats.words.toLocaleString()} words · {stats.minutes} min read
							<span className="mx-1.5">·</span>{LANGUAGES.find(([c]) => c === lang)?.[1]}
						</p>
					</div>
					{liveUrl && (
						<a href={liveUrl} target="_blank" rel="noopener noreferrer" className="hidden h-9 items-center gap-1.5 rounded-full border border-neutral-300 px-4 text-sm font-semibold transition hover:border-neutral-950 sm:inline-flex dark:border-neutral-700 dark:hover:border-white">
							<Eye className="h-4 w-4" />Preview
						</a>
					)}
					<button type="button" onClick={() => void save()} disabled={saving || loading}
						className="inline-flex h-9 items-center gap-1.5 rounded-full bg-neutral-950 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-950"
						title="Save (⌘S / Ctrl+S)">
						{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
						{postId ? 'Save' : 'Publish'}
					</button>
				</div>
			</header>

			{notice && (
				<div role="status" className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-xl ${notice.kind === 'ok' ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-red-600 text-white'}`}>
					{notice.text}
				</div>
			)}

			<div className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-32 lg:grid-cols-[minmax(0,1fr)_340px]">
				<main className="min-w-0">
					{draft && (
						<div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
							<span className="flex-1">You have unsaved work from {new Date(draft.at).toLocaleString()}.</span>
							<button type="button" onClick={restoreDraft} className="rounded-full bg-amber-900 px-3 py-1.5 font-semibold text-white dark:bg-amber-100 dark:text-amber-950">Restore</button>
							<button type="button" onClick={discardDraft} className="font-semibold underline underline-offset-2">Discard</button>
						</div>
					)}

					{/* Toolbar */}
					{editor && (
						<div className="sticky top-14 z-20 -mx-4 border-b border-neutral-100 bg-white/95 px-4 py-1.5 backdrop-blur dark:border-neutral-900 dark:bg-neutral-950/95">
							<div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-0.5">
								<ToolButton title="Undo (⌘Z)" disabled={htmlMode || !editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></ToolButton>
								<ToolButton title="Redo (⌘⇧Z)" disabled={htmlMode || !editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></ToolButton>
								<Divider />
								{!htmlMode && (
									<>
										<BlockMenu editor={editor} />
										<Divider />
										<ToolButton title="Bold (⌘B)" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolButton>
										<ToolButton title="Italic (⌘I)" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolButton>
										<ToolButton title="Underline (⌘U)" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></ToolButton>
										<ToolButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></ToolButton>
										<ToolButton title="Highlight" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter className="h-4 w-4" /></ToolButton>
										<ToolButton title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><Code className="h-4 w-4" /></ToolButton>
										<InputPopover icon={<Link2 className="h-4 w-4" />} title="Link (select text first)" placeholder="https://… or /en-US/…" active={editor.isActive('link')}
											initial={editor.getAttributes('link').href ?? ''}
											onApply={(href) => (href ? editor.chain().focus().extendMarkRange('link').setLink({ href }).run() : editor.chain().focus().unsetLink().run())}
											onRemove={editor.isActive('link') ? () => editor.chain().focus().unsetLink().run() : undefined} />
										<Divider />
										<ToolButton title="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolButton>
										<ToolButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolButton>
										<ToolButton title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft className="h-4 w-4" /></ToolButton>
										<ToolButton title="Center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter className="h-4 w-4" /></ToolButton>
										<ToolButton title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight className="h-4 w-4" /></ToolButton>
										<Divider />
										<ToolButton title="Upload photo" onClick={async () => { const f = await pickFile(); if (f) void insertImages([f]) }}><ImagePlus className="h-4 w-4" /></ToolButton>
										<InputPopover icon={<ImageIcon className="h-4 w-4" />} title="Photo from a link" placeholder="https://…jpg" onApply={(src) => src && editor.chain().focus().setImage({ src }).run()} />
										<InputPopover icon={<YoutubeIcon className="h-4 w-4" />} title="YouTube video" placeholder="https://youtube.com/watch?v=…" onApply={(src) => src && editor.commands.setYoutubeVideo({ src })} />
										<ToolButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></ToolButton>
										<ToolButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser className="h-4 w-4" /></ToolButton>
									</>
								)}
								<span className="flex-1" />
								<ToolButton title={htmlMode ? 'Back to the visual editor' : 'Edit HTML'} active={htmlMode} onClick={toggleHtml}><FileCode className="h-4 w-4" /></ToolButton>
							</div>
						</div>
					)}

					<article className="mx-auto mt-8 max-w-3xl">
						{/* Cover photo */}
						{cover ? (
							<figure className="group relative mb-8 overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900">
								{/* eslint-disable-next-line @next/next/no-img-element -- any Cloudinary / external URL */}
								<img src={cover} alt="" className="aspect-[16/9] w-full object-cover" />
								<div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
									<button type="button" onClick={async () => { const f = await pickFile(); const url = f && (await upload(f)); if (url) { setCover(url); setCoverDirty(true); setDirty(true) } }}
										className="rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-neutral-950 shadow">Change</button>
									<button type="button" onClick={() => { setCover(''); setCoverDirty(true); setDirty(true) }} className="rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-red-600 shadow">Remove</button>
								</div>
							</figure>
						) : (
							<button type="button" onClick={async () => { const f = await pickFile(); const url = f && (await upload(f)); if (url) { setCover(url); setCoverDirty(true); setDirty(true) } }}
								className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-900 dark:hover:text-white">
								<ImagePlus className="h-4 w-4" />Add cover photo
							</button>
						)}

						{lang !== SOURCE && !hasText(version) && (
							<div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl bg-neutral-100 px-4 py-3 text-sm dark:bg-neutral-900">
								<Globe className="h-4 w-4 text-neutral-500" />
								<span className="flex-1">No {LANGUAGES.find(([c]) => c === lang)?.[1]} version yet.</span>
								<button type="button" onClick={copyEnglish} className="rounded-full bg-neutral-950 px-3 py-1.5 font-semibold text-white dark:bg-white dark:text-neutral-950">Start from English</button>
							</div>
						)}

						{/* Title and summary */}
						<textarea
							value={version.title}
							onChange={(e) => update({ title: e.target.value.replace(/\n/g, ' ') })}
							placeholder="Title"
							rows={1}
							className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-4xl font-bold leading-tight tracking-tight placeholder:text-neutral-300 focus:outline-none focus:ring-0 sm:text-5xl dark:placeholder:text-neutral-700 [field-sizing:content]"
						/>
						<textarea
							value={version.excerpt}
							onChange={(e) => update({ excerpt: e.target.value })}
							placeholder="Short summary: shown on blog cards and in Google"
							rows={1}
							className="mt-3 w-full resize-none overflow-hidden border-0 bg-transparent p-0 text-xl text-neutral-500 placeholder:text-neutral-300 focus:outline-none focus:ring-0 dark:placeholder:text-neutral-700 [field-sizing:content]"
						/>
						<hr className="my-8 border-neutral-200 dark:border-neutral-800" />

						{/* The article */}
						{/* HTML mode only hides the visual editor: its menus must stay mounted */}
						{htmlMode && (
							<textarea value={html} onChange={(e) => { setHtml(e.target.value); setDirty(true) }} spellCheck={false}
								className="min-h-[60vh] w-full rounded-2xl border-0 bg-neutral-950 p-5 font-mono text-[13px] leading-relaxed text-neutral-100 focus:ring-2 focus:ring-brand-500" />
						)}
						<div className={htmlMode ? 'hidden' : ''}>
								{editor && (
									<BubbleMenu editor={editor} tippyOptions={{ duration: 120, maxWidth: 'none' }}
										shouldShow={({ editor, from, to }) => from !== to && !editor.isActive('image') && !editor.isActive('youtube')}>
										<div className="flex items-center gap-0.5 rounded-xl border border-neutral-200 bg-white p-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
											<ToolButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></ToolButton>
											<ToolButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolButton>
											<ToolButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></ToolButton>
											<ToolButton title="Highlight" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter className="h-4 w-4" /></ToolButton>
											<Divider />
											<ToolButton title="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolButton>
											<ToolButton title="Subheading" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></ToolButton>
											<ToolButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolButton>
											<Divider />
											<InputPopover icon={<Link2 className="h-4 w-4" />} title="Link" placeholder="https://… or /en-US/…" active={editor.isActive('link')}
												initial={editor.getAttributes('link').href ?? ''}
												onApply={(href) => (href ? editor.chain().focus().extendMarkRange('link').setLink({ href }).run() : editor.chain().focus().unsetLink().run())}
												onRemove={editor.isActive('link') ? () => editor.chain().focus().unsetLink().run() : undefined} />
											{editor.isActive('link') && (
												<ToolButton title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}><Link2Off className="h-4 w-4" /></ToolButton>
											)}
										</div>
									</BubbleMenu>
								)}
								{editor && (
									<BubbleMenu editor={editor} pluginKey="imageMenu" tippyOptions={{ duration: 120, maxWidth: 'none' }} shouldShow={({ editor }) => editor.isActive('image')}>
										<div className="flex items-center gap-0.5 rounded-xl border border-neutral-200 bg-white p-1 shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
											<InputPopover icon={<span className="px-1 text-xs font-semibold">ALT</span>} title="Alt text (describe the photo, for Google and screen readers)" placeholder="e.g. Camels on the Erg Chebbi dunes at sunset"
												initial={editor.getAttributes('image').alt ?? ''} onApply={(alt) => editor.chain().focus().updateAttributes('image', { alt }).run()} />
											<ToolButton title="Replace photo" onClick={async () => { const f = await pickFile(); const url = f && (await upload(f)); if (url) editor.chain().focus().updateAttributes('image', { src: url }).run() }}><ImagePlus className="h-4 w-4" /></ToolButton>
											<ToolButton title="Use as cover" onClick={() => { setCover(editor.getAttributes('image').src); setCoverDirty(true); setDirty(true) }}><span className="px-1 text-xs font-semibold">Cover</span></ToolButton>
											<ToolButton title="Delete photo" onClick={() => editor.chain().focus().deleteSelection().run()}><X className="h-4 w-4" /></ToolButton>
										</div>
									</BubbleMenu>
								)}
								{editor && (
									<FloatingMenu editor={editor} tippyOptions={{ duration: 120, placement: 'left' }}>
										<div className="-ml-2 flex items-center gap-0.5 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
											<Plus className="mx-1 h-4 w-4 text-neutral-400" />
											<ToolButton title="Heading" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolButton>
											<ToolButton title="Bulleted list" onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></ToolButton>
											<ToolButton title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolButton>
											<ToolButton title="Upload photo" onClick={async () => { const f = await pickFile(); if (f) void insertImages([f]) }}><ImagePlus className="h-4 w-4" /></ToolButton>
											<ToolButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></ToolButton>
										</div>
									</FloatingMenu>
								)}
								<EditorContent editor={editor} />
						</div>
					</article>
				</main>

				{/* Sidebar */}
				<aside className="space-y-4 pt-8 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
					<SidebarCard title="Languages" icon={<Globe className="h-3.5 w-3.5" />}>
						<div className="grid grid-cols-2 gap-1.5">
							{LANGUAGES.map(([code, name]) => (
								<button key={code} type="button" disabled={!postId && code !== SOURCE} onClick={() => switchLang(code)}
									className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition disabled:opacity-40 ${code === lang ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}>
									<span className={`h-2 w-2 shrink-0 rounded-full ${translated(code) ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
									<span className="truncate">{name}</span>
								</button>
							))}
						</div>
						<p className="mt-3 text-xs text-neutral-500">
							{postId ? 'Green = has a version. Each language gets its own address from its title.' : 'Publish in English first, then add other languages.'}
						</p>
					</SidebarCard>

					<SidebarCard title="Tags" icon={<Tag className="h-3.5 w-3.5" />}>
						<div className="flex flex-wrap gap-1.5">
							{version.tags.map((tag) => (
								<span key={tag} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 py-1 pl-2.5 pr-1 text-xs font-medium dark:bg-neutral-900">
									{tag}
									<button type="button" onClick={() => update({ tags: version.tags.filter((t) => t !== tag) })} className="grid h-4 w-4 place-items-center rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700" aria-label={`Remove ${tag}`}><X className="h-3 w-3" /></button>
								</span>
							))}
						</div>
						<input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add a tag and press Enter"
							onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput) } }} onBlur={() => addTag(tagInput)}
							className="mt-2 w-full rounded-xl border-0 bg-neutral-100 px-3 py-2 text-sm focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900" />
					</SidebarCard>

					<SidebarCard title="Google preview" icon={<ExternalLink className="h-3.5 w-3.5" />}>
						<div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
							<p className="truncate text-xs text-neutral-500">travsus.com › {lang} › blog › {slug}</p>
							<p className="mt-1 line-clamp-2 text-[17px] leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">{version.title || 'Title'} | TRAVSUS</p>
							<p className="mt-1 line-clamp-2 text-[13px] leading-snug text-neutral-600 dark:text-neutral-400">{version.excerpt || plain(version.content).slice(0, 160) || 'Summary'}</p>
						</div>
						<div className="mt-3 space-y-1 text-xs">
							<p className={version.title.length > TITLE_MAX ? 'text-amber-600' : 'text-neutral-500'}>Title: {version.title.length}/{TITLE_MAX} characters</p>
							<p className={version.excerpt.length > SUMMARY_MAX || !version.excerpt ? 'text-amber-600' : 'text-neutral-500'}>
								Summary: {version.excerpt.length}/{SUMMARY_MAX} characters{!version.excerpt && ' (missing)'}
							</p>
						</div>
					</SidebarCard>

					<SidebarCard title="Article health" icon={<Check className="h-3.5 w-3.5" />}>
						<dl className="grid grid-cols-2 gap-2 text-sm">
							{([['Words', stats.words.toLocaleString()], ['Reading', `${stats.minutes} min`], ['Headings', stats.headings], ['Links', stats.links], ['Photos', stats.images], ['Cover', cover ? 'Yes' : 'No']] as [string, ReactNode][]).map(([label, value]) => (
								<div key={label} className="rounded-xl bg-neutral-50 px-3 py-2 dark:bg-neutral-900">
									<dt className="text-xs text-neutral-500">{label}</dt>
									<dd className="font-semibold">{value}</dd>
								</div>
							))}
						</dl>
						<ul className="mt-3 space-y-1 text-xs text-amber-600">
							{stats.words > 0 && stats.words < 300 && <li>Short article: aim for 600+ words.</li>}
							{stats.words > 300 && stats.headings === 0 && <li>Add headings to break up the text.</li>}
							{stats.noAlt > 0 && <li>{stats.noAlt} photo(s) without alt text: click a photo, then ALT.</li>}
							{!cover && <li>No cover photo: the first photo in the text is used.</li>}
						</ul>
					</SidebarCard>

					{post && (
						<details className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
							<summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-neutral-500">Advanced: raw translations (JSON)</summary>
							<div className="mt-3 text-sm"><BlogJsonEditorPage blogPost={post} /></div>
						</details>
					)}
				</aside>
			</div>

			<style jsx global>{`
				.ProseMirror p.is-empty::before,
				.ProseMirror h2.is-empty::before,
				.ProseMirror h3.is-empty::before {
					content: attr(data-placeholder);
					float: left;
					height: 0;
					color: #a3a3a3;
					pointer-events: none;
				}
				.ProseMirror img.ProseMirror-selectednode,
				.ProseMirror div[data-youtube-video].ProseMirror-selectednode iframe {
					outline: 3px solid #f59e0b;
					outline-offset: 2px;
				}
				.ProseMirror iframe {
					width: 100%;
					height: auto;
					aspect-ratio: 16 / 9;
					border-radius: 1rem;
				}
				.ProseMirror mark {
					background: #fde68a;
					border-radius: 0.2em;
					padding: 0 0.1em;
				}
			`}</style>
		</div>
	)
}
