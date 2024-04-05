import { i18n } from '@/services/i18n'
import { required } from '@vee-validate/rules'
import {
    regOnlyAlphanumNSpacesWithDotsNHyphen,
    VSchemaCommon
} from '@/services/definitions/validations/validations-commons'
import { WARE_LOC_TYPE } from '@/services/definitions'


const { t } = i18n.global

/**
 * UoM validation schema
 */
export const VSchemaWareLocation = {
    lName:       ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 2, 30, true, regOnlyAlphanumNSpacesWithDotsNHyphen, t('validation.only-alpha-digits-no-spaces'))
    },
    parentID:    ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 1, 10000, true, true)},
    warehouseID: ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 1, 10000, true, true)},
    strgCatID:   ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 1, 10000, true, true)},

    lType:       ( value: string ): boolean | string => {

        if (!required(value)) return t('validation.required')
        switch (value) {
            case WARE_LOC_TYPE.VIEW:
            case WARE_LOC_TYPE.TRANSIT:
            case WARE_LOC_TYPE.INTERNAL:
            case WARE_LOC_TYPE.SUPPLIER:
            case WARE_LOC_TYPE.COSTUMER:
            case WARE_LOC_TYPE.INVENTORY:
            case WARE_LOC_TYPE.PRODUCTION:
                return true
                // break                | unreachable in this situation
            default:
                return t('validation.invalid')
        }

        // return true                  | unreachable in this situation
    },
    lNotes: ( value: string ): boolean | string => {return VSchemaCommon.notes(value, 3, 200, false)},
}
