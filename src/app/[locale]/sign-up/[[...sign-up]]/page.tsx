import { SignUp } from '@clerk/nextjs'

export const metadata = { title: 'Create account | TRAVSUS', robots: { index: false } }

export default function SignUpPage({ params }: { params: { locale: string } }) {
	return (
		<div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
			<SignUp
				path={`/${params.locale}/sign-up`}
				signInUrl={`/${params.locale}/sign-in`}
			/>
		</div>
	)
}
