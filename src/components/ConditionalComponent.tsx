'use client'

import { useComponentVisibility } from '@/hooks/useComponentVisibility'

interface ConditionalComponentProps {
	component: React.ComponentType
}

export default function ConditionalComponent({
	component: Component,
}: ConditionalComponentProps) {
	const isVisible = useComponentVisibility()

	if (!isVisible) {
		return null
	}

	return <Component />
}
