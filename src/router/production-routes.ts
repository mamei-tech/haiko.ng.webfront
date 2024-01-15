import { LayMain, SbProduction } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const ProductionRoutes: Array<RouteRecordRaw> = [

    {
        path:      RoutePaths.bom,
        name:      RoutePathNames.bom,
        component: () => import('../views/production/ViewBoM.vue'),
        meta:      { layout: LayMain, sidebar: SbProduction, reqAuth: true }
    },

    //#region ======= ##### ===============================================================
    //#endregion ==========================================================================

    //#region ======= ##### ===============================================================
    //#endregion ==========================================================================
]
