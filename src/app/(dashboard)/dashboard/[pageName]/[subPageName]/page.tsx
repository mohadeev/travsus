'use client'
import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import Page from '@/app/products/[[...stepIndex]]/page'

// }

const subPage = (params: any) => {
	return (
		<DefaultLayout>
			<Page {...params} />
		</DefaultLayout>
	)
}

export default subPage
