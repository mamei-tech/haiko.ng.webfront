import { i18n } from '@/services/i18n'
import { regex, required } from '@vee-validate/rules'
import { CORE_PICKING_TYPE, RESERVATION_METHODS, SHIPPING_POL } from '@/services/definitions'
import {
    VSchemaCommon,
    regOnlyAlphanumNSpacesWithDotsNHyphen,
    regAlphanumNHyphensLowerCaps, regOnlyAlphaNOSpacesCaps, regHTMLColorNoAlpha, regAlphanumNHyphensDotsCaps
} from '@/services/definitions/validations/validations-commons'


const { t } = i18n.global

/**
 * Inventory Picking Type validation schema
 */
export const VSchemaPickingType = {
    tName:     ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 2, 30, true, regOnlyAlphanumNSpacesWithDotsNHyphen, t('validation.only-alpha-digit-no-spaces'))
    },
    iName:     ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 2, 30, true, regAlphanumNHyphensLowerCaps, t('validation.only-alpha-digit-nospc-hyphen-lowcaps'))
    },
    seqCode:   ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value.toUpperCase() ?? '', 2, 6, true, regOnlyAlphaNOSpacesCaps, t('validation.only-alpha-caps'))
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

/**
 * Inventory picking (a.k.a Inventory Transfer Ops)
 */
export const VSchemaPicking = {

    pSrcDocument:     ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 4, 120, false, regAlphanumNHyphensDotsCaps, t('validation.only-alpha-digit-nospc-hyphen-dots-caps'))
    },

    pShippingPolicy: ( value: string ): boolean | string => {return value == SHIPPING_POL.DIRECT || value == SHIPPING_POL.ONE},

    contactID: ( value: string | number ): boolean | string => { return VSchemaCommon.required4Select(value) },
    pickingType: ( value: string | number ): boolean | string => { return VSchemaCommon.required4Select(value) },
    pResponsibleId: ( value: string | number ): boolean | string => { return VSchemaCommon.required4Select(value) },

}

