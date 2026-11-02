'use client'
// Password vault, encrypted in this browser. A random vault key encrypts the
// whole vault (AES-GCM); that key is itself locked twice, with the unlock code
// and with a recovery key (each through PBKDF2-SHA256, 600,000 rounds, random
// salt). The server and the database only see scrambled data.
//
// The recovery key is made here and emailed to the owner (the server sends it
// once and never stores it). Forgot the code → "Forgot code?", paste the key
// from the email, choose a new code; a new recovery key is emailed and the old
// one stops working. Lose both the code and that email = the vault is lost.
//
// One 40-character code opens everything, with every password shown. The
// vault locks by itself after 5 minutes without activity, and when the tab is
// closed.
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Check, Copy, Eye, EyeOff, ExternalLink, KeyRound, Loader2, Lock, Mail, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2, X } from 'lucide-react'

type Entry = { id: string; label: string; username: string; password: string; notes: string; updatedAt: string }
type Project = { id: string; name: string; url: string; entries: Entry[] }
type Vault = { projects: Project[] }
/** The vault key, locked with a secret (the unlock code or the recovery key) */
type Wrapped = { kdf: 'PBKDF2-SHA256'; iterations: number; salt: string; iv: string; key: string }
/** The row as stored. format 2: vault key wrapped twice; older rows: encrypted straight with the code. */
type Stored = { format?: number; iv: string; data: string; code?: Wrapped; recovery?: Wrapped; salt?: string; iterations?: number; version: number }
type Reason = 'created' | 'changed' | 'reset' | 'new'
type Phase = 'loading' | 'setup' | 'locked' | 'forgot' | 'open' | 'error'
type Notice = { kind: 'emailed' } | { kind: 'show'; key: string } | null

const ITERATIONS = 600_000
const CODE_LENGTH = 40
const IDLE_MS = 5 * 60_000
const CLIPBOARD_MS = 30_000

// ---- Crypto (Web Crypto, in the browser) ----
const enc = new TextEncoder()
const dec = new TextDecoder()
type Bytes = Uint8Array<ArrayBuffer>
const toB64 = (bytes: Uint8Array) => btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''))
const fromB64 = (text: string): Bytes => Uint8Array.from(atob(text), (c) => c.charCodeAt(0))
const random = (n: number): Bytes => crypto.getRandomValues(new Uint8Array(n))

async function deriveKey(secret: string, salt: Bytes, iterations: number) {
	const base = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey'])
	return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}
const newVaultKey = () => crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
async function wrap(vaultKey: CryptoKey, secret: string): Promise<Wrapped> {
	const salt = random(16)
	const iv = random(12)
	const raw = await crypto.subtle.exportKey('raw', vaultKey)
	const key = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await deriveKey(secret, salt, ITERATIONS), raw))
	return { kdf: 'PBKDF2-SHA256', iterations: ITERATIONS, salt: toB64(salt), iv: toB64(iv), key: toB64(key) }
}
/** Throws when the secret is wrong */
async function unwrap(w: Wrapped, secret: string) {
	const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(w.iv) }, await deriveKey(secret, fromB64(w.salt), w.iterations), fromB64(w.key))
	return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt'])
}
async function encryptVault(vault: Vault, key: CryptoKey) {
	const iv = random(12)
	const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(vault))))
	return { iv: toB64(iv), data: toB64(data) }
}
async function decryptVault(row: { iv: string; data: string }, key: CryptoKey): Promise<Vault> {
	const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(row.iv) }, key, fromB64(row.data))
	const vault = JSON.parse(dec.decode(plain))
	return { projects: vault.projects ?? [] }
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
/** 40 characters: about 200 bits, far beyond guessing (codes and recovery keys) */
const newCode = () => pick(CODE_ALPHABET, CODE_LENGTH)
const newPassword = () => pick('ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?-_=+', 24)
const uid = () => toB64(random(9)).replace(/[+/=]/g, '')
/** Recovery keys are typed or pasted: spaces and dashes don't matter, nor lower case */
const cleanKey = (text: string) => text.toUpperCase().replace(/[^A-Z0-9]/g, '')

const card = 'rounded-3xl border border-neutral-200 bg-white p-5 sm:p-6 dark:border-neutral-800 dark:bg-neutral-950'
const inputCls = 'h-11 w-full rounded-xl border-0 bg-white px-3.5 text-sm ring-1 ring-neutral-200 transition placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-950 dark:bg-neutral-900 dark:ring-neutral-700 dark:focus:ring-white'
const btn = 'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:opacity-50'
const btnDark = `${btn} bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950`
const btnLight = `${btn} border border-neutral-300 hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white`
const iconBtn = 'grid h-9 w-9 shrink-0 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white'

