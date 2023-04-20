import { LayBaseDashboard } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const InventoryRoutes: Array<RouteRecordRaw> = [

    //#region ======= MEASUREMENTS UNITS ==================================================

    {
        path:      RoutePaths.muList,
        name:      RoutePathNames.munits,
        component: () => import('../views/inventory/munits/ViewMeasurements.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    }
    /*{
        path:      RoutePaths.staffEdit,
        name:      RoutePathNames.staffEdit,
        component: () => import('../views/people/staff/ViewFormStaff.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path:      RoutePaths.staffCreate,
        name:      RoutePathNames.staffCreate,
        component: () => import('../views/people/staff/ViewFormStaff.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    }*/

    //#endregion ==========================================================================
]
