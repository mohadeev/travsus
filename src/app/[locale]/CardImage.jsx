import { useTranslations } from '@/lib/i18n';

const CardImage = (props) => {
    const t = useTranslations("app_locale_CardImage");
    console.log('props:', props)
    return (
        <div>
            {t('app_locale_CardImage_Hello')} {props?.name} {t('app_locale_CardImage_Age')} {props.age}{' '}
        </div>
    )
}

export default CardImage