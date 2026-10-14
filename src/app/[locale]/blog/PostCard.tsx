// Article card: photo, date · reading time, title, short intro.
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { blogPath, type BlogPost } from '@/lib/blog'
import { PHOTOS } from '@/lib/photos'

export default function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
	const t = useTranslations('Blog')
	const locale = useLocale()
	const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(post.createdAt))

	return (
		<Link
			href={blogPath(locale, post.title, post.id) as any}
			className={`group block ${featured ? 'grid items-center gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-12' : ''}`}
		>
			<div
				className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${
					featured ? 'aspect-[16/10] rounded-[28px] sm:rounded-[36px]' : 'aspect-[3/2] rounded-3xl'
				}`}
			>
				<Image
					src={post.image || PHOTOS.sahara}
					alt=""
					fill
					sizes={featured ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
					className="object-cover transition duration-700 group-hover:scale-[1.03]"
				/>
			</div>
			<div className={featured ? '' : 'mt-4'}>
				<p className="text-sm text-neutral-500">
					{featured && <span className="mr-2 font-semibold uppercase tracking-wider text-neutral-950 dark:text-white">{t('latest')}</span>}
					{date} · {t('read_time', { minutes: post.readMinutes })}
				</p>
				<h2
					className={`mt-2 font-bold tracking-tight group-hover:underline ${
						featured ? 'text-3xl leading-tight sm:text-5xl' : 'line-clamp-3 text-xl leading-snug'
					}`}
				>
					{post.title}
				</h2>
				<p className={`mt-3 text-neutral-500 ${featured ? 'line-clamp-3 text-lg' : 'line-clamp-2'}`}>{post.excerpt}</p>
			</div>
		</Link>
	)
}
