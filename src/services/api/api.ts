import axios from 'axios'
import appConfig from '@/configs/app.conf'
import router from '@/router'

//@ts-ignore
import Nprogress from 'nprogress'
import { useSt_Auth } from '@/stores/auth'
import { RoutePaths } from '@/services/definitions/route-paths'


Nprogress.configure({ trickleSpeed: 1500, showSpinner: false, easing: 'ease', speed: 500 })


const customInstance = axios.create({
    baseURL: appConfig.server.api,
    headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: false
    // TIP about 'withCredentials' and CORS problem:
    //  this field have to be set in TRUE if the backend specify the origins domains in its CORS policy if the backend use the (*) wildcard then this value must be FALSE
})


// I think that the code we have in this interceptor is going on detrimental of the app performance
//  ---- BEFORE A REQUEST ----
customInstance.interceptors.request.use(
    config => {

        const st_auth = useSt_Auth()                                                    // https://pinia.vuejs.org/core-concepts/outside-component-usage.html#single-page-applications | I cant' find another way to do this

        if (config.headers === undefined) config.headers = {}                               // shut up TS mouth
        config.headers.Authorization = `Bearer ${ st_auth.authTk }`                       // assign store token to axios configuration

        // Trying to show the nprogress bar
        const a = document.querySelector('div#topper-border-cont')
        a!.setAttribute('class', a!.className + ' mp-4-nprogress')
        Nprogress.start()

        return config
    },
    error => {
        Nprogress.done()
        return Promise.reject(error)
    }
)

// ---- BEFORE A RESPONSE ----
customInstance.interceptors.response.use(
    response => {
        // Trying to hide the nprogress bar
        const a = document.querySelector('div#topper-border-cont')
        a!.setAttribute('class', 'main-panel ps mp-stylized')
        Nprogress.done()

        return response
    },
    error => {
        Nprogress.done()

        // Handling Expired Token, when token expires, the user will be auth (according tho the state)
        // and the store will have an access token, yet the token will be invalid for the backend 'cause
        // it's expiration time. So we need to handle this
        if (error.response !== undefined && error.response.status === 401) {

            const st_Auth = useSt_Auth()                                                    // https://pinia.vuejs.org/core-concepts/outside-component-usage.html#single-page-applications | I cant' find another way to do this

            st_Auth.setLoggedOut()
            router.push(RoutePaths.login)
        }

        return Promise.reject(error)
    }
)

/**
 * A custom axios instance pointing to
 * api url and activating Nprogress on each
 * request
 */
export default customInstance
