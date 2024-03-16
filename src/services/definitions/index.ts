import { ALIGN_POSITION } from './types-common'
import { RoutePaths, RoutePathNames } from './route-paths'

import { PAGE_SIZE } from './dtable/dtable-common'
import { HRolesTable, HStaffTable } from './dtable/dtable-people'
import { HSupplierCatTable, HSupplierTable } from './dtable/dtable-purchase'
import { HUoMCatTable, HUoMTable, HProductTable, HProductSupplierLine, HWarehouseTable, HStrgCategory, HStrgCatProductLine, HWareLocationsTable } from './dtable/dtable-inventory'

import { SelectDataUoMType } from './data-select-options'
import { HTTP_HEADER_FORM_DATA, HTTP_HEADER_FORM_URLENCODED,RELPATH_DEFAULT_AVATAR_IMG, RELPATH_DEFAULT_PRODUCT_IMG, IMG_ORG_AVATAR_NAME, IMG_AVATAR_SMALL_THUMBNAIL, IMG_ORG_PRODUCT_NAM } from './data-strs'
import { DT_ACTIONBAR_MODE, ENTITY_NAMES, DT_ACTION_BUTTON_MODE, STRG_PROD_POLICY } from '@/services/definitions/enums-entities'
import { HTTP_RESPONSES, OPS_KIND_STR, ACTION_KIND_STR, FMODE, BULK_ACTIONS, KEYS, PICTURE_TYPE_CELL, HTML_INPUT_TYPE, DIALOG_ICON, WARE_LOC_TYPE } from '@/services/definitions/enums-common'

import { VSchemaAuth } from '@/services/definitions/validations/validations-auth'
import { VSchemaRole } from '@/services/definitions/validations/validations-rbac'
import { VSchemaUoM, VSchemaUoMCat } from '@/services/definitions/validations/validations-uom'
import { VSchemaCommon } from '@/services/definitions/validations/validations-commons'
import { VSchemaSupplier } from '@/services/definitions/validations/validations-suppliers'
import { VSchemaPSL, VSchemaProduct } from '@/services/definitions/validations/validations-product'
import { VSchemaWarehouse } from '@/services/definitions/validations/validations-warehouse'
import { VSchemaStrgCategory } from '@/services/definitions/validations/validations-strgcategory'
import { VSchemaStaffCreate, VSchemaStaffEdit } from '@/services/definitions/validations/validations-people'

import type { Problem, ErrorDictionary } from '@/services/definitions/types-errors'
import type { IWarehouseRow, IDtoWarehouse } from '@/services/definitions/entities/types-warehouse'
import type { IWareLocationRow } from '@/services/definitions/entities/types-warelocation'
import type { IStrgCategoryRow, IDtoStrgCategory, IStrgCatProdLine } from '@/services/definitions/entities/types-strgcategory'
import type { TOpsKind, Function0, Function1, IColumnHeader, IDataTableQuery, ITableChkEmit, TBulkAction, ById, IIndexable, IChecked, Filter, IDataListBasicResponse, TFormMode, TActionKind, IdsArray, IBulkData, IMultiselectBasic, IShell, IScrollInfo, IDataTablePage, ICellUpdate, IvCard, IExtFilter, IExtFilterGroup } from './types-common'
import type { IStaffRow, IDtoStaff, IStaffBasic } from '@/services/definitions/entities/types-staff'
import type { IRoleBasic, IDtoRole, IPermAssocId, IPermAssoc, IGroupPermsDict } from '@/services/definitions/entities/types-rbac'
import type { IDtoUoM, IDtoUoMCategory, IUoMBasic } from '@/services/definitions/entities/types-uom'
import type { ISupplierCatRow, IDtoSupplierCat, ISupplierRow, ISuppCatBasic, IDtoSupplier, ISupplierBasic } from '@/services/definitions/entities/types-supplier'
import type { ICountryBasic, ICountryStatesBasic } from '@/services/definitions/entities/types-location'
import type { IProdUoM, IProductRow, IProdCatBasic, IDtoProduct, IDtoProductSupplierL } from '@/services/definitions/entities/types-product'
import type { ICurrencyBasic } from '@/services/definitions/entities/types-currency'


export {
    // Routes
    RoutePaths,
    RoutePathNames,

    // static select data
    SelectDataUoMType,

    // Data Definitions
    HUoMTable,
    HRolesTable,
    HStaffTable,
    HUoMCatTable,
    HProductTable,
    HStrgCategory,
    HSupplierTable,
    HWarehouseTable,
    HSupplierCatTable,
    HWareLocationsTable,
    HStrgCatProductLine,
    HProductSupplierLine,

    PAGE_SIZE,

    // Enums
    KEYS,
    FMODE,
    DIALOG_ICON,
    OPS_KIND_STR,
    ENTITY_NAMES,
    BULK_ACTIONS,
    WARE_LOC_TYPE,
    HTTP_RESPONSES,
    ACTION_KIND_STR,
    HTML_INPUT_TYPE,
    PICTURE_TYPE_CELL,
    DT_ACTIONBAR_MODE,
    STRG_PROD_POLICY,
    DT_ACTION_BUTTON_MODE,

    // strings constants
    HTTP_HEADER_FORM_DATA,
    HTTP_HEADER_FORM_URLENCODED,
    RELPATH_DEFAULT_AVATAR_IMG,
    RELPATH_DEFAULT_PRODUCT_IMG,

    IMG_AVATAR_SMALL_THUMBNAIL,
    IMG_ORG_AVATAR_NAME,
    IMG_ORG_PRODUCT_NAM,

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
    VSchemaStrgCategory, VSchemaAuth, VSchemaCommon, VSchemaStaffCreate, VSchemaStaffEdit, VSchemaRole, VSchemaWarehouse, VSchemaSupplier, VSchemaUoM, VSchemaUoMCat, VSchemaPSL, VSchemaProduct,

    // =====  ENTITIES =====

    // warehouse (storage) locations
    IWareLocationRow,

    // warehouse
    IWarehouseRow, IDtoWarehouse,

    // storage category
    IStrgCategoryRow, IDtoStrgCategory, IStrgCatProdLine,

    // staff
    IStaffRow, IDtoStaff, IStaffBasic,

    // rbac
    IRoleBasic, IDtoRole,  IPermAssocId, IPermAssoc,

    // uom
    IDtoUoM, IDtoUoMCategory, IUoMBasic,

    // supplier
    ISupplierCatRow, IDtoSupplierCat, ISupplierRow, ISuppCatBasic, IDtoSupplier, ISupplierBasic,

    // location
    ICountryBasic, ICountryStatesBasic,

    // product
    IProdUoM, IProductRow, IProdCatBasic, IDtoProduct, IDtoProductSupplierL,

    // currency
    ICurrencyBasic
}
