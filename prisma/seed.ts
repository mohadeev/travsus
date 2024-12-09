import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	const travelSpots = [
		{
			title: 'Explore the Vibrant Medina of Marrakech',
			subtitle: 'Discover the bustling souks and historic architecture',
			content:
				"Immerse yourself in the colorful world of Marrakech's medina...",
			imageUrl: '/images/marrakech-medina.jpg',
		},
		{
			title: 'Sahara Desert Adventure',
			subtitle: 'Experience the magic of the Moroccan desert',
			content:
				'Embark on an unforgettable journey through the Sahara Desert...',
			imageUrl: '/images/sahara-desert.jpg',
		},
		{
			title: 'Coastal Charm of Essaouira',
			subtitle: 'Relax in this picturesque seaside town',
			content:
				'Discover the laid-back atmosphere and rich history of Essaouira...',
			imageUrl: '/images/essaouira-coast.jpg',
		},
		{
			title: 'Fes: A Journey Through Time',
			subtitle: 'Explore the oldest imperial city of Morocco',
			content:
				'Step back in time as you wander through the ancient streets of Fes...',
			imageUrl: '/images/fes-medina.jpg',
		},
		{
			title: 'Chefchaouen: The Blue Pearl',
			subtitle: 'Discover the enchanting blue city in the Rif Mountains',
			content:
				'Lose yourself in the mesmerizing blue-washed streets of Chefchaouen...',
			imageUrl: '/images/chefchaouen-blue-city.jpg',
		},
	]

	for (const spot of travelSpots) {
		await prisma.travelSpot.create({
			data: spot,
		})
	}

	console.log('Seed data inserted successfully.')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
