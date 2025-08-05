import { useTranslations } from '@/lib/i18n'
import Button, { ButtonProps } from "./Button";
import React from "react";

export interface ButtonThirdProps extends ButtonProps {}

const ButtonThird: React.FC<ButtonThirdProps> = ({
  className = "text-neutral-700 border border-neutral-200 dark:text-neutral-200 dark:border-neutral-700",
  ...args
}) => {
  const t = useTranslations("shared_ButtonThird");
  return <Button className={`ttnc-ButtonThird ${className}`} {...args} />;
};

export default ButtonThird;