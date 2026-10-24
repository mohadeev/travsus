// Server-side database access (MongoDB) + small helpers used by every API
// route / server action. Never import this from a client component.
//
// The query API is the one the code was written against:
//   db.from(T.bookings).select('*, tour:tours(name)').eq('customerId', id).order('createdAt', { ascending: false })
//   db.from(T.users).insert(withMeta({ ... })).select().single()
// Results are { data, error, count }. Rows have `id` (stored as `_id`) and
// dates as ISO strings, like the API this replaces.
import { randomBytes } from 'node:crypto'
import { MongoClient, ObjectId, type Collection, type Db, type Document } from 'mongodb'

if (typeof window !== 'undefined') {
	throw new Error('src/lib/db.ts must only be imported on the server')
}

const MAIN_URL = process.env.DATABASE_URL
const PLACES_URL = process.env.DATABASE_URL_PLACES || MAIN_URL
const MAIN_DB = process.env.MONGODB_DB || 'travsus'
if (!MAIN_URL) throw new Error('Missing DATABASE_URL env var')

// One connection per process, reused between serverless invocations
const shared = globalThis as unknown as { __travsusMongo?: Record<string, Promise<MongoClient>> }
const clients = (shared.__travsusMongo ??= {})
const connect = (url: string) => (clients[url] ??= new MongoClient(url, { maxPoolSize: 10 }).connect())
const mainDb = async (): Promise<Db> => (await connect(MAIN_URL)).db(MAIN_DB)
/** The geography database keeps its own name (set in its connection string). */
const placesDb = async (): Promise<Db> => (PLACES_URL === MAIN_URL ? mainDb() : (await connect(PLACES_URL!)).db())

/** Table names — change them here if a collection is renamed. */
export const T = {
	users: 'users',
	addresses: 'Address',
	businesses: 'businesses',
	bookings: 'bookings',
	tours: 'tours',
	reviews: 'reviews',
	paymentMethods: 'payment_methods',
	payoutMethods: 'payout_methods',
	subscriptions: 'subscriptions',
	referralLinks: 'referral_links',
	newsletter: 'newsletter',
	tripadvisorPlaces: 'places',
	translatableContents: 'translatable_contents',
	translatedTexts: 'translated_texts',
	counters: 'Counter',
	posts: 'Post',
	forumPosts: 'ForumPost',
	forumComments: 'ForumComment',
	reports: 'WhistleblowerReport',
	// First-party analytics
	analyticsSessions: 'analytics_sessions',
	analyticsEvents: 'analytics_events',
	// Affiliate program
	affiliates: 'affiliates',
	affiliateClicks: 'affiliate_clicks',
	affiliateReferrals: 'affiliate_referrals',
	affiliatePayouts: 'affiliate_payouts',
	affiliateInvites: 'affiliate_invites',
	// Geography (the big collections live in the places database)
	continents: 'geo_continents',
	countries: 'geo_countries',
	states: 'geo_states',
	cities: 'geo_cities',
	places: 'geo_places',
	geoContents: 'geo_translatable_contents',
	geoTexts: 'geo_translated_texts',
} as const

/** Collections kept in the places database, under their names there. */
const IN_PLACES_DB: Record<string, string> = {
	[T.cities]: 'City',
	[T.geoContents]: 'TranslatableContent',
	[T.geoTexts]: 'TranslatedText',
}

/** Raw collection access, for the few reads that need their own projection or pipeline. */
export async function mongoCollection(table: string): Promise<Collection<Document>> {
	return IN_PLACES_DB[table] ? (await placesDb()).collection(IN_PLACES_DB[table]) : (await mainDb()).collection(table)
}

/**
 * Common relation selects. `users!customerId` picks the foreign key when a
 * table points at users more than once.
 */
export const REL = {
	bookingFull: `*, customer:${T.users}!customerId(*), provider:${T.users}!providerId(*), tour:${T.tours}(*), paymentMethod:${T.paymentMethods}(*)`,
	bookingWithPeople: `*, customer:${T.users}!customerId(*), provider:${T.users}!providerId(*), tour:${T.tours}(*)`,
	tourAddresses: `startAddress:${T.addresses}!startAddressId(*), endAddress:${T.addresses}!endAddressId(*)`,
} as const

