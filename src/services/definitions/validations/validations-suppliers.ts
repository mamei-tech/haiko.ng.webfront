import { i18n } from '@/services/i18n'
import { max, min, regex, required, integer, length } from '@vee-validate/rules'
import {
    regHTMLColorNoAlpha,
    regOnlyAlphanumericAndSpacesWithDots,
    VSchemaCommon, regWebSiteURL, regOnlyAlphanumericAndSpaces
} from '@/services/definitions/validations/validations-commons'

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

export const VSchemaSupplier = {
    sName:          ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!min(value, { length: 4 })) return t('validation.min-length', { length: 4 })
        if (!max(value, { length: 30 })) return t('validation.max-length', { length: 30 })
        if (!regex(value, { regex: regOnlyAlphanumericAndSpacesWithDots })) return t('validation.only-html-color')

        return true
    },
    contactName:    ( value: string ): boolean | string => {
        if (!min(value, { length: 4 })) return t('validation.min-length', { length: 4 })
        if (!max(value, { length: 80 })) return t('validation.max-length', { length: 80 })
        if (!regex(value, { regex: regOnlyAlphanumericAndSpaces })) return t('validation.only-html-color')

        return true
    },
    sContactNotes:  ( value: string ): boolean | string => {return VSchemaCommon.description(value, 4, 120, false)},
    sInternalNotes: ( value: string ): boolean | string => {return VSchemaCommon.description(value, 4, 300, false)},
    sCategoryID:    ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!integer(value)) return t('validation.only-integers')

        return true
    },
    sPhone:         ( value: string, validationInstance: any ): boolean | string => {
        if (!integer(value)) return t('validation.cellphone')
        if (!min(value, { length: 7 })) return t('validation.min-length', { length: 7 })
        if (!max(value, { length: 10 })) return t('validation.max-length', { length: 10 })
        if (validationInstance.form.cell === value) return t('validation.same-phone')

        return true
    },
    sEmail:         ( value: string ): boolean | string => {return VSchemaCommon.email(value)},
    cell:           ( value: string ): boolean | string => {return VSchemaCommon.cell(value, true)},
    sWebSite:       ( value: string ): boolean | string => {
        if (!regex(value, { regex: regWebSiteURL })) return t('validation.only-html-color')

        return true
    },
    sAddress:       ( value: string ): boolean | string => {
        if (!min(value, { length: 4 })) return t('validation.min-length', { length: 4 })
        if (!max(value, { length: 80 })) return t('validation.max-length', { length: 80 })

        return true
    },
    countryCode:    ( value: string ): boolean | string => {
        if (!value) return true
        if (!length(value, { length: 2 }) && !length(value, { length: 0 })) return t('validation.min-length', { length: 2 })

        return true
    },
    stateCode:      ( value: string, validationInstance: any ): boolean | string => {
        if ((value == undefined || value == '') && validationInstance.form.countryCode?.length == 2) return t('validation.country-code-present')
        if (!min(value, { length: 2 })) return t('validation.min-length', { length: 2 })
        if (!max(value, { length: 3 })) return t('validation.max-length', { length: 3 })

        return true
    }
}

// chequea que si esta presente countryCode lo debem estar tambien stateCode, luego para para requerir solo un telefono y luego chequea el backend en funcion de esto, luego pasa a editar

//region ======== COMMON VALIDATIONS FIELDS RULES =======================================
