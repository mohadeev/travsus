// Plain text with simple links: "[label](/en-US/morocco/...)" becomes a link.
// Only links to our own site are allowed; anything else stays as text.
import { Fragment } from 'react'
import Link from 'next/link'

const LINK = /\[([^\]\n]+)\]\(((?:\/|https:\/\/www\.travsus\.com\/)[^)\s]*)\)/g

/** "[label](url)" → "label", for meta tags, JSON-LD and anywhere links can't render. */
export const stripLinks = (text: string) => text.replace(new RegExp(LINK.source, 'g'), '$1')

export default function LinkedText({ text }: { text?: string | null }) {
	if (!text) return null
	const parts: React.ReactNode[] = []
	let last = 0
	const re = new RegExp(LINK.source, 'g')
	let match: RegExpExecArray | null
	while ((match = re.exec(text))) {
		const [whole, label, href] = match
		const start = match.index
		if (start > last) parts.push(text.slice(last, start))
		parts.push(
			<Link key={start} href={href.replace('https://www.travsus.com', '') as any} className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400">
				{label}
			</Link>,
		)
		last = start + whole.length
	}
	if (last < text.length) parts.push(text.slice(last))
	return <Fragment>{parts}</Fragment>
}
