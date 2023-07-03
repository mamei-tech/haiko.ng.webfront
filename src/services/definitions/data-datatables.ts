import { VSchemaUoM } from '@/services/definitions/validations/validations-uom'
import { SelectUoMType } from '@/services/definitions/data-select-options'
import { HTML_INPUT_TYPE } from '@/services/definitions/enums-common'
import { i18n } from '@/services/i18n'

import type { IColumnHeader } from '@/services/definitions'


const { t } = i18n.global

// H means headers
// this struct defines (tells) to the CmpDataTable how it should render and process the table headers and the cells
// for a specific data

export const PAGE_SIZE = 10

export const HStaffTable: Partial<IColumnHeader>[] = [
    { title: '', chk: true, styleWidth: 2 },
    { title: 'id', hidden: true },
    { title: 'avatar', styleToCenter: true, navKey: 'avatarPath', fieldPicture: true, styleWidth: 8 },
    { title: 'name', sorting: '', navKey: 'firstName' },
    { title: 'user', styleToCenter: true, sorting: '', navKey: 'username' },
    { title: 'contact', sorting: '', navKey: 'cell' },
    { title: 'role', styleToCenter: true, navKey: 'roleId' },
    { title: 'active', styleToCenter: true, sorting: '', navKey: 'isActive', fieldSwitch: true },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   40
    }
]

export const HRolesTable: Partial <IColumnHeader>[] = [
    { title: 'id', hidden: false },
    { title: 'rname', navKey: 'rName' },
    { title: 'description' },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth: 40
    }
]

export const HUoMCatTable: Partial <IColumnHeader>[] = [
    { title: 'id', hidden: true },
    { title: 'category', navKey: 'ucName' },
    { title: 'units', listOPillsUoM: true },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth: 40
    }
]

export const HUoMTable: Partial<IColumnHeader>[] = [
    { title: 'id', hidden: true },
    { title: 'uom', navKey: 'uName', styleToLeft: true, styleWidth: 20, cellEditable: true, cellEditableValidation: VSchemaUoM.uName, cellEditableInputType: HTML_INPUT_TYPE.TEXT },
    { title: 'uType', navKey: 'uType', styleWidth: 10, cellEditableSelect: true, cellEditableSelectOptions: SelectUoMType, cellEditableSelectPlaceholder: t('form.placeholders.uom-type-select') },
    { title: 'ratio', navKey: 'uRatio', styleWidth: 10, cellEditable: true, cellEditableValidation: VSchemaUoM.uRatio, cellEditableInputType: HTML_INPUT_TYPE.NUMBER },
    { title: 'active', styleToCenter: true, navKey: 'isActive', fieldSwitch: true },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   40
    }
]

export const HSupplierCatTable: Partial <IColumnHeader>[] = [
    { title: 'id', hidden: true },
    { title: 'name', navKey: 'scName', sorting: '' },
    { title: 'count', navKey: 'sCount', styleWidth: 30, sorting: '' },
    { title: 'color', navKey: 'scColor', fieldColor: true },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   40
    }
]

export const HSupplierTable: Partial <IColumnHeader>[] = [
    { title: '', chk: true, styleWidth: 2 },
    { title: 'id', hidden: true },
    { title: 'name', navKey: 'sName', sorting: '' },
    { title: 'contact', navKey: 'contactName', sorting: '', forceEmptyRender: true },
    { title: 'phone', navKey: 'sPhone', sorting: '', forceEmptyRender: true },
    { title: 'active', styleToCenter: true, navKey: 'isActive', fieldSwitch: true },
    { title: 'category', styleToCenter: true, navKey: 'sCategoryID' },
    { title: 'products', navKey: 'pCount', styleToCenter: true },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   40
    }
]
