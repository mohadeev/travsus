'use client'
// Password vault, encrypted in this browser. The unlock code never leaves the
// page: a key is made from it (PBKDF2-SHA256, 600,000 rounds, random salt) and
// the whole vault is encrypted with AES-GCM before it is saved. The server and
// the database only see scrambled data. Lost code = lost vault: nobody,
// including us, can open it without the code.
//
// Passwords are grouped by project (a website, an app...). The vault locks by
// itself after 5 minutes without activity, and when the tab is closed. One
// 40-character code opens everything, with every password shown.
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Check, Copy, Eye, EyeOff, ExternalLink, KeyRound, Loader2, Lock, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2, X } from 'lucide-react'

type Entry = { id: string; label: string; username: string; password: string; notes: string; updatedAt: string }
type Project = { id: string; name: string; url: string; entries: Entry[] }
type Vault = { projects: Project[] }
type Sealed = { kdf: 'PBKDF2-SHA256'; iterations: number; salt: string; iv: string; data: string; version: number }
type Phase = 'loading' | 'setup' | 'locked' | 'open' | 'error'

const ITERATIONS = 600_000
const CODE_LENGTH = 40
const IDLE_MS = 5 * 60_000
const CLIPBOARD_MS = 30_000

// ---- Crypto (Web Crypto, in the browser) ----
const enc = new TextEncoder()
const dec = new TextDecoder()
const toB64 = (bytes: Uint8Array) => btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''))
const fromB64 = (text: string): Bytes => Uint8Array.from(atob(text), (c) => c.charCodeAt(0))
type Bytes = Uint8Array<ArrayBuffer>
const random = (n: number): Bytes => crypto.getRandomValues(new Uint8Array(n))

async function deriveKey(code: string, salt: Bytes, iterations: number) {
	const base = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey'])
	return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}
async function seal(vault: Vault, key: CryptoKey, salt: Bytes, iterations: number, version: number): Promise<Sealed> {
	const iv = random(12)
	const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(vault))))
	return { kdf: 'PBKDF2-SHA256', iterations, salt: toB64(salt), iv: toB64(iv), data: toB64(data), version }
}
async function unseal(sealed: Sealed, key: CryptoKey): Promise<Vault> {
	const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(sealed.iv) }, key, fromB64(sealed.data))
	return JSON.parse(dec.decode(plain))
}

// ---- Generators ----
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O, 1/I
const pick = (alphabet: string, n: number) => {
	// Rejection sampling: every character equally likely
	const out: string[] = []
	const limit = 256 - (256 % alphabet.length)
	while (out.length < n) for (const b of Array.from(random(n * 2))) if (b < limit && out.length < n) out.push(alphabet[b % alphabet.length])
	return out.join('')
}
/** 40 characters: about 200 bits, far beyond guessing */
const newCode = () => pick(CODE_ALPHABET, CODE_LENGTH)
const newPassword = () => pick('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?-_=+', 24)
const uid = () => toB64(random(9)).replace(/[+/=]/g, '')

const card = 'rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-950'
const inputCls = 'h-11 w-full rounded-xl border-0 bg-white px-3.5 text-sm ring-1 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900 dark:ring-neutral-700 dark:focus:ring-white'
const btn = 'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:opacity-50'
const btnDark = `${btn} bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950`
const btnLight = `${btn} border border-neutral-300 hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white`
const iconBtn = 'grid h-9 w-9 shrink-0 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white'

