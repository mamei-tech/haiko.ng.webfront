import { i18n } from '@/services/i18n'
import { regex, required } from '@vee-validate/rules'
import { CORE_PICKING_TYPE, RESERVATION_METHODS } from '@/services/definitions'
import {
    VSchemaCommon,
    regOnlyAlphanumNSpacesWithDotsNHyphen,
    regAlphanumNHyphensLowerCaps, regOnlyAlphaNOSpacesCaps, regHTMLColorNoAlpha
} from '@/services/definitions/validations/validations-commons'




const { t } = i18n.global

/**
 * Inventory Picking Type validation schema
 */
export const VSchemaPicking = {
    tName:     ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 2, 30, true, regOnlyAlphanumNSpacesWithDotsNHyphen, t('validation.only-alpha-digits-no-spaces'))
    },
    iName:     ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 2, 30, true, regAlphanumNHyphensLowerCaps, t('validation.only-alpha-digist-nospc-hyphen-lowcaps'))
    },
    seqCode:   ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value.toUpperCase() ?? '', 2, 4, true, regOnlyAlphaNOSpacesCaps, t('validation.only-alpha-caps'))
    },
    tColor:    ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!regex(value, { regex: regHTMLColorNoAlpha })) return t('validation.only-html-color')

        return true
    },
    pCoreType: ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        return value === CORE_PICKING_TYPE.INCOMING || value === CORE_PICKING_TYPE.TRANSFER || value === CORE_PICKING_TYPE.MNFACTRN || value === CORE_PICKING_TYPE.OUTGOING;
    },
    resDaysBefore: ( value: string, a: any ): boolean | string => {
        if (a.form.pCoreType === CORE_PICKING_TYPE.INCOMING) return true
        if (a.form.resMethod === RESERVATION_METHODS.BEFORE_SCHEDULE_DATE)
            return VSchemaCommon.numerical(value, 1, 90, true, true)
        else return true
    }
}
