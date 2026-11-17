// Can this email domain receive mail? Asks Cloudflare's public DNS (DNS over
// HTTPS, works on the Worker) for the domain's mail servers (MX records).
// A domain with no MX but an address record can still receive mail (RFC 5321).
// Never blocks a real address because of a DNS hiccup: errors count as "unknown".
import 'server-only'

export type DomainMail = 'ok' | 'no_mail' | 'unknown'

const cache = new Map<string, { at: number; result: DomainMail }>()
const DAY = 24 * 3600_000

async function lookup(name: string, type: 'MX' | 'A' | 'AAAA') {
	const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, {
		headers: { accept: 'application/dns-json' },
		signal: AbortSignal.timeout(3000),
	})
	if (!res.ok) throw new Error(`DNS ${res.status}`)
	return (await res.json()) as { Status: number; Answer?: { type: number; data: string }[] }
}

export async function domainReceivesMail(domain: string): Promise<DomainMail> {
	const key = domain.toLowerCase()
	const hit = cache.get(key)
	if (hit && Date.now() - hit.at < DAY) return hit.result
	let result: DomainMail = 'unknown'
	try {
		const mx = await lookup(key, 'MX')
		if (mx.Status === 3) result = 'no_mail' // NXDOMAIN: the domain doesn't exist
		else {
			const servers = (mx.Answer ?? []).filter((a) => a.type === 15)
			// "0 ." is a null MX: the domain says it never receives mail
			if (servers.length && servers.every((a) => /^0\s+\.$/.test(a.data.trim()))) result = 'no_mail'
			else if (servers.length) result = 'ok'
			else {
				const [a, aaaa] = await Promise.all([lookup(key, 'A'), lookup(key, 'AAAA')])
				result = (a.Answer ?? []).some((r) => r.type === 1) || (aaaa.Answer ?? []).some((r) => r.type === 28) ? 'ok' : 'no_mail'
			}
		}
	} catch {
		return 'unknown'
	}
	cache.set(key, { at: Date.now(), result })
	return result
}
