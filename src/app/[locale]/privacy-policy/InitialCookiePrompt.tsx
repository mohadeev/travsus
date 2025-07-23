'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface InitialCookiePromptProps {
	onAccept: () => void
	onReject: () => void
	onShowPurposes: () => void
}

export function InitialCookiePrompt({
	onAccept,
	onReject,
	onShowPurposes,
}: InitialCookiePromptProps) {
	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg">
			<div className="container mx-auto max-w-4xl">
				<h2 className="mb-2 text-lg font-semibold">
					We Care About Your Privacy
				</h2>
				<p className="mb-4 text-sm text-gray-600">
					We and our 417 partners store and access personal data, like browsing
					data or unique identifiers, on your device. Selecting "I Accept"
					enables tracking technologies to support the purposes shown under "we
					and our partners process data to provide," whereas selecting "Reject
					All" or withdrawing your consent will disable them. If trackers are
					disabled, some content and ads you see may not be as relevant to you.
					You can resurface this menu to change your choices or withdraw consent
					at any time by clicking the Manage Preferences link on the bottom of
					the webpage. Your choices will have effect within our Website. For
					more details, refer to our{' '}
					<Link
						href="/privacy-policy"
						className="text-blue-600 hover:underline"
					>
						Privacy Policy
					</Link>
					.
				</p>

				<div className="mb-4 text-sm text-gray-600">
					<strong>We and our partners process data to provide:</strong>
					<ul className="ml-6 mt-2 list-disc">
						<li>Use precise geolocation data</li>
						<li>Actively scan device characteristics for identification</li>
						<li>Store and/or access information on a device</li>
						<li>
							Personalised advertising and content, advertising and content
							measurement, audience research and services development
						</li>
					</ul>
				</div>

				<div className="flex flex-col justify-end gap-2 sm:flex-row">
					<Button variant="outline" onClick={onReject} className="sm:order-1">
						Reject All
					</Button>
					<Button
						variant="outline"
						onClick={onShowPurposes}
						className="sm:order-2"
					>
						Show Purposes
					</Button>
					<Button onClick={onAccept} className="sm:order-3">
						I Accept
					</Button>
				</div>
			</div>
		</div>
	)
}
