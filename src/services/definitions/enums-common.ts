
export enum HTTP_RESPONSES {
    OK = 200,
    BAD_REQ = 400,
    INTERNAL_SERVER_ERROR = 500
}

/**
 * 'Operation Kind String' definition
 * This helps to get OpsKind strings so one don't have to manually write it down on the code, just call this use it
 *
 * ! The values defined here must match one2one with the definition of TOpsKind type definition in the 'types-common.ts' file
 */
export enum OPS_KIND_STR {
    DELETION = 'deletion',
    ADDITION = 'addition',
    UPDATE = 'update',
    ENABLE = 'enable',
    DISABLE = 'disable',
    REQUEST = 'request'
}

/**
 * 'Action Kind String' definition
 * This helps to get TActionKind strings so one don't have to manually write it down on the code, just call this use it
 *
 * ! The values defined here must match one2one with the definition of TActionKind type definition in the 'types-common.ts' file
 */
export enum ACTION_KIND_STR {
    DELETE = 'delete',
    CREATE = 'create',
    UPDATE = 'update',
    ACTIVATE = 'activate',
    DEACTIVATE = 'deactivate',
}

/**
 * 'FORM MODE' definition
 * This helps to get TFormMode strings so one don't have to manually write it down on the code, just call this use it
 *
 * ! The values defined here must match one2one with the definition of TFormMode type definition in the 'types-common.ts' file
 */
export enum FMODE {
    EDIT = 'edit',
    CREATE = 'create',
    DETAILS = 'details',
}

/**
 * This helps to get TBulkAction strings so one don't have to manually write it down on the code, just call this use it
 *
 * ! The values defined here must match one2one with the definition of TBulkAction type definition in the 'types-common.ts' file
 */
export enum BULK_ACTIONS {
    ENALBE = 'ENABLE',
    DISABLE = 'DISABLE',
    REMOVE = 'REMOVE',
}

/**
 * Keyboard keys map
 * this enum intent to be filled on demand as the project codebase grow
 */
export enum KEYS {
    ESCAPE = 'Escape',
    ENTER = 'Enter',
    BACKSPC = 'Backspace'
}

/***
 * This enum was created to select the kind of default picture needs to be used in a datatable cell
 */
export enum PICTURE_TYPE_CELL {
    DEFAULT = 0,
    PRODUCT = 1,
    USER = 2
}

/***
 * HTML input types definitions
 */
export enum HTML_INPUT_TYPE {
    BUTTON = 'button',
    CHECKBOX = 'checkbox',
    COLOR = 'color',
    DATE = 'date',
    DATETIME_LOCAL = 'datetime-local',
    EMAIL = 'email',
    FILE = 'file',
    HIDDEN = 'hidden',
    IMAGE = 'image',
    MONTH = 'month',
    NUMBER = 'number',
    PASSWORD = 'password',
    RADIO = 'radio',
    RANGE = 'range',
    RESET = 'reset',
    SEARCH = 'search',
    SUBMIT = 'submit',
    TEL = 'tel',
    TEXT = 'text',
    TIME = 'time',
    URL = 'url',
    WEEK = 'week',
}

/***
 * Dialog Icon STR
 */
export enum DIALOG_ICON {
    W = 'warning',
    S = 'success',
    I = 'info',
    Q = 'question',
    E = 'error'
}

/**
 * Warehouse (storage) location types
 */
export enum WARE_LOC_TYPE {
    VIEW = 'view',
    SUPPLIER = 'supplier',
    COSTUMER = 'costumer',
    TRANSIT = 'transit',
    INTERNAL = 'internal',
    PRODUCTION = 'production',
    INVENTORY = 'inventory'
}
