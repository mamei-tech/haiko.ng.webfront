import { i18n } from '@/services/i18n'
import { integer, max, min, regex, required } from '@vee-validate/rules'
import { regOnlyAlphanumericNoSpaces, VSchemaCommon } from '@/services/definitions/validations/validations-commons'


const { t } = i18n.global

/**
 * UoM validation schema
 */
export const VSchemaWarehouse = {
    wName:  ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 3, 30, true, regOnlyAlphanumericNoSpaces, t('validation.only-alpha-digits-no-spaces'))
    },

    code:  ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 2, 10, true, regOnlyAlphanumericNoSpaces, t('validation.only-alpha-digits-no-spaces'))
    },
    suppAddressID:  ( value: number ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!integer(value)) return t('validation.only-integers')

        return true
    }
}
