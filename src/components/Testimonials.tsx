import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Circle } from 'lucide-react'
import defualt_user from '@/images/defualt_user.jpg'

interface Testimonial {
	id: number
	name: string
	avatar: string
	rating: number
	review: string
	location?: string
	title: string
	date: string
	serviceType: string
}

const testimonials: Testimonial[] = [
	{
		id: 1,
		name: 'Sarah Johnson',
		avatar: '/professional-woman-smiling.png',
		rating: 5,
		title: 'Exceptional Kitchen Renovation',
		review:
			'The home renovation service exceeded all my expectations. The team was professional, punctual, and delivered exceptional quality work. My kitchen looks absolutely stunning!',
		location: 'Austin, TX',
		date: '2024-01-15',
		serviceType: 'Kitchen Renovation',
	},
	{
		id: 2,
		name: 'Michael Chen',
		avatar: '/professional-man-smiling.png',
		rating: 5,
		title: 'Outstanding Bathroom Transformation',
		review:
			'Outstanding service from start to finish. They transformed our outdated bathroom into a modern oasis. The attention to detail and craftsmanship is remarkable.',
		location: 'Seattle, WA',
		date: '2024-02-20',
		serviceType: 'Bathroom Remodel',
	},
	{
		id: 3,
		name: 'Emily Rodriguez',
		avatar: '/professional-woman-happy.png',
		rating: 4,
		title: 'Great Living Room Makeover',
		review:
			'Great experience working with this team. They were responsive, professional, and completed our living room makeover on time and within budget. Highly recommend!',
		location: 'Denver, CO',
		date: '2024-03-10',
		serviceType: 'Living Room Design',
	},
]

const StarRating = ({ rating }: { rating: number }) => {
	return (
		<div className="flex items-center gap-2">
			<div className="flex gap-0.5">
				{[1, 2, 3, 4, 5].map((circle) => (
					<Circle
						key={circle}
						className={`h-4.5 w-4.5 ${circle <= rating ? 'fill-green-600 text-green-600' : 'text-gray-300'}`}
					/>
				))}
			</div>
			<span className="text-sm font-medium text-gray-700">{rating}/5</span>
		</div>
	)
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
	return (
		<Card className="min-w-100 bg-white">
			<CardContent className="p-6">
				<div className="flex items-start gap-4">
					<div className="flex-1">
						<div className="flex items-start justify-between">
							<div className="flex gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage
										src={
											testimonial?.userImage
												? testimonial?.userImage
												: defualt_user.src
										}
										alt={testimonial.name}
									/>
									<AvatarFallback>
										{testimonial.name
											.split(' ')
											.map((n) => n[0])
											.join('')
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<h4 className="font-semibold text-gray-900">
										{testimonial.name}
									</h4>
									{testimonial.location && (
										<div className="flex items-center text-sm font-medium text-black">
											<span>{testimonial.location}</span>
										</div>
									)}
								</div>
							</div>
							<div className="text-sm font-medium text-black">
								{new Date(testimonial.date).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</div>
						</div>

						<div className="mt-3">
							<div className="mb-2">
								<StarRating rating={testimonial.rating} />
							</div>

							<h3 className="mb-2 text-lg font-semibold text-gray-900">
								{testimonial.title}
							</h3>
							<p className="mb-3 leading-relaxed text-gray-700">
								{testimonial.review}
							</p>

							<div className="flex flex-wrap gap-4 text-sm/6 font-semibold text-black">
								<span>Service Type: {testimonial.serviceType}</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default function Testimonials() {
	return (
		<section
			className="mx-auto my-10 w-full px-4 py-16"
			style={{ backgroundColor: '#F5F5F7' }}
		>
			<div className="container">
				<div className="mb-12 text-start">
					<h2 className="mb-4 text-balance text-3xl font-bold text-gray-900">
						What Our Customers Say
					</h2>
					<p className="max-w-2xl text-pretty text-xs text-black">
						Don't just take our word for it. Here's what our satisfied customers
						have to say about their home transformation experience.
					</p>
				</div>

				<div className="flex flex-row items-start gap-6 overflow-auto">
					{testimonials.map((testimonial) => (
						<TestimonialCard key={testimonial.id} testimonial={testimonial} />
					))}
				</div>
			</div>
		</section>
	)
}
