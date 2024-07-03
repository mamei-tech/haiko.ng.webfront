
import type { IColumnHeader } from '@/services/definitions'

// H means headers
// this struct defines (tells) to the CmpDataTable how it should render and process the table headers and the cells
// for a specific data

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
    { title: 'name', navKey: 'pName', sorting: '' },
    { title: 'cell', navKey: 'cell', sorting: '', forceEmptyRender: true, styleWidth: 10 },
    { title: 'phone', navKey: 'sPhone', sorting: '', forceEmptyRender: true, styleWidth: 10 },
    { title: 'active', styleToCenter: true, navKey: 'isActive', fieldSwitch: true, styleWidth: 5 },
    { title: 'category', styleToCenter: true, navKey: 'suppCategoryID', sorting: '' },
    { title: 'products', navKey: 'pCount',  sorting: '', styleToCenter: true, styleWidth: 8 },
    { title: 'countryCode', hidden: true },
    {
        title:        '',            // actions buttons
        styleToRight: true,
        styleWidth:   5
    }
]

