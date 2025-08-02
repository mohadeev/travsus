import { useTranslations } from '@/lib/i18n'
import { CreateCompanyForm } from '@/components/dashboard/create-company-form'

export default function CreateCompanyPage() {
	const t = useTranslations('dashboard_dashboard_company_create_page')
	return (
		<div className="container py-8">
			<h1 className="mb-6 text-2xl font-bold">
				{t('dashboard_dashboard_company_create_page_Create_New_Company')}
			</h1>
			<CreateCompanyForm />
		</div>
	)
}
