import Link from 'next/link'
;<div className="mt-12 text-center">
	<p className="mb-2 text-gray-700">Need to delete your account?</p>
	<Link
		href="/account-settings/deactivate"
		className="font-medium text-gray-700 underline hover:text-red-600"
	>
		Take care of that now
	</Link>
</div>

export default function AccountSettingsPage() {
	return (
		<div>
			<div className="mt-12 text-center">
				<p className="mb-2 text-gray-700">Need to delete your account?</p>
				<Link
					href="/account-settings/deactivate"
					className="font-medium text-gray-700 underline hover:text-red-600"
				>
					Take care of that now
				</Link>
			</div>
		</div>
	)
}
