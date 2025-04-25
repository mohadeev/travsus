import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from '@reduxjs/toolkit'
import type { RootState } from '../../store'

// Define types
export interface Company {
	id: string
	name: string
	type: 'travel_agency' | 'hotel'
	description?: string
	isActive?: boolean
	logo?: string
	createdAt: string
	updatedAt: string
}

interface CompanyState {
	companies: Company[]
	activeCompany: any // Using 'any' to match your data structure
	status: 'idle' | 'loading' | 'succeeded' | 'failed'
	error: string | null
	lastFetched: number | null
	isChangingActive: boolean // New state to track active company changes separately
}

// Initial state
const initialState: CompanyState = {
	companies: [],
	activeCompany: null,
	status: 'idle',
	error: null,
	lastFetched: null,
	isChangingActive: false,
}

// Async thunks
export const fetchCompanies = createAsyncThunk(
	'company/fetchCompanies',
	async (_, { getState, rejectWithValue }) => {
		try {
			// Get current state
			const state = getState() as RootState
			const lastFetched = state.company?.lastFetched
			const currentTime = Date.now()

			// If data was fetched less than 5 minutes ago, use cached data
			if (
				lastFetched &&
				currentTime - lastFetched < 5 * 60 * 1000 &&
				state.company?.companies.length > 0
			) {
				return state.company.companies
			}

			// Otherwise fetch fresh data
			const response = await fetch('/api/dashboard/companies')
			if (!response.ok) {
				throw new Error('Failed to fetch companies')
			}
			const data = await response.json()
			return data
		} catch (error: any) {
			return rejectWithValue(error.message)
		}
	},
)

export const fetchActiveCompany = createAsyncThunk(
	'company/fetchActiveCompany',
	async (_, { getState, rejectWithValue }) => {
		try {
			// Get current state
			const state = getState() as RootState
			const lastFetched = state.company?.lastFetched
			const currentTime = Date.now()

			// If data was fetched less than 5 minutes ago and we have an active company, use cached data
			if (
				lastFetched &&
				currentTime - lastFetched < 5 * 60 * 1000 &&
				state.company?.activeCompany
			) {
				return state.company.activeCompany
			}

			// Otherwise fetch fresh data
			const response = await fetch('/api/dashboard/company/active')
			if (!response.ok) {
				throw new Error('Failed to fetch active company')
			}
			const data = await response.json()
			return data
		} catch (error: any) {
			return rejectWithValue(error.message)
		}
	},
)

export const setActiveCompany = createAsyncThunk(
	'company/setActiveCompany',
	async (companyId: string, { getState, rejectWithValue }) => {
		try {
			const response = await fetch('/api/dashboard/company/set-active', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ companyId }),
			})
			if (!response.ok) {
				throw new Error('Failed to set active company')
			}
			const data = await response.json()
			return data
		} catch (error: any) {
			return rejectWithValue(error.message)
		}
	},
)

// Create slice
const companySlice = createSlice({
	name: 'company',
	initialState,
	reducers: {
		clearActiveCompany: (state) => {
			state.activeCompany = null
		},
		clearCompanyCache: (state) => {
			state.lastFetched = null
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch companies
			.addCase(fetchCompanies.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(
				fetchCompanies.fulfilled,
				(state, action: PayloadAction<Company[]>) => {
					state.status = 'succeeded'
					state.companies = action.payload
					state.lastFetched = Date.now()
				},
			)
			.addCase(fetchCompanies.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload as string
			})
			// Fetch active company
			.addCase(fetchActiveCompany.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(
				fetchActiveCompany.fulfilled,
				(state, action: PayloadAction<any>) => {
					state.status = 'succeeded'
					state.activeCompany = action.payload
					state.lastFetched = Date.now()
				},
			)
			.addCase(fetchActiveCompany.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload as string
			})
			// Set active company
			.addCase(setActiveCompany.pending, (state, action) => {
				// Don't set status to loading, just track that we're changing the active company
				state.isChangingActive = true

				// Immediately update the active company locally for better UX
				const companyId = action.meta.arg
				const selectedCompany = state.companies.find(
					(company) => company.id === companyId,
				)

				if (selectedCompany) {
					// Set the selected company as active locally
					// Using the structure activeCompany.company to match your data structure
					state.activeCompany = {
						company: selectedCompany,
					}

					// Update the companies array to reflect the change
					state.companies = state.companies.map((company) => ({
						...company,
						isActive: company.id === companyId,
					}))
				}
			})
			.addCase(
				setActiveCompany.fulfilled,
				(state, action: PayloadAction<any>) => {
					// Keep the status as succeeded if it was already succeeded
					if (state.status === 'loading') {
						state.status = 'succeeded'
					}
					state.isChangingActive = false
					state.activeCompany = action.payload
					state.lastFetched = Date.now()

					// Update the company in the companies array if needed
					if (action.payload && action.payload.company) {
						const companyId = action.payload.company.id
						const index = state.companies.findIndex((c) => c.id === companyId)
						if (index !== -1) {
							// Set all companies to inactive
							state.companies = state.companies.map((c) => ({
								...c,
								isActive: false,
							}))
							// Set the selected company to active
							state.companies[index] = {
								...state.companies[index],
								isActive: true,
							}
						}
					}
				},
			)
			.addCase(setActiveCompany.rejected, (state, action) => {
				// Only set status to failed if it was loading
				if (state.status === 'loading') {
					state.status = 'failed'
				}
				state.isChangingActive = false
				state.error = action.payload as string
			})
	},
})

// Export actions
export const { clearActiveCompany, clearCompanyCache } = companySlice.actions

// Export selectors
export const selectAllCompanies = (state: RootState) => {
	return state.company?.companies || []
}
export const selectActiveCompany = (state: RootState) => {
	return state.company?.activeCompany || null
}
export const selectCompanyStatus = (state: RootState) => {
	return state.company?.status || 'idle'
}
export const selectIsChangingActive = (state: RootState) => {
	return state.company?.isChangingActive || false
}
export const selectCompanyError = (state: RootState) =>
	state.company?.error || null
export const selectLastFetched = (state: RootState) =>
	state.company?.lastFetched || null

// Export reducer
export default companySlice.reducer
