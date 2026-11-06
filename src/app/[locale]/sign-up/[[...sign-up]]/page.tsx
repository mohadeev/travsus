import { SignUp } from '@clerk/nextjs'

export const metadata = { title: 'Create account | TRAVSUS', robots: { index: false } }

export default async function SignUpPage(props: { params: Promise<{ locale: string }> }) {
	const params = await props.params;
	return (
		<div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
			<SignUp
				path={`/${params.locale}/sign-up`}
				signInUrl={`/${params.locale}/sign-in`}
			/>
		</div>
	)
}
