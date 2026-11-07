// unstable_cache with a key that survives deploys.
//
// Next.js and vinext build the cache key from the function's source code
// (fn.toString()) plus the key parts. The minified source changes on every
// build, so every deploy started with an empty data cache: each tour had to
// be read from the database again, and when the database was slow or down,
// tour pages failed ("Something went wrong") instead of using the copy saved
// a few minutes earlier. Here the key is only the key parts (bump their
// version when the data's shape changes), so saved data is reused across
// deploys and keeps being served while the database is unreachable.
import { unstable_cache as nextUnstableCache } from 'next/cache'

export function unstable_cache<T extends (...args: any[]) => Promise<any>>(
	fn: T,
	keyParts: string[],
	options?: { revalidate?: number | false; tags?: string[] },
): T {
	const stable = ((...args: any[]) => fn(...args)) as T
	Object.defineProperty(stable, 'toString', { value: () => `stable-cache:${keyParts.join('|')}` })
	return nextUnstableCache(stable, keyParts, options) as T
}
