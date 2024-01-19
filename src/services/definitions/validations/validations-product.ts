import { i18n } from '@/services/i18n'
import { max, min, regex, required } from '@vee-validate/rules'
import {
    regOnlyAlphanumericNoSpaces,
    regOnlyAlphanumNSpacesWithDotsNHyphen,
    VSchemaCommon
} from '@/services/definitions/validations/validations-commons'


const { t } = i18n.global

/**
 * Validation schema for Product entity form
 */
export const VSchemaProduct = {
    pName:              ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 3, 36, true, regOnlyAlphanumNSpacesWithDotsNHyphen, t('validation.only-alpha-digits-underscore-dots-spaces'))
    },
    noteSell:           ( value: string ): boolean | string => {return VSchemaCommon.notes(value, 3, 200, false)},
    notePurchase:       ( value: string ): boolean | string => {return VSchemaCommon.notes(value, 3, 200, false)},
    noteTransfer:       ( value: string ): boolean | string => {return VSchemaCommon.notes(value, 3, 200, false)},
    weight:             ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 0, 20000, false, false)},
    volume:             ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 0, 20000, false, false)},
    preDay2Manuf:       ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 0, 360, true, false)},
    sellPrice:          ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 0, 10000, false, false)},
    sellTax:            ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 0, 100, true, false)},
    cost:               ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 0, 10000, false, false)}
    // productImg: VSchemaCommon.productImg,            // TODO should we do this ?
}

/**
 * Validation schema for Product-Supplier line (relationship) entity
 *
 */
export const VSchemaPSL = {
    supplierCode: ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 3, 36, false, regOnlyAlphanumNSpacesWithDotsNHyphen, t('validation.only-alpha-digits-underscore-dots-spaces'))
    },
    sPrice:       ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 0, 500000000, false, true)},
    sTax:  ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 0, 100, true, false)}
}
