import { i18n } from '@/services/i18n'
import { regex, required } from '@vee-validate/rules'
import { regHTMLColorNoAlpha, VSchemaCommon } from '@/services/definitions/validations/validations-commons'

const { t } = i18n.global


export const VSchemaSupplierCat = {
    scName:       ( value: string ): boolean | string => {return VSchemaCommon.nameNoSpaceValidation(value)},
    sDescription: ( value: string ): boolean | string => {return VSchemaCommon.description(value)},
    scColor:      ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!regex(value, { regex: regHTMLColorNoAlpha })) return t('validation.only-html-color')

        return true
    }
}

//region ======== COMMON VALIDATIONS FIELDS RULES =======================================
