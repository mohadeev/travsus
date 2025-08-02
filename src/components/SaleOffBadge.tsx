import React, { FC } from "react";
import { useTranslations } from '@/lib/i18n';

export interface SaleOffBadgeProps {
  className?: string;
  desc?: string;
}

const SaleOffBadge: FC<SaleOffBadgeProps> = ({
  className = "",
  desc = "-10% today",
}) => {
  const t = useTranslations("components_SaleOffBadge");

  return (
    <div
      className={`nc-SaleOffBadge flex items-center justify-center text-xs py-0.5 px-3 bg-red-700 text-red-50 rounded-full ${className}`}
      data-nc-id="SaleOffBadge"
    >
      {t('components_SaleOffBadge_Desc')}
    </div>
  );
};

export default SaleOffBadge;