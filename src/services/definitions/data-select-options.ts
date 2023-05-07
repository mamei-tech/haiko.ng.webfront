import { i18n } from '@/services/i18n'
import type { IMultiselectBasic } from '@/services/definitions/types-common'


const { t } = i18n.global

/**
 * Used as static data for UoM Type as a field in the UoM CRUD form
 * Tells the relationship between the unit and the reference unit in the same category
 */
export const SelectUoMType: IMultiselectBasic[] =
    [
        { value: -1, label: t('data.u-ratio-down') },
        { value: 0, label: t('data.u-ratio-equal') },
        { value: 1, label: t('data.u-ratio-up') }
    ]
