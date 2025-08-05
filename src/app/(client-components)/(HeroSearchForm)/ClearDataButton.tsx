"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { FC } from "react";
import { useTranslations } from '@/lib/i18n';

export interface ClearDataButtonProps {
  onClick: () => void;
}

const ClearDataButton: FC<ClearDataButtonProps> = ({ onClick }) => {
  const t = useTranslations("app_clientcomponents_HeroSearchForm_ClearDataButton");

  return (
    <span
      onClick={() => onClick && onClick()}
      className={t('app_clientcomponents_HeroSearchForm_ClearDataButton_Span_Classes')}
    >
      <XMarkIcon className={t('app_clientcomponents_HeroSearchForm_ClearDataButton_Icon_Classes')} />
    </span>
  );
};

export default ClearDataButton;