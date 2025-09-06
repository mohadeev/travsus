'use client'

import React, { FC } from 'react'
import LocationInput from '../LocationInputDesktop'
import GuestsInput from '../GuestsInputDesktop'
import ExperiencesDateSingleInput from './ExperiencesDateSingleInput'
import { Form, Field } from 'react-final-form'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export interface ExperiencesSearchFormProps {}

const ExperiencesSearchForm: FC<ExperiencesSearchFormProps> = ({}) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()
	// function handleSearch() {
	// 	const params = new URLSearchParams(searchParams)

	// 	replace(`/search?${params.toString()}`)
	// }
	// const subLink = handleSearch()
	const renderForm = () => {
		const onSubmit = () => {}
		return (
			<form>
				<form className="relative flex w-full flex-row rounded-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
					<LocationInput
						// onInputDone={() => setDateFocused(true)}
						className="flex-[1.5]"
					/>
					<div className="h-8 self-center border-r border-slate-200 dark:border-slate-700"></div>
					<ExperiencesDateSingleInput className="flex-[1.2]" />
					<div className="h-8 self-center border-r border-slate-200 dark:border-slate-700"></div>
					<GuestsInput className="flex-1" />
				</form>
			</form>
		)
	}

	return renderForm()
}

export default ExperiencesSearchForm
