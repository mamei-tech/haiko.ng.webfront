import { createRouter, createWebHistory } from 'vue-router'
import { RoutePaths, RoutePathNames } from '@/services/definitions'
import { LayBasePage, LayBaseDashboard } from '@/layouts'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:  [
        {
            path:      RoutePaths.login,
            name:      RoutePathNames.login,
            component: () => import("../views/auth/ViewLogin.vue"),
            meta:      { layout: LayBasePage }
        },
        {
            path:      RoutePaths.dashboard,
            name:      RoutePathNames.dashboard,
            component: () => import("../views/ViewDashboard.vue"),
            meta:      { layout: LayBaseDashboard }
        }
    ]
})

export default router
