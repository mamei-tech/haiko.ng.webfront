import { VSchemaUoM } from '@/services/definitions/validations/validations-uom'
import { VSchemaPSL } from '@/services/definitions/validations/validations-product'
import { VSchemaProdLine } from '@/services/definitions/validations/validations-strgcategory'
import { SelectDataUoMType } from '@/services/definitions/data-select-options'
import { HTML_INPUT_TYPE } from '@/services/definitions/enums-common'
import { i18n } from '@/services/i18n'

import type { IColumnHeader } from '@/services/definitions'


const { t } = i18n.global

// H means headers
// this struct defines (tells) to the CmpDataTable how it should render and process the table headers and the cells
// for a specific data

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
    { title: 'uType', navKey: 'uType', styleWidth: 10, cellEditableSelect: true, cellEditableSelectOptions: SelectDataUoMType, cellEditableSelectPlaceholder: t('form.placeholders.uom-type-select') },
    { title: 'ratio', navKey: 'uRatio', styleWidth: 10, cellEditable: true, cellEditableValidation: VSchemaUoM.uRatio, cellEditableInputType: HTML_INPUT_TYPE.NUMBER },
    { title: 'active', styleToCenter: true, navKey: 'isActive', fieldSwitch: true },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   40
    }
]

export const HProductSupplierLine: Partial<IColumnHeader>[] = [
    { title: 'id', hidden: true },
    { title: 'supplier', navKey: 'supplierId', styleWidth: 20, styleToLeft: true, cellEditableSelect: true, cellEditableSelectOptions: [], cellEditableSelectPlaceholder: t('form.placeholders.product-supplier'), cellEditableSelectSearchable: true },        // ❗ this select will be filled in the 'onMounted' present in the ViewFormProduct component
    { title: 'supp-cod', navKey: 'supplierCode', styleToLeft: true, styleWidth: 12, cellEditable: true, cellEditableValidation: VSchemaPSL.supplierCode, cellEditableInputType: HTML_INPUT_TYPE.TEXT },                                                              // supp-cod == supplier code
    { title: 'sku', styleWidth: 12, navKey: 'sku' },
    { title: 'price', navKey: 'sPrice', styleWidth: 10, styleToRight: true, cellEditable: true, cellEditableValidation: VSchemaPSL.sPrice, cellEditableInputType: HTML_INPUT_TYPE.TEXT },
    { title: 'currency', navKey: 'currencyId', styleWidth: 2, styleToLeft: true, cellEditableSelect: true, cellEditableSelectOptions: [], cellEditableSelectPlaceholder: t('form.placeholders.product-currency') },
    { title: 'tax', navKey: 'sTax', styleWidth: 2, cellEditable: true, cellEditableValidation: VSchemaPSL.sTax, cellEditableInputType: HTML_INPUT_TYPE.TEXT },
    { title: 'active', styleToCenter: true, styleWidth: 10, navKey: 'isActive', fieldSwitch: true },
    {
        title:        '',                                     // actions buttons
        styleToRight: true,
        styleWidth:   6
    }
]

export const HProductTable: Partial<IColumnHeader>[] = [
    { title: '', chk: true, styleWidth: 2 },
    { title: 'id', hidden: true },
    { title: 'sellCode', hidden: true },

    { title: 'name', navKey: 'pName', sorting: '', styleWidth: 20 },
    { title: 'active', styleToCenter: true, navKey: 'isActive', fieldSwitch: true, styleWidth: 5, sorting: '' },
    { title:           'inventory',
        styleToCenter: true,
        navKey:        'doWeTrackInventory',
        styleWidth:    5,
        iconField:     true,
        sorting: '',
        iconMapValues: [
            { icon: 'tim-icons icon-components', val: true },
            { icon: '', val: false }
        ]
    },
    { title: 'category', styleToCenter: true, navKey: 'pCategoryID', styleWidth: 10, sorting: '' },
    { title: 'price', navKey: 'sellPrice', styleToRight: true, styleWidth: 6, sorting: '' },
    { title: 'cost', styleToCenter: true, styleWidth: 6 },
    { title: 'stock', navKey: 'pTotalStock', styleToRight: true, styleWidth: 4, forceEmptyRender: true, sorting: '' },
    { title: 'unit', navKey: 'pUoMID', styleToLeft: true, styleWidth: 1 },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   5
    }
]

export const HWarehouseTable: Partial<IColumnHeader>[] = [
    { title: 'id', hidden: true },
    { title: 'name', navKey: 'wName', sorting: '' },
    { title: 'code', styleWidth: 30, sorting: '' },
    { title: 'address', navKey: 'suppID' },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   40
    }
]

export const HStrgCategory: Partial <IColumnHeader>[] = [
    { title: 'id', hidden: true },
    { title: 'name', navKey: 'sCatName', sorting: '', styleWidth: 40 },
    { title: 'count-wlocations', navKey: 'wLocationCount', styleWidth: 10 },
    { title: 'strg-prod-policy', navKey: 'allowProdType', sorting: '', styleWidth: 20 },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   40
    }
]

export const HStrgCatProductLine: Partial <IColumnHeader>[] = [
    { title: 'id', hidden: true },
    { title: 'products', navKey: 'productID', styleWidth: 35, cellEditableSelect: true, cellEditableSelectSearchable: true, cellEditableSelectPlaceholder: t('form.placeholders.strg-select-product') },
    { title: 'capacity', navKey: 'maxCapacity', styleToRight: true, styleWidth: 20, cellEditable: true, cellEditableValidation: VSchemaProdLine.maxCapacity, cellEditableInputType: HTML_INPUT_TYPE.TEXT },
    { title: '', navKey: 'uomID', hidden: true },
    { title: 'uom', navKey: 'uomLabel', styleToLeft: true, styleWidth: 10 },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   40
    }
]
