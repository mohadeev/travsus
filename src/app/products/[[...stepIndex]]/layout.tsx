// 'use client'
// import React, { useEffect } from 'react'
// import { FC } from 'react'
// import ButtonPrimary from '@/shared/ButtonPrimary'
// import ButtonSecondary from '@/shared/ButtonSecondary'
// import { Route } from '@/routers/types'
// import {
// 	useSearchParams,
// 	useRouter,
// 	usePathname,
// 	redirect,
// } from 'next/navigation'
// import { useDispatch, useSelector } from 'react-redux'
// import getFetchDataFromApi from '@/utils/getFetchDataFromApi'
// import { updateServiceState } from '@/app/GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
// import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'
// import Link from 'next/link'

// export interface CommonLayoutProps {
// 	children: React.ReactNode
// 	params: {
// 		stepIndex: string
// 	}
// }

// const CommonLayout: FC<CommonLayoutProps> = ({ children, params }) => {
// 	const pathname = usePathname()

// 	function updateSearchParam({
// 		key,
// 		value,
// 	}: {
// 		key: string
// 		value: string
// 	}): string {
// 		// const pathname = usePathname()
// 		const searchParams = useSearchParams()
// 		const params = new URLSearchParams(searchParams)
// 		if (value) {
// 			// set the search parameter if value is not empty
// 			params.set(key, value)
// 		} else {
// 			params.delete(key)
// 		}
// 		return `${pathname}?${params.toString()}`
// 	}

// 	const dispatch = useDispatch()
// 	const searchParams = useSearchParams()
// 	const step = searchParams.get('step')
// 	const serviceId = searchParams.get('serviceId')
// 	const service = useSelector(
// 		(state: any) => state.creatingServiceSlice.service,
// 	)
// 	const index = Number(step) || 1
// 	const nextHref = updateSearchParam({
// 		key: 'step',
// 		value: `${index < 10 ? index + 1 : 1}`,
// 	}) as Route
// 	const backtHref = updateSearchParam({
// 		key: 'step',
// 		value: `${index > 1 ? index - 1 : 1}`,
// 	}) as Route
// 	const currenthref = (stp: number) => {
// 		const searchParams = useSearchParams()
// 		const params = new URLSearchParams(searchParams)

// 		if (stp) {
// 			// Set the search parameter if stp is not empty
// 			params.set('step', String(stp))
// 		} else {
// 			params.delete('step')
// 		}

// 		return {
// 			pathname: pathname,
// 			query: { ...Object.fromEntries(params.entries()) }, // Convert search params to an object
// 		}
// 	}
// 	const nextBtnText = index > 9 ? 'Publish listing' : 'Continue'
// 	useEffect(() => {
// 		;(async () => {
// 			try {
// 				const serviceData = await getFetchDataFromApi(
// 					'/api/listing/get/getTourData?',
// 					{
// 						id: serviceId,
// 					},
// 				)
// 				serviceData
// 				dispatch(updateServiceState({ path: 'service', value: serviceData }))
// 			} catch (error) {}

// 			// console.log('serviceData', serviceData)
// 		})()

// 		return () => {}
// 	}, [serviceId])

// 	const handleClickPulbishProduct = async () => {
// 		console.log('service: ', service)
// 		if (index > 9) {
// 			const body: any = { tourData: service }
// 			await basedPostUrlRequestLogedIn('/api/listing/post/edit-listing', body)
// 				.then((res: any) => {
// 					console.log('res', res)
// 					// if (res.responseData.success) {
// 					// 	console.log(res)
// 					// }
// 				})
// 				.catch((err) => {
// 					console.log('err', err)
// 				})
// 		}
// 	}

// 	const arr = Array(10).fill(null) // Fills the array with 0s

// 	return (
// 		<div
// 			className={`nc-PageAddListing1 mx-auto max-w-3xl px-4 pb-24 pt-14 sm:py-24 lg:pb-32`}
// 		>
// 			<div className="space-y-11">
// 				<div className="flex flex-row items-start justify-start gap-2 overflow-auto">
// 					{arr.map((_, i) => (
// 						<Link
// 							key={i}
// 							href={currenthref(i + 1)}
// 							className={`inline-flex cursor-pointer items-center justify-between rounded-full border border-neutral-300 ${i + 1 == index ? 'bg-primary-6000 text-neutral-50' : 'bg-white'} px-5 py-2 transition duration-150 ease-in-out hover:border-neutral-400 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700`}
// 						>
// 							{i + 1}
// 						</Link>
// 					))}
// 				</div>
// 				<div>
// 					<span className="text-4xl font-semibold">{index}</span>{' '}
// 					<span className="text-lg text-neutral-500 dark:text-neutral-400">
// 						/ 10
// 					</span>
// 				</div>
// 				{/* --------------------- */}
// 				<div className="listingSection__wrap">{children}</div>
// 				{/* --------------------- */}
// 				<div className="flex justify-end space-x-5">
// 					<ButtonSecondary href={backtHref}>Go back</ButtonSecondary>
// 					<ButtonPrimary
// 						onClick={handleClickPulbishProduct}
// 						// href={nextHref}
// 					>
// 						{nextBtnText || 'Continue'}
// 					</ButtonPrimary>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// export default CommonLayout

