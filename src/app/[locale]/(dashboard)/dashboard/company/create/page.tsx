import { CreateCompanyForm } from '@/components/dashboard/create-company-form'

export default function CreateCompanyPage() {
	return (
		<div className="container py-8">
			<h1 className="mb-6 text-2xl font-bold">Create New Company</h1>
			<CreateCompanyForm />
		</div>
	)
}
