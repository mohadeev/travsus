import React from 'react'
import { useTranslations } from '@/lib/i18n';

const page = () => {
  const t = useTranslations("app_locale_transtest_page");
  
  return <div>{t('app_locale_transtest_page_Translate_This_Page_To_Test_It')}</div>
}

export default page