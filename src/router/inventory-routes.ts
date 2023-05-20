import { LayBaseDashboard } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const InventoryRoutes: Array<RouteRecordRaw> = [

    //#region ======= MEASUREMENTS UNITS ==================================================

    {
        path:      RoutePaths.muList,
        name:      RoutePathNames.munits,
        component: () => import('../views/inventory/munits/ViewListMeasurements.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path:      RoutePaths.muEdit,
        name:      RoutePathNames.muEdit,
        component: () => import('../views/inventory/munits/ViewFormUoM.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path:      RoutePaths.muCreate,
        name:      RoutePathNames.muCreate,
        component: () => import('../views/inventory/munits/ViewFormUoM.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    }

    //#endregion ==========================================================================
]
