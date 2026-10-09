import { SignIn } from '@clerk/nextjs'

export const metadata = { title: 'Sign in | TRAVSUS', robots: { index: false } }

export default function SignInPage({ params }: { params: { locale: string } }) {
	return (
		<div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
			<SignIn
				path={`/${params.locale}/sign-in`}
				signUpUrl={`/${params.locale}/sign-up`}
			/>
		</div>
	)
}
