import { RoutePaths, RoutePathNames } from './route-paths'
import { HCatalogsTable, PAGE_SIZE, queryBase } from './data-datatables'
import { ALIGN_POSITION } from './types-common'

import type { Problem, ErrorDictionary } from '@/services/definitions/types-errors'
import type { OPSKind, Function0, Function1, IColumnHeader, IDataTableQuery } from './types-common'
import type { IStaffPage, IStaffRow } from '@/services/definitions/entities/types-staff'


export {
    // Routes
    RoutePaths,
    RoutePathNames,

    // Data Definitions
    HCatalogsTable,
    PAGE_SIZE,
    queryBase,

    // Enums

    // Functions & other Types
    OPSKind,
    Function0,
    Function1,
    IColumnHeader,

    // Common Types
    Problem,
    ErrorDictionary,
    IDataTableQuery,
    ALIGN_POSITION,

    // =====  ENTITIES =====

    // staff
    IStaffPage,  IStaffRow

}
