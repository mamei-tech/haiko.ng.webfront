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
        path:      RoutePaths.muForm,
        name:      RoutePathNames.muForm,
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
        path:      RoutePaths.prodForm,
        name:      RoutePathNames.productForm,
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
        path:      RoutePaths.warehouseForm,
        name:      RoutePathNames.warehouseForm,
        component: () => import('../views/inventory/warehouse/ViewFormWarehouse.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    //#endregion ==========================================================================

    //#region ======= WAREHOUSE LOCATIONS =================================================

    {
        path:      RoutePaths.strgcategoryList,
        name:      RoutePathNames.strgcategoryList,
        component: () => import('../views/inventory/wlocation/ViewListStorageCat.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.strgcategoryForm,
        name:      RoutePathNames.strgcategoryForm,
        component: () => import('../views/inventory/wlocation/ViewFormStrgCat.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    {
        path:      RoutePaths.wlocationList,
        name:      RoutePathNames.wlocationList,
        component: () => import('../views/inventory/wlocation/ViewListWareLocation.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.wlocationForm,
        name:      RoutePathNames.wlocationForm,
        component: () => import('../views/inventory/wlocation/ViewFormWareLocation.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    //#endregion ==========================================================================

    //#region ======= PICKING ============================================================

    {
        path:      RoutePaths.pickigtypeList,
        name:      RoutePathNames.pickigtypeList,
        component: () => import('../views/inventory/picking/ViewListPickingType.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.pickigtypeForm,
        name:      RoutePathNames.pickigtypeForm,
        component: () => import('../views/inventory/picking/ViewFormPickingType.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    //#endregion ==========================================================================

    //#region ======= OPERATIONS ==========================================================

    {
        path:      RoutePaths.invReplenishmentList,
        name:      RoutePathNames.invReplenishmentList,
        component: () => import('../views/inventory/operations/ViewListReplenishment.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    {
        path:      RoutePaths.invTransferList,
        name:      RoutePathNames.invTransferList,
        component: () => import('../views/inventory/operations/ViewListTransfer.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },
    {
        path:      RoutePaths.invTransferListForm,
        name:      RoutePathNames.invTransferForm,
        component: () => import('../views/inventory/operations/ViewFormTransfer.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    {
        path:      RoutePaths.invAdjustmentList,
        name:      RoutePathNames.invAdjustmentList,
        component: () => import('../views/inventory/operations/ViewListAdjustment.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    {
        path:      RoutePaths.invScrapList,
        name:      RoutePathNames.invScrapList,
        component: () => import('../views/inventory/operations/ViewListScrap.vue'),
        meta:      { layout: LayMain, sidebar: SbInventory, reqAuth: true }
    },

    //#endregion ==========================================================================
]
