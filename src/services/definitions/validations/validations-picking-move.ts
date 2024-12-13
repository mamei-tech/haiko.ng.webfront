import { i18n } from '@/services/i18n'
import { max, min, regex, required } from '@vee-validate/rules'
import {
    regOnlyAlphanumNSpaces,
    VSchemaCommon
} from '@/services/definitions/validations/validations-commons'


const { t } = i18n.global

/**
 * Validation schema for inventory PickingMove line (relationship) entity
 * Remember that inventory picking and inventory transfer are the same thing in the inventory context
 *
 */
export const VSchemaPickingMoveL = {
    prodUoMQty:     ( value: string ): boolean | string => {return VSchemaCommon.numerical(value, 1, 500000000, false, true)},
    moveDescription: ( value: string ): boolean | string => {
        if (!min(value, { length: 3 })) return t('validation.min-length', { length: 3 })
        if (!max(value, { length: 80 })) return t('validation.max-length', { length: 80 })
        if (!regex(value, { regex: regOnlyAlphanumNSpaces })) return t('validation.only-alpha-digit-spaces')

        return true
    }
}
