import { i18n } from '@/services/i18n'
import { max, min, regex, required } from '@vee-validate/rules'
import { regAlphaDigitsUnderscoreNDots } from '@/services/definitions/validations/validations-commons'


const { t } = i18n.global

/**
 * Staff validation schema. Prepared to be used with Vee-validate lib in ROLE CRUD
 */
export const VSchemaRole = {
    rName: ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!regex(value, { regex: regAlphaDigitsUnderscoreNDots })) return t('validation.only-alpha-digits-underscore-dots')
        if (!min(value, { length: 4 })) return t('validation.min-length', { length: 4 })
        if (!max(value, { length: 20 })) return t('validation.max-length', { length: 20 })

        return true
    },
    description: ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!min(value, { length: 4 })) return t('validation.min-length', { length: 4 })
        if (!max(value, { length: 80 })) return t('validation.max-length', { length: 80 })

        return true
    }
}

//region ======== COMMON VALIDATIONS FIELDS RULES =======================================
