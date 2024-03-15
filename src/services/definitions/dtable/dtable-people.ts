
import type { IColumnHeader } from '@/services/definitions'

// H means headers
// this struct defines (tells) to the CmpDataTable how it should render and process the table headers and the cells
// for a specific data

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

