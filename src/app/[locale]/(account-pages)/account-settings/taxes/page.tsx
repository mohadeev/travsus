'use client'

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, FileText } from 'lucide-react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useToast } from '@/hooks/useToast'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser } from '@/app/[locale]/GlobalRedux/Features/userReducer/userReducer'
import { useTranslations } from '@/lib/i18n'

export default function TaxesPage() {
	const t = useTranslations('TaxesPage')
	const [activeTab, setActiveTab] = useState('taxpayers')
	const { toast } = useToast()
	const dispatch = useDispatch()
	const { userData, loading } = useSelector((state: any) => state.userReducer)

	const [showTaxInfoForm, setShowTaxInfoForm] = useState(false)
	const [showVatForm, setShowVatForm] = useState(false)

	const [taxInfo, setTaxInfo] = useState({
		taxId: userData?.taxInfo?.taxId || '',
		country: userData?.taxInfo?.country || '',
		address: userData?.taxInfo?.address || '',
		city: userData?.taxInfo?.city || '',
		state: userData?.taxInfo?.state || '',
		postalCode: userData?.taxInfo?.postalCode || '',
	})

	const [vatInfo, setVatInfo] = useState({
		vatId: userData?.taxInfo?.vatId || '',
		vatCountry: userData?.taxInfo?.vatCountry || '',
	})

	const handleTaxInfoChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setTaxInfo((prev) => ({ ...prev, [name]: value }))
	}

	const handleVatInfoChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setVatInfo((prev) => ({ ...prev, [name]: value }))
	}

	const handleTaxInfoSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		dispatch(
			updateUser({
				taxInfo: {
					...userData?.taxInfo,
					...taxInfo,
				},
			}) as any,
		)

		toast({
			title: t('success'),
			description: t('tax_info_updated'),
		})

		setShowTaxInfoForm(false)
	}

	const handleVatInfoSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		dispatch(
			updateUser({
				taxInfo: {
					...userData?.taxInfo,
					...vatInfo,
				},
			}) as any,
		)

		toast({
			title: t('success'),
			description: t('vat_info_updated'),
		})

		setShowVatForm(false)
	}

	const taxDocuments = [
		{ year: 2024, documents: [] },
		{ year: 2023, documents: [] },
		{ year: 2022, documents: [] },
		{ year: 2021, documents: [] },
	]

	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link
					href="/account-settings"
					className="text-gray-600 hover:underline"
				>
					{t('account')}
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">{t('taxes')}</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">{t('page_title')}</h1>

			{/* Tabs */}
			<div className="mb-8 border-b border-gray-200">
				<div className="flex space-x-8">
					<button
						className={`px-1 pb-4 ${
							activeTab === 'taxpayers'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('taxpayers')}
					>
						{t('taxpayers_tab')}
					</button>
					<button
						className={`px-1 pb-4 ${
							activeTab === 'documents'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('documents')}
					>
						{t('documents_tab')}
					</button>
				</div>
			</div>

			{activeTab === 'taxpayers' ? (
				<div className="space-y-12">
					{/* Taxpayer Information Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">{t('taxpayer_info')}</h2>
						<p className="mb-4 text-gray-600">
							{t('tax_info_required')}{' '}
							<Link href="#" className="underline">
								{t('learn_more')}
							</Link>
						</p>

						{!showTaxInfoForm ? (
							<div>
								{userData?.taxInfo?.taxId ? (
									<div className="mb-4 rounded-lg border border-gray-200 p-4">
										<div className="flex justify-between">
											<div>
												<p className="font-medium">
													{t('tax_id')}: {userData.taxInfo.taxId}
												</p>
												<p className="text-sm text-gray-500">
													{userData.taxInfo.address}, {userData.taxInfo.city},{' '}
													{userData.taxInfo.state} {userData.taxInfo.postalCode}
													, {userData.taxInfo.country}
												</p>
											</div>
											<button
												onClick={() => setShowTaxInfoForm(true)}
												className="font-medium text-black underline"
											>
												{t('edit')}
											</button>
										</div>
									</div>
								) : (
									<button
										onClick={() => setShowTaxInfoForm(true)}
										className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
									>
										{t('add_tax_info')}
									</button>
								)}
							</div>
						) : (
							<form
								onSubmit={handleTaxInfoSubmit}
								className="space-y-4 rounded-lg border border-gray-200 p-6"
							>
								<h3 className="mb-2 text-lg font-medium">
									{t('add_tax_info')}
								</h3>

								<div>
									<label className="mb-1 block text-sm font-medium text-gray-700">
										{t('tax_id_number')}
									</label>
									<input
										type="text"
										name="taxId"
										value={taxInfo.taxId}
										onChange={handleTaxInfoChange}
										className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
										required
									/>
								</div>

								<div>
									<label className="mb-1 block text-sm font-medium text-gray-700">
										{t('country')}
									</label>
									<select
										name="country"
										value={taxInfo.country}
										onChange={handleTaxInfoChange}
										className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
										required
									>
										<option value="">{t('select_country')}</option>
										<option value="United States">{t('countries.us')}</option>
										<option value="Canada">{t('countries.ca')}</option>
										<option value="United Kingdom">{t('countries.uk')}</option>
										<option value="France">{t('countries.fr')}</option>
										<option value="Germany">{t('countries.de')}</option>
										<option value="Spain">{t('countries.es')}</option>
									</select>
								</div>

								<div>
									<label className="mb-1 block text-sm font-medium text-gray-700">
										{t('address')}
									</label>
									<input
										type="text"
										name="address"
										value={taxInfo.address}
										onChange={handleTaxInfoChange}
										className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
										required
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="mb-1 block text-sm font-medium text-gray-700">
											{t('city')}
										</label>
										<input
											type="text"
											name="city"
											value={taxInfo.city}
											onChange={handleTaxInfoChange}
											className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
											required
										/>
									</div>
									<div>
										<label className="mb-1 block text-sm font-medium text-gray-700">
											{t('state_province')}
										</label>
										<input
											type="text"
											name="state"
											value={taxInfo.state}
											onChange={handleTaxInfoChange}
											className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
											required
										/>
									</div>
								</div>

								<div>
									<label className="mb-1 block text-sm font-medium text-gray-700">
										{t('postal_code')}
									</label>
									<input
										type="text"
										name="postalCode"
										value={taxInfo.postalCode}
										onChange={handleTaxInfoChange}
										className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
										required
									/>
								</div>

								<div className="flex space-x-4 pt-2">
									<ButtonPrimary type="submit" disabled={loading}>
										{loading ? t('saving') : t('save')}
									</ButtonPrimary>
									<button
										type="button"
										onClick={() => setShowTaxInfoForm(false)}
										className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
									>
										{t('cancel')}
									</button>
								</div>
							</form>
						)}
					</div>

					{/* VAT Section */}
					<div>
						<h2 className="mb-2 text-xl font-semibold">{t('vat_title')}</h2>
						<p className="mb-4 text-gray-600">
							{t('vat_description')}{' '}
							<Link href="#" className="underline">
								{t('learn_more')}
							</Link>
						</p>

						{!showVatForm ? (
							<div>
								{userData?.taxInfo?.vatId ? (
									<div className="mb-4 rounded-lg border border-gray-200 p-4">
										<div className="flex justify-between">
											<div>
												<p className="font-medium">
													{t('vat_id')}: {userData.taxInfo.vatId}
												</p>
												<p className="text-sm text-gray-500">
													{t('country')}: {userData.taxInfo.vatCountry}
												</p>
											</div>
											<button
												onClick={() => setShowVatForm(true)}
												className="font-medium text-black underline"
											>
												{t('edit')}
											</button>
										</div>
									</div>
								) : (
									<button
										onClick={() => setShowVatForm(true)}
										className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
									>
										{t('add_vat_id')}
									</button>
								)}
							</div>
						) : (
							<form
								onSubmit={handleVatInfoSubmit}
								className="space-y-4 rounded-lg border border-gray-200 p-6"
							>
								<h3 className="mb-2 text-lg font-medium">
									{t('add_vat_info')}
								</h3>

								<div>
									<label className="mb-1 block text-sm font-medium text-gray-700">
										{t('vat_id_number')}
									</label>
									<input
										type="text"
										name="vatId"
										value={vatInfo.vatId}
										onChange={handleVatInfoChange}
										className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
										required
									/>
								</div>

								<div>
									<label className="mb-1 block text-sm font-medium text-gray-700">
										{t('country')}
									</label>
									<select
										name="vatCountry"
										value={vatInfo.vatCountry}
										onChange={handleVatInfoChange}
										className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
										required
									>
										<option value="">{t('select_country')}</option>
										<option value="United Kingdom">{t('countries.uk')}</option>
										<option value="France">{t('countries.fr')}</option>
										<option value="Germany">{t('countries.de')}</option>
										<option value="Spain">{t('countries.es')}</option>
										<option value="Italy">{t('countries.it')}</option>
										<option value="Netherlands">{t('countries.nl')}</option>
									</select>
								</div>

								<div className="flex space-x-4 pt-2">
									<ButtonPrimary type="submit" disabled={loading}>
										{loading ? t('saving') : t('save')}
									</ButtonPrimary>
									<button
										type="button"
										onClick={() => setShowVatForm(false)}
										className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
									>
										{t('cancel')}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			) : (
				<div className="space-y-8">
					<div>
						<p className="mb-4 text-gray-600">{t('tax_docs_description')}</p>
						<p className="mb-6 text-gray-600">
							{t('tax_docs_alternative')}{' '}
							<Link href="#" className="underline">
								{t('earnings_summary')}
							</Link>
							.
						</p>

						{taxDocuments.map((yearData) => (
							<div
								key={yearData.year}
								className="border-b border-gray-200 py-6"
							>
								<h3 className="mb-2 text-lg font-medium">{yearData.year}</h3>
								{yearData.documents.length > 0 ? (
									<ul className="space-y-2">
										{yearData.documents.map((doc, index) => (
											<li key={index} className="flex items-center">
												<FileText className="mr-2 h-5 w-5 text-gray-500" />
												<span>{t('document_name')}</span>
											</li>
										))}
									</ul>
								) : (
									<p className="text-gray-500">{t('no_tax_docs')}</p>
								)}
							</div>
						))}

						<div className="mt-6">
							<p className="text-gray-600">
								{t('prior_tax_docs')}{' '}
								<Link href="#" className="underline">
									{t('contact_us')}
								</Link>
								.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Help Section */}
			<div className="mt-12 border-t border-gray-200 pt-6">
				<h2 className="mb-2 text-xl font-semibold">{t('need_help')}</h2>
				<p className="text-gray-600">
					{t('help_description')}{' '}
					<Link href="#" className="underline">
						{t('help_center')}
					</Link>
					.
				</p>
			</div>
		</div>
	)
}
