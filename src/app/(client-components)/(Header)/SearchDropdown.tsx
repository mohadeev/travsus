"use client";

import { Popover, Transition } from "@headlessui/react";
import Input from "@/shared/Input";
import React, { FC, Fragment } from "react";
import { useTranslations } from '@/lib/i18n';

interface Props {
  className?: string;
}

const SearchDropdown: FC<Props> = ({ className = "" }) => {
  const t = useTranslations("app_clientcomponents_Header_SearchDropdown");
  const inputRef = React.createRef<HTMLInputElement>();

  return (
    <React.Fragment>
      <Popover className={t('app_clientcomponents_Header_SearchDropdown_Container_Classes')}>
        {({ open }) => {
          if (open) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 100);
          }

          return (
            <>
              <Popover.Button className={t('app_clientcomponents_Header_SearchDropdown_Button_Classes')}>
                <i className={t('app_clientcomponents_Header_SearchDropdown_Icon_Classes')}></i>
              </Popover.Button>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel
                  static
                  className={t('app_clientcomponents_Header_SearchDropdown_Panel_Classes')}
                >
                  <form action="" method="POST">
                    <Input
                      ref={inputRef}
                      rounded="rounded-full"
                      type="search"
                      placeholder={t('app_clientcomponents_Header_SearchDropdown_Placeholder_Text')}
                    />
                    <input type="submit" hidden value="" />
                  </form>
                </Popover.Panel>
              </Transition>
            </>
          );
        }}
      </Popover>
    </React.Fragment>
  );
};

export default SearchDropdown;