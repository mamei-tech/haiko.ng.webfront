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
            component: () => import("../views/auth/ViewLogin.vue"),
            meta:      { layout: LayBaseDashboard }
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        }
    ]
})

export default router
