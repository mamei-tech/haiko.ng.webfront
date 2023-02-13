import type { IColumnHeader, IDataTableQuery } from '@/services/definitions'

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

export const HStaffTable: Partial<IColumnHeader>[] = [
    {
        title: '',
        chk:   true,
        width: 2
    },

    {
        title:  'id',
        hidden: true
    },

    {
        title:  'avatar',
        navKey: 'avatarPath'
    },

    {
        title:   'name',
        sorting: '',
        navKey:  'firstName'
    },

    {
        title:    'user',
        toCenter: true,
        sorting:  '',
        navKey:   'username'
    },

    {
        title:   'contact',
        sorting: '',
        navKey:  'cell'
    },

    {
        title:    'role',
        toCenter: true,
        navKey:   'roleId'
    },

    {
        title:    'active',
        toCenter: true,
        sorting:  '',
        navKey:   'isActive',
        switch:   true
    },

    {
        title:   '',            // actions buttons
        toRight: true,
        width:   40
    }
]

