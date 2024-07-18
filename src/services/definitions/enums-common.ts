
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
    CREATE      = 'create',
    DETAILS     = 'details',
    EDIT        = 'edit',
    EDIT_LOCAL  = 'edit.local',      //  used in situations when the formulary edition process need to be done locally in the front (not saving the data to the backend server)
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
 * Inventory stock pick reservation methods
 */
export enum RESERVATION_METHODS {
    AT_CONFIRMATION = 'at-confirmation',
    MANUALLY = 'manually',
    BEFORE_SCHEDULE_DATE = 'before-sche-date'
}

/**
 * Defines the types of the address that a PARTNER (entity) may have.
 */
export enum ADDRESS_TYPE {
    /**
     * Use this to organize the contact details of employees of a given company (e.g. CEO, CFO, ...)
     */
    CONTACT = 'contact',
    /**
     * Preferred address for all invoices. Selected by default when you invoice an order that belongs to this company.
     */
    INVOICE = 'invoice',
    /**
     * Preferred address for all deliveries. Selected by default when you deliver an order that belongs to this company
     */
    DELIVERY = 'delivery',
    /**
     * Private addresses are only visible by authorized users and contain sensitive data (employee home addresses, ...)
     */
    PRIVATE = 'private',
    /**
     * Other address for the company (e.g. subsidiary, ...)
     */
    OTHER = 'other'
}
