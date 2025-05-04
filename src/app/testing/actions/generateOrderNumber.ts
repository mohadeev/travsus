'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateNumbers(counter: number) {
	// This will generate a 10-digit number
	const numberPart = counter.toString().padStart(10, '0')
	const year = new Date().getFullYear().toString().slice(-2)

	return {
		orderNumber: `TR-${numberPart}`,
		invoiceNumber: `INV-${numberPart}`,
		receiptNumber: `REC-${numberPart}`,
		bookingReference: `TRVS-${year}-${numberPart}`,
	}
}

export async function createOrderNumber() {
	try {
		// Use a transaction to ensure atomicity
		return await prisma.$transaction(async (tx) => {
			// Get and increment the counter
			const counter = await tx.counter.upsert({
				where: { name: 'orderCounter' },
				update: { value: { increment: 1 } },
				create: { name: 'orderCounter', value: 1000000000 }, // Start from 1 billion
			})

			const numbers = generateNumbers(counter.value)
			return numbers
		})
	} catch (error) {
		console.error('Failed to create order numbers:', error)
		console.error('Failed to create order numbers')
	}
}
