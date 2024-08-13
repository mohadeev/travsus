'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import { AppProps } from 'next/app'
import { useEffect } from 'react'
import {
	clearUser,
	setUser,
} from '../GlobalRedux/Features/userReducer/userReducer'

function AuthWatcher() {
	const { data: session, status } = useSession()
	const dispatch = useDispatch()
	console.log('session?.user', session?.user)

	useEffect(() => {
		if (status === 'authenticated' && session?.user) {
			dispatch(setUser(session?.user))
		} else if (status === 'unauthenticated') {
			dispatch(clearUser())
			console.log('session?.user', 'unauthenticated')
		}
	}, [session, status, dispatch])

	return null
}

export default AuthWatcher
