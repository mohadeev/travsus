import { Popover, Tab, Transition } from "@headlessui/react";
import {
  BanknotesIcon,
  GlobeAltIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { FC, Fragment } from "react";
import { headerCurrency } from "./CurrencyDropdown";
import { useTranslations } from '@/lib/i18n';

export const headerLanguage = [
  {
    id: "English",
    name: "English",
    description: "United State",
    href: "##",
    active: true,
  },
  {
    id: "Vietnamese",
    name: "Vietnamese",
    description: "Vietnamese",
    href: "##",
  },
  {
    id: "Francais",
    name: "Francais",
    description: "Belgique",
    href: "##",
  },
  {
    id: "Francais",
    name: "Francais",
    description: "Canada",
    href: "##",
  },
  {
    id: "Francais",
    name: "Francais",
    description: "Belgique",
    href: "##",
  },
  {
    id: "Francais",
    name: "Francais",
    description: "Canada",
    href: "##",
  },
];

interface LangDropdownProps {
  panelClassName?: string;
  className?: string;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const LangDropdown: FC<LangDropdownProps> = ({
  panelClassName = "top-full right-0 max-w-sm w-96",
  className = "hidden md:flex",
}) => {
  const t = useTranslations("app_clientcomponents_Header_LangDropdown");

  // Update headerLanguage with translated text
  const translatedHeaderLanguage = headerLanguage.map(item => ({
    ...item,
    description: item.description === "United State" ? t('app_clientcomponents_Header_LangDropdown_United_State_Text') : item.description
  }));

  const renderLang = (close: () => void) => {
    return (
      <div className={t('app_clientcomponents_Header_LangDropdown_Lang_Grid_Class')}>
        {translatedHeaderLanguage.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={() => close()}
            className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${
              item.active ? "bg-gray-100 dark:bg-gray-700" : "opacity-80"
            }`}
          >
            <div className="">
              <p className={t('app_clientcomponents_Header_LangDropdown_Name_Text_Class')}>{item.name}</p>
              <p className={t('app_clientcomponents_Header_LangDropdown_Description_Text_Class')}>
                {item.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    );
  };

  const renderCurr = (close: () => void) => {
    return (
      <div className={t('app_clientcomponents_Header_LangDropdown_Currency_Grid_Class')}>
        {headerCurrency.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={() => close()}
            className={`flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 ${
              item.active ? "bg-gray-100 dark:bg-gray-700" : "opacity-80"
            }`}
          >
            <item.icon className={t('app_clientcomponents_Header_LangDropdown_Icon_Size_Class')} />
            <p className={t('app_clientcomponents_Header_LangDropdown_Currency_Name_Class')}>{item.name}</p>
          </a>
        ))}
      </div>
    );
  };

  return (
    <>
      <Popover className={t('app_clientcomponents_Header_LangDropdown_Root_Class').replace('${className}', className || t('app_clientcomponents_Header_LangDropdown_Default_Class'))}>
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-80"}
             group self-center h-10 sm:h-12 px-3 py-1.5 inline-flex items-center text-sm text-gray-800 dark:text-neutral-200 font-medium hover:text-opacity-100 focus:outline-none `}
            >
              <GlobeAltIcon className={t('app_clientcomponents_Header_LangDropdown_Button_Icon_Class')} />
              <span className={t('app_clientcomponents_Header_LangDropdown_Separator_Class')}>/</span>
              <BanknotesIcon className={t('app_clientcomponents_Header_LangDropdown_Button_Icon_Class')} />
              <ChevronDownIcon
                className={`${open ? "-rotate-180" : "text-opacity-70"}
                  ml-1 h-4 w-4  group-hover:text-opacity-80 transition ease-in-out duration-150`}
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className={`absolute z-20  ${panelClassName}`}>
                <div className={t('app_clientcomponents_Header_LangDropdown_Panel_Container_Class')}>
                  <Tab.Group>
                    <Tab.List className={t('app_clientcomponents_Header_LangDropdown_Tab_List_Class')}>
                      {["Language", "Currency"].map((category) => (
                        <Tab
                          key={category}
                          className={({ selected }) =>
                            classNames(
                              "w-full rounded-full py-2 text-sm font-medium leading-5 text-gray-700",
                              "focus:outline-none focus:ring-0",
                              selected
                                ? "bg-white shadow"
                                : "text-gray-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/40"
                            )
                          }
                        >
                          {category}
                        </Tab>
                      ))}
                    </Tab.List>
                    <Tab.Panels className={t('app_clientcomponents_Header_LangDropdown_Tab_Panels_Class')}>
                      <Tab.Panel
                        className={classNames(
                          "rounded-xl p-3",
                          "focus:outline-none focus:ring-0"
                        )}
                      >
                        {renderLang(close)}
                      </Tab.Panel>
                      <Tab.Panel
                        className={classNames(
                          "rounded-xl p-3",
                          "focus:outline-none focus:ring-0"
                        )}
                      >
                        {renderCurr(close)}
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};
export default LangDropdown;