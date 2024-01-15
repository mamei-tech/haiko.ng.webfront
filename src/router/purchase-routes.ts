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
        path:      RoutePaths.purchaseEdit,
        name:      RoutePathNames.purchaseEdit,
        component: () => import('../views/purchase/ViewFormPurchase.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },
    {
        path:      RoutePaths.purchaseCreate,
        name:      RoutePathNames.purchaseCreate,
        component: () => import('../views/purchase/ViewFormPurchase.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },

    // --- suppliers categories
    {
        path:      RoutePaths.supplierCatList,
        name:      RoutePathNames.supplierCat,
        component: () => import('../views/purchase/suppliers/ViewListSuppCategories.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },
    {
        path:      RoutePaths.supplierCatEdit,
        name:      RoutePathNames.supplierCatEdit,
        component: () => import('../views/purchase/suppliers/ViewFormSuppCategories.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },
    {
        path:      RoutePaths.supplierCatCreate,
        name:      RoutePathNames.supplierCatCreate,
        component: () => import('../views/purchase/suppliers/ViewFormSuppCategories.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },

    // --- suppliers
    {
        path:      RoutePaths.supplierList,
        name:      RoutePathNames.supplier,
        component: () => import('../views/purchase/suppliers/ViewListSuppliers.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },
    {
        path:      RoutePaths.supplierEdit,
        name:      RoutePathNames.supplierEdit,
        component: () => import('../views/purchase/suppliers/ViewFormSuppliers.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    },
    {
        path:      RoutePaths.supplierCreate,
        name:      RoutePathNames.supplierCreate,
        component: () => import('../views/purchase/suppliers/ViewFormSuppliers.vue'),
        meta:      { layout: LayMain, sidebar: SbPurchase, reqAuth: true }
    }

    //#endregion ========================================================================
]
