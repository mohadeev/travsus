// Company shown in the legacy admin template (components/Layouts/DefaultLayout).
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

type BusinessState = { company: any | null }

const initialState: BusinessState = { company: null }

const businessSlice = createSlice({
	name: 'business',
	initialState,
	reducers: {
		setBusinessCompany(state, action: PayloadAction<any>) {
			state.company = action.payload
		},
	},
})

export const { setBusinessCompany } = businessSlice.actions
export default businessSlice.reducer

export const selectBusinessCompany = (state: RootState) =>
	state.business.company
