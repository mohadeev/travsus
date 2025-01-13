'use client'

import { useState } from 'react'
import {
	Search,
	Compass,
	Globe,
	Map,
	Mountain,
	Plane,
	Tent,
	Umbrella,
	ChevronLeft,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { createPost } from '@/app/actions/forum/createPost'
import Textarea from '@/shared/Textarea'

const categories = [
	{
		icon: Globe,
		name: 'General Travel',
		description: 'General travel discussions and tips',
		posts: 234,
		color: 'text-blue-500',
	},
	{
		icon: Mountain,
		name: 'Adventure Travel',
		description: 'Hiking, climbing, and outdoor adventures',
		posts: 156,
		color: 'text-green-500',
	},
	{
		icon: Umbrella,
		name: 'Beach Destinations',
		description: 'Beach holidays and coastal getaways',
		posts: 189,
		color: 'text-yellow-500',
	},
	{
		icon: Plane,
		name: 'Air Travel',
		description: 'Flight experiences and airline reviews',
		posts: 321,
		color: 'text-purple-500',
	},
	{
		icon: Tent,
		name: 'Accommodation',
		description: 'Hotels, hostels, and places to stay',
		posts: 267,
		color: 'text-red-500',
	},
	{
		icon: Map,
		name: 'Trip Planning',
		description: 'Itineraries and travel planning help',
		posts: 412,
		color: 'text-indigo-500',
	},
	{
		icon: Compass,
		name: 'Travel Guides',
		description: 'Destination guides and recommendations',
		posts: 178,
		color: 'text-orange-500',
	},
]

const recentPosts = [
	{
		id: '1',
		title: "Best time to visit Morocco's Sahara Desert",
		excerpt:
			'Planning a desert adventure and would love some advice on the ideal season for visiting the Sahara...',
		author: { name: 'Sarah Johnson', image: '/placeholder.svg' },
		createdAt: new Date('2024-01-04'),
		tags: ['Morocco', 'Desert', 'Travel Tips'],
		category: 'Adventure Travel',
	},
	{
		id: '2',
		title: 'Hidden gems in Essaouira',
		excerpt:
			'Just returned from an amazing trip to Essaouira and wanted to share some lesser-known spots...',
		author: { name: 'Mike Peters', image: '/placeholder.svg' },
		createdAt: new Date('2024-01-03'),
		tags: ['Morocco', 'Essaouira', 'Travel Guide'],
		category: 'Travel Guides',
	},
	{
		id: '3',
		title: 'Transportation options from Marrakech to Fes',
		excerpt:
			'Looking for recommendations on the best way to travel between these two cities...',
		author: { name: 'Emma Wilson', image: '/placeholder.svg' },
		createdAt: new Date('2024-01-02'),
		tags: ['Morocco', 'Transportation', 'Travel Planning'],
		category: 'Trip Planning',
	},
]

type Page = 'main' | 'category' | 'post'

const CreatePostForm = ({
	onClose,
	onSubmit,
}: {
	onClose: () => void
	onSubmit: (formData: FormData) => Promise<{ success: boolean }>
}) => {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [tags, setTags] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const formData = new FormData()
		formData.append('title', title)
		formData.append('content', content)
		formData.append('tags', tags)
		formData.append('authorId', 'mock-user-id') // Replace with actual user ID when authentication is implemented

		const result = await onSubmit(formData)
		if (result.success) {
			setTitle('')
			setContent('')
			setTags('')
			onClose()
		} else {
			alert('Failed to create post. Please try again.')
		}
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="w-full max-w-2xl rounded-lg bg-white p-6">
				<h2 className="mb-4 text-2xl font-bold">Create New Discussion</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700"
						>
							Title
						</label>
						<Input
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
							className="mt-1"
						/>
					</div>
					<div>
						<label
							htmlFor="content"
							className="block text-sm font-medium text-gray-700"
						>
							Content
						</label>
						<Textarea
							id="content"
							value={content}
							onChange={(e) => setContent(e.target.value)}
							required
							className="mt-1"
							rows={5}
						/>
					</div>
					<div>
						<label
							htmlFor="tags"
							className="block text-sm font-medium text-gray-700"
						>
							Tags (comma-separated)
						</label>
						<Input
							id="tags"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
							className="mt-1"
						/>
					</div>
					<div className="flex justify-end space-x-2">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit">Create Post</Button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default CreatePostForm
