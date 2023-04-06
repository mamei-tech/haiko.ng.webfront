import { LayBaseDashboard } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const PeopleRoutes: Array<RouteRecordRaw> = [

    //#region ======= ROLES ===============================================================
    {
        path: RoutePaths.rolesLists,
        name: RoutePathNames.roles,
        component: () => import('../views/people/rbac/ViewListRoles.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path: RoutePaths.rolesEdit,
        name: RoutePathNames.rolesEdit,
        component: () => import('../views/people/rbac/ViewFormRoles.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true, }
    },
    {
        path: RoutePaths.rolesCreate,
        name: RoutePathNames.rolesCreate,
        component: () => import('../views/people/rbac/ViewFormRoles.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true, }
    },
    //#endregion ==========================================================================

    //#region ======= STAFF ===============================================================
    {
        path: RoutePaths.staffList,
        name: RoutePathNames.staff,
        component: () => import('../views/people/staff/ViewListStaff.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path: RoutePaths.staffEdit,
        name: RoutePathNames.staffEdit,
        component: () => import('../views/people/staff/ViewFormStaff.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true, }
    },
    {
        path: RoutePaths.staffCreate,
        name: RoutePathNames.staffCreate,
        component: () => import('../views/people/staff/ViewFormStaff.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true, }
    },
    //#endregion ==========================================================================

    //#region ======= CLIENTS =============================================================
    {
        path: RoutePaths.clientsList,
        name: RoutePathNames.clients,
        component: () => import('../views/people/clients/ViewListClients.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true }
    },
    //#endregion ==========================================================================

    //#region ======= AUTHORIZATION =======================================================
    {
        path: RoutePaths.authList,
        name: RoutePathNames.auth,
        component: () => import('../views/people/rbac/ViewListAuth.vue'),
        meta: { layout: LayBaseDashboard, reqAuth: true }
    }
    //#endregion ==========================================================================
]
