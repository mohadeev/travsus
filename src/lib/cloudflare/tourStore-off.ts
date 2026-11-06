// The Cloudflare Worker build's src/lib/tourStore.ts (vite.config.ts): a
// Worker has no disk to keep the tours' JSON copy on, so tours are read from
// MongoDB there. Same exports, always off, and mingo stays out of the Worker
// (size limit).
import type { Collection, Document } from 'mongodb'
import type { ReadCollection, TourStoreStatus } from '../tourStore'

export type { ReadCollection, TourStoreStatus }

export const tourStoreEnabled = () => false
export const tourFilePath = () => ''
export function startTourStore(_getCollection: () => Promise<Collection<Document>>) {}
export async function tourReadCollection(_getCollection: () => Promise<Collection<Document>>): Promise<ReadCollection | null> {
	return null
}
export async function afterTourWrite(_ids: unknown[], _deleted = false) {}
export async function resyncTourStore(): Promise<void> {
	throw new Error('The tour JSON store is not used on the Cloudflare Worker (tours are read from MongoDB)')
}
export function tourStoreStatus(): TourStoreStatus {
	return { enabled: false, file: null, tours: null, loadedFrom: null, changeStream: 'closed', lastFullSync: null, lastChange: null, lastFileWrite: null, lastError: null }
}
export async function flushTourFile() {}
