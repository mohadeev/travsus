// Round author photo, or their first letter.
import type { ForumAuthor } from '@/lib/forum'

export default function Avatar({ author, size = 40 }: { author: ForumAuthor; size?: number }) {
	return author.image ? (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={author.image}
			alt=""
			width={size}
			height={size}
			className="shrink-0 rounded-full object-cover"
			style={{ width: size, height: size }}
		/>
	) : (
		<span
			aria-hidden
			className="grid shrink-0 place-items-center rounded-full bg-neutral-950 font-semibold text-white dark:bg-white dark:text-neutral-950"
			style={{ width: size, height: size, fontSize: size * 0.4 }}
		>
			{(author.name || '?').charAt(0).toUpperCase()}
		</span>
	)
}
