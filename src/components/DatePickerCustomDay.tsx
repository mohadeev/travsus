import React, { FC } from "react";
import { useTranslations } from '@/lib/i18n';

interface Props {
  dayOfMonth: number;
  date?: Date | undefined;
}

const DatePickerCustomDay: FC<Props> = ({ dayOfMonth, date }) => {
  const t = useTranslations("components_DatePickerCustomDay");
  
  return <span className={t('components_DatePickerCustomDay_Day_Span_Class')}>{dayOfMonth}</span>;
};

export default DatePickerCustomDay;