// Forum categories. Posts store the `key` (the same in every language); the
// name and description come from the Jan03_Forum_x8k2 translations.
import { Compass, Globe, Map, Mountain, Plane, Tent, Umbrella, type LucideIcon } from 'lucide-react'

export const FORUM_CATEGORIES = [
	{ key: 'general', icon: Globe, name: 'General_Travel', description: 'General_Travel_Description' },
	{ key: 'adventure', icon: Mountain, name: 'Adventure_Travel', description: 'Adventure_Travel_Description' },
	{ key: 'beach', icon: Umbrella, name: 'Beach_Destinations', description: 'Beach_Destinations_Description' },
	{ key: 'air', icon: Plane, name: 'Air_Travel', description: 'Air_Travel_Description' },
	{ key: 'stays', icon: Tent, name: 'Accommodation', description: 'Accommodation_Description' },
	{ key: 'planning', icon: Map, name: 'Trip_Planning', description: 'Trip_Planning_Description' },
	{ key: 'guides', icon: Compass, name: 'Travel_Guides', description: 'Travel_Guides_Description' },
] as const satisfies readonly { key: string; icon: LucideIcon; name: string; description: string }[]

export type ForumCategoryKey = (typeof FORUM_CATEGORIES)[number]['key']

export const isForumCategory = (value: unknown): value is ForumCategoryKey =>
	FORUM_CATEGORIES.some((c) => c.key === value)

export const forumCategory = (key: string | null | undefined) =>
	FORUM_CATEGORIES.find((c) => c.key === key)
