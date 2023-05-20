import { LayBaseDashboard } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'

import type { RouteRecordRaw } from 'vue-router'


export const PurchaseRoutes: Array<RouteRecordRaw> = [

    //#region ======= PURCHASE ==========================================================

    {
        path:      RoutePaths.purchaseList,
        name:      RoutePathNames.purchase,
        component: () => import('../views/purchase/ViewListPurchase.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path:      RoutePaths.purchaseEdit,
        name:      RoutePathNames.purchaseEdit,
        component: () => import('../views/purchase/ViewFormPurchase.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path:      RoutePaths.purchaseCreate,
        name:      RoutePathNames.purchaseCreate,
        component: () => import('../views/purchase/ViewFormPurchase.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },

    // --- suppliers categories
    {
        path:      RoutePaths.suppliersCatList,
        name:      RoutePathNames.suppliersCat,
        component: () => import('../views/purchase/suppliers/ViewListSuppliers.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path:      RoutePaths.suppliersCatEdit,
        name:      RoutePathNames.suppliersCatEdit,
        component: () => import('../views/purchase/suppliers/ViewFormSuppliers.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path:      RoutePaths.suppliersCatCreate,
        name:      RoutePathNames.suppliersCatCreate,
        component: () => import('../views/purchase/suppliers/ViewFormSuppliers.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },

    // --- suppliers
    {
        path:      RoutePaths.suppliersList,
        name:      RoutePathNames.suppliers,
        component: () => import('../views/purchase/suppliers/ViewListSuppCategories.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path:      RoutePaths.suppliersEdit,
        name:      RoutePathNames.suppliersEdit,
        component: () => import('../views/purchase/suppliers/ViewFormSuppCategories.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    },
    {
        path:      RoutePaths.suppliersCreate,
        name:      RoutePathNames.suppliersCreate,
        component: () => import('../views/purchase/suppliers/ViewFormSuppCategories.vue'),
        meta:      { layout: LayBaseDashboard, reqAuth: true }
    }

    //#endregion ========================================================================
]
