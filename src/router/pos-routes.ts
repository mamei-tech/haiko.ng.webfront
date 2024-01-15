import { LayMain } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const POSRoutes: Array<RouteRecordRaw> = [

    {
        path:      RoutePaths.pos,
        name:      RoutePathNames.pos,
        component: () => import('../views/pos/ViewPOS.vue'),
        meta:      { layout: LayMain, reqAuth: true }

        // TODO I don't think we will be using the LayMain, we just leave it there by the moment
    },

    //#region ======= ##### ===============================================================
    //#endregion ==========================================================================

    //#region ======= ##### ===============================================================
    // ...
    //#endregion ==========================================================================
]
