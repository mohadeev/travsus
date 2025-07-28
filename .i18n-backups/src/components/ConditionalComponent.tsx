'use client'

import { useComponentVisibility } from '@/hooks/useComponentVisibility'

interface ConditionalComponentProps {
	component: React.ComponentType
	show?: boolean
}

export default function ConditionalComponent({
	component: Component,
	show,
}: ConditionalComponentProps) {
	const isVisible = useComponentVisibility()

	if (!show && !isVisible) {
		return null
	}

	return <Component />
}
