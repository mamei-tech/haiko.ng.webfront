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

    inventory: '/inventory',                                            // general inventory view

    muList: '/inventory/mu/list',                                       // uom = mu = units of measurement
    muForm: '/inventory/mu/:fmode/:id?',

    prodList:   '/inventory/product/list',
    prodForm:   '/inventory/product/:fmode/:id?',

    warehouseList: '/inventory/warehouse/list',
    warehouseForm: '/inventory/warehouse/:fmode/:id?',

    wlocationList : '/inventory/wlocation/list',                       // wlocation = warehouse location
    wlocationForm : '/inventory/wlocation/:fmode/:id?',

    strgcategoryList: '/inventory/strgcategory/list',                  // strgcategory = storage location
    strgcategoryForm: '/inventory/strgcategory/:fmode/:id?',

    pickigtypeList: '/inventory/pickingtype/list',
    pickigtypeForm: '/inventory/pickingtype/:fmode/:id?',

    invReplenishment: '/inventory/ops/replenishment',                  // inventory operation replenishment
    invTransfer: '/inventory/ops/transfer',                            // inventory operation transfer
    invAdjustment: '/inventory/ops/adjustment',                        // inventory operation adjustments
    invScrap: '/inventory/ops/scrapping',                              // inventory operation scrapping

    //#endregion ==========================================================================

    //#region ======= PRODUCTION ==========================================================

    bom: '/production/bom',

    //#endregion ==========================================================================

    //#region ======= PURCHASE ============================================================

    purchaseList:   '/purchase/list',
    purchaseForm:   '/purchase/:fmode/:id?',

    supplierCatList:   '/purchase/supplier/category/list',
    supplierCatForm:   '/purchase/supplier/category/:fmode/:id?',

    supplierList:   '/purchase/supplier/list',
    supplierForm:   '/purchase/supplier/:fmode/:id?',

    //#endregion ==========================================================================

    //#region ======= PEOPLE ==============================================================

    rolesLists:  '/people/roles/list',
    rolesForm:   '/people/roles/:fmode/:id?',

    staffList: '/people/staff/list',
    staffForm:   '/people/staff/:fmode/:id?',

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

    inventory: 'view-inventory',                                        // general inventory view

    munits: 'units',                                                    // uom = mu = units of measurement
    muForm: 'units-form',

    product:     'product',
    productForm: 'product-form',

    warehouseList: 'warehouse',
    warehouseForm: 'warehouse-form',

    wlocationList: 'wlocation',                                        // wlocation = warehouse location | ware location
    wlocationForm: 'wlocation-form',

    strgcategoryList: 'strgcategory',                                  // strgcategory = storage location
    strgcategoryForm: 'strgcategory-form',

    pickigtypeList: 'pickingtype',
    pickigtypeForm: 'pickingtype-form',

    invTransfer:      'invTransfer',                                  // inventory operation transfer
    invScrap:         'invScrap',                                     // inventory operation scrapping
    invAdjustment:    'invAdjustment',                                // inventory operation adjustments
    invReplenishment: 'invReplenishment',                             // inventory operation replenishment

    //#endregion ==========================================================================

    //#region ======= PRODUCTION ==========================================================

    bom: 'bom',

    //#endregion ==========================================================================

    //#region ======= PURCHASE ============================================================

    purchase:     'purchase',
    purchaseForm: 'purchase-form',

    supplierCat:     'supplier-cat',
    supplierCatForm: 'supplier-cat-form',

    supplier:     'supplier',
    supplierForm: 'supplier-form',

    //#endregion ==========================================================================

    //#region ======= PEOPLE ==============================================================

    roles:     'roles',
    rolesForm: 'roles-form',

    staff:     'staff',
    staffForm: 'staff-form',

    clients: 'clients',

    //#endregion ==========================================================================

    //#region ======= CONFIGURATIONS ======================================================

    configs: 'configs',

    //#endregion ==========================================================================

    //#region ======= GALLERY =============================================================

    gallery: 'gallery'

    //#endregion ==========================================================================

}
