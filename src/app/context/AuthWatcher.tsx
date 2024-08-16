'use client'
import { SessionProvider, useSession } from 'next-auth/react'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import { AppProps } from 'next/app'
import { useEffect } from 'react'
import {
	clearUser,
	setUser,
} from '../GlobalRedux/Features/userReducer/userReducer'
import basedGetUrlRequestLogedIn from '../utils/basedGetUrlRequestLogedIn'

function AuthWatcher() {
	const { data: session, status } = useSession()
	const dispatch = useDispatch()

	useEffect(() => {
		if (status === 'authenticated' && session?.user) {
			;(async () => {
				basedGetUrlRequestLogedIn('/api/user/userData').then((res) => {
					const message = res?.message
					const user = res?.user
					if (user?.id && message) {
						dispatch(setUser(user))
					}
				})
			})()
		} else if (status === 'unauthenticated') {
			dispatch(clearUser())
			console.log('session?.user', 'unauthenticated')
		}
	}, [session, status, dispatch])

	return null
}

export default AuthWatcher
