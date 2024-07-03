/**
 * This enum is used to specify to a component how it should specialize / adapt according to the entity that is defined.
 * This helps to tailor the components to specific use cases and entities accordingly
 *
 * DT == data table
 */
export enum DT_ACTIONBAR_MODE {
    JC = 0,                         // just create, no other button
    COMMON = 1,                     // STAFF | ROLE | ... edit, create, view
    TOGSTATUS = 2,                  // Just the buttons to toggles entities status, nothing more
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
    COUNTRY = 'country',
    COMPANY = 'company',
    UOMCATEGORY = 'uomcatetgory',
    UOM = 'unit',
    SUPPLIER_CAT = 'supplier-cat',
    SUPPLIER = 'supplier',
    PURCHASE = 'purchase',
    PRODUCT = 'product',
    WAREHOUSE = 'warehouse',
    STRGCATEGORY = 'strgcategory',
    WARELOCATION = 'wlocation',
    CURRENCY = 'currency',
    PRODUCT_CAT = 'product-cat',
    PICKINGTYPE = 'pickingtype'
}

/**
 * Defines the policies database values to be fallowed when when storing new product in warehouse storage locations
 */
export enum STRG_PROD_POLICY {
    MIXED = 'mixed',
    ONLYSAME = 'same',
    IFEMPTY = 'empty'
}
