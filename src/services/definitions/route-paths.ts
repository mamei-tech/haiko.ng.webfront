export const RoutePaths = {
    login:     '/',
    hub:       '/hub',

    //#region ======= POS =================================================================

    pos: '/pos',                         // general POS view

    //#endregion ==========================================================================

    //#region ======= DASHBOARD & REPORTS =================================================

    dashNReports: '/dashreports',        // general dashboard and reports view

    //#endregion ==========================================================================

    //#region ======= MANAGEMENT ==========================================================

    dops: '/management/dops',                        // daily operations / workdays management central view

    //#endregion ==========================================================================

    //#region ======= INVENTORY ===========================================================

    inventory: '/inventory',                          // general inventory view

    muList:   '/inventory/mu/list',                   // uom = mu = units of measurement
    muEdit:   '/inventory/mu/:fmode/:id',             // uom = mu = units of measurement
    muCreate: '/inventory/mu/:fmode',                 // uom = mu = units of measurement

    prodList:   '/inventory/product/list',
    prodEdit:   '/inventory/product/:fmode/:id',
    prodCreate: '/inventory/product/:fmode',

    //#endregion ==========================================================================

    //#region ======= PRODUCTION ==========================================================

    bom: '/production/bom',

    //#endregion ==========================================================================

    //#region ======= PURCHASE ============================================================

    purchaseList:   '/purchase/list',
    purchaseEdit:   '/purchase/:fmode/:id',
    purchaseCreate: '/purchase/:fmode',

    supplierCatList:   '/purchase/supplier/category/list',
    supplierCatEdit:   '/purchase/supplier/category/:fmode/:id',
    supplierCatCreate: '/purchase/supplier/category/:fmode',

    supplierList:   '/purchase/supplier/list',
    supplierEdit:   '/purchase/supplier/:fmode/:id',
    supplierCreate: '/purchase/supplier/:fmode',

    //#endregion ==========================================================================

    //#region ======= PEOPLE ==============================================================

    rolesLists:  '/people/roles/list',
    rolesEdit:   '/people/roles/:fmode/:id',
    rolesCreate: '/people/roles/:fmode',

    staffList: '/people/staff/list',
    // staffForm:   '/people/staff/:fmode/:id?',
    staffEdit:   '/people/staff/:fmode/:id',
    staffCreate: '/people/staff/:fmode',

    clientsList: '/people/clients/list',

    //#endregion ==========================================================================

    //#region ======= CONFIGURATIONS ======================================================

    configs: '/configs',

    //#endregion ==========================================================================

    //#region ======= GALLERY =============================================================

    gallery: '/gallery'

    //#endregion ==========================================================================
}

export const RoutePathNames = {
    login:     'login',
    dashboard: 'dashboard',
    hub:       'hub',

    //#region ======= POS =================================================================

    pos: 'pos',

    //#endregion ==========================================================================

    //#region ======= DASHBOARD & REPORTS =================================================

    dashNReports: 'dash-reports',                         // general dashboard and reports view

    //#endregion ==========================================================================

    //#region ======= MANAGEMENT ==========================================================

    dops: 'dops',                                           // daily operations / workdays management central view

    //#endregion ==========================================================================

    //#region ======= INVENTORY ===========================================================

    inventory: 'view-inventory',            // general inventory view

    munits:   'units',                      // uom = mu = units of measurement
    muCreate: 'units-create',               // uom = mu = units of measurement
    muEdit:   'units-edit',                 // uom = mu = units of measurement

    product:    'product',
    prodCreate: 'product-create',
    prodEdit:   'product-edit',

    //#endregion ==========================================================================

    //#region ======= PRODUCTION ==========================================================

    bom: 'bom',

    //#endregion ==========================================================================

    //#region ======= PURCHASE ============================================================

    purchase:       'purchase',
    purchaseEdit:   'purchase-create',
    purchaseCreate: 'purchase-edit',

    supplierCat:       'supplier-cat',
    supplierCatEdit:   'supplier-cat-edit',
    supplierCatCreate: 'supplier-cat-create',

    supplier:       'supplier',
    supplierEdit:   'supplier-edit',
    supplierCreate: 'supplier-create',

    //#endregion ==========================================================================

    //#region ======= PEOPLE ==============================================================

    roles:       'roles',
    rolesEdit:   'roles-edit',
    rolesCreate: 'roles-create',

    staff:       'staff',
    staffCreate: 'staff-create',
    staffEdit:   'staff-edit',

    clients: 'clients',

    //#endregion ==========================================================================

    //#region ======= CONFIGURATIONS ======================================================

    configs: 'configs',

    //#endregion ==========================================================================

    //#region ======= GALLERY =============================================================

    gallery: 'gallery'

    //#endregion ==========================================================================

}
