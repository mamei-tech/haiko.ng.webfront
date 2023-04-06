export const RoutePaths = {
    login:     '/',
    dashboard: '/dashboard',

    // PEOPLE section
    rolesLists:   '/roles/list',
    rolesEdit:    '/roles/:fmode/:id',
    rolesCreate: '/roles/:fmode',

    staffList: '/staff/list',
    // staffForm:   '/staff/:fmode/:id?',
    staffEdit:   '/staff/:fmode/:id',
    staffCreate: '/staff/:fmode',

    clientsList: '/clients/list',
    authList:    '/authorization/list'
}

export const RoutePathNames = {
    login:     'login',
    dashboard: 'dashboard',

    // PEOPLE section
    roles: 'roles',
    rolesEdit: 'roles-edit',
    rolesCreate: 'roles-create',

    staff:       'staff',
    staffCreate: 'staff-create',
    staffEdit:   'staff-edit',

    clients: 'clients',
    auth:    'authorization'

    // ...
}
