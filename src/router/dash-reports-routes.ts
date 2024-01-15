import { LayMain, SbDashNReports } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'

// DashReportsRoutes == dashboard and reports

export const DashReportsRoutes: Array<RouteRecordRaw> = [

    {
        path:      RoutePaths.dashNReports,
        name:      RoutePathNames.dashNReports,
        component: () => import('../views/dash-reports/ViewDashboard.vue'),
        meta:      { layout: LayMain, sidebar: SbDashNReports, reqAuth: true }
    },

    //#region ======= ##### ===============================================================
    //#endregion ==========================================================================

    //#region ======= ##### ===============================================================
    //#endregion ==========================================================================
]
