// The booking being built on a tour page and paid for at checkout:
// date, guests, accommodation and the priced line items.
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import type { AppDispatch, RootState } from '../index'

export type Booking = {
	id?: string
	tour?: any
	selectedDate?: any
	guests: any // { guestAdults, guestChildren }
	accommodation: any
	bookOwnHotels: boolean
	lineItems: any[]
	[key: string]: any // extra fields when loaded from the server
}

type BookingState = {
	booking: Booking
	status: 'idle' | 'loading' | 'succeeded' | 'failed'
	error: string | null
	promoRemoved: boolean // a change at checkout dropped the promo code
}

const emptyBooking: Booking = {
	guests: {},
	accommodation: {},
	bookOwnHotels: false,
	lineItems: [],
}

const initialState: BookingState = {
	booking: emptyBooking,
	status: 'idle',
	error: null,
	promoRemoved: false,
}

/**
 * Re-prices the booking for `tour` after a change.
 * `changes` may hold `guests` or `accommodation`; empty = default 2 adults.
 */
export const recalculatePrice = createAsyncThunk(
	'booking/recalculatePrice',
	async (
		{ tour, changes = {} }: { tour: any; changes?: Record<string, any> },
		{ getState, rejectWithValue },
	) => {
		try {
			const { booking } = (getState() as RootState).booking
			const result = await updateLineItemsLogic({
				tour,
				body: { ...changes, booking },
			})
			return {
				lineItems: result.lineItems,
				guests: result.guests,
				accommodation: result.accommodation,
			}
		} catch (error: any) {
			return rejectWithValue(error?.message ?? 'Pricing failed')
		}
	},
)

/**
 * Saves a change to a booking that already exists (checkout page):
 * date, guests, accommodation or own hotels. The server re-prices it.
 */
export const saveBookingChanges = createAsyncThunk(
	'booking/saveChanges',
	async (
		{ bookingId, changes }: { bookingId: string; changes: Record<string, any> },
		{ rejectWithValue },
	) => {
		const response = await fetch(`/api/bookings/${bookingId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(changes),
		})
		const data = await response.json().catch(() => null)
		if (!response.ok) return rejectWithValue(data?.error ?? 'Could not save')
		return data as { booking: Booking; promoRemoved: boolean }
	},
)

const bookingSlice = createSlice({
	name: 'booking',
	initialState,
	reducers: {
		/** Opens a tour page: start a fresh booking unless it's the same tour. */
		startBooking(state, action: PayloadAction<any>) {
			const tour = action.payload
			if (state.booking.tour?.id === tour?.id) return
			state.booking = { ...emptyBooking, tour }
			state.status = 'idle'
			state.error = null
		},
		/** Replaces the booking with one loaded from the server (checkout, payment). */
		setBooking(state, action: PayloadAction<any>) {
			state.booking = action.payload
		},
		setSelectedDate(state, action: PayloadAction<any>) {
			state.booking.selectedDate = action.payload
		},
		setBookOwnHotels(state, action: PayloadAction<boolean>) {
			state.booking.bookOwnHotels = action.payload
		},
		setLineItems(state, action: PayloadAction<any[]>) {
			state.booking.lineItems = action.payload
		},
		/** Includes or excludes a line item (e.g. "accommodation") from the total. */
		includeLineItem(
			state,
			action: PayloadAction<{ description: string; include: boolean }>,
		) {
			const { description, include } = action.payload
			for (const item of state.booking.lineItems) {
				if (item.description === description) item.includeInTotal = include
			}
		},
		resetBooking: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(recalculatePrice.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(recalculatePrice.fulfilled, (state, action) => {
				state.status = 'succeeded'
				Object.assign(state.booking, action.payload)
			})
			.addCase(recalculatePrice.rejected, (state, action) => {
				state.status = 'failed'
				state.error = String(action.payload ?? action.error.message)
			})
			.addCase(saveBookingChanges.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(saveBookingChanges.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.booking = action.payload.booking
				state.promoRemoved = action.payload.promoRemoved
			})
			.addCase(saveBookingChanges.rejected, (state, action) => {
				state.status = 'failed'
				state.error = String(action.payload ?? action.error.message)
			})
	},
})

export const {
	startBooking,
	setBooking,
	setSelectedDate,
	setBookOwnHotels,
	setLineItems,
	includeLineItem,
	resetBooking,
} = bookingSlice.actions
export default bookingSlice.reducer

/**
 * Call when a tour page opens: starts and prices a booking for that tour,
 * unless one is already in progress for it (keeps the user's choices).
 */
export const openTourBooking =
	(tour: any) => (dispatch: AppDispatch, getState: () => RootState) => {
		const { booking } = getState().booking
		if (!tour?.id) return
		if (booking.tour?.id === tour.id && booking.lineItems.length) return
		dispatch(startBooking(tour))
		dispatch(recalculatePrice({ tour }))
	}

export const selectBooking =(state: RootState) => state.booking.booking
export const selectBookingStatus = (state: RootState) => state.booking.status
export const selectPromoRemoved = (state: RootState) => state.booking.promoRemoved

/** Sum of the line items included in the total. */
export const totalOf = (lineItems: any[] = []) =>
	lineItems
		.filter((item) => item.includeInTotal === true)
		.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0)
