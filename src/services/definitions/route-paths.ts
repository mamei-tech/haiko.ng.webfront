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

    //#endregion ==========================================================================

    //#region ======= PURCHASE ============================================================

    purchaseList:   '/purchase/list',
    purchaseEdit:   '/purchase/:fmode/:id',
    purchaseCreate: '/purchase/:fmode',

    suppliersCatList:   '/suppliers/categories/list',
    suppliersCatEdit:   '/purchase/categories/:fmode/:id',
    suppliersCatCreate: '/purchase/categories/:fmode',

    suppliersList:   '/suppliers/list',
    suppliersEdit:   '/purchase/:fmode/:id',
    suppliersCreate: '/purchase/:fmode'

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

    //#endregion ==========================================================================

    //#region ======= PURCHASE ============================================================

    purchase:       'purchase',
    purchaseEdit:   'purchase-create',
    purchaseCreate: 'purchase-edit',

    suppliersCat:       'suppliers-cat',
    suppliersCatEdit:   'suppliers-cat-edit',
    suppliersCatCreate: 'suppliers-cat-create',

    suppliers:       'suppliers',
    suppliersEdit:   'suppliers-edit',
    suppliersCreate: 'suppliers-create'

    //#endregion ==========================================================================

    //#region ======= OPERATIONS ==========================================================

    //#endregion ==========================================================================
}
