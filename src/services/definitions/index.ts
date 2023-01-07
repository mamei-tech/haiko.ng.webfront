import { ALIGN_POSITION } from './types-common'
import { RoutePaths, RoutePathNames } from './route-paths'
import { HCatalogsTable, PAGE_SIZE, queryBase } from './data-datatables'
import { EntityTypes, ENTITY_NAMES } from '@/services/definitions/enums-entities'
import { HTTP_RESPONSES, OPS_KIND_STR, ACTION_KIND_STR, FMODE, BULK_ACTIONS } from '@/services/definitions/enums-common'

import { VSchemaStaffCreate, VSchemaStaffEdit } from '@/services/definitions/validations/validations-people'
import { VSchemaCommon } from '@/services/definitions/validations/validations-commons'
import { VSchemaAuth } from '@/services/definitions/validations/validations-auth'

import type { Problem, ErrorDictionary } from '@/services/definitions/types-errors'
import type { TOpsKind, Function0, Function1, IColumnHeader, IDataTableQuery, ITableChkEmit, TBulkAction, ById, IIndexable, IChecked, Filter, IBasicPageState, IDataListBasicResponse, TFormMode, TActionKind, EntityGenericNames, IdsArray, IBulkData, IMultiselectBasic, IShell, IScrollInfo  } from './types-common'
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
    ENTITY_NAMES,
    OPS_KIND_STR,
    FMODE,
    BULK_ACTIONS,
    ACTION_KIND_STR,
    HTTP_RESPONSES,

    // Functions & other Types
    TOpsKind,
    Function0, Function1,

    // Common Types
    Problem,
    ErrorDictionary,
    IDataTableQuery, ITableChkEmit, IColumnHeader, IIndexable, IChecked, IBasicPageState, IDataListBasicResponse, IBulkData, IMultiselectBasic, IShell, IScrollInfo,
    ById, TBulkAction, Filter, TFormMode, TActionKind, EntityGenericNames, IdsArray,
    ALIGN_POSITION,

    // Validations ... VSchema == validations schema
    VSchemaAuth, VSchemaCommon, VSchemaStaffCreate, VSchemaStaffEdit,

    // =====  ENTITIES =====

    // staff
    IStaffPage,  IStaffRow, IDtoStaff,

    // rbac
    IRoleBasic
}
