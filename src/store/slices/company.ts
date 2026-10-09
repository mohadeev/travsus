// Dashboard companies and the one currently active.
// Saved in localStorage (see store/index.ts) and refreshed after 5 minutes.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../index'

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

type CompanyState = {
	companies: Company[]
	activeCompany: any // { company: Company, ... } from /api/dashboard/company/active
	status: 'idle' | 'loading' | 'succeeded' | 'failed'
	error: string | null
	lastFetched: number | null
	isChangingActive: boolean
}

const initialState: CompanyState = {
	companies: [],
	activeCompany: null,
	status: 'idle',
	error: null,
	lastFetched: null,
	isChangingActive: false,
}

const CACHE_MS = 5 * 60 * 1000
const isFresh = (state: RootState) =>
	!!state.company.lastFetched &&
	Date.now() - state.company.lastFetched < CACHE_MS

async function getJson(url: string, init?: RequestInit) {
	const response = await fetch(url, init)
	if (!response.ok) throw new Error(`Request failed: ${url}`)
	return response.json()
}

export const fetchCompanies = createAsyncThunk(
	'company/fetchCompanies',
	async (_: void, { getState, rejectWithValue }) => {
		const state = getState() as RootState
		if (isFresh(state) && state.company.companies.length > 0) {
			return state.company.companies
		}
		try {
			return (await getJson('/api/dashboard/companies')) as Company[]
		} catch (error: any) {
			return rejectWithValue(error.message)
		}
	},
)

export const fetchActiveCompany = createAsyncThunk(
	'company/fetchActiveCompany',
	async (_: void, { getState, rejectWithValue }) => {
		const state = getState() as RootState
		if (isFresh(state) && state.company.activeCompany) {
			return state.company.activeCompany
		}
		try {
			return await getJson('/api/dashboard/company/active')
		} catch (error: any) {
			return rejectWithValue(error.message)
		}
	},
)

export const setActiveCompany = createAsyncThunk(
	'company/setActiveCompany',
	async (companyId: string, { rejectWithValue }) => {
		try {
			return await getJson('/api/dashboard/company/set-active', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ companyId }),
			})
		} catch (error: any) {
			return rejectWithValue(error.message)
		}
	},
)

const markActive = (state: CompanyState, companyId: string) => {
	state.companies = state.companies.map((company) => ({
		...company,
		isActive: company.id === companyId,
	}))
}

const companySlice = createSlice({
	name: 'company',
	initialState,
	reducers: {
		clearActiveCompany(state) {
			state.activeCompany = null
		},
		clearCompanyCache(state) {
			state.lastFetched = null
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCompanies.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(fetchCompanies.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.companies = action.payload
				state.lastFetched = Date.now()
			})
			.addCase(fetchCompanies.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload as string
			})

			.addCase(fetchActiveCompany.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(fetchActiveCompany.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.activeCompany = action.payload
				state.lastFetched = Date.now()
			})
			.addCase(fetchActiveCompany.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.payload as string
			})

			// Switch locally right away, then confirm with the server's answer
			.addCase(setActiveCompany.pending, (state, action) => {
				state.isChangingActive = true
				const companyId = action.meta.arg
				const selected = state.companies.find((c) => c.id === companyId)
				if (selected) {
					state.activeCompany = { company: selected }
					markActive(state, companyId)
				}
			})
			.addCase(setActiveCompany.fulfilled, (state, action) => {
				if (state.status === 'loading') state.status = 'succeeded'
				state.isChangingActive = false
				state.activeCompany = action.payload
				state.lastFetched = Date.now()
				const companyId = action.payload?.company?.id
				if (companyId) markActive(state, companyId)
			})
			.addCase(setActiveCompany.rejected, (state, action) => {
				if (state.status === 'loading') state.status = 'failed'
				state.isChangingActive = false
				state.error = action.payload as string
			})
	},
})

export const { clearActiveCompany, clearCompanyCache } = companySlice.actions
export default companySlice.reducer

export const selectAllCompanies = (state: RootState) => state.company.companies
export const selectActiveCompany = (state: RootState) =>
	state.company.activeCompany
export const selectCompanyStatus = (state: RootState) => state.company.status
export const selectIsChangingActive = (state: RootState) =>
	state.company.isChangingActive
export const selectCompanyError = (state: RootState) => state.company.error
