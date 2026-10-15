// Newsletter subscribers go to MailRelay (free plan: 80,000 emails a month),
// where the newsletters themselves are written and sent.
// Set in the environment (Vercel + .env.local):
//   MAILRELAY_ACCOUNT   your account name: <account>.ipzmarketing.com
//   MAILRELAY_API_KEY   MailRelay → Settings → API keys
//   MAILRELAY_GROUP_ID  optional: group id(s) to add subscribers to, e.g. "1" or "1,4"
// Without them, subscribers are only kept in our own `newsletter` table.
import 'server-only'

export const mailrelayConfigured = () => !!(process.env.MAILRELAY_ACCOUNT && process.env.MAILRELAY_API_KEY)

/** Add (or update) a subscriber in MailRelay. Never throws; false when not done. */
export async function addToMailRelay(email: string) {
	if (!mailrelayConfigured()) return false
	const account = process.env.MAILRELAY_ACCOUNT!.replace(/^https?:\/\//, '').replace(/\.ipzmarketing\.com.*$/, '')
	const groups = (process.env.MAILRELAY_GROUP_ID ?? '')
		.split(',')
		.map((g) => Number(g.trim()))
		.filter((g) => Number.isInteger(g) && g > 0)
	try {
		const res = await fetch(`https://${account}.ipzmarketing.com/api/v1/subscribers/sync`, {
			method: 'POST',
			headers: { 'X-AUTH-TOKEN': process.env.MAILRELAY_API_KEY!, 'content-type': 'application/json' },
			body: JSON.stringify({
				email,
				status: 'active',
				...(groups.length ? { group_ids: groups } : {}),
			}),
			signal: AbortSignal.timeout(10_000),
		})
		if (!res.ok) console.error('MailRelay subscribe failed:', res.status, (await res.text().catch(() => '')).slice(0, 300))
		return res.ok
	} catch (error: any) {
		console.error('MailRelay subscribe failed:', error?.message ?? error)
		return false
	}
}