/** Each wrong try waits a little longer */
const backoff = (fails: number) => new Promise((r) => setTimeout(r, Math.min(30_000, 1000 * 2 ** (fails - 1))))

export default function VaultPanel() {
	const [phase, setPhase] = useState<Phase>('loading')
	const [error, setError] = useState('')
	const [vault, setVault] = useState<Vault>({ projects: [] })
	const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
	const [query, setQuery] = useState('')
	const [notice, setNotice] = useState<Notice>(null)
	// Unlocked session, in memory only: the vault key and its two locked copies
	const session = useRef<{ key: CryptoKey; code: Wrapped; recovery: Wrapped; version: number } | null>(null)
	const stored = useRef<Stored | null>(null)

	const load = useCallback(async () => {
		setPhase('loading')
		try {
			const res = await fetch('/api/admin/vault', { cache: 'no-store' })
			if (!res.ok) throw new Error()
			const { vault: row } = await res.json()
			stored.current = row
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
		setNotice(null)
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

	/**
	 * Encrypts and saves the vault. With `recoveryKey`, that new key replaces the
	 * old one and is emailed to the owner. Returns false when not saved.
	 */
	async function put(next: Vault, s: { key: CryptoKey; code: Wrapped; recovery: Wrapped; version: number }, recoveryKey?: string, reason?: Reason) {
		const body = { format: 2, ...(await encryptVault(next, s.key)), code: s.code, recovery: s.recovery, version: s.version, emailRecoveryKey: recoveryKey, reason }
		const res = await fetch('/api/admin/vault', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
		const data = await res.json().catch(() => ({}))
		if (res.status === 409) throw new Error('The vault was changed in another tab. Lock and unlock to get the latest version (your last change was not saved).')
		if (!res.ok) throw new Error('Not saved. Check your connection and try again.')
		s.version = data.version
		session.current = s
		stored.current = { format: 2, iv: body.iv, data: body.data, code: s.code, recovery: s.recovery, version: data.version }
		// The email didn't go out: show the key once instead, so it isn't lost
		if (recoveryKey) setNotice(data.emailed ? { kind: 'emailed' } : { kind: 'show', key: recoveryKey })
	}

	/** New recovery key for this session's vault key (emailed), optionally a new code too */
	async function rekey(next: Vault, key: CryptoKey, version: number, reason: Reason, code?: string) {
		const recoveryKey = newCode()
		const current = session.current
		const s = {
			key,
			code: code ? await wrap(key, code) : current!.code,
			recovery: await wrap(key, recoveryKey),
			version,
		}
		await put(next, s, recoveryKey, reason)
	}

	async function save(next: Vault) {
		const s = session.current
		if (!s) return lock()
		setVault(next)
		setSaving('saving')
		try {
			await put(next, s)
			setError('')
			setSaving('saved')
		} catch (err: any) {
			setError(err?.message || 'Not saved.')
			setSaving('failed')
		}
	}

	const opened = (next: Vault) => {
		setVault(next)
		setSaving('idle')
		setError('')
		setPhase('open')
	}

	if (phase === 'loading') return <Shell><p className="flex items-center gap-2 text-neutral-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p></Shell>
	if (phase === 'error') return <Shell><p className="text-red-500">{error}</p></Shell>

	if (phase === 'setup')
		return (
			<Shell>
				<Setup
					onCreate={async (code) => {
						const key = await newVaultKey()
						const empty: Vault = { projects: [] }
						session.current = null
						await rekey(empty, key, 0, 'created', code).catch((err) => {
							throw new Error(err?.message || 'Could not create the vault.')
						})
						opened(empty)
					}}
				/>
			</Shell>
		)

	if (phase === 'locked')
		return (
			<Shell>
				<Unlock
					onForgot={stored.current?.recovery ? () => setPhase('forgot') : undefined}
					onUnlock={async (code) => {
						const row = stored.current!
						if (row.recovery && row.code) {
							const key = await unwrap(row.code, code) // throws on a wrong code
							const next = await decryptVault(row, key)
							session.current = { key, code: row.code, recovery: row.recovery, version: row.version }
							return opened(next)
						}
						// Older vault, encrypted straight with the code: move it to a vault
						// key with a recovery key (emailed)
						const next = await decryptVault(row, await deriveKey(code, fromB64(row.salt!), row.iterations!))
						session.current = null
						await rekey(next, await newVaultKey(), row.version, 'created', code)
						opened(next)
					}}
				/>
			</Shell>
		)

	if (phase === 'forgot')
		return (
			<Shell>
				<Forgot
					onCancel={() => setPhase('locked')}
					onReset={async (recoveryKey, code) => {
						const row = stored.current!
						const key = await unwrap(row.recovery!, recoveryKey) // throws on a wrong key
						const next = await decryptVault(row, key)
						session.current = null
						await rekey(next, key, row.version, 'reset', code)
						opened(next)
					}}
				/>
			</Shell>
		)

	return (
		<Shell>
			{notice && <RecoveryNotice notice={notice} onClose={() => setNotice(null)} />}
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
					await rekey(vault, s.key, s.version, 'changed', code)
				}}
				onNewRecoveryKey={async () => {
					const s = session.current
					if (!s) return lock()
					await rekey(vault, s.key, s.version, 'new')
				}}
			/>
		</Shell>
	)
}

/** After a new recovery key: emailed, or (email failed) shown once */
function RecoveryNotice({ notice, onClose }: { notice: NonNullable<Notice>; onClose: () => void }) {
	const [copied, setCopied] = useState(false)
	return (
		<div className={`mb-5 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${notice.kind === 'emailed' ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'}`}>
			<Mail className="mt-0.5 h-4 w-4 shrink-0" />
			<div className="min-w-0 flex-1">
				{notice.kind === 'emailed' ? (
					<p>A new recovery key was emailed to skendoulmohamed@gmail.com. Keep that email: if you forget your code, it lets you set a new one. Older recovery keys no longer work.</p>
				) : (
					<>
						<p className="font-semibold">The recovery key email could not be sent. Save this key now, it won’t be shown again:</p>
						<p className="mt-2 break-all font-mono text-base font-bold tracking-wider">{notice.key}</p>
						<button className="mt-2 inline-flex items-center gap-1.5 font-semibold underline" onClick={async () => { await copySecret(notice.key).catch(() => {}); setCopied(true) }}>
							{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
						</button>
					</>
				)}
			</div>
			<button className={iconBtn} aria-label="Close" onClick={onClose}><X className="h-4 w-4" /></button>
		</div>
	)
}

/** Forgot the code: the recovery key from the email, then a new code */
function Forgot({ onReset, onCancel }: { onReset: (recoveryKey: string, code: string) => Promise<void>; onCancel: () => void }) {
	const [key, setKey] = useState('')
	const [code, setCode] = useState('')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const [fails, setFails] = useState(0)
	const ready = cleanKey(key).length === CODE_LENGTH && code.trim().length === CODE_LENGTH

	async function submit(e: FormEvent) {
		e.preventDefault()
		if (!ready) return
		setBusy(true)
		setError('')
		try {
			await onReset(cleanKey(key), code.trim())
		} catch (err: any) {
			const n = fails + 1
			setFails(n)
			await backoff(n)
			setError(err instanceof DOMException || !err?.message ? 'Wrong recovery key. Use the one from the latest “recovery key” email.' : err.message)
			setBusy(false)
		}
	}

	return (
		<form onSubmit={submit} className={`${card} space-y-4`}>
			<h2 className="text-xl font-bold">Forgot your code?</h2>
			<p className="text-sm text-neutral-500">
				Open the latest email “Your TRAVSUS Passwords recovery key” in skendoulmohamed@gmail.com, paste the key here and choose a new unlock code. A new recovery key will be emailed.
			</p>
			<input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Recovery key from the email" autoComplete="off" spellCheck={false} autoFocus className={`${inputCls} font-mono`} />
			<div className="flex flex-col gap-2 sm:flex-row">
				<input value={code} onChange={(e) => setCode(e.target.value)} maxLength={CODE_LENGTH} placeholder="New unlock code (40 characters)" autoComplete="off" spellCheck={false} className={`${inputCls} font-mono`} />
				<button type="button" className={btnLight} onClick={() => setCode(newCode())}><RefreshCw className="h-4 w-4" /> Generate</button>
			</div>
			<p className="text-xs text-neutral-500">{code.trim().length} / {CODE_LENGTH} characters. Write the new code down before you continue.</p>
			{error && <p className="text-sm text-red-500">{error}</p>}
			<div className="flex gap-2">
				<button disabled={busy || !ready} className={btnDark}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Set new code</button>
				<button type="button" className={btnLight} onClick={onCancel}>Back</button>
			</div>
		</form>
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
				Encrypted in your browser. The server only keeps scrambled data: without your unlock code (or the recovery key we email you) nobody can read it, not even us.
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
				Write it on paper or keep it in a safe place, not in this vault. A <strong className="text-neutral-950 dark:text-white">recovery key</strong> will be emailed to skendoulmohamed@gmail.com: keep that email, it lets you set a new code if you forget this one.
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
				I saved this code somewhere safe.
			</label>
			{error && <p className="text-sm text-red-500">{error}</p>}
			<button type="submit" disabled={busy || tooShort || !!mismatch || !confirm || !savedIt} className={btnDark}>
				{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Create the vault
			</button>
		</form>
	)
}

/** Enter the unlock code */
function Unlock({ onUnlock, onForgot }: { onUnlock: (code: string) => Promise<void>; onForgot?: () => void }) {
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
		} catch (err: any) {
			const n = fails + 1
			setFails(n)
			await backoff(n)
			// A wrong code fails to decrypt (DOMException); other errors are saving problems
			setError(err instanceof DOMException || !err?.message ? 'Wrong code.' : err.message)
			setBusy(false)
		}
	}

	return (
		<form onSubmit={submit} className={`${card} space-y-4`}>
			<h2 className="text-xl font-bold">Locked</h2>
			<input value={code} onChange={(e) => setCode(e.target.value)} type="password" placeholder="Your 40-character unlock code" autoComplete="off" autoFocus spellCheck={false} className={`${inputCls} h-12 font-mono`} />
			{error && <p className="text-sm text-red-500">{error}</p>}
			<div className="flex flex-wrap items-center gap-4">
				<button type="submit" disabled={busy || !code} className={btnDark}>
					{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Unlock
				</button>
				{onForgot && (
					<button type="button" className="text-sm font-semibold text-neutral-500 underline underline-offset-2 hover:text-neutral-950 dark:hover:text-white" onClick={onForgot}>
						Forgot code?
					</button>
				)}
			</div>
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
	vault, query, setQuery, saving, error, onSave, onLock, onChangeCode, onNewRecoveryKey,
}: {
	vault: Vault
	query: string
	setQuery: (q: string) => void
	saving: 'idle' | 'saving' | 'saved' | 'failed'
	error: string
	onSave: (v: Vault) => Promise<void>
	onLock: () => void
	onChangeCode: (code: string) => Promise<void>
	onNewRecoveryKey: () => Promise<void>
}) {
	const [mailing, setMailing] = useState(false)
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
				<button className={btnDark} onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add</button>
				<button className={btnLight} onClick={() => setShowAll((v) => !v)}>{showAll ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {showAll ? 'Hide all' : 'Show all'}</button>
				<button className={btnLight} onClick={onLock}><Lock className="h-4 w-4" /> Lock</button>
			</div>
			<p className="text-xs text-neutral-500" aria-live="polite">
				{saving === 'saving' ? 'Saving…' : saving === 'saved' ? 'Saved, encrypted.' : ''} Locks by itself after 5 minutes without activity.{' '}
				<button className="underline underline-offset-2" onClick={() => setChanging((v) => !v)}>Change unlock code</button>
				{' · '}
				<button
					className="underline underline-offset-2 disabled:opacity-50"
					disabled={mailing}
					onClick={async () => {
						setMailing(true)
						await onNewRecoveryKey().catch(() => {})
						setMailing(false)
					}}
				>
					{mailing ? 'Sending…' : 'Email me a new recovery key'}
				</button>
			</p>
			{error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">{error}</p>}
			{changing && <ChangeCode onDone={() => setChanging(false)} onChange={onChangeCode} />}

			{adding && (
				<QuickAdd
					onCancel={() => setAdding(false)}
					onSubmit={async ({ name, url, entry }) => {
						setAdding(false)
						// Same website name: added to that card
						const same = vault.projects.find((p) => p.name.toLowerCase() === name.toLowerCase())
						await onSave({
							projects: same
								? vault.projects.map((p) => (p.id === same.id ? { ...p, url: p.url || url, entries: [...p.entries, entry] } : p))
								: [...vault.projects, { id: uid(), name, url, entries: [entry] }],
						})
					}}
				/>
			)}

			{!projects.length && !adding && (
				<div className={`${card} text-center text-sm text-neutral-500`}>{q ? 'Nothing matches your search.' : 'No projects yet. Press “Add” to save your first email and password, for example under travsus.com.'}</div>
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

/** Website name, email or username and password in one form (address and notes optional) */
function QuickAdd({ onSubmit, onCancel }: { onSubmit: (v: { name: string; url: string; entry: Entry }) => void; onCancel: () => void }) {
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [username, setUsername] = useState('')
	const [url, setUrl] = useState('')
	const [notes, setNotes] = useState('')
	const [more, setMore] = useState(false)
	const ready = name.trim() && username.trim() && password
	return (
		<form
			className={`${card} space-y-3`}
			onSubmit={(e) => {
				e.preventDefault()
				if (!ready) return
				onSubmit({
					name: name.trim(),
					url: url.trim(),
					entry: { id: uid(), label: '', username: username.trim(), password, notes: notes.trim(), updatedAt: new Date().toISOString() },
				})
			}}
		>
			<div className="grid gap-2 sm:grid-cols-3">
				<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project or website (e.g. travsus.com)" autoFocus className={inputCls} />
				<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email or username" autoComplete="off" className={inputCls} />
				<div className="flex gap-2">
					<input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="new-password" spellCheck={false} className={`${inputCls} font-mono`} />
					<button type="button" className={iconBtn} title="Generate a strong password" aria-label="Generate a strong password" onClick={() => setPassword(newPassword())}><RefreshCw className="h-4 w-4" /></button>
				</div>
			</div>
			{more ? (
				<div className="grid gap-2">
					<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Address (optional, e.g. vercel.com)" className={inputCls} />
					<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" rows={2} className={`${inputCls} h-auto py-2.5`} />
				</div>
			) : (
				<button type="button" className="text-sm font-semibold text-neutral-500 underline underline-offset-2 hover:text-neutral-950 dark:hover:text-white" onClick={() => setMore(true)}>
					+ Address or notes
				</button>
			)}
			<div className="flex gap-2">
				<button disabled={!ready} className={btnDark}><Check className="h-4 w-4" /> Save</button>
				<button type="button" className={btnLight} onClick={onCancel}>Cancel</button>
			</div>
		</form>
	)
}

function ChangeCode({ onChange, onDone }: { onChange: (code: string) => Promise<void>; onDone: () => void }) {
	const [code, setCode] = useState('')
	const [confirm, setConfirm] = useState('')
	const [busy, setBusy] = useState(false)
	const [error, setError] = useState('')
	const ok = code.trim().length === CODE_LENGTH && confirm.trim() === code.trim()
	return (
		<form
			className={`${card} space-y-3`}
			onSubmit={async (e) => {
				e.preventDefault()
				if (!ok) return
				setBusy(true)
				setError('')
				try {
					await onChange(code.trim())
					onDone()
				} catch (err: any) {
					setError(err?.message || 'Not changed. Try again.')
					setBusy(false)
				}
			}}
		>
			<p className="text-sm font-semibold">New unlock code (the old one stops working; a new recovery key is emailed)</p>
			<div className="flex flex-col gap-2 sm:flex-row">
				<input value={code} onChange={(e) => setCode(e.target.value)} maxLength={CODE_LENGTH} placeholder={`Exactly ${CODE_LENGTH} characters`} autoComplete="off" spellCheck={false} className={`${inputCls} font-mono`} />
				<button type="button" className={btnLight} onClick={() => setCode(newCode())}><RefreshCw className="h-4 w-4" /> Generate</button>
			</div>
			<input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Type it again" autoComplete="off" className={`${inputCls} font-mono`} />
			{error && <p className="text-sm text-red-500">{error}</p>}
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
					<button className={iconBtn} title="Add an email and password" aria-label="Add an email and password" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /></button>
					<button className={iconBtn} title="Edit project" aria-label="Edit project" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" /></button>
					<button className={iconBtn} title="Delete project" aria-label="Delete project" onClick={onDelete}><Trash2 className="h-4 w-4" /></button>
				</div>
			</div>

			<ul className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
				{project.entries.map((entry) => (
					<EntryRow key={entry.id} entry={entry} showAll={showAll} onSave={onSaveEntry} onDelete={() => confirm(`Delete “${entry.label || entry.username}”?`) && onDeleteEntry(entry.id)} />
				))}
			</ul>
			{!project.entries.length && !adding && <p className="mt-2 text-sm text-neutral-500">No emails yet.</p>}
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
				<button className="flex max-w-full items-center gap-1.5 truncate text-sm font-semibold hover:underline" onClick={() => copy('user')} title="Copy email or username">
					<span className="truncate">{entry.username || '—'}</span>
					{entry.username && (copied === 'user' ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0 text-neutral-400" />)}
				</button>
				{entry.label && <p className="truncate text-xs text-neutral-500">{entry.label}</p>}
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
				if (!password || !username.trim()) return
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
				<button disabled={!password || !username.trim()} className={btnDark}><Check className="h-4 w-4" /> Save</button>
				<button type="button" className={btnLight} onClick={onCancel}><X className="h-4 w-4" /> Cancel</button>
			</div>
		</form>
	)
}
