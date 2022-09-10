import { LayBaseDashboard } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const PeopleRoutes: Array<RouteRecordRaw> = [

    // ======== STAFF
    {
        path: RoutePaths.listStaff,
        name: RoutePathNames.staff,
        component: () => import('../views/people/staff/ViewListStaff.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true }
    },

    // ======== CLIENTS
    {
        path: RoutePaths.listClients,
        name: RoutePathNames.clients,
        component: () => import('../views/people/clients/ViewListClients.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true }
    },

    // ======== AUTHORIZATION
    {
        path: RoutePaths.listAuth,
        name: RoutePathNames.auth,
        component: () => import('../views/people/rbac/ViewListAuth.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true }
    }
]