/**
 * "parent>child": the child column that points at the parent, for embeds
 * that return a list (tour.bookings, post.comments...). Every other embed is
 * a single row found through a column of the parent (`tourId` for `tour`).
 */
const ONE_TO_MANY: Record<string, string> = {
	[`${T.tours}>${T.bookings}`]: 'tourId',
	[`${T.businesses}>${T.tours}`]: 'businessId',
	[`${T.forumPosts}>${T.forumComments}`]: 'postId',
	[`${T.translatableContents}>${T.translatedTexts}`]: 'contentId',
	[`${T.geoContents}>${T.geoTexts}`]: 'contentId',
	[`${T.users}>${T.referralLinks}`]: 'userId',
}

/** Required list columns on a new tour. */
export const EMPTY_TOUR_LISTS = {
	slugs: [],
	images: [],
	people: [],
	services: [],
	places: [],
	highlights: [],
	days: [],
	paths: [],
	tags: [],
	keyphrase: [],
	faq: [],
	pricingTiers: [],
	accommodations: [],
	translations: [],
}

/** Values a new row gets when they are left out (what the old tables defaulted to). */
const DEFAULTS: Record<string, Record<string, unknown>> = {
	[T.tours]: EMPTY_TOUR_LISTS,
	[T.posts]: { imageIds: [], tags: [], translations: [] },
	[T.users]: { likedCommentIds: [], dislikedCommentIds: [], passwordHistory: [], passwordResetTokens: [] },
	[T.reviews]: { images: [] },
	[T.bookings]: { bookingStates: [], lineItems: [], paymentPlan: 'full', balanceAttempts: 0 },
	[T.forumPosts]: { tags: [], likedByIds: [], dislikedByIds: [] },
	[T.forumComments]: { likedByIds: [], dislikedByIds: [] },
	[T.newsletter]: { tokens: [], types: [] },
	[T.affiliates]: { status: 'pending' },
	[T.analyticsSessions]: { consent: false, pageviews: 0, errors: 0 },
	[T.continents]: { translations: [] },
	[T.countries]: { translations: [] },
	[T.states]: { translations: [] },
	[T.cities]: { translations: [] },
	[T.places]: { translations: [], tags: [] },
}

/** Timestamp columns filled in automatically: [on insert..., on update]. */
const TIMESTAMPS: Record<string, { created: string[]; updated?: string }> = {
	[T.posts]: { created: ['createdAt'] },
	[T.affiliates]: { created: ['created_at'] },
	[T.affiliateClicks]: { created: ['created_at'] },
	[T.affiliateReferrals]: { created: ['created_at'] },
	[T.affiliatePayouts]: { created: ['paid_at'] },
	[T.affiliateInvites]: { created: ['created_at'] },
	[T.analyticsEvents]: { created: ['created_at'] },
	[T.analyticsSessions]: { created: ['started_at', 'last_seen_at'] },
	[T.counters]: { created: [] },
}
const timestampsOf = (table: string) => TIMESTAMPS[table] ?? { created: ['createdAt', 'updatedAt'], updated: 'updatedAt' }

/** 24-char hex id, same format as the old MongoDB ObjectIds. */
export const newId = () => randomBytes(12).toString('hex')

/** Adds id / createdAt / updatedAt to a row (or rows) before inserting. */
export function withMeta<R extends Record<string, any>>(row: R, timestamps = true) {
	const now = new Date().toISOString()
	return {
		id: newId(),
		...(timestamps ? { createdAt: now, updatedAt: now } : {}),
		...row,
	}
}

/** Sets updatedAt on an update payload. */
export const touch = <R extends Record<string, any>>(row: R) => ({
	...row,
	updatedAt: new Date().toISOString(),
})

/**
 * Converts a stored timestamp to Date, treating values without a time zone
 * as UTC (that's how they were stored).
 */
export function asDate(value: string | Date | null | undefined): Date | null {
	if (!value) return null
	if (value instanceof Date) return value
	const hasZone = /([zZ]|[+-]\d\d:?\d\d)$/.test(value)
	return new Date(hasZone ? value : `${value}Z`)
}

