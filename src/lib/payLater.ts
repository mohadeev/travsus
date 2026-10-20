// Book now, pay later: a €20 deposit now, the rest charged on the tour's first day.
// Shared by the tour page, checkout, the payment code and the daily balance job.
import { readTripDates } from '@/lib/tripDates'

export const DEPOSIT_EUR = 20
/** The deposit option only makes sense when something is left to pay later. */
const MIN_BALANCE_EUR = 20

export type PaymentPlan = 'full' | 'deposit'

/** Can this booking be reserved with a deposit? (needs a date and a real balance) */
export function depositAvailable(total: number, selectedDate: any) {
	const [start] = readTripDates(selectedDate)
	return !!start && total - DEPOSIT_EUR >= MIN_BALANCE_EUR
}

/** What is left to pay after the deposit, in euros. */
export const balanceAfterDeposit = (total: number) => Math.round((total - DEPOSIT_EUR) * 100) / 100

/**
 * When the balance is charged: the morning of the first tour day. Dates are
 * stored as the visitor's local midnight; noon UTC of that moment is the right
 * calendar day anywhere, and 06:00 UTC of that day is the morning in Morocco.
 */
export function balanceDueAt(selectedDate: any): Date | null {
	const [start] = readTripDates(selectedDate)
	if (!start) return null
	const day = new Date(start.getTime() + 12 * 3600_000)
	return new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 6, 0, 0))
}
