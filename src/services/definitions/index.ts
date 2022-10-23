import { ALIGN_POSITION } from './types-common'
import { RoutePaths, RoutePathNames } from './route-paths'
import { HCatalogsTable, PAGE_SIZE, queryBase } from './data-datatables'
import { EntityTypes } from '@/services/definitions/enums-entities'

import { VSchemaStaffCreate, VSchemaStaffEdit } from '@/services/definitions/validations/validations-people'
import { VSchemaCommon } from '@/services/definitions/validations/validations-commons'
import { VSchemaAuth } from '@/services/definitions/validations/validations-auth'

import type { Problem, ErrorDictionary } from '@/services/definitions/types-errors'
import type { TOPSKind, Function0, Function1, IColumnHeader, IDataTableQuery, ITableChkEmit, BULK_ACTION, ById, IIndexable, IChecked, Filter, IBasicPageState, IDataListBasicResponse, TFormMode, TActionKind, EntityGenericNames, IdsArray, IBulkData  } from './types-common'
import type { IStaffPage, IStaffRow, IStaffDto } from '@/services/definitions/entities/types-staff'


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

    // Functions & other Types
    TOPSKind,
    Function0, Function1,

    // Common Types
    Problem,
    ErrorDictionary,
    IDataTableQuery, ITableChkEmit, IColumnHeader, IIndexable, IChecked, IBasicPageState, IDataListBasicResponse, IBulkData,
    ById, BULK_ACTION, Filter, TFormMode, TActionKind, EntityGenericNames, IdsArray,
    ALIGN_POSITION,

    // Validations ... VSchema == validations schema
    VSchemaAuth, VSchemaCommon, VSchemaStaffCreate, VSchemaStaffEdit,


    // =====  ENTITIES =====

    // staff
    IStaffPage,  IStaffRow, IStaffDto

}
