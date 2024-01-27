import { LayMain, SbInventory } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const InventoryRoutes: Array<RouteRecordRaw> = [

    {
        path:      RoutePaths.inventory,
        name:      RoutePathNames.inventory,
        component: () => import('../views/inventory/ViewInventory.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    //#region ======= MEASUREMENTS UNITS ==================================================

    {
        path:      RoutePaths.muList,
        name:      RoutePathNames.munits,
        component: () => import('../views/inventory/munits/ViewListMeasurements.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.muEdit,
        name:      RoutePathNames.muEdit,
        component: () => import('../views/inventory/munits/ViewFormUoM.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.muCreate,
        name:      RoutePathNames.muCreate,
        component: () => import('../views/inventory/munits/ViewFormUoM.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    //#endregion ==========================================================================

    //#region ======= PRODUCTS ============================================================

    {
        path:      RoutePaths.prodList,
        name:      RoutePathNames.product,
        component: () => import('../views/inventory/products/ViewListProducts.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.prodEdit,
        name:      RoutePathNames.prodEdit,
        component: () => import('../views/inventory/products/ViewFormProducts.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.prodCreate,
        name:      RoutePathNames.prodCreate,
        component: () => import('../views/inventory/products/ViewFormProducts.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    //#endregion ==========================================================================

    //#region ======= WAREHOUSE ===========================================================

    {
        path:      RoutePaths.warehouseList,
        name:      RoutePathNames.warehouseList,
        component: () => import('../views/inventory/warehouse/ViewListWarehouse.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.warehouseCreate,
        name:      RoutePathNames.warehouseCreate,
        component: () => import('../views/inventory/warehouse/ViewFormWarehouse.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.warehouseEdit,
        name:      RoutePathNames.warehouseEdit,
        component: () => import('../views/inventory/warehouse/ViewFormWarehouse.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    //#endregion ==========================================================================
]
