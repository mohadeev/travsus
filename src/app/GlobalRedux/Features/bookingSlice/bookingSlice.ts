import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import updateNestedStateWithMap from '../../updateNestedStateWithMap'
import { updateLineItemsLogic } from '../../../api/updateLineItems/updateLineItemsLogic'
import { RootState } from '../../store'
//
const initialState: any = {
	booking: {
		serviceCharge: 10,
		accommodation: {},
		bookOwnHotels: false,
		guests: {},
		lineItems: [],
	},
	status: 'default',
	fetched: false,
	error: null,
}

export const updateLineItemsAsync = createAsyncThunk(
	'booking/updateLineItems',
	async (body: any, { rejectWithValue }) => {
		try {
			console.log('body:', body)
			// Uncomment and implement the actual API call when ready
			// const response = await fetch('/api/updateLineItems', {
			//   method: 'POST',
			//   headers: {
			//     'Content-Type': 'application/json',
			//   },
			//   body: JSON.stringify(body),
			// })
			// if (!response.ok) {
			//   throw new Error('Failed to update line items')
			// }
			// const data = await response.json()
			// return data
			return {} // Remove this line when implementing the actual API call
		} catch (error: any) {
			return rejectWithValue(error?.message)
		}
	},
)

export const localUpdateLineItemsLogicAsync: any = createAsyncThunk(
	'booking/localUpdateLineItemsLogic',
	async ({ value, tour }: any, { getState, rejectWithValue }) => {
		try {
			const state: any = getState() as RootState
			const body = { ...value, booking: state?.booking }
			const newUpdate = await updateLineItemsLogic({
				tour,
				body,
			})
			return newUpdate
		} catch (error: any) {
			console.log('localUpdateLineItemsLogicAsyncErrr:', error)
			return rejectWithValue(error.message)
		}
	},
)

const bookingSlice = createSlice({
	name: 'booking',
	initialState,
	reducers: {
		setSelectedDate: (state, action: PayloadAction<string>) => {
			state.booking.selectedDate = action.payload
			console.log('action.payload:', action.payload)
		},
		setSeats: (state, action: PayloadAction<number>) => {
			state.booking.seats = action.payload
			state.booking.subtotal = state.booking.pricePerSeat * state.booking.seats
			state.booking.totalPrice =
				state.booking.subtotal + state.booking.serviceCharge
		},
		setGustes: (state, action: PayloadAction<any>) => {
			state.booking.guests = action.payload
		},
		setAccommodation: (state, action: PayloadAction<number>) => {
			state.booking.accommodation = action.payload
		},
		setPricePerSeat: (state, action: PayloadAction<number>) => {
			state.booking.pricePerSeat = action.payload
			state.booking.subtotal = state.booking.pricePerSeat * state.booking.seats
			state.booking.totalPrice =
				state.booking.subtotal + state.booking.serviceCharge
		},
		updateBookingState: (state, action: PayloadAction<any>) => {
			const { fetched } = state

			if (!fetched) {
				console.log('booking data aleardy fetched')
				const { path, value } = action.payload
				updateNestedStateWithMap(state, path, value)
				state.fetched = true
			}
		},
		bookOwnHotelsReducers: (state, action: PayloadAction<any>) => {
			const { path, value } = action.payload
			updateNestedStateWithMap(state, path, value)
		},
		updateBookingLineItems: (state, action: PayloadAction<any>) => {
			const { path, value } = action.payload
			updateNestedStateWithMap(state, path, value)
		},
		updateProvidedService: (state, action: PayloadAction<any>) => {
			const { path, value } = action.payload
			updateNestedStateWithMap(state, path, value)
		},
		removeLineItem: (state, action: PayloadAction<any>) => {
			const descriptionToToggle = action.payload.description
			const value = action.payload.value
			const lineItems = state.booking.lineItems

			const newLineItems = lineItems.map((item: any) =>
				item.description === descriptionToToggle
					? { ...item, includeInTotal: value }
					: item,
			)
			state.booking.lineItems = newLineItems
		},
		resetBooking: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(updateLineItemsAsync.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(updateLineItemsAsync.fulfilled, (state, action) => {
				state.status = 'succeeded'
				const { lineItems, guests, accommodation }: any = action.payload
				if (lineItems) state.booking.lineItems = lineItems
				if (guests) state.booking.guests = guests
				if (accommodation !== undefined && accommodation !== null) {
					state.booking.accommodation = accommodation
				}
			})
			.addCase(updateLineItemsAsync.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload as string
			})
			.addCase(localUpdateLineItemsLogicAsync.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(localUpdateLineItemsLogicAsync.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.booking = { ...state.booking, ...action.payload }
			})
			.addCase(localUpdateLineItemsLogicAsync.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload as string
			})
	},
})

export const {
	setSelectedDate,
	setSeats,
	setPricePerSeat,
	resetBooking,
	updateBookingState,
	updateBookingLineItems,
	setAccommodation,
	setGustes,
	bookOwnHotelsReducers,
	updateProvidedService,
	removeLineItem,
} = bookingSlice.actions

export default bookingSlice.reducer
