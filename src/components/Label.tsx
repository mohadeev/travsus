import React, { FC } from "react";
import { useTranslations } from '@/lib/i18n';

export interface LabelProps {
  className?: string;
  children?: React.ReactNode;
}

const Label: FC<LabelProps> = ({ className = "", children }) => {
  const t = useTranslations("components_Label");

  return (
    <label
      className={`${t('components_Label_Base_Classes')} ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;