// "Popular" label for the most visited tours: on the photo of the cards, and
// under the title on the tour page.
import { Flame } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function PopularBadge({ className = '' }: { className?: string }) {
	const t = useTranslations('Home')
	return (
		<span className={`inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold leading-4 text-ink shadow-[0_1px_4px_rgba(0,0,0,0.2)] ${className}`}>
			<Flame className="h-3.5 w-3.5 fill-brand-500 text-brand-500" aria-hidden />
			{t('popular')}
		</span>
	)
}
