// The tours, read from a JSON file on the server's disk instead of MongoDB.
//
// MongoDB stays the source of truth: every write still goes to MongoDB. The
// file is an exact copy of the `tours` collection, kept in step with it:
// - at start: the file is loaded (if there is one), then the whole collection
//   is read from MongoDB and the file rewritten;
// - every write made through src/lib/db.ts updates the copy before the write
//   returns, so a tour you just saved is read back as saved;
// - a MongoDB change stream applies every other change at once (scripts,
//   Atlas, another server), including deletes;
// - the whole collection is read again every 30 minutes, and after the change
//   stream drops, as a safety net.
//
// Reads (src/lib/db.ts → tourReadCollection) are answered from the copy with
// mingo, which runs MongoDB's own query language on in-memory objects, so
// filters, sorting, counts and joins behave exactly as they did in MongoDB.
// The file is held in memory while the server runs (reading and parsing ~10 MB
// on every query would be slow); it is the copy on disk that a restart starts
// from, and what you can open to see what the site serves.
//
// The file is MongoDB Extended JSON (EJSON, relaxed): plain JSON in which
// dates are { "$date": "..." }, so loading it back gives the same values
// MongoDB has (dates stay dates and compare as dates).
//
// Only in the Next.js server (the container). Off on the Cloudflare Worker
// build (no disk), on Vercel, during `next build`, in the scripts in
// scripts/db, or with TOURS_JSON=off: tours are then read from MongoDB as
// before. TOURS_JSON=on forces it on; TOURS_JSON_PATH moves the file
// (default: data/tours.json in the server's folder, /app/data in the image).
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { BSON, type ChangeStream, type ChangeStreamDocument, type Collection, type Document } from 'mongodb'
import { Aggregator, find } from 'mingo'

const { EJSON } = BSON

/** Full re-read of the collection, as a safety net next to the change stream. */
const FULL_SYNC_MS = 30 * 60 * 1000
/** Without a change stream (MongoDB not a replica set): read everything this often. */
const POLL_MS = 2 * 60 * 1000
/** After an error: try again this soon. */
const RETRY_MS = 15 * 1000
/** Writes to the file are grouped: one write per burst of changes. */
const FILE_WRITE_DELAY_MS = 300
/** A request waits this long at most for the first load before reading MongoDB instead. */
const FIRST_LOAD_WAIT_MS = 15 * 1000
/** At start, the file is used alone only if MongoDB hasn't answered within this time. */
const FILE_ONLY_AFTER_MS = 5 * 1000

export type TourStoreStatus = {
	enabled: boolean
	file: string | null
	tours: number | null
	/** Where the copy now comes from: the file at start, then MongoDB */
	loadedFrom: 'file' | 'mongodb' | null
	changeStream: 'open' | 'unsupported' | 'closed'
	lastFullSync: string | null
	lastChange: string | null
	lastFileWrite: string | null
	lastError: string | null
}

type State = {
	started: boolean
	getCollection: (() => Promise<Collection<Document>>) | null
	docs: Map<string, Document> | null
	list: Document[] | null
	loadedFrom: 'file' | 'mongodb' | null
	firstLoad: Promise<boolean> | null
	stream: ChangeStream | null
	streamState: 'open' | 'unsupported' | 'closed'
	syncing: Promise<void> | null
	fileTimer: ReturnType<typeof setTimeout> | null
	fileWrite: Promise<void>
	lastFullSync: number | null
	lastChange: number | null
	lastFileWrite: number | null
	lastError: string | null
}

// Kept on globalThis: Next.js can load this module more than once (server
// components, route handlers, instrumentation), and there must be one copy.
const shared = globalThis as unknown as { __travsusTourStore?: State }
const state: State = (shared.__travsusTourStore ??= {
	started: false,
	getCollection: null,
	docs: null,
	list: null,
	loadedFrom: null,
	firstLoad: null,
	stream: null,
	streamState: 'closed',
	syncing: null,
	fileTimer: null,
	fileWrite: Promise.resolve(),
	lastFullSync: null,
	lastChange: null,
	lastFileWrite: null,
	lastError: null,
})

export function tourStoreEnabled(): boolean {
	if (process.env.TOURS_JSON === 'off') return false
	if (process.env.NEXT_PHASE === 'phase-production-build') return false
	if (process.env.CLOUDFLARE_BUILD || process.env.VERCEL) return false
	if (process.env.TOURS_JSON === 'on') return true
	// Only inside the Next.js server: the scripts in scripts/db use src/lib/db.ts
	// too, and a change stream would keep them from exiting
	return process.env.NEXT_RUNTIME === 'nodejs'
}

export function tourFilePath(): string {
	// path.resolve: relative to the server's folder (process.cwd() can't appear
	// here: the Edge middleware bundle includes this file via src/lib/db.ts)
	return process.env.TOURS_JSON_PATH || path.resolve('data', 'tours.json')
}

const idOf = (doc: Document) => String(doc._id)
const errorText = (error: unknown) => (error instanceof Error ? error.message : String(error))

