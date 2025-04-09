import { PrismaClient as PlacesClient } from 'prisma/generated/places'
import { PrismaClient as UsersPrismaClient } from '@prisma/client'

// Create instances
const placesClient = new PlacesClient()
const prisma = new UsersPrismaClient()

// Default export for `prisma`
export default prisma

// Named export for `placesClient`
export { placesClient }
