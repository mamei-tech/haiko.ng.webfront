import { ALIGN_POSITION } from './types-common'
import { RoutePaths, RoutePathNames } from './route-paths'
import { HCatalogsTable, PAGE_SIZE } from './data-datatables'
import { HTTP_HEADER_FORM_DATA, HTTP_HEADER_FORM_URLENCODED,RELPATH_DEFAULT_AVATAR_IMG, RELPATH_DEFAULT_PRODUCT_IMG, IMG_ORG_AVATAR_NAME, IMG_AVATAR_SMALL_THUMBNAIL, IMG_PRODUCT_NAME } from './data-strs'
import { ENTITY_TYPE, ENTITY_NAMES } from '@/services/definitions/enums-entities'
import { HTTP_RESPONSES, OPS_KIND_STR, ACTION_KIND_STR, FMODE, BULK_ACTIONS, KEYS, PICTURE_TYPE_CELL } from '@/services/definitions/enums-common'

import { VSchemaStaffCreate, VSchemaStaffEdit } from '@/services/definitions/validations/validations-people'
import { VSchemaCommon } from '@/services/definitions/validations/validations-commons'
import { VSchemaAuth } from '@/services/definitions/validations/validations-auth'
import { VSchemaRole } from '@/services/definitions/validations/validations-rbac'

import type { Problem, ErrorDictionary } from '@/services/definitions/types-errors'
import type { TOpsKind, Function0, Function1, IColumnHeader, IDataTableQuery, ITableChkEmit, TBulkAction, ById, IIndexable, IChecked, Filter, IDataListBasicResponse, TFormMode, TActionKind, EntityGenericNames, IdsArray, IBulkData, IMultiselectBasic, IShell, IScrollInfo, IDataTablePage  } from './types-common'
import type { IStaffRow, IDtoStaff } from '@/services/definitions/entities/types-staff'
import type { IRoleBasic, IDtoRole, IPermAssocId, IPermAssoc, IGroupPermsDict } from '@/services/definitions/entities/types-rbac'


export {
    // Routes
    RoutePaths,
    RoutePathNames,

    // Data Definitions
    HCatalogsTable,
    PAGE_SIZE,

    // Enums
    ENTITY_TYPE,
    PICTURE_TYPE_CELL,
    ENTITY_NAMES,
    OPS_KIND_STR,
    FMODE,
    BULK_ACTIONS,
    ACTION_KIND_STR,
    HTTP_RESPONSES,
    KEYS,

    // strings constants
    HTTP_HEADER_FORM_DATA,
    HTTP_HEADER_FORM_URLENCODED,
    RELPATH_DEFAULT_AVATAR_IMG,
    RELPATH_DEFAULT_PRODUCT_IMG,

    IMG_AVATAR_SMALL_THUMBNAIL,
    IMG_ORG_AVATAR_NAME,
    IMG_PRODUCT_NAME,

    // Functions & other Types
    TOpsKind,
    Function0, Function1,

    // Common Types
    Problem,
    ErrorDictionary,
    IDataTableQuery, ITableChkEmit, IColumnHeader, IIndexable, IChecked, IDataListBasicResponse, IBulkData, IMultiselectBasic, IShell, IScrollInfo, IDataTablePage, IGroupPermsDict,
    ById, TBulkAction, Filter, TFormMode, TActionKind, EntityGenericNames, IdsArray,
    ALIGN_POSITION,

    // Validations ... VSchema == validations schema
    VSchemaAuth, VSchemaCommon, VSchemaStaffCreate, VSchemaStaffEdit, VSchemaRole,

    // =====  ENTITIES =====

    // staff
    IStaffRow, IDtoStaff,

    // rbac
    IRoleBasic, IDtoRole,  IPermAssocId, IPermAssoc
}