function fail(where: string, error: unknown) {
	state.lastError = `${new Date().toISOString()} ${where}: ${errorText(error)}`
	console.error(`Tour JSON store, ${where}:`, errorText(error))
}

/** Something changed: the cached list is rebuilt and the file rewritten. */
function changed() {
	state.list = null
	state.lastChange = Date.now()
	scheduleFileWrite()
}

// ---- The file ----

function scheduleFileWrite() {
	if (state.fileTimer) return
	state.fileTimer = setTimeout(() => {
		state.fileTimer = null
		state.fileWrite = state.fileWrite.then(writeTourFile, (error) => fail('file write', error))
	}, FILE_WRITE_DELAY_MS)
	state.fileTimer.unref?.()
}

async function writeTourFile() {
	if (!state.docs) return
	const file = tourFilePath()
	const docs = Array.from(state.docs.values()).sort((a, b) => (idOf(a) < idOf(b) ? -1 : idOf(a) > idOf(b) ? 1 : 0))
	try {
		await mkdir(path.dirname(file), { recursive: true })
		// Written next to it, then renamed: a reader never sees half a file
		const temporary = `${file}.${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}.tmp`
		await writeFile(temporary, EJSON.stringify(docs, { relaxed: true }))
		await rename(temporary, file)
		state.lastFileWrite = Date.now()
	} catch (error) {
		fail('file write', error)
	}
}

async function loadTourFile(): Promise<boolean> {
	try {
		const docs = EJSON.parse(await readFile(tourFilePath(), 'utf8'), { relaxed: true }) as Document[]
		if (!Array.isArray(docs)) throw new Error('not a list of tours')
		// MongoDB may have answered first: never replace a fresher copy
		if (state.loadedFrom !== 'mongodb') {
			state.docs = new Map(docs.map((doc) => [idOf(doc), doc]))
			state.list = null
			state.loadedFrom = 'file'
		}
		return true
	} catch (error: any) {
		if (error?.code !== 'ENOENT') fail('file read', error)
		return false
	}
}

// ---- MongoDB ----

/** Reads the whole collection again (one at a time). */
function fullSync(): Promise<void> {
	state.syncing ??= (async () => {
		try {
			const col = await state.getCollection!()
			const docs = await col.find({}).toArray()
			state.docs = new Map(docs.map((doc) => [idOf(doc), doc]))
			state.loadedFrom = 'mongodb'
			state.lastFullSync = Date.now()
			changed()
		} finally {
			state.syncing = null
		}
	})()
	return state.syncing
}

function applyChange(change: ChangeStreamDocument<Document>) {
	if (!state.docs) return
	switch (change.operationType) {
		case 'insert':
		case 'update':
		case 'replace': {
			const id = String(change.documentKey._id)
			// updateLookup: the tour as it is now (missing if deleted meanwhile)
			if (change.fullDocument) state.docs.set(id, change.fullDocument)
			else state.docs.delete(id)
			changed()
			return
		}
		case 'delete':
			state.docs.delete(String(change.documentKey._id))
			changed()
			return
		default:
			// drop, rename, invalidate...: start again from the collection
			closeStream()
			fullSync()
				.then(openStream)
				.catch((error) => fail('resync', error))
	}
}

function closeStream() {
	const stream = state.stream
	state.stream = null
	if (state.streamState === 'open') state.streamState = 'closed'
	stream?.close().catch(() => {})
}

/** MongoDB answers this when change streams are not available (a standalone server). */
const NO_CHANGE_STREAMS = /replica set|only supported on replica sets|\$changeStream/i

async function openStream() {
	if (state.stream || state.streamState === 'unsupported') return
	try {
		const col = await state.getCollection!()
		const stream = col.watch([], { fullDocument: 'updateLookup' })
		state.stream = stream
		state.streamState = 'open'
		stream.on('change', applyChange)
		stream.on('error', (error: any) => {
			if (state.stream !== stream) return
			closeStream()
			if (error?.code === 40573 || NO_CHANGE_STREAMS.test(errorText(error))) {
				state.streamState = 'unsupported'
				console.warn('Tour JSON store: MongoDB has no change streams here; reading every tour every 2 minutes instead')
				return
			}
			fail('change stream', error)
			// Changes may have been missed while it was down: read everything again
			retryLater(() => fullSync().then(openStream))
		})
	} catch (error) {
		fail('change stream', error)
		retryLater(() => fullSync().then(openStream))
	}
}

function retryLater(task: () => Promise<unknown>) {
	setTimeout(() => {
		task().catch((error) => {
			fail('retry', error)
			retryLater(task)
		})
	}, RETRY_MS).unref?.()
}

/**
 * Starts the copy (once per server). `getCollection` gives the MongoDB tours
 * collection; it comes from src/lib/db.ts so this file doesn't import it.
 */
