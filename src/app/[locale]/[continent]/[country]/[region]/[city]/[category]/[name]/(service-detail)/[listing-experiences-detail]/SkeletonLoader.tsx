import { useTranslations } from '@/lib/i18n'

export const SkeletonLoader = () => {
	const t = useTranslations("app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader");

	return (
		<header className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Header_Container_Classes')}>
			<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Grid_Container_Classes')}>
				{/* Large Image Placeholder */}
				<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Large_Image_Placeholder_Classes')}>
					<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Overlay_Classes')}></div>
				</div>

				{/* Small Image Placeholder 1 */}
				<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Small_Image_Placeholder_Classes')}>
					<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Overlay_Classes')}></div>
				</div>

				{/* Small Image Placeholders 2 & 3 */}
				<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Small_Image_Container_Classes')}>
					<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Aspect_Ratio_Classes')}></div>
					<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Overlay_Classes')}></div>
				</div>
				<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Small_Image_Container_Classes')}>
					<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Aspect_Ratio_Classes')}></div>
					<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Overlay_Classes')}></div>
				</div>

				{/* "Show all photos" button Placeholder */}
				<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Show_Photos_Button_Classes')}>
					<div className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Icon_Placeholder_Classes')}></div>
					<span className={t('app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader_Text_Placeholder_Classes')}></span>
				</div>
			</div>
		</header>
	)
}