/**
 * Fetches every row of a query, page by page. Pass a function that builds
 * the query, e.g. `fetchAll(() => db.from(T.cities).select('*').eq('countryId', id).order('id'))`.
 */
export async function fetchAll<Row = any>(
	build: () => { range: (from: number, to: number) => PromiseLike<{ data: any; error: any }> },
	pageSize = 1000,
): Promise<Row[]> {
	const rows: Row[] = []
	for (let from = 0; ; from += pageSize) {
		const page = must(await build().range(from, from + pageSize - 1)) as Row[]
		rows.push(...(page ?? []))
		if (!page || page.length < pageSize) return rows
	}
}

/** Throws on a database error, otherwise returns the data. */
export function must<D>(res: { data: D; error: { message: string } | null }): D {
	if (res.error) throw new Error(res.error.message)
	return res.data
}

// ---------------------------------------------------------------------------
// Query builder

export type DbError = { message: string; code?: string; details?: string }
export type DbResult<D> = { data: D; error: DbError | null; count: number | null; status: number }

type Embed = { alias: string; table: string; fk?: string; spec: Spec }
type Spec = { all: boolean; columns: string[]; embeds: Embed[]; count: boolean }

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/

/** Splits "a, b:t(c, d), e" at the commas outside parentheses. */
function splitTop(text: string): string[] {
	const parts: string[] = []
	let depth = 0
	let current = ''
	for (const ch of text) {
		if (ch === '(') depth++
		if (ch === ')') depth--
		if (ch === ',' && depth === 0) {
			parts.push(current)
			current = ''
		} else current += ch
	}
	if (current.trim()) parts.push(current)
	return parts.map((p) => p.trim()).filter(Boolean)
}

