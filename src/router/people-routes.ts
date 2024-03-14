import { LayMain, SbPeople } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const PeopleRoutes: Array<RouteRecordRaw> = [

    //#region ======= ROLES ===============================================================
    {
        path:      RoutePaths.rolesLists,
        name:      RoutePathNames.roles,
        component: () => import('../views/people/rbac/ViewListRoles.vue'),
        meta:      { layout: LayMain, sidebar: SbPeople, reqAuth: true }
    },
    {
        path:      RoutePaths.rolesForm,
        name:      RoutePathNames.rolesForm,
        component: () => import('../views/people/rbac/ViewFormRoles.vue'),
        meta:      { layout: LayMain, sidebar: SbPeople, reqAuth: true }
    },
    //#endregion ==========================================================================

    //#region ======= STAFF ===============================================================
    {
        path:      RoutePaths.staffList,
        name:      RoutePathNames.staff,
        component: () => import('../views/people/staff/ViewListStaff.vue'),
        meta:      { layout: LayMain, sidebar: SbPeople, reqAuth: true }
    },
    {
        path:      RoutePaths.staffForm,
        name:      RoutePathNames.staffForm,
        component: () => import('../views/people/staff/ViewFormStaff.vue'),
        meta:      { layout: LayMain, sidebar: SbPeople, reqAuth: true }
    },
    //#endregion ==========================================================================

    //#region ======= CLIENTS =============================================================
    {
        path:      RoutePaths.clientsList,
        name:      RoutePathNames.clients,
        component: () => import('../views/people/clients/ViewListClients.vue'),
        meta:      { layout: LayMain, sidebar: SbPeople, reqAuth: true }
    }
    //#endregion ==========================================================================

    //#region ======= AUTHORIZATION =======================================================
    //#endregion ==========================================================================
]
