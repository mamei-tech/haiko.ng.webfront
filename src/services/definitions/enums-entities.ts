/**
 * This enum is used to specify to a component how it should specialize / adapt according to the entity that is defined.
 * This helps to tailor the components to specific use cases and entities accordingly
 *
 * DT == data table
 */
export enum DT_ACTIONBAR_MODE {
    DEFAULT = 0,
    COMMON = 1,             // STAFF | ROLE | ... edit, create, view
    NOEJC = 2,              // common no edit just create | no action 'details' action btn in the row, no action bar at all
}

/**
 *  This enum is used to specify the distribution that should be used for the rows' action buttons in the
 *  datatables
 *
 * DT == data table
 */
export enum DT_ACTION_BUTTON_MODE {
    DEFAULT = 0,            // The three action buttons by default: view, edit, delete
    JEDINDEL = 1,           // Just edit and delete buttons
    JDEL = 2,               // Just delete button
}


/**
 * This helps to get entities names strings so one don't have to manually write it down on the code, just call this use it
 *
 * ! The values defined here must match one2one with the business entity names we are working with
 */
export enum ENTITY_NAMES {
    DEFAULT = 'default',
    STAFF = 'staff',
    ROLE = 'role',
    UOMCATEGORY = 'uomcatetgory',
    UOM = 'unit',
    SUPPLIER_CAT = 'supplier-cat',
    SUPPLIER = 'supplier',
}
