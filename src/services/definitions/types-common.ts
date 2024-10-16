import type { HTML_INPUT_TYPE } from '@/services/definitions'


export interface IDataTablePage<T> extends IDataListBasicResponse {
    entityList: Array<T>;
}

export interface IIndexable {
    id: number
}

export type IdsArray = { ids: Array<number> }

export interface IChecked {
    chked: boolean
}

/***
 * Generic type for a non param function
 */
export interface Function0<T = void> {
    (): T
}

/***
 * Generic type for a functions with one parameter
 */
export interface Function1<T1, T2 = void> {
    ( param1: T1 ): T2
}

/**
 * Define data we need the filers holds
 */
export interface IExtFilter {
    label: string,
    entityField: string,                // should be the name of the entity field
    isActive: boolean                   // tells if the filters is active on the UI
    value: number | string | boolean    // hold the value that should be used to filtering (query) the data on the server
}

/**
 * Database extended filters group. If we need to define more (extended) filters for a datatable than we can define in the columns headers,
 * this is the solution.
 */
export interface IExtFilterGroup {
    label: string,
    filters: IExtFilter[]
}

/***
 * Interface to describe object for datatable headers abstraction.
 * This create a flexible configuration for describing how to handle the headers and cell representation.
 */
export interface IColumnHeader {
    hidden: boolean | undefined
    /**
     * Define a checkbox cell / header
     */
    chk: boolean | undefined
    /**
     * Designed to be used optional with a boolean header filter header when whe need to set the header to true by default, and doing so filter the data starting from the first (hence default) load
     * defStatus = default status
     */
    defStatus : boolean
    title: string
    /**
     * To be uses as tips / hints / help right int the UI. Right now, we have not components making uses of that.
     */
    hint: string
    /**
     * So v-for can navigate in the data array. if isn't present, lower-cased title be use then. It comes in handy when we have a user friendly title different from the real key
     */
    navKey: string | undefined
    /**
     * Sorting information of the header
     */
    sorting: SortDir | undefined
    styleToLeft: boolean | undefined
    styleToRight: boolean | undefined
    styleToCenter: boolean | undefined
    styleBold: boolean | undefined
    /**
     * percent (%)
     */
    styleWidth: number | undefined
    /**
     * Tells is the cell should be rendered as a color field
     */
    fieldColor: boolean | undefined
    /**
     * If we can use this cell as a switch for enable / disable actions
     */
    fieldSwitch: boolean | undefined
    /**
     * Defines a select / multiselect cell
     */
    filterSelectOptions: IMultiselectBasic[] | undefined
    /**
     * This type property defines the roles for witches. It may comes in handy when we need more than one
     * switches in the data-grid, this way we can make a distinction for emitting the events from
     * the data-grid
     */
    fieldSwitchRole: TSwitchRole | undefined
    /**
     * Comes in handy when we need to handle the cell as a picture cell
     */
    fieldPicture: boolean | undefined
    /**
     * - list of pills - | <UnitOfMeasurement version>
     * This will be used when the cells needs to render a list of 'pills' containing text. May implement other version to differentiate the render logic
     * The render will depend of the following properties:
     *  - isActive: for using a opaque color when is inactive
     *  - uname: the name of the units, it will be text of the pill
     *  - uType: for render an indicative for the units of reference
     */
    listOPillsUoM: boolean | undefined
    /**
     * Tells if we want a normal / basic editable cell on click event, built-in the datatable
     * ❗ This property and cellEditableSelect should be mutual exclusive
     */
    cellEditable: boolean | undefined
    /**
     * Tells if we want a select editable cell on click event, built-in the datatable
     * ❗ This property and cellEditable should be mutual exclusive
     */
    cellEditableSelect: boolean | undefined
    cellEditableSelectOptions: IMultiselectBasic[] | undefined
    cellEditableSelectPlaceholder: string | undefined
    cellEditableSelectSearchable: boolean | undefined
    /**
     * A function of /services/definition/validation/ schema, to be used as a callback for validating the editable cell data when it changes
     */
    cellEditableValidation: Function
    /**
     * Tells to the component which kind of HTML input render
     */
    cellEditableInputType: HTML_INPUT_TYPE
    /**
     * Tell if we want to force the render of an empty cell on the table, when there is no data to render
     */
    forceEmptyRender: boolean
    /**
     * Tell if we need to render the cell as an icon cell
     * ❗ The icon field is a kind of a switcher, but with more options
     */
    iconField: boolean | undefined
    /**
     * Helps to know how to map actual cells values from entities to the desired icon for a specific row case
     *
     * @param val reference value to map the icon to
     * @param icon CSS icon str to be mapped
     */
    iconMapBinary: Array<{ val: number | string | boolean, icon: string }> | undefined
    /**
     * Defines the conversion (or mapping)
     *
     * @param val reference value to map the color to
     * @param color CSS color str to be mapped
     */
    colorMapValues: Array<{val: number | string | boolean, color: string}> | undefined
}

/***
 * Describe a dictionary mapped by the object ids or keys
 */
export type ById<T> = {
    [ id: number | string ]: T
}

/***
 * A Shell or abstractions has a collection of object by array and with a dictionary mapped by the id object
 */
export type IShell<T> = {
    array: T[]
    dic: ById<T>
}

/***
 * Definition for <<API>> operations that requieres a UI toast feedback
 * T = type
 *
 * ! The values defined here must match one2one with the definition of OPS_KIND_STR type definition in the 'enums-common.ts' file
 *
 */
export type TOpsKind = 'deletion' | 'addition' | 'update' | 'enable' | 'disable' | 'request'

