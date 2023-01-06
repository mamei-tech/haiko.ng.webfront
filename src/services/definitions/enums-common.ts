
export enum HTTP_RESPONSES {
    OK = 200,
    BAD_REQ = 400,
    INTERNAL_SERVER_ERROR = 500
}

/**
 * 'Operation Kind String' definition
 * This helps to get OpsKind strings so one don't have to manually write it down on the code, just call this use it
 *
 * ! The values defined here must match one2one with the definition of TOPSKind type definition in the 'types-common.ts' file
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
