'use client'
import React, { useEffect } from 'react'
import axios from 'axios'
import { useTranslations } from '@/lib/i18n'

const TestAnything = () => {
  const t = useTranslations("app_locale_TestAnything");
  const country = 'United States'

  async function getFamousCities(country: any) {
    try {
      const response = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            country: country,
            city: '', // Leave blank to get all cities
            format: 'json',
            addressdetails: 1,
            limit: 10, // Adjust the limit as needed
          },
        },
      )

      const cities = response.data

      if (cities.length > 0) {
        cities.forEach((city: any) => {})
      } else {
        console.log(`No cities found for ${country}.`)
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
    }
  }

  useEffect(() => {
    return () => {}
  }, [])

  return <div>{t('app_locale_TestAnything_Test_Anything')}</div>
}

export default TestAnything