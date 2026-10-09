'use server'

import { db, T, must, newId } from '@/lib/db'

const COUNTER_NAME = 'orderCounter'
const COUNTER_START = 1000000000

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

/**
 * Atomically takes the next order counter value.
 * Uses compare-and-swap: the update only succeeds if nobody changed the value
 * in between, otherwise it retries — so two checkouts never share a number.
 */
async function nextCounterValue(): Promise<number> {
	for (let attempt = 0; attempt < 10; attempt++) {
		const counter = must(
			await db.from(T.counters).select('value').eq('name', COUNTER_NAME).maybeSingle(),
		)

		if (!counter) {
			const { error } = await db
				.from(T.counters)
				.insert({ id: newId(), name: COUNTER_NAME, value: COUNTER_START })
			if (!error) return COUNTER_START
			continue // someone else created it first — retry
		}

		const next = counter.value + 1
		const updated = must(
			await db
				.from(T.counters)
				.update({ value: next })
				.eq('name', COUNTER_NAME)
				.eq('value', counter.value)
				.select('value'),
		)
		if (updated?.length) return next
	}
	throw new Error('Could not reserve an order number, please retry')
}

export async function createOrderNumber() {
	try {
		return generateNumbers(await nextCounterValue())
	} catch (error) {
		console.error('Failed to create order numbers:', error)
	}
}
