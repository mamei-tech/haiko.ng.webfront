import { i18n } from '@/services/i18n'
import { VSchemaCommon } from '@/services/definitions/validations/validations-commons'


const { t } = i18n.global

/**
 * RBAC validation schema. Prepared to be used with Vee-validate lib in ROLE CRUD
 */
export const VSchemaRole = {
    rName:       ( value: string ): boolean | string => {return VSchemaCommon.nameValidation(value)},
    description: ( value: string ): boolean | string => {return VSchemaCommon.notes(value)}
}

//region ======== COMMON VALIDATIONS FIELDS RULES =======================================
