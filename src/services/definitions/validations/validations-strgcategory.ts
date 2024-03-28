import { i18n } from '@/services/i18n'
import { integer, required, min_value, max_value } from '@vee-validate/rules'
import { regOnlyAlphanumericNoSpaces, VSchemaCommon } from '@/services/definitions/validations/validations-commons'


const { t } = i18n.global


// This validation file / logic is related to the warehouse (storage) category

/**
 * Warehouse Storage Category
 */
export const VSchemaStrgCategory = {
    sCatName: ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 3, 30, true, regOnlyAlphanumericNoSpaces, t('validation.only-alpha-digits-no-spaces'))
    },
}

/**
 * Warehouse Storage Category -> Product capacity line validations scheme
 */
export const VSchemaProdLine = {
    maxCapacity: ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!integer(value)) return t('validation.only-integers')
        if (!min_value(value, { min: 2 })) return t('validation.min-value', { value: 2 })
        if (!max_value(value, { max: 10000000 })) return t('validation.max-value', { value: 10000000 })

        return true
    },
}
