import { VSchemaUoM } from '@/services/definitions/validations/validations-uom'
import { SelectUoMType } from '@/services/definitions/data-select-options'
import { HTML_INPUT_TYPE } from '@/services/definitions/enums-common'
import { i18n } from '@/services/i18n'

import type { IColumnHeader } from '@/services/definitions'


const { t } = i18n.global

// H means headers
export const PAGE_SIZE = 10

export const HStaffTable: Partial<IColumnHeader>[] = [
    { title: '', chk: true, width: 2 },
    { title: 'id', hidden: true },
    { title: 'avatar', toCenter: true, navKey: 'avatarPath', picture: true, width: 8 },
    { title: 'name', sorting: '', navKey: 'firstName' },
    { title: 'user', toCenter: true, sorting: '', navKey: 'username' },
    { title: 'contact', sorting: '', navKey: 'cell' },
    { title: 'role', toCenter: true, navKey: 'roleId' },
    { title: 'active', toCenter: true, sorting: '', navKey: 'isActive', switch: true },
    {
        title:   '',            // actions buttons
        toRight: true,
        width:   40
    }
]

export const HRolesTable: Partial <IColumnHeader>[] = [
    { title: 'id', hidden: false },
    { title: 'rname', navKey: 'rName' },
    { title: 'description' },
    {
        title:   '',            // actions buttons
        toRight: true,
        width:   40
    }
]

export const HUoMCatTable: Partial <IColumnHeader>[] = [
    { title: 'id', hidden: true },
    { title: 'category', navKey: 'ucName' },
    { title: 'units', listOPillsUoM: true },
    {
        title:   '',            // actions buttons
        toRight: true,
        width:   40
    }
]

export const HUoMTable: Partial<IColumnHeader>[] = [
    { title: 'id', hidden: true },
    { title: 'uom', navKey: 'uName', toLeft: true, width: 20, cellEditable: true, cellValidation: VSchemaUoM.uName, cellEditableInputType: HTML_INPUT_TYPE.TEXT },
    { title: 'uType', navKey: 'uType', width: 10, cellEditableSelect: true, cellEditableSelectOptions: SelectUoMType, cellEditableSelectPlaceholder: t('form.placeholders.uom-type-select') },
    { title: 'ratio', navKey: 'uRatio', width: 10, cellEditable: true, cellValidation:VSchemaUoM.uRatio, cellEditableInputType: HTML_INPUT_TYPE.NUMBER },
    { title: 'active', toCenter: true, navKey: 'isActive', switch: true },
    {
        title:   '',            // actions buttons
        toRight: true,
        width:   40
    }
]
