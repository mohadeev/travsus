"use client";

import React, { FC, useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useTranslations } from '@/lib/i18n';

export interface NcInputNumberProps {
  className?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  label?: string;
  desc?: string;
}

const NcInputNumber: FC<NcInputNumberProps> = ({
  className = t('components_NcInputNumber_Default_Width_Class'),
  defaultValue = 0,
  min = 0,
  max,
  onChange,
  label,
  desc,
}) => {
  const t = useTranslations("components_NcInputNumber");
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleClickDecrement = () => {
    if (min >= value) return;
    setValue((state) => {
      return state - 1;
    });
    onChange && onChange(value - 1);
  };
  const handleClickIncrement = () => {
    if (max && max <= value) return;
    setValue((state) => {
      return state + 1;
    });
    onChange && onChange(value + 1);
  };

  const renderLabel = () => {
    return (
      <div className={t('components_NcInputNumber_Label_Container_Class')}>
        <span className={t('components_NcInputNumber_Label_Text_Class')}>
          {label}
        </span>
        {desc && (
          <span className={t('components_NcInputNumber_Description_Text_Class')}>
            {desc}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`${t('components_NcInputNumber_Main_Container_Class')} ${className}`}
      data-nc-id="NcInputNumber"
    >
      {label && renderLabel()}

      <div
        className={t('components_NcInputNumber_Controls_Container_Class')}
      >
        <button
          className={t('components_NcInputNumber_Button_Class')}
          type="button"
          onClick={handleClickDecrement}
          disabled={min >= value}
        >
          <MinusIcon className={t('components_NcInputNumber_Icon_Class')} />
        </button>
        <span>{value}</span>
        <button
          className={t('components_NcInputNumber_Button_Class')}
          type="button"
          onClick={handleClickIncrement}
          disabled={max ? max <= value : false}
        >
          <PlusIcon className={t('components_NcInputNumber_Icon_Class')} />
        </button>
      </div>
    </div>
  );
};

export default NcInputNumber;