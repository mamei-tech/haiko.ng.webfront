import type { IColumnHeader } from '@/services/definitions'

// H means headers
export const PAGE_SIZE = 10

export const HCatalogsTable: Partial<IColumnHeader>[] = [
    { title: '', chk: true, width: 2 },
    { title: 'Id', navKey: '_id', hidden: true },
    { title: 'Name', sorting: '' },
    { title: 'Active', toCenter: true, navKey: 'isEnable', switch: true },
    { title: 'Size(MB)', navKey: 'size', width: 12, sorting: '' },
    { title: 'Items', toCenter: true, width: 10 },
    { title: 'Actions', toRight: true, width: 40 }
]

export const HStoresTable: Partial<IColumnHeader>[] = [
    { title: '', chk  : true, width: 2 },
    { title : 'Id', hidden: true },
    { title  : 'Store Name', sorting: '', navKey : 'storeName' },
    { title: 'Store Type', toCenter: true, sorting: '', navKey: 'storeType', multi: [] },
    { title   : "Owner\\'s name", toCenter: true, sorting : '', navKey  : 'name' },
    { title   : "Owner\\'s Lastname", toCenter: true, sorting : '', navKey  : 'lastName' },
    { title   : 'Active', toCenter: true, navKey  : 'isActive', switch  : true },
    { title  : 'Actions', toRight: true, width  : 40 }
]

export const HMenuTable: Partial<IColumnHeader>[] = [
    { title: '', chk  : true, width: 2 },
    { title   : 'Menu Name', sorting : '', navKey  : 'displayName', toCenter: true },
    { title   : 'Description', sorting : '', toCenter: true },
    { title   : 'Active', toCenter: true, switch  : true, navKey  : 'isActive' },
    { title  : 'Actions', toRight: true }
]

export const HItemsTable: Partial<IColumnHeader>[] = [
    { title: '', chk  : true, width: 2 },
    { title : 'Id', hidden: true },
    { title  : 'Name', sorting: '', navKey : 'itemName' },
    { title  : 'Store', sorting: '', navKey : 'storeName' },
    { title: 'Store Type', toCenter: true, sorting: '', navKey: 'storeType', multi: [] },
    { title   : 'Active', toCenter: true, navKey  : 'isActive', switch  : true, switchRole: 'main' },
    { title   : 'Sold Out', toCenter: true, navKey  : 'isSoldOutToday', switch  : true, switchRole: 'secondary' }
]
