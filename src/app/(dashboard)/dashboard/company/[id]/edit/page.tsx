"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { selectAllCompanies } from "@/app/GlobalRedux/Features/companySlice/companySlice"
// import { EditCompanyForm } from "@/components/dashboard/edit-company-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { AppDispatch } from "@/app/GlobalRedux/store"
import { EditCompanyForm } from "@/components/dashboard/edit-company-form"

export default function EditCompanyPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const companies = useSelector(selectAllCompanies)
  const [company, setCompany] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const companyId = params.id as string

  useEffect(() => {
    // First try to find the company in the Redux store
    const foundCompany = companies.find((c) => c.id === companyId)

    if (foundCompany) {
      setCompany(foundCompany)
      setIsLoading(false)
    } else {
      // If not found in Redux, fetch from API
      fetchCompanyData()
    }
  }, [companyId, companies])

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/dashboard/company/${companyId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch company data")
      }

      const data = await response.json()
      setCompany(data)
    } catch (error) {
      console.error("Error fetching company:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/dashboard/settings")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[200px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-[300px]" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!company) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Company Not Found</CardTitle>
          <CardDescription>
            The company you are looking for does not exist or you don't have permission to edit it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleBack} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Company</CardTitle>
          <CardDescription>Update your company information.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditCompanyForm company={company} />
        </CardContent>
      </Card>
    </div>
  )
}
