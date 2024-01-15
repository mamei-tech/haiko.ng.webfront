import { LayMain, SbConfig } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const ConfigRoutes: Array<RouteRecordRaw> = [

    {
        path:      RoutePaths.configs,
        name:      RoutePathNames.configs,
        component: () => import('../views/configs/ViewConfigs.vue'),
        meta:      { layout: LayMain, sidebar: SbConfig, reqAuth: true }
    }

    //#region ======= ##### ===============================================================
    //#endregion ==========================================================================

    //#region ======= ##### ===============================================================
    // ...
    //#endregion ==========================================================================
]