function parseSelect(text: string): Spec {
	const spec: Spec = { all: false, columns: [], embeds: [], count: false }
	for (const part of splitTop(text || '*')) {
		if (part === '*') spec.all = true
		else if (part === 'count') spec.count = true
		else {
			const embed = /^(?:([\w"]+):)?([\w"]+)(?:!([\w"]+))?\(([\s\S]*)\)$/.exec(part)
			if (embed) {
				const [, alias, table, fk, inner] = embed.map((s) => s?.replace(/"/g, ''))
				spec.embeds.push({ alias: alias || table, table, fk: fk || undefined, spec: parseSelect(inner) })
			} else spec.columns.push(part.replace(/"/g, ''))
		}
	}
	return spec
}

const column = (name: string) => (name === 'id' ? '_id' : name)

const HEX_ID = /^[0-9a-f]{24}$/

/**
 * Ids in the places database are ObjectIds, everywhere else strings: a value
 * compared with or stored in an id column takes the form of its table.
 */
function fixId(table: string, key: string, value: unknown) {
	if (key !== '_id' && !/Id$/.test(key)) return value
	if (IN_PLACES_DB[table]) return typeof value === 'string' && HEX_ID.test(value) ? new ObjectId(value) : value
	return value instanceof ObjectId ? value.toHexString() : value
}

/** Top-level timestamps are stored as dates; ids take the table's form. */
const storedValue = (table: string, col: string, value: unknown) =>
	typeof value === 'string' && !col.includes('.') && ISO_DATE.test(value) ? new Date(value) : fixId(table, col, value)

/** Dates (and object ids) → strings, deep, so rows can be sent to the client as they are. */
function plain(value: any): any {
	if (value instanceof Date) return value.toISOString()
	if (value instanceof ObjectId) return value.toHexString()
	if (Array.isArray(value)) return value.map(plain)
	if (value && typeof value === 'object') {
		const out: Record<string, unknown> = {}
		for (const [k, v] of Object.entries(value)) out[k] = plain(v)
		return out
	}
	return value
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** SQL LIKE pattern → regular expression (`%` any text, `_` one character, `\%` literal). */
function likeRegex(pattern: string, caseInsensitive: boolean) {
	let out = '^'
	for (let i = 0; i < pattern.length; i++) {
		const c = pattern[i]
		if (c === '\\' && i + 1 < pattern.length) out += escapeRe(pattern[++i])
		else if (c === '%') out += '[\\s\\S]*'
		else if (c === '_') out += '[\\s\\S]'
		else out += escapeRe(c)
	}
	return new RegExp(out + '$', caseInsensitive ? 'i' : '')
}

/** One filter → a MongoDB condition. */
function condition(table: string, col: string, op: string, value: any): Document {
	const key = column(col)
	const v = storedValue(table, key, value)
	switch (op) {
		case 'eq':
			return { [key]: v }
		case 'neq':
			return { [key]: { $ne: v } }
		case 'gt':
			// `.gt('images', '[]')`: a non-empty list
			return v === '[]' ? { [`${key}.0`]: { $exists: true } } : { [key]: { $gt: v } }
		case 'gte':
			return { [key]: { $gte: v } }
		case 'lt':
			return { [key]: { $lt: v } }
		case 'lte':
			return { [key]: { $lte: v } }
		case 'like':
			return { [key]: likeRegex(String(v), false) }
		case 'ilike':
			return { [key]: likeRegex(String(v), true) }
		case 'is':
			return { [key]: v }
		case 'in':
			return { [key]: { $in: (Array.isArray(value) ? value : [value]).map((x) => storedValue(table, key, x)) } }
		case 'cs': // contains: every given element is in the list
			if (Array.isArray(v)) return v.some((x) => x && typeof x === 'object') ? { [key]: { $all: v.map((x) => (x && typeof x === 'object' ? { $elemMatch: x } : x)) } } : { [key]: { $all: v } }
			return { [key]: v }
		case 'not':
			return { $nor: [v] }
		default:
			throw new Error(`Unsupported filter operator "${op}"`)
	}
}

/** "{a,b}" → [a, b], "(a,b)" → [a, b], "null" → null (the `.or()` syntax). */
function orValue(raw: string): any {
	if (raw === 'null') return null
	if (raw === 'true') return true
	if (raw === 'false') return false
	if (/^[{(].*[})]$/.test(raw)) return raw.slice(1, -1).split(',').map((s) => s.trim().replace(/^"(.*)"$/, '$1'))
	return raw
}

const notNull = (v: unknown) => v !== null && v !== undefined
const unique = (list: unknown[]) => Array.from(new Set(list.filter(notNull)))

type Mode = 'many' | 'single' | 'maybe'
type Order = { col: string; dir: 1 | -1; nullsFirst?: boolean; embed?: string }
type Action =
	| { kind: 'select' }
	| { kind: 'insert'; rows: Document[] }
	| { kind: 'update'; values: Document }
	| { kind: 'upsert'; rows: Document[]; onConflict: string[]; ignoreDuplicates: boolean }
	| { kind: 'delete' }

class Query implements PromiseLike<DbResult<any>> {
	private action: Action = { kind: 'select' }
	private spec: Spec | null = null
	private filters: Document[] = []
	private orders: Order[] = []
	private skip = 0
	private max: number | null = null
	private mode: Mode = 'many'
	private wantCount = false
	private headOnly = false

	constructor(private table: string) {}

	select(columns = '*', options: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean } = {}) {
		this.spec = parseSelect(columns)
		if (options.count) this.wantCount = true
		if (options.head) this.headOnly = true
		return this
	}
	insert(rows: Document | Document[]) {
		this.action = { kind: 'insert', rows: Array.isArray(rows) ? rows : [rows] }
		return this
	}
	update(values: Document) {
		this.action = { kind: 'update', values }
		return this
	}
	upsert(rows: Document | Document[], options: { onConflict?: string; ignoreDuplicates?: boolean } = {}) {
		this.action = {
			kind: 'upsert',
			rows: Array.isArray(rows) ? rows : [rows],
			onConflict: (options.onConflict || 'id').split(',').map((s) => s.trim()),
			ignoreDuplicates: !!options.ignoreDuplicates,
		}
		return this
	}
	delete() {
		this.action = { kind: 'delete' }
		return this
	}

	private where(doc: Document) {
		this.filters.push(doc)
		return this
	}
	eq(col: string, value: unknown) {
		return this.where(condition(this.table, col, 'eq', value))
	}
	neq(col: string, value: unknown) {
		return this.where(condition(this.table, col, 'neq', value))
	}
	gt(col: string, value: unknown) {
		return this.where(condition(this.table, col, 'gt', value))
	}
	gte(col: string, value: unknown) {
		return this.where(condition(this.table, col, 'gte', value))
	}
	lt(col: string, value: unknown) {
		return this.where(condition(this.table, col, 'lt', value))
	}
	lte(col: string, value: unknown) {
		return this.where(condition(this.table, col, 'lte', value))
	}
	like(col: string, pattern: string) {
		return this.where(condition(this.table, col, 'like', pattern))
	}
	ilike(col: string, pattern: string) {
		return this.where(condition(this.table, col, 'ilike', pattern))
	}
	is(col: string, value: null | boolean) {
		return this.where(condition(this.table, col, 'is', value))
	}
	in(col: string, values: unknown[]) {
		return this.where(condition(this.table, col, 'in', values))
	}
	contains(col: string, value: unknown) {
		return this.where(condition(this.table, col, 'cs', value))
	}
	containedBy(col: string, value: unknown[]) {
		return this.where({ [column(col)]: { $not: { $elemMatch: { $nin: value } } } })
	}
	/** `.not('image', 'is', null)` */
	not(col: string, op: string, value: unknown) {
		if (op === 'is' && value === null) return this.where({ [column(col)]: { $ne: null } })
		return this.where({ $nor: [condition(this.table, col, op, value)] })
	}
	filter(col: string, op: string, value: unknown) {
		if (op.startsWith('not.')) return this.not(col, op.slice(4), value)
		return this.where(condition(this.table, col, op, value))
	}
	match(values: Record<string, unknown>) {
		for (const [col, value] of Object.entries(values)) this.eq(col, value)
		return this
	}
	/** `.or('customerId.eq.X,providerId.eq.Y')` */
	or(text: string) {
		const parts = splitOr(text).map((part) => {
			const m = /^([\w.]+)\.(not\.)?(\w+)\.([\s\S]*)$/.exec(part)
			if (!m) throw new Error(`Cannot read filter "${part}"`)
			const [, col, negated, op, raw] = m
			const value = orValue(raw)
			if (negated) return op === 'is' && value === null ? { [column(col)]: { $ne: null } } : { $nor: [condition(this.table, col, op, value)] }
			return condition(this.table, col, op, value)
		})
		return this.where({ $or: parts })
	}
	order(col: string, options: { ascending?: boolean; nullsFirst?: boolean; referencedTable?: string; foreignTable?: string } = {}) {
		this.orders.push({ col, dir: options.ascending === false ? -1 : 1, nullsFirst: options.nullsFirst, embed: options.referencedTable || options.foreignTable })
		return this
	}
	range(from: number, to: number) {
		this.skip = from
		this.max = to - from + 1
		return this
	}
	limit(n: number) {
		this.max = n
		return this
	}
	single() {
		this.mode = 'single'
		return this
	}
	maybeSingle() {
		this.mode = 'maybe'
		return this
	}
	throwOnError() {
		return this
	}

	then<R1 = DbResult<any>, R2 = never>(onFulfilled?: ((value: DbResult<any>) => R1 | PromiseLike<R1>) | null, onRejected?: ((reason: any) => R2 | PromiseLike<R2>) | null) {
		return this.run().then(onFulfilled, onRejected)
	}

	private get where_(): Document {
		return this.filters.length === 0 ? {} : this.filters.length === 1 ? this.filters[0] : { $and: this.filters }
	}

	private async run(): Promise<DbResult<any>> {
		try {
			const { data, count } = await this.execute()
			let rows = data
			if (data && this.mode !== 'many') {
				if (this.mode === 'single' && data.length !== 1) {
					return { data: null, error: { code: 'PGRST116', message: `Expected one row, got ${data.length} (${this.table})` }, count, status: 406 }
				}
				if (data.length > 1) console.warn(`maybeSingle on ${this.table}: ${data.length} rows match, using the first`)
				rows = data[0] ?? null
			}
			return { data: rows, error: null, count, status: 200 }
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e)
			console.error(`Database error (${this.table}):`, message)
			return { data: null, error: { message, code: (e as any)?.code ? String((e as any).code) : undefined }, count: null, status: 500 }
		}
	}

	private async execute(): Promise<{ data: any[] | null; count: number | null }> {
		const col = await mongoCollection(this.table)
		switch (this.action.kind) {
			case 'select':
				return this.find(col, this.where_)
			case 'insert': {
				const docs = this.action.rows.map((r) => this.newDoc(r))
				if (docs.length) await col.insertMany(docs)
				return this.returning(col, docs.map((d) => d._id))
			}
			case 'update': {
				const ids = (await col.find(this.where_, { projection: { _id: 1 } }).toArray()).map((d) => d._id)
				if (ids.length) await col.updateMany({ _id: { $in: ids } }, { $set: this.changes(this.action.values) })
				return this.returning(col, ids)
			}
			case 'upsert': {
				const { rows, onConflict, ignoreDuplicates } = this.action
				const ids: unknown[] = []
				for (const row of rows) {
					const doc = this.newDoc(row)
					const key: Document = Object.fromEntries(onConflict.map((c) => [column(c), doc[column(c)]]))
					const existing = await col.findOne(key, { projection: { _id: 1 } })
					if (existing) {
						const { _id, ...rest } = doc
						if (!ignoreDuplicates) await col.updateOne({ _id: existing._id }, { $set: this.changes(rest) })
						ids.push(existing._id)
					} else {
						await col.insertOne(doc)
						ids.push(doc._id)
					}
				}
				return this.returning(col, ids)
			}
			case 'delete': {
				if (!this.filters.length) throw new Error(`Refusing to delete every row of ${this.table}`)
				const ids = (await col.find(this.where_, { projection: { _id: 1 } }).toArray()).map((d) => d._id)
				const out = await this.returning(col, ids)
				if (ids.length) await col.deleteMany({ _id: { $in: ids } })
				return out
			}
		}
	}

	/** The rows a write touched, when `.select()` was asked for. */
	private returning(col: Collection<Document>, ids: unknown[]) {
		if (!this.spec) return Promise.resolve({ data: null, count: null })
		return this.find(col, { _id: { $in: ids } }, true)
	}

	/** A row to insert: id, defaults and timestamps filled in, dates stored as dates. */
	private newDoc(row: Document): Document {
		const { id, ...rest } = row
		const now = new Date()
		const doc: Document = { _id: fixId(this.table, '_id', id ?? newId()) }
		for (const [k, v] of Object.entries(DEFAULTS[this.table] ?? {})) doc[k] = Array.isArray(v) ? [...v] : v
		for (const k of timestampsOf(this.table).created) doc[k] = now
		for (const [k, v] of Object.entries(rest)) if (v !== undefined) doc[k] = storedValue(this.table, k, v)
		return doc
	}

	/** An update payload: no id, dates as dates, updatedAt kept current. */
	private changes(values: Document): Document {
		const { id, _id, ...rest } = values
		const set: Document = {}
		for (const [k, v] of Object.entries(rest)) if (v !== undefined) set[k] = storedValue(this.table, k, v)
		const updated = timestampsOf(this.table).updated
		if (updated && set[updated] === undefined) set[updated] = new Date()
		return set
	}

	private async find(col: Collection<Document>, filter: Document, ignoreWindow = false): Promise<{ data: any[] | null; count: number | null }> {
		const spec = this.spec ?? parseSelect('*')
		const count = this.wantCount ? await col.countDocuments(filter) : null
		if (this.headOnly) return { data: null, count }

		const pipeline: Document[] = [{ $match: filter }]
		const sorts = this.orders.filter((o) => !o.embed)
		if (sorts.length) {
			const sort: Document = {}
			sorts.forEach((o, i) => {
				const key = column(o.col)
				// MongoDB puts nulls first ascending and last descending; honour an explicit wish
				if (o.nullsFirst !== undefined && o.nullsFirst !== (o.dir === 1)) {
					pipeline.push({ $addFields: { [`__null${i}`]: { $cond: [{ $eq: [{ $ifNull: [`$${key}`, null] }, null] }, 1, 0] } } })
					sort[`__null${i}`] = o.nullsFirst ? -1 : 1
				}
				sort[key] = o.dir
			})
			pipeline.push({ $sort: sort })
		}
		if (!ignoreWindow) {
			if (this.skip) pipeline.push({ $skip: this.skip })
			if (this.max !== null) pipeline.push({ $limit: this.max })
		}
		const projection = projectionFor(spec)
		if (projection) pipeline.push({ $project: projection })
		const docs = await col.aggregate(pipeline).toArray()
		await embed(this.table, docs, spec, this.orders.filter((o) => o.embed))
		return { data: docs.map((d) => shape(d, spec)), count }
	}
}

/** Splits an `.or()` list at the commas outside {} and (). */
function splitOr(text: string): string[] {
	const parts: string[] = []
	let depth = 0
	let current = ''
	for (const ch of text) {
		if (ch === '{' || ch === '(') depth++
		if (ch === '}' || ch === ')') depth--
		if (ch === ',' && depth === 0) {
			parts.push(current)
			current = ''
		} else current += ch
	}
	parts.push(current)
	return parts.map((p) => p.trim()).filter(Boolean)
}

/** The fields to load: the selected columns plus the keys the embeds need. */
function projectionFor(spec: Spec): Document | null {
	if (spec.all) return null
	const fields: Document = { _id: 1 }
	for (const c of spec.columns) fields[column(c)] = 1
	for (const e of spec.embeds) if (e.fk) fields[e.fk] = 1
	for (const e of spec.embeds) if (!e.fk) fields[`${e.alias}Id`] = 1
	return fields
}

/** Loads the embedded relations of `docs` (in place, under each alias). */
async function embed(parent: string, docs: Document[], spec: Spec, orders: Order[]) {
	if (!docs.length) return
	for (const e of spec.embeds) {
		const col = await mongoCollection(e.table)
		const childKey = ONE_TO_MANY[`${parent}>${e.table}`]
		if (childKey) {
			const key = e.fk ?? childKey
			const ids = unique(docs.map((d) => fixId(e.table, key, d._id)))
			if (e.spec.count) {
				const counts = await col.aggregate([{ $match: { [key]: { $in: ids } } }, { $group: { _id: `$${key}`, n: { $sum: 1 } } }]).toArray()
				const byId = new Map(counts.map((c) => [String(c._id), c.n]))
				for (const d of docs) d[e.alias] = [{ count: byId.get(String(d._id)) ?? 0 }]
				continue
			}
			const projection = projectionFor(e.spec)
			const children = await col.find({ [key]: { $in: ids } }, projection ? { projection: { ...projection, [key]: 1 } } : {}).toArray()
			await embed(e.table, children, e.spec, orders)
			const byParent = new Map<string, Document[]>()
			for (const c of children) {
				const list = byParent.get(String(c[key])) ?? []
				list.push(c)
				byParent.set(String(c[key]), list)
			}
			const sort = orders.find((o) => o.embed === e.alias || o.embed === e.table)
			for (const d of docs) {
				const list = byParent.get(String(d._id)) ?? []
				if (sort) list.sort((a, b) => (a[column(sort.col)] > b[column(sort.col)] ? sort.dir : a[column(sort.col)] < b[column(sort.col)] ? -sort.dir : 0))
				d[e.alias] = list.map((c) => shape(c, e.spec))
			}
		} else {
			const key = e.fk ?? `${e.alias}Id`
			const ids = unique(docs.map((d) => fixId(e.table, '_id', d[key])))
			const projection = projectionFor(e.spec)
			const found = ids.length ? await col.find({ _id: { $in: ids as any[] } }, projection ? { projection } : {}).toArray() : []
			await embed(e.table, found, e.spec, orders)
			const byId = new Map(found.map((f) => [String(f._id), shape(f, e.spec)]))
			for (const d of docs) d[e.alias] = notNull(d[key]) ? (byId.get(String(d[key])) ?? null) : null
		}
	}
}

/** A stored document → the row the code expects (id, selected columns, embeds). */
function shape(doc: Document, spec: Spec): Document {
	const aliases = new Set(spec.embeds.map((e) => e.alias))
	const out: Document = {}
	const { _id, ...rest } = doc
	if (spec.all || spec.columns.includes('id')) out.id = plain(_id)
	for (const [k, v] of Object.entries(rest)) {
		if (k.startsWith('__null')) continue
		if (aliases.has(k) || spec.all || spec.columns.includes(k)) out[k] = plain(v)
	}
	return out
}

export const db = {
	from: (table: string) => new Query(table),
}
