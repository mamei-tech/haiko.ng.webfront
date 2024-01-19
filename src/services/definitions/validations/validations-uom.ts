import { i18n } from '@/services/i18n'
import { max, min, regex, required } from '@vee-validate/rules'
import { regDecimalDotSeparator, regOnlyAlphanumericNoSpaces, VSchemaCommon } from '@/services/definitions/validations/validations-commons'


const { t } = i18n.global

/**
 * UoM validation schema
 */
export const VSchemaUoM = {
    uName:  ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 3, 30, true, regOnlyAlphanumericNoSpaces, t('validation.only-alpha-digits-no-spaces'))
    },
    uType:  ( value: number ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (value < -1 || value > 1) return t('validation.invalid')

        return true
    },
    uRatio: ( value: number ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (value <=0) return t('validation.uom-ratio-gt-zero')
        if (!regex(value, { regex: regDecimalDotSeparator })) return t('validation.invalid')

        return true
    }
}

export const VSchemaUoMCat = {
    ucName: ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 3, 30, true, regOnlyAlphanumericNoSpaces, t('validation.only-alpha-digits-no-spaces'))
    },
}

