import { LayMain, SbManagement } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const ManagementRoutes: Array<RouteRecordRaw> = [

    {
        path:      RoutePaths.dops,
        name:      RoutePathNames.dops,
        component: () => import('../views/management/ViewDailyOps.vue'),
        meta:      { layout: LayMain, sidebar: SbManagement, reqAuth: true }
    },

    //#region ======= ##### ===============================================================
    //#endregion ==========================================================================

    //#region ======= ##### ===============================================================
    //#endregion ==========================================================================
]
