import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const imageObject = {
	url: 'http://res.cloudinary.com/travsus/image/upload/v1728822103/cysxlmxlumy6oyjwfxha.jpg',
	public_id: 'cysxlmxlumy6oyjwfxha',
}

export async function seed() {
	const tours = await prisma.tour.findMany()

	for (const tour of tours) {
		const currentImages = tour.images as any[]
		const newImages = [...currentImages]

		// Add the imageObject 6 times if there are less than 6 objects
		while (newImages.length < 6) {
			newImages.push(imageObject)
		}

		await prisma.tour.update({
			where: { id: tour.id },
			data: { images: newImages },
		})
	}

	console.log('Seed completed: Added image objects to all tours')
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
