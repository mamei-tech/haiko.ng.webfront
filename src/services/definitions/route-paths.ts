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

    muList:   '/mu/list',
    muEdit:   '/mu/:fmode/:id',
    muCreate: '/mu/:fmode'

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

    munits:   'units',
    muCreate: 'units-create',
    muEdit:   'units-edit'

    //#endregion ==========================================================================

    //#region ======= OPERATIONS ==========================================================

    //#endregion ==========================================================================
}
