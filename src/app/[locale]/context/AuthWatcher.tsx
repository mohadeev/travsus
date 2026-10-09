'use client'
// Keeps the Redux user in sync with the Clerk session.
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { clearUser, setUser } from '@/store/slices/user'
import basedGetUrlRequestLogedIn from '@/app/utils/basedGetUrlRequestLogedIn'

function AuthWatcher() {
	const { isLoaded, isSignedIn, userId } = useAuth()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!isLoaded) return
		if (!isSignedIn) {
			dispatch(clearUser())
			return
		}
		// Loads (or on first sign-in creates) the TRAVSUS account
		basedGetUrlRequestLogedIn('/api/user/userData').then((res) => {
			if (res?.user?.id) dispatch(setUser(res.user))
			else dispatch(clearUser())
		})
	}, [isLoaded, isSignedIn, userId, dispatch])

	return null
}

export default AuthWatcher
