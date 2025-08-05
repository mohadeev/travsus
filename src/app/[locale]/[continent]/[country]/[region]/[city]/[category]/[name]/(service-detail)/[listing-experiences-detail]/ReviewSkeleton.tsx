import { useTranslations } from '@/lib/i18n'

const ReviewSkeleton = () => {
	const t = useTranslations("app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_ReviewSkeleton");

	return (
		<div className="animate-pulse border-b border-neutral-200 pb-6">
			<div className="flex items-start gap-4">
				<div className="h-12 w-12 rounded-full bg-neutral-200"></div>
				<div className="flex-1">
					<div className="mb-2 h-4 w-32 rounded bg-neutral-200"></div>
					<div className="h-3 w-48 rounded bg-neutral-200"></div>
				</div>
			</div>
			<div className="mt-3">
				<div className="mb-2 h-4 w-24 rounded bg-neutral-200"></div>
				<div className="mb-2 h-5 w-64 rounded bg-neutral-200"></div>
				<div className="mb-1 h-4 w-full rounded bg-neutral-200"></div>
				<div className="mb-1 h-4 w-full rounded bg-neutral-200"></div>
				<div className="mb-3 h-4 w-3/4 rounded bg-neutral-200"></div>
				<div className="h-3 w-48 rounded bg-neutral-200"></div>
			</div>
		</div>
	)
}

export default ReviewSkeleton