export function startTourStore(getCollection: () => Promise<Collection<Document>>) {
	if (!tourStoreEnabled() || state.started) return
	state.started = true
	state.getCollection = getCollection

	// The change stream is opened before the full read, so nothing that
	// changes during the read is missed (applying a change twice is harmless).
	const fromMongo = openStream()
		.then(fullSync)
		.then(() => true)
	fromMongo.catch((error) => {
		fail('first load', error)
		retryLater(() => fullSync().then(openStream))
	})
	const fromFile = loadTourFile()
	const timeout = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms).unref?.())

	// Ready when MongoDB has answered; or, if MongoDB is slow or down, with
	// the file from the last run (FILE_ONLY_AFTER_MS later)
	state.firstLoad = Promise.race([
		fromMongo.catch(() => fromFile),
		// No file from an earlier run: keep waiting for MongoDB
		Promise.all([fromFile, timeout(FILE_ONLY_AFTER_MS)]).then(([found]) => found || fromMongo.catch(() => false)),
	])

	const poll = setInterval(() => {
		const due = state.streamState === 'open' ? FULL_SYNC_MS : POLL_MS
		if (!state.lastFullSync || Date.now() - state.lastFullSync >= due) {
			fullSync()
				.then(openStream)
				.catch((error) => fail('scheduled resync', error))
		}
	}, POLL_MS)
	poll.unref?.()
}

// ---- What src/lib/db.ts uses ----

/** The subset of a MongoDB collection that src/lib/db.ts reads with. */
export type ReadCollection = {
	countDocuments(filter: Document): Promise<number>
	aggregate(pipeline: Document[]): { toArray(): Promise<Document[]> }
	find(filter: Document, options?: { projection?: Document }): { toArray(): Promise<Document[]> }
}

function allTours(): Document[] {
	state.list ??= Array.from(state.docs!.values())
	return state.list
}

// Rows are copied (one level) so the caller can attach joined rows without
// touching the copy; deeper values are copied by db.ts before they leave it.
const copies = (docs: Document[]) => docs.map((doc) => ({ ...doc }))

const jsonCollection: ReadCollection = {
	async countDocuments(filter) {
		return find(allTours(), filter).all().length
	},
	aggregate(pipeline) {
		return { toArray: async () => copies(new Aggregator(pipeline).run(allTours()) as Document[]) }
	},
	find(filter, options = {}) {
		return { toArray: async () => copies(find(allTours(), filter, options.projection ?? {}).all() as Document[]) }
	},
}

/**
 * The collection to read tours from: the JSON copy, or null to read MongoDB
 * (store off, or the copy couldn't be loaded in time).
 */
export async function tourReadCollection(getCollection: () => Promise<Collection<Document>>): Promise<ReadCollection | null> {
	if (!tourStoreEnabled()) return null
	startTourStore(getCollection)
	if (state.docs) return jsonCollection
	const timeout = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), FIRST_LOAD_WAIT_MS).unref?.())
	const loaded = await Promise.race([state.firstLoad ?? Promise.resolve(false), timeout])
	return loaded && state.docs ? jsonCollection : null
}

/**
 * After a write to the tours in MongoDB (from src/lib/db.ts): the copy takes
 * the written tours as MongoDB now has them, before the write returns.
 */
export async function afterTourWrite(ids: unknown[], deleted = false) {
	if (!state.docs || !state.getCollection || !ids.length) return
	const keys = ids.map(String)
	try {
		if (deleted) {
			for (const key of keys) state.docs.delete(key)
		} else {
			const col = await state.getCollection()
			const docs = await col.find({ _id: { $in: ids as any[] } }).toArray()
			const found = new Set(docs.map(idOf))
			for (const doc of docs) state.docs.set(idOf(doc), doc)
			for (const key of keys) if (!found.has(key)) state.docs.delete(key)
		}
		changed()
	} catch (error) {
		// The change stream / next full read brings it in anyway
		fail('update after write', error)
	}
}

/** Reads every tour from MongoDB again now (and rewrites the file). */
export async function resyncTourStore() {
	if (!state.started || !state.getCollection) throw new Error('The tour JSON store is not running on this server')
	await fullSync()
	await openStream()
	state.fileWrite = state.fileWrite.then(writeTourFile)
	await state.fileWrite
}

export function tourStoreStatus(): TourStoreStatus {
	const at = (ms: number | null) => (ms ? new Date(ms).toISOString() : null)
	return {
		enabled: tourStoreEnabled(),
		file: tourStoreEnabled() ? tourFilePath() : null,
		tours: state.docs?.size ?? null,
		loadedFrom: state.loadedFrom,
		changeStream: state.streamState,
		lastFullSync: at(state.lastFullSync),
		lastChange: at(state.lastChange),
		lastFileWrite: at(state.lastFileWrite),
		lastError: state.lastError,
	}
}

/** Waits for pending file writes (tests and shutdown). */
export async function flushTourFile() {
	if (state.fileTimer) {
		clearTimeout(state.fileTimer)
		state.fileTimer = null
		state.fileWrite = state.fileWrite.then(writeTourFile)
	}
	await state.fileWrite
}
