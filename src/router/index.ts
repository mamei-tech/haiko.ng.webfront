import { useSt_Auth } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import { ApiAuth } from '@/services/api/api-auth'
import { LayBasePage, LayBaseDashboard } from '@/layouts'
import { RoutePaths, RoutePathNames } from '@/services/definitions'
import { PeopleRoutes } from '@/router/people-routes'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:  [
        {
            path:      RoutePaths.login,
            name:      RoutePathNames.login,
            component: () => import('../views/auth/ViewLogin.vue'),
            meta:      { layout: LayBasePage }
        },
        {
            path:      RoutePaths.dashboard,
            name:      RoutePathNames.dashboard,
            component: () => import('../views/ViewDashboard.vue'),
            meta:      { layout: LayBaseDashboard }
        },
        ...PeopleRoutes
    ]
})

// GUARD - authentication checker | axios hook
router.beforeEach(( to, _, next ) => {

    const st_auth = useSt_Auth()                                                // maybe we can put this outside this method to improve speed

    if (st_auth === undefined) next()
    else if (to.meta.reqAuth && !st_auth.isLoggedIn) {
        next(RoutePaths.login)
    }
    else if (to.name === RoutePathNames.login && st_auth.isLoggedIn) {            // Not logged / auth
        // Try to login but the user is logged in already
        ApiAuth.setAccessToken(st_auth.authTk)                                    // As the user is logged in already the access_token has to be in the store
        next(RoutePaths.dashboard)
    }
    else {
        next()                                                                  // Carry on
    }
})

export default router
