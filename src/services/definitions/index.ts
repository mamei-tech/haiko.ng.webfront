import { ALIGN_POSITION } from './types-common'
import { RoutePaths, RoutePathNames } from './route-paths'
import { HStaffTable, HRolesTable, HUoMCatTable, HUoMTable, PAGE_SIZE, HSupplierCatTable, HSupplierTable, HProductTable } from './data-datatables'
import { SelectUoMType } from './data-select-options'
import { HTTP_HEADER_FORM_DATA, HTTP_HEADER_FORM_URLENCODED,RELPATH_DEFAULT_AVATAR_IMG, RELPATH_DEFAULT_PRODUCT_IMG, IMG_ORG_AVATAR_NAME, IMG_AVATAR_SMALL_THUMBNAIL, IMG_PRODUCT_NAME } from './data-strs'
import { DT_ACTIONBAR_MODE, ENTITY_NAMES, DT_ACTION_BUTTON_MODE } from '@/services/definitions/enums-entities'
import { HTTP_RESPONSES, OPS_KIND_STR, ACTION_KIND_STR, FMODE, BULK_ACTIONS, KEYS, PICTURE_TYPE_CELL, HTML_INPUT_TYPE } from '@/services/definitions/enums-common'

import { VSchemaStaffCreate, VSchemaStaffEdit } from '@/services/definitions/validations/validations-people'
import { VSchemaCommon } from '@/services/definitions/validations/validations-commons'
import { VSchemaAuth } from '@/services/definitions/validations/validations-auth'
import { VSchemaRole } from '@/services/definitions/validations/validations-rbac'

import type { Problem, ErrorDictionary } from '@/services/definitions/types-errors'
import type { TOpsKind, Function0, Function1, IColumnHeader, IDataTableQuery, ITableChkEmit, TBulkAction, ById, IIndexable, IChecked, Filter, IDataListBasicResponse, TFormMode, TActionKind, IdsArray, IBulkData, IMultiselectBasic, IShell, IScrollInfo, IDataTablePage, ICellUpdate, IvCard, IExtFilter, IExtFilterGroup } from './types-common'
import type { IStaffRow, IDtoStaff } from '@/services/definitions/entities/types-staff'
import type { IRoleBasic, IDtoRole, IPermAssocId, IPermAssoc, IGroupPermsDict } from '@/services/definitions/entities/types-rbac'
import type { IDtoUoM, IDtoUoMCategory, IUoMBasic } from '@/services/definitions/entities/types-uom'
import type { ISupplierCatRow, IDtoSupplierCat, ISupplierRow, ISuppCatBasic, IDtoSupplier } from '@/services/definitions/entities/types-supplier'
import type { ICountryBasic, ICountryStatesBasic } from '@/services/definitions/entities/types-location'
import type { IProductRow, IProdCatBasic } from '@/services/definitions/entities/types-product'


export {
    // Routes
    RoutePaths,
    RoutePathNames,

    // static select data
    SelectUoMType,

    // Data Definitions
    HStaffTable,
    HRolesTable,
    HUoMTable,
    HUoMCatTable,
    HSupplierCatTable,
    HSupplierTable,
    HProductTable,

    PAGE_SIZE,

    // Enums
    HTML_INPUT_TYPE,
    DT_ACTIONBAR_MODE,
    DT_ACTION_BUTTON_MODE,
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
    IDataTableQuery, ITableChkEmit, IColumnHeader,  IIndexable, IChecked, IDataListBasicResponse, IBulkData, IMultiselectBasic, IShell, IScrollInfo, IDataTablePage, IGroupPermsDict, ICellUpdate, IvCard, IExtFilter, IExtFilterGroup,
    ById, TBulkAction, Filter, TFormMode, TActionKind, IdsArray,
    ALIGN_POSITION,

    // Validations ... VSchema == validations schema
    VSchemaAuth, VSchemaCommon, VSchemaStaffCreate, VSchemaStaffEdit, VSchemaRole,

    // =====  ENTITIES =====

    // staff
    IStaffRow, IDtoStaff,

    // rbac
    IRoleBasic, IDtoRole,  IPermAssocId, IPermAssoc,

    // uom
    IDtoUoM, IDtoUoMCategory, IUoMBasic,

    // supplier
    ISupplierCatRow, IDtoSupplierCat, ISupplierRow, ISuppCatBasic, IDtoSupplier,

    // location
    ICountryBasic, ICountryStatesBasic,

    // product
    IProductRow, IProdCatBasic
}