'use client'
import React, { useEffect } from 'react'
import { FC } from 'react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { Route } from '@/routers/types'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import getFetchDataFromApi from '@/utils/getFetchDataFromApi'
import { updateServiceState } from '@/app/GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'
import Link from 'next/link'

export interface CommonLayoutProps {
	children: React.ReactNode
	params: {
		stepIndex: string
	}
}

const CommonLayout: FC<CommonLayoutProps> = ({ children, params }) => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const dispatch = useDispatch()
	const step = searchParams.get('step')
	const serviceId = searchParams.get('serviceId')
	const service = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	const index = Number(step) || 1

	// Updated to use searchParams from the component directly
	function updateSearchParam({
		key,
		value,
	}: {
		key: string
		value: string
	}): string {
		const params = new URLSearchParams(searchParams.toString())
		if (value) {
			params.set(key, value)
		} else {
			params.delete(key)
		}
		return `${pathname}?${params.toString()}`
	}

	// Updated to use searchParams from the component directly
	const currenthref = (stp: number) => {
		const params = new URLSearchParams(searchParams.toString())
		if (stp) {
			params.set('step', String(stp))
		} else {
			params.delete('step')
		}
		return {
			pathname,
			query: { ...Object.fromEntries(params.entries()) },
		}
	}

	const nextHref = updateSearchParam({
		key: 'step',
		value: `${index < 10 ? index + 1 : 1}`,
	}) as Route

	const backtHref = updateSearchParam({
		key: 'step',
		value: `${index > 1 ? index - 1 : 1}`,
	}) as Route

	const nextBtnText = index > 9 ? 'Publish listing' : 'Continue'

	// Ensure dispatch is included as a dependency
	useEffect(() => {
		;(async () => {
			try {
				const serviceData = await getFetchDataFromApi(
					'/api/listing/get/getTourData?',
					{
						id: serviceId,
					},
				)
				dispatch(updateServiceState({ path: 'service', value: serviceData }))
			} catch (error) {
				console.error(error)
			}
		})()
	}, [serviceId, dispatch]) // Dispatch included in the dependency array

	const handleClickPulbishProduct = async () => {
		if (index > 9) {
			const body: any = { tourData: service }
			await basedPostUrlRequestLogedIn('/api/listing/post/edit-listing', body)
				.then((res: any) => {
					console.log('res', res)
				})
				.catch((err) => {
					console.log('err', err)
				})
		}
	}

	const arr = Array(10).fill(null) // Fills the array with 0s

	return (
		<div
			className={`nc-PageAddListing1 mx-auto max-w-3xl px-4 pb-24 pt-14 sm:py-24 lg:pb-32`}
		>
			<div className="space-y-11">
				<div className="flex flex-row items-start justify-start gap-2 overflow-auto">
					{arr.map((_, i) => (
						<Link
							key={i}
							href={currenthref(i + 1)}
							className={`inline-flex cursor-pointer items-center justify-between rounded-full border border-neutral-300 ${
								i + 1 === index ? 'bg-primary-6000 text-neutral-50' : 'bg-white'
							} px-5 py-2 transition duration-150 ease-in-out hover:border-neutral-400 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700`}
						>
							{i + 1}
						</Link>
					))}
				</div>
				<div>
					<span className="text-4xl font-semibold">{index}</span>{' '}
					<span className="text-lg text-neutral-500 dark:text-neutral-400">
						/ 10
					</span>
				</div>
				<div className="listingSection__wrap">{children}</div>
				<div className="flex justify-end space-x-5">
					<ButtonSecondary href={backtHref}>Go back</ButtonSecondary>
					<ButtonPrimary onClick={handleClickPulbishProduct}>
						{nextBtnText || 'Continue'}
					</ButtonPrimary>
				</div>
			</div>
		</div>
	)
}

export default CommonLayout
