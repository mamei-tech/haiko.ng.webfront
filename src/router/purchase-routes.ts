import { LayMain, SbPurchase } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const PurchaseRoutes: Array<RouteRecordRaw> = [

    //#region ======= PURCHASE ==========================================================

    {
        path:      RoutePaths.purchaseList,
        name:      RoutePathNames.purchase,
        component: () => import('../views/purchase/ViewListPurchase.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },
    {
        path:      RoutePaths.purchaseForm,
        name:      RoutePathNames.purchaseForm,
        component: () => import('../views/purchase/ViewFormPurchase.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },

    //#endregion ========================================================================

    //#region ======= SUPPLIERS =========================================================

    {
        path:      RoutePaths.supplierList,
        name:      RoutePathNames.supplier,
        component: () => import('../views/purchase/suppliers/ViewListSuppliers.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },
    {
        path:      RoutePaths.supplierForm,
        name:      RoutePathNames.supplierForm,
        component: () => import('../views/purchase/suppliers/ViewFormSuppliers.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },

    //#endregion ========================================================================

    //#region ======= SUPPLIERS CATEGORIES ==============================================
    {
        path:      RoutePaths.supplierCatList,
        name:      RoutePathNames.supplierCat,
        component: () => import('../views/purchase/suppliers/ViewListSuppCategories.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },
    {
        path:      RoutePaths.supplierCatForm,
        name:      RoutePathNames.supplierCatForm,
        component: () => import('../views/purchase/suppliers/ViewFormSuppCategories.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    }

    //#endregion ========================================================================
]
