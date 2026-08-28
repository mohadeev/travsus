export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import React from 'react'
import { useTranslations } from '@/lib/i18n'

const page = () => {
	const t = useTranslations('itsonthemove_page')
	return (
		<div className="container">
			{t('itsonthemove_page_Our_Website_Has_Been_Reviewed')}{' '}
			<a href="https://www.itsonthemove.com/Holiday-Tours/C17-1-0.htm">
				{t('itsonthemove_page_Holiday_Tours_Listings')}
			</a>
		</div>
	)
}

export default page
