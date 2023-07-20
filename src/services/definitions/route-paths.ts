export const RoutePaths = {
    login:     '/',
    dashboard: '/dashboard',

    //#region ======= PEOPLE ==============================================================

    rolesLists:  '/roles/list',
    rolesEdit:   '/roles/:fmode/:id',
    rolesCreate: '/roles/:fmode',

    staffList: '/staff/list',
    // staffForm:   '/staff/:fmode/:id?',
    staffEdit:   '/staff/:fmode/:id',
    staffCreate: '/staff/:fmode',

    clientsList: '/clients/list',

    //#endregion ==========================================================================

    //#region ======= INVENTORY ===========================================================

    muList:   '/mu/list',                   // uom = mu = units of measurement
    muEdit:   '/mu/:fmode/:id',             // uom = mu = units of measurement
    muCreate: '/mu/:fmode',                 // uom = mu = units of measurement

    prodList:   '/product/list',
    prodEdit:   '/product/:fmode/:id',
    prodCreate: '/product/:fmode',

    //#endregion ==========================================================================

    //#region ======= PURCHASE ============================================================

    purchaseList:   '/purchase/list',
    purchaseEdit:   '/purchase/:fmode/:id',
    purchaseCreate: '/purchase/:fmode',

    supplierCatList:   '/supplier/category/list',
    supplierCatEdit:   '/supplier/category/:fmode/:id',
    supplierCatCreate: '/supplier/category/:fmode',

    supplierList:   '/supplier/list',
    supplierEdit:   '/supplier/:fmode/:id',
    supplierCreate: '/supplier/:fmode'

    //#endregion ==========================================================================

    //#region ======= OPERATIONS ==========================================================
    //#endregion ==========================================================================
}

export const RoutePathNames = {
    login:     'login',
    dashboard: 'dashboard',

    //#region ======= PEOPLE ==============================================================

    roles:       'roles',
    rolesEdit:   'roles-edit',
    rolesCreate: 'roles-create',

    staff:       'staff',
    staffCreate: 'staff-create',
    staffEdit:   'staff-edit',

    clients: 'clients',

    //#endregion ==========================================================================

    //#region ======= INVENTORY ===========================================================

    munits:   'units',                      // uom = mu = units of measurement
    muCreate: 'units-create',               // uom = mu = units of measurement
    muEdit:   'units-edit',                 // uom = mu = units of measurement

    product:    'product',
    prodCreate: 'product-create',
    prodEdit:   'product-edit',

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
    supplierCreate: 'supplier-create'

    //#endregion ==========================================================================

    //#region ======= OPERATIONS ==========================================================
    //#endregion ==========================================================================
}
