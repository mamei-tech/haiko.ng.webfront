import { i18n } from '@/services/i18n'
import { integer, max, min, regex, required } from '@vee-validate/rules'
import {
    regOnlyAlphanumNSpacesWithDotsNHyphen,
    VSchemaCommon
} from '@/services/definitions/validations/validations-commons'


const { t } = i18n.global

/**
 * UoM validation schema
 */
export const VSchemaWareLocation = {
    lName:  ( value: string ): boolean | string => {
        return VSchemaCommon.nameValidation(value, 2, 30, true, regOnlyAlphanumNSpacesWithDotsNHyphen, t('validation.only-alpha-digits-no-spaces'))
    },

}
