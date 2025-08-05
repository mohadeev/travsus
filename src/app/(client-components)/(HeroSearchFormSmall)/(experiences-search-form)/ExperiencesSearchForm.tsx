'use client'

import React, { FC } from 'react'
import LocationInput from '../LocationInput'
import GuestsInput from '../GuestsInput'
import ExperiencesDateSingleInput from './ExperiencesDateSingleInput'

export interface ExperiencesSearchFormProps {}

const ExperiencesSearchForm: FC<ExperiencesSearchFormProps> = ({}) => {
	const renderForm = () => {
		return (
			<form className="relative flex w-full flex-row rounded-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
				<LocationInput
					// onInputDone={() => setDateFocused(true)}
					className="flex-[1.5]"
				/>
				<div className="h-8 self-center border-r border-slate-200 dark:border-slate-700"></div>
				<ExperiencesDateSingleInput className="flex-[1.2]" />
				<div className="h-8 self-center border-r border-slate-200 dark:border-slate-700"></div>
				<GuestsInput className="flex-1" submitLink="/listing-experiences" />
			</form>
		)
	}

	return renderForm()
}

export default ExperiencesSearchForm