/***
 * Definition for <<UI>> actions that requieres a dialog confirmations or UI feedback
 * T = type
 */
export type TActionKind = 'delete' | 'create' | 'update' | 'activate' | 'deactivate'

/**
 * Definition for entities forms view mode
 * T = type
 */
export type TFormMode = 'edit' | 'create' | 'details'

/***
 * Table Top Buttons Action Bar (BULK ACTION) clicked action
 */
export type TBulkAction = 'ENABLE' | 'DISABLE' | 'REMOVE'

/***
 * Interface for type the emission argument object for the table's checkbox component
 */
export interface ITableChkEmit {
    id: number
    newStatus: boolean
}

/***
 * Interface for type the emission argument object for the table's bulk actions events
 */
export interface IBulkData {
    ids: string[]
    actionType: TBulkAction
}

export type TGetStoreEntities = {
    storeId: number
    queryParams: IDataTableQuery
}

/**
 * Generic common type for bulk / batch actions for stores related entities like items, menus, modifiers, etc
 */
export type TBulkActions = {
    ids: Array<number>
    /**
     * Store that owns the entity identifiers This can be null in some situations. E.g. in Staff's endpoint the
     * privileges are higher, so the  bulks operations can perform on item of multiple store. In this situations we can
     * filter the items by the store that owns it, this is an example when "StoreId" can be null
     */
    storeId?: number
}

/**
 * Datatable sort header direction
 */
export type SortDir = 'ASC' | 'DESC' | ''

/**
 * This type hold the base query information related to a datatable
 */
export interface IDTQueryBase {
    sortdir: SortDir
    field: string
    skip: number
    limit: number
    search: string
}

export type Filter = Record<string, string>

export interface IDataTableQuery {
    /**
     * Offset page, commonly start in 0
     */
    Offset: number

    /**
     * Size (limit) of the page, count of element to be included
     */
    Limit: number

    /**
     * Table field to {ORDER BY} for
     */
    Orderer: string

    /**
     * Order direction: ascending (ASC), descending (DSC)
     */
    OrderDir?: SortDir

    /**
     * Actual query to look for. This value is going to use to search in the
     * specified entity field
     */
    Search?: string

    /**
     * Key-Value collection of filters for the query
     */
    Filters?: Filter
}

/**
 * Definition of elements styles.
 */
export type TElementType = '' | 'success' | 'danger' | 'info' | 'warning'

export type TAlignment = {
    v: 'top' | 'bottom'
    h: 'left' | 'right' | 'center'
}

/**
 * This type define the roles for witches. It may comes in handy when we need more than one
 * switches in the data-grid, this way we can make a distinction for emitting the events from
 * the data-grid
 */
export type TSwitchRole = 'main' | 'secondary'

export const ALIGN_POSITION = {
    TOP_CENTER:    { v: 'top', h: 'center' },
    TOP_RIGHT:     { v: 'top', h: 'right' },
    TOP_LEFT:      { v: 'top', h: 'left' },
    BOTTOM_RIGHT:  { v: 'bottom', h: 'right' },
    BOTTOM_LEFT:   { v: 'bottom', h: 'left' },
    BOTTOM_CENTER: { v: 'bottom', h: 'center' }
} as {
    TOP_CENTER:     TAlignment
    TOP_RIGHT:      TAlignment
    TOP_LEFT:       TAlignment
    BOTTOM_CENTER:  TAlignment
    BOTTOM_LEFT:    TAlignment
    BOTTOM_RIGHT:   TAlignment
}

/**
 * Definition of elements referring to scroll information
 */
export interface IScrollInfo {
    /**
     * distance of the current element from the top edge of the node
     */
    offsetTop: number;
    /**
     * gets or sets the number of pixels that the content of an element has been scrolled up
     */
    scrollTop: number;
}

/**
 * Used as object to hold the data when a datatable cell is updated
 */
export interface ICellUpdate {
    entityId: number,
    entityField: string
    updatedValue: string | number | boolean
}

/**
 * Describe the basic (but in a incomplete manner) data of a data-table page view. The field regarding of the type of the entity
 * is missing this interface can be adapted to any case
 */
export interface IDataListBasicResponse {
    totalRecords: number                  // Total entity count on the entire system
}

/**
 * Basic multiselect interface data
 */
export interface IMultiselectBasic {
    value: number|string,
    label: string
}

/**
 * vCard v4 interface so the necesary props are defined
 * reference -> https://github.com/joonhocho/vcard-generator
 */
export interface IvCard {
    name: Partial<IvCardName>,
    nickname?: string | undefined,
    work: Partial<IvCardWork>
    emails: Array<{ type: string | undefined, text: string }> | undefined
    phones: Array<{ type: string | undefined, text: string }> | undefined
    addresses: Array<Partial<IvCardAddress>>
    note: { text: string } | undefined                                                      // ! in supplier case use INTERNAL NOTES
}

/**
 * Just used in IvCard interface definition
 */
interface IvCardName {
    familyName: string,
    givenName: string,
    middleName: string | undefined,
    prefix: string | undefined,
    suffix: string | undefined
}

/**
 * Just used in IvCard interface definition
 */
interface IvCardWork {
    organization: string,
    title: string | undefined,
    role: string | undefined                                                            // ! in supplier (for ROLE) case use CONTACT NOTES |
}

/**
 * Just used in IvCard interface definition
 */
interface IvCardAddress {
    type: string | undefined,
    street: string,
    locality: string | undefined,
    region: string | undefined,                                                         // ! in supplier case use STATECODE |
    code: number | undefined,                                                           // ! in supplier case use ZIP |
    country: string | undefined                                                         // ! in supplier case use COUNTRY CODE |
}
