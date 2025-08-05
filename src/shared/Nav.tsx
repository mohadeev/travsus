import React, { FC } from "react";
import { useTranslations } from '@/lib/i18n'

export interface NavProps {
  containerClassName?: string;
  className?: string;
  children?: React.ReactNode;
}

const Nav: FC<NavProps> = ({
  containerClassName = "",
  className = "",
  children,
}) => {
  const t = useTranslations("shared_Nav");
  
  return (
    <nav className={`nc-Nav ${containerClassName}`} data-nc-id="Nav">
      <ul className={`flex  ${className}`}>{children}</ul>
    </nav>
  );
};

export default Nav;