export default function VaultPanel() {
	const [phase, setPhase] = useState<Phase>('loading')
	const [error, setError] = useState('')
	const [vault, setVault] = useState<Vault>({ projects: [] })
	const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
	const [query, setQuery] = useState('')
	// Unlocked session: key + salt + version stay in memory only
	const session = useRef<{ key: CryptoKey; salt: Bytes; iterations: number; version: number } | null>(null)
	const sealedRef = useRef<Sealed | null>(null)

	const load = useCallback(async () => {
		setPhase('loading')
		try {
			const res = await fetch('/api/admin/vault', { cache: 'no-store' })
			if (!res.ok) throw new Error()
			const { vault: row } = await res.json()
			sealedRef.current = row
			setPhase(row ? 'locked' : 'setup')
		} catch {
			setError('Could not reach the vault. Check that you are signed in, then reload.')
			setPhase('error')
		}
	}, [])
	useEffect(() => void load(), [load])

	const lock = useCallback(() => {
		session.current = null
		setVault({ projects: [] })
		setQuery('')
		void load()
	}, [load])

	// Lock after 5 minutes without activity
	useEffect(() => {
		if (phase !== 'open') return
		let timer = setTimeout(lock, IDLE_MS)
		const reset = () => {
			clearTimeout(timer)
			timer = setTimeout(lock, IDLE_MS)
		}
		const events = ['mousemove', 'keydown', 'pointerdown', 'scroll', 'touchstart']
		events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
		return () => {
			clearTimeout(timer)
			events.forEach((e) => window.removeEventListener(e, reset))
		}
	}, [phase, lock])

	/** Encrypts and saves the whole vault */
	async function save(next: Vault) {
		const s = session.current
		if (!s) return lock()
		setVault(next)
		setSaving('saving')
		try {
			const sealed = await seal(next, s.key, s.salt, s.iterations, s.version)
			const res = await fetch('/api/admin/vault', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sealed) })
			const data = await res.json().catch(() => ({}))
			if (res.status === 409) {
				setError('The vault was changed in another tab. Lock and unlock to get the latest version (your last change was not saved).')
				return setSaving('failed')
			}
			if (!res.ok) throw new Error()
			s.version = data.version
			sealedRef.current = { ...sealed, version: data.version }
			setError('')
			setSaving('saved')
		} catch {
			setError('Not saved. Check your connection and try again.')
			setSaving('failed')
		}
	}

	if (phase === 'loading') return <Shell><p className="flex items-center gap-2 text-neutral-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p></Shell>
	if (phase === 'error') return <Shell><p className="text-red-500">{error}</p></Shell>

	if (phase === 'setup')
		return (
			<Shell>
				<Setup
					onCreate={async (code) => {
						const salt = random(16)
						const key = await deriveKey(code, salt, ITERATIONS)
						const empty: Vault = { projects: [] }
						const sealed = await seal(empty, key, salt, ITERATIONS, 0)
						const res = await fetch('/api/admin/vault', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sealed) })
						if (!res.ok) throw new Error('Could not create the vault.')
						const { version } = await res.json()
						session.current = { key, salt, iterations: ITERATIONS, version }
						setVault(empty)
						setPhase('open')
					}}
				/>
			</Shell>
		)

	if (phase === 'locked')
		return (
			<Shell>
				<Unlock
					onUnlock={async (code) => {
						const sealed = sealedRef.current!
						const salt = fromB64(sealed.salt)
						const key = await deriveKey(code, salt, sealed.iterations)
						const opened = await unseal(sealed, key) // throws on a wrong code
						session.current = { key, salt, iterations: sealed.iterations, version: sealed.version }
						setVault({ projects: opened.projects ?? [] })
						setSaving('idle')
						setError('')
						setPhase('open')
					}}
				/>
			</Shell>
		)

	return (
		<Shell>
			<Open
				vault={vault}
				query={query}
				setQuery={setQuery}
				saving={saving}
				error={error}
				onSave={save}
				onLock={lock}
				onChangeCode={async (code) => {
					const s = session.current
					if (!s) return lock()
					const salt = random(16)
					session.current = { ...s, key: await deriveKey(code, salt, ITERATIONS), salt, iterations: ITERATIONS }
					await save(vault)
				}}
			/>
		</Shell>
	)
}

function Shell({ children }: { children: React.ReactNode }) {
	return (
		<main className="mx-auto max-w-4xl px-4 pb-24 pt-8 text-neutral-950 sm:px-5 sm:pt-12 dark:text-white">
			<h1 className="headline flex items-center gap-3 text-3xl sm:text-4xl">
				<KeyRound className="h-7 w-7" /> Passwords
			</h1>
			<p className="mt-2 flex items-start gap-2 text-sm text-neutral-500">
				<ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
				Encrypted in your browser with your unlock code. The server only keeps scrambled data: without the code nobody can read it, not even us.
			</p>
			<div className="mt-8">{children}</div>
		</main>
	)
}

