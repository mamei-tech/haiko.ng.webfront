import { ALIGN_POSITION } from './types-common'
import { RoutePaths, RoutePathNames } from './route-paths'
import { HCatalogsTable, PAGE_SIZE, queryBase } from './data-datatables'
import { EntityTypes } from '@/services/definitions/enums-entities'
import { HTTP_RESPONSES } from '@/services/definitions/enums-common'

import { VSchemaStaffCreate, VSchemaStaffEdit } from '@/services/definitions/validations/validations-people'
import { VSchemaCommon } from '@/services/definitions/validations/validations-commons'
import { VSchemaAuth } from '@/services/definitions/validations/validations-auth'

import type { Problem, ErrorDictionary } from '@/services/definitions/types-errors'
import type { TOPSKind, Function0, Function1, IColumnHeader, IDataTableQuery, ITableChkEmit, BULK_ACTION, ById, IIndexable, IChecked, Filter, IBasicPageState, IDataListBasicResponse, TFormMode, TActionKind, EntityGenericNames, IdsArray, IBulkData, IMultiselectBasic, IShell, IScrollInfo  } from './types-common'
import type { IStaffPage, IStaffRow, IDtoStaff } from '@/services/definitions/entities/types-staff'
import type { IRoleBasic } from '@/services/definitions/entities/types-rbac'


export {
    // Routes
    RoutePaths,
    RoutePathNames,

    // Data Definitions
    HCatalogsTable,
    PAGE_SIZE,
    queryBase,

    // Enums
    EntityTypes,
    HTTP_RESPONSES,

    // Functions & other Types
    TOPSKind,
    Function0, Function1,

    // Common Types
    Problem,
    ErrorDictionary,
    IDataTableQuery, ITableChkEmit, IColumnHeader, IIndexable, IChecked, IBasicPageState, IDataListBasicResponse, IBulkData, IMultiselectBasic, IShell, IScrollInfo,
    ById, BULK_ACTION, Filter, TFormMode, TActionKind, EntityGenericNames, IdsArray,
    ALIGN_POSITION,

    // Validations ... VSchema == validations schema
    VSchemaAuth, VSchemaCommon, VSchemaStaffCreate, VSchemaStaffEdit,


    // =====  ENTITIES =====

    // staff
    IStaffPage,  IStaffRow, IDtoStaff,

    // rbac
    IRoleBasic
}
