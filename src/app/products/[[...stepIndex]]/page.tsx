'use client'
import React, { FC, useEffect } from 'react'
import PageAddListing1 from './PageAddListing1'
import PageAddListing2 from './PageAddListing2'
import PageAddListing3 from './PageAddListing3'
import PageAddListing4 from './PageAddListing4'
import PageAddListing5 from './PageAddListing5'
import PageAddListing6 from './PageAddListing6'
import PageAddListing7 from './PageAddListing7'
import PageAddListing8 from './PageAddListing8'
import PageAddListing9 from './PageAddListing9'
import PageAddListing10 from './PageAddListing10'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import ButtonSecondary from '@/shared/ButtonSecondary'
import ButtonPrimary from '@/shared/ButtonPrimary'
import Link from 'next/link'
import basedPostUrlRequestLogedIn from '@/app/utils/basedPostUrlRequestLogedIn'
import { updateServiceState } from '@/app/GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
import getFetchDataFromApi from '@/utils/getFetchDataFromApi'
import { Route } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import { Form } from 'react-final-form'

const components = [
	PageAddListing1,
	PageAddListing1, // Default for stepIndex 0 or invalid
	PageAddListing2,
	PageAddListing3,
	PageAddListing4,
	PageAddListing5,
	PageAddListing6,
	PageAddListing7,
	PageAddListing8,
	PageAddListing9,
	PageAddListing10,
]

const Page = ({
	params,
	searchParams,
}: {
	params: { stepIndex: string }
	searchParams?: { [key: string]: string | string[] | undefined }
}) => {
	const newsearchParams = useSearchParams()
	const step = newsearchParams.get('step')
	const stepIndex = Number(step)
	const ContentComponent = components[stepIndex] || PageAddListing1

	return (
		<CommonLayout params={params}>
			<ContentComponent />
		</CommonLayout>
	)
}

export default Page

export interface CommonLayoutProps {
	children: React.ReactNode
	params: {
		stepIndex: string
	}
}

const CommonLayout: FC<CommonLayoutProps> = ({ children, params }: any) => {
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

	const handleClickPulbishProduct = async (values: any) => {
		console.log(values)
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
	const onSubmit = () => {}
	return (
		<div className={`nc-PageAddListing1 flex items-start justify-start`}>
			<Form
				onSubmit={onSubmit}
				// validate={validate}
				initialValues={{productCategory: "tour"}}
				render={({ handleSubmit, form, submitting, pristine, values }) => (
					<form className="mx-auto flex max-w-3xl flex-col items-start justify-start space-y-10 pt-0">
						<div className="flex flex-row items-start justify-start gap-2 overflow-auto">
							{arr.map((_, i) => (
								<Link
									key={i}
									href={currenthref(i + 1)}
									className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${
										i + 1 === index
											? 'bg-primary text-white'
											: 'text-neutral-6000 border border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
									}`}
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
						<div className="listingSection__wrap">
							{React.Children.map(children, (child) => {
								// Clone each child and pass the values prop
								return React.cloneElement(child, { values })
							})}
						</div>
						<div className="flex justify-end space-x-5">
							<ButtonSecondary href={backtHref}>Go back</ButtonSecondary>
							<ButtonPrimary onClick={() => handleClickPulbishProduct(values)}>
								{nextBtnText || 'Continue'}
							</ButtonPrimary>
						</div>
					</form>
				)}
			/>
		</div>
	)
}
