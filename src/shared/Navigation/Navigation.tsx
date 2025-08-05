import React from 'react'
import { useTranslations } from '@/lib/i18n'
import NavigationItem from './NavigationItem'
import { NAVIGATION_DEMO } from '@/data/navigation'

function Navigation() {
	const t = useTranslations("shared_Navigation_Navigation");

	return (
		<ul className={t('shared_Navigation_Navigation_Navigation_Classes')}>
			{NAVIGATION_DEMO.map((item) => (
				<NavigationItem key={item.id} menuItem={item} />
			))}
		</ul>
	)
}

export default Navigation