import React from 'react'
import { useTranslations } from '@/lib/i18n'

export default function ErrorMessage() {
	const t = useTranslations(components_ui)

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100">
			<div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
					<svg
						className="h-8 w-8 text-red-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>
				</div>
				<h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
					{t('components_ui_errormessage_Oops')}
				</h2>
				<p className="mb-8 text-center text-gray-600">
					{t('components_ui_errormessage_Something_Went_Wrong')}
				</p>
				<button
					className="w-full rounded bg-red-600 px-4 py-2 text-white transition duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
					onClick={() => window.location.reload()}
				>
					{t('components_ui_errormessage_Retry')}
				</button>
			</div>
		</div>
	)
}