/** First time: make the unlock code */
function Setup({ onCreate }: { onCreate: (code: string) => Promise<void> }) {
	const [code, setCode] = useState('')
	const [confirm, setConfirm] = useState('')
	const [savedIt, setSavedIt] = useState(false)
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const [copied, setCopied] = useState(false)
	const tooShort = code.trim().length !== CODE_LENGTH
	const mismatch = confirm && confirm.trim() !== code.trim()

	async function submit(e: FormEvent) {
		e.preventDefault()
		if (tooShort || mismatch || !savedIt) return
		setBusy(true)
		setError('')
		try {
			await onCreate(code.trim())
		} catch (err: any) {
			setError(err?.message || 'Could not create the vault.')
			setBusy(false)
		}
	}

	return (
		<form onSubmit={submit} className={`${card} space-y-4`}>
			<h2 className="text-xl font-bold">Create your unlock code</h2>
			<p className="text-sm text-neutral-500">
				You’ll need it every time you open this page. Use the generated one (strongest) or type your own: exactly {CODE_LENGTH} characters.{' '}
				<strong className="text-neutral-950 dark:text-white">If you lose it, the passwords can’t be recovered.</strong> Write it on paper or keep it in a safe place, not in this vault.
			</p>
			<div className="flex flex-col gap-2 sm:flex-row">
				<input value={code} onChange={(e) => setCode(e.target.value)} maxLength={CODE_LENGTH} placeholder="Unlock code (40 characters)" autoComplete="off" spellCheck={false} className={`${inputCls} font-mono`} />
				<button type="button" className={btnLight} onClick={() => { setCode(newCode()); setConfirm(''); setCopied(false) }}>
					<RefreshCw className="h-4 w-4" /> Generate
				</button>
				<button type="button" className={btnLight} disabled={!code} onClick={async () => { await navigator.clipboard.writeText(code).catch(() => {}); setCopied(true) }}>
					{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
				</button>
			</div>
			<p className={`text-xs ${code && tooShort ? 'text-red-500' : 'text-neutral-500'}`}>{code.trim().length} / {CODE_LENGTH} characters</p>
			<input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Type the code again" autoComplete="off" className={`${inputCls} font-mono`} />
			{mismatch && <p className="text-xs text-red-500">The two codes are different.</p>}
			<label className="flex items-start gap-2 text-sm">
				<input type="checkbox" checked={savedIt} onChange={(e) => setSavedIt(e.target.checked)} className="mt-0.5 rounded" />
				I saved this code somewhere safe. I understand that without it the vault can’t be opened.
			</label>
			{error && <p className="text-sm text-red-500">{error}</p>}
			<button type="submit" disabled={busy || tooShort || !!mismatch || !confirm || !savedIt} className={btnDark}>
				{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Create the vault
			</button>
		</form>
	)
}

/** Enter the unlock code */
function Unlock({ onUnlock }: { onUnlock: (code: string) => Promise<void> }) {
	const [code, setCode] = useState('')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const [fails, setFails] = useState(0)

	async function submit(e: FormEvent) {
		e.preventDefault()
		if (!code.trim()) return
		setBusy(true)
		setError('')
		try {
			await onUnlock(code.trim())
		} catch {
			// Each wrong try waits a little longer
			const n = fails + 1
			setFails(n)
			await new Promise((r) => setTimeout(r, Math.min(30_000, 1000 * 2 ** (n - 1))))
			setError('Wrong code.')
			setBusy(false)
		}
	}

	return (
		<form onSubmit={submit} className={`${card} space-y-4`}>
			<h2 className="text-xl font-bold">Locked</h2>
			<input value={code} onChange={(e) => setCode(e.target.value)} type="password" placeholder="Your 40-character unlock code" autoComplete="off" autoFocus spellCheck={false} className={`${inputCls} h-12 font-mono`} />
			{error && <p className="text-sm text-red-500">{error}</p>}
			<button type="submit" disabled={busy || !code} className={btnDark}>
				{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Unlock
			</button>
		</form>
	)
}

/** Copies, then empties the clipboard after 30 s if it still holds the same text */
async function copySecret(text: string) {
	await navigator.clipboard.writeText(text)
	setTimeout(async () => {
		try {
			if ((await navigator.clipboard.readText()) === text) await navigator.clipboard.writeText('')
		} catch {
			/* the browser didn't allow reading the clipboard */
		}
	}, CLIPBOARD_MS)
}

function Open({
	vault, query, setQuery, saving, error, onSave, onLock, onChangeCode,
}: {
	vault: Vault
	query: string
	setQuery: (q: string) => void
	saving: 'idle' | 'saving' | 'saved' | 'failed'
	error: string
	onSave: (v: Vault) => Promise<void>
	onLock: () => void
	onChangeCode: (code: string) => Promise<void>
}) {
	const [adding, setAdding] = useState(false)
	const [changing, setChanging] = useState(false)
	// Every password is shown once the vault is open
	const [showAll, setShowAll] = useState(true)
	const q = query.trim().toLowerCase()
	const projects = useMemo(() => {
		const sorted = [...vault.projects].sort((a, b) => a.name.localeCompare(b.name))
		if (!q) return sorted
		return sorted
			.map((p) => (`${p.name} ${p.url}`.toLowerCase().includes(q) ? p : { ...p, entries: p.entries.filter((e) => `${e.label} ${e.username} ${e.notes}`.toLowerCase().includes(q)) }))
			.filter((p) => `${p.name} ${p.url}`.toLowerCase().includes(q) || p.entries.length)
	}, [vault, q])
	const count = vault.projects.reduce((n, p) => n + p.entries.length, 0)

	const setProject = (id: string, change: (p: Project) => Project | null) =>
		onSave({ projects: vault.projects.flatMap((p) => (p.id === id ? [change(p)].filter(Boolean) as Project[] : [p])) })

	return (
		<div className="space-y-5">
			<div className="flex flex-wrap items-center gap-2">
				<label className="relative min-w-[200px] flex-1">
					<Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${count} password${count === 1 ? '' : 's'}`} className={`${inputCls} pl-10`} />
				</label>
				<button className={btnDark} onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add project</button>
				<button className={btnLight} onClick={() => setShowAll((v) => !v)}>{showAll ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {showAll ? 'Hide all' : 'Show all'}</button>
				<button className={btnLight} onClick={onLock}><Lock className="h-4 w-4" /> Lock</button>
			</div>
			<p className="text-xs text-neutral-500" aria-live="polite">
				{saving === 'saving' ? 'Saving…' : saving === 'saved' ? 'Saved, encrypted.' : ''} Locks by itself after 5 minutes without activity.{' '}
				<button className="underline underline-offset-2" onClick={() => setChanging((v) => !v)}>Change unlock code</button>
			</p>
			{error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}
			{changing && <ChangeCode onDone={() => setChanging(false)} onChange={onChangeCode} />}

			{adding && (
				<ProjectForm
					onCancel={() => setAdding(false)}
					onSubmit={async (name, url) => {
						setAdding(false)
						await onSave({ projects: [...vault.projects, { id: uid(), name, url, entries: [] }] })
					}}
				/>
			)}

			{!projects.length && !adding && (
				<div className={`${card} text-center text-sm text-neutral-500`}>{q ? 'Nothing matches your search.' : 'No projects yet. Add your first website or app.'}</div>
			)}

			{projects.map((project) => (
				<ProjectCard
					key={project.id}
					project={project}
					showAll={showAll}
					onRename={(name, url) => setProject(project.id, (p) => ({ ...p, name, url }))}
					onDelete={() => confirm(`Delete “${project.name}” and its ${project.entries.length} password(s)?`) && setProject(project.id, () => null)}
					onSaveEntry={(entry) =>
						setProject(project.id, (p) => ({
							...p,
							entries: p.entries.some((e) => e.id === entry.id) ? p.entries.map((e) => (e.id === entry.id ? entry : e)) : [...p.entries, entry],
						}))
					}
					onDeleteEntry={(id) => setProject(project.id, (p) => ({ ...p, entries: p.entries.filter((e) => e.id !== id) }))}
				/>
			))}
		</div>
	)
}

function ChangeCode({ onChange, onDone }: { onChange: (code: string) => Promise<void>; onDone: () => void }) {
	const [code, setCode] = useState('')
	const [confirm, setConfirm] = useState('')
	const [busy, setBusy] = useState(false)
	const ok = code.trim().length === CODE_LENGTH && confirm.trim() === code.trim()
	return (
		<form
			className={`${card} space-y-3`}
			onSubmit={async (e) => {
				e.preventDefault()
				if (!ok) return
				setBusy(true)
				await onChange(code.trim())
				onDone()
			}}
		>
			<p className="text-sm font-semibold">New unlock code (the old one stops working)</p>
			<div className="flex flex-col gap-2 sm:flex-row">
				<input value={code} onChange={(e) => setCode(e.target.value)} maxLength={CODE_LENGTH} placeholder={`Exactly ${CODE_LENGTH} characters`} autoComplete="off" spellCheck={false} className={`${inputCls} font-mono`} />
				<button type="button" className={btnLight} onClick={() => setCode(newCode())}><RefreshCw className="h-4 w-4" /> Generate</button>
			</div>
			<input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Type it again" autoComplete="off" className={`${inputCls} font-mono`} />
			<div className="flex gap-2">
				<button disabled={!ok || busy} className={btnDark}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Change code</button>
				<button type="button" className={btnLight} onClick={onDone}>Cancel</button>
			</div>
		</form>
	)
}

function ProjectForm({ initial, onSubmit, onCancel }: { initial?: { name: string; url: string }; onSubmit: (name: string, url: string) => void; onCancel: () => void }) {
	const [name, setName] = useState(initial?.name ?? '')
	const [url, setUrl] = useState(initial?.url ?? '')
	return (
		<form className={`${card} space-y-3`} onSubmit={(e) => { e.preventDefault(); if (name.trim()) onSubmit(name.trim(), url.trim()) }}>
			<div className="grid gap-2 sm:grid-cols-2">
				<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project or website (e.g. TRAVSUS)" autoFocus className={inputCls} />
				<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Address (optional, e.g. travsus.com)" className={inputCls} />
			</div>
			<div className="flex gap-2">
				<button disabled={!name.trim()} className={btnDark}><Check className="h-4 w-4" /> {initial ? 'Save' : 'Add project'}</button>
				<button type="button" className={btnLight} onClick={onCancel}>Cancel</button>
			</div>
		</form>
	)
}

function ProjectCard({
	project, showAll, onRename, onDelete, onSaveEntry, onDeleteEntry,
}: {
	project: Project
	showAll: boolean
	onRename: (name: string, url: string) => void
	onDelete: () => void
	onSaveEntry: (entry: Entry) => void
	onDeleteEntry: (id: string) => void
}) {
	const [editing, setEditing] = useState(false)
	const [adding, setAdding] = useState(false)
	const href = project.url ? (/^https?:\/\//i.test(project.url) ? project.url : `https://${project.url}`) : ''

	if (editing) return <ProjectForm initial={project} onCancel={() => setEditing(false)} onSubmit={(name, url) => { setEditing(false); onRename(name, url) }} />

	return (
		<section className={card}>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h2 className="truncate text-lg font-bold">{project.name}</h2>
					{href && (
						<a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:underline">
							{project.url} <ExternalLink className="h-3.5 w-3.5" />
						</a>
					)}
				</div>
				<div className="flex shrink-0 items-center">
					<button className={iconBtn} title="Add a password" aria-label="Add a password" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /></button>
					<button className={iconBtn} title="Edit project" aria-label="Edit project" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /></button>
					<button className={iconBtn} title="Delete project" aria-label="Delete project" onClick={onDelete}><Trash2 className="h-4 w-4" /></button>
				</div>
			</div>

			<ul className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
				{project.entries.map((entry) => (
					<EntryRow key={entry.id} entry={entry} showAll={showAll} onSave={onSaveEntry} onDelete={() => confirm(`Delete “${entry.label || entry.username}”?`) && onDeleteEntry(entry.id)} />
				))}
			</ul>
			{!project.entries.length && !adding && <p className="mt-2 text-sm text-neutral-500">No passwords yet.</p>}
			{adding && <EntryForm onCancel={() => setAdding(false)} onSubmit={(entry) => { setAdding(false); onSaveEntry(entry) }} />}
		</section>
	)
}

function EntryRow({ entry, showAll, onSave, onDelete }: { entry: Entry; showAll: boolean; onSave: (e: Entry) => void; onDelete: () => void }) {
	const [show, setShow] = useState(showAll)
	useEffect(() => setShow(showAll), [showAll])
	const [editing, setEditing] = useState(false)
	const [copied, setCopied] = useState<'user' | 'pass' | null>(null)

	const copy = async (what: 'user' | 'pass') => {
		await (what === 'pass' ? copySecret(entry.password) : navigator.clipboard.writeText(entry.username)).catch(() => {})
		setCopied(what)
		setTimeout(() => setCopied(null), 1500)
	}

	if (editing) return <li className="py-3"><EntryForm initial={entry} onCancel={() => setEditing(false)} onSubmit={(e) => { setEditing(false); onSave(e) }} /></li>

	return (
		<li className="grid gap-2 py-3 sm:grid-cols-[1fr_1.2fr_auto] sm:items-center sm:gap-4">
			<div className="min-w-0">
				<p className="truncate text-sm font-semibold">{entry.label || 'Login'}</p>
				<button className="flex max-w-full items-center gap-1.5 truncate text-sm text-neutral-500 hover:text-neutral-950 dark:hover:text-white" onClick={() => copy('user')} title="Copy username">
					<span className="truncate">{entry.username || '—'}</span>
					{entry.username && (copied === 'user' ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />)}
				</button>
			</div>
			<div className="flex min-w-0 items-center gap-1 rounded-xl bg-neutral-100 py-1 pl-3.5 pr-1 dark:bg-neutral-900">
				<code className="min-w-0 flex-1 truncate font-mono text-sm">{show ? entry.password : '•'.repeat(Math.min(16, Math.max(8, entry.password.length)))}</code>
				<button className={iconBtn} title={show ? 'Hide' : 'Show'} aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((v) => !v)}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
				<button className={iconBtn} title="Copy password (cleared after 30 s)" aria-label="Copy password" onClick={() => copy('pass')}>{copied === 'pass' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
			</div>
			<div className="flex items-center justify-end">
				<button className={iconBtn} title="Edit" aria-label="Edit" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /></button>
				<button className={iconBtn} title="Delete" aria-label="Delete" onClick={onDelete}><Trash2 className="h-4 w-4" /></button>
			</div>
			{entry.notes && <p className="whitespace-pre-wrap text-xs text-neutral-500 sm:col-span-3">{entry.notes}</p>}
		</li>
	)
}

function EntryForm({ initial, onSubmit, onCancel }: { initial?: Entry; onSubmit: (e: Entry) => void; onCancel: () => void }) {
	const [label, setLabel] = useState(initial?.label ?? '')
	const [username, setUsername] = useState(initial?.username ?? '')
	const [password, setPassword] = useState(initial?.password ?? '')
	const [notes, setNotes] = useState(initial?.notes ?? '')
	const [show, setShow] = useState(!initial)
	return (
		<form
			className="mt-3 space-y-2 rounded-2xl bg-neutral-50 p-3 sm:p-4 dark:bg-neutral-900/60"
			onSubmit={(e) => {
				e.preventDefault()
				if (!password && !username) return
				onSubmit({ id: initial?.id ?? uid(), label: label.trim(), username: username.trim(), password, notes: notes.trim(), updatedAt: new Date().toISOString() })
			}}
		>
			<div className="grid gap-2 sm:grid-cols-2">
				<input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="What is it? (e.g. Admin login, Database, Stripe)" className={inputCls} autoFocus />
				<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email or username" autoComplete="off" className={inputCls} />
			</div>
			<div className="flex gap-2">
				<input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? 'text' : 'password'} placeholder="Password" autoComplete="new-password" spellCheck={false} className={`${inputCls} font-mono`} />
				<button type="button" className={iconBtn} aria-label={show ? 'Hide' : 'Show'} onClick={() => setShow((v) => !v)}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
				<button type="button" className={`${btnLight} shrink-0 px-4`} onClick={() => { setPassword(newPassword()); setShow(true) }}><RefreshCw className="h-4 w-4" /> <span className="hidden sm:inline">Generate</span></button>
			</div>
			<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional: recovery codes, PIN, where it's used…)" rows={2} className={`${inputCls} h-auto py-2.5`} />
			<div className="flex gap-2">
				<button disabled={!password && !username} className={btnDark}><Check className="h-4 w-4" /> Save</button>
				<button type="button" className={btnLight} onClick={onCancel}><X className="h-4 w-4" /> Cancel</button>
			</div>
		</form>
	)
}
