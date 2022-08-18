import { defineStore } from 'pinia'
import { ApiAuth } from '@/services/api/api-auth'
import type { IAuthFormData } from '@/services/definitions/types-forms'

// https://pinia.vuejs.org/core-concepts/#setup-stores

// Sample of option store
export const useAuthStore = defineStore({
    id: 'auth',

    state: () : IAuthState => ({
        isLoggedIn: false,
        authTk: ''

        // userList: [] as UserInfo[],
        // user:     null as UserInfo | null
    }),

    getters: {
        // doubleCount: ( state ) => state.counter * 2
    },

    actions: {

        // ---mutators ---

        /**
         * Set the current user logged in the system
         * @param token The JWT Authentication token
         */
        setLoggedIn( token: string ) : void {
            this.authTk = token
            this.isLoggedIn = true
        },

        /**
         * Revoking the JWT Authentication token
         */
        setLoggedOut() : void {
            this.$reset()
        },

        // --- async calls actions ---

        /**
         * Trys to log in in the backed the given user credential data as payload, with the help of a definid axios apis
         * to make the actual request
         *
         * @param payload user credential data for logged in
         */
        async reqLogin (payload: IAuthFormData) : Promise<void> {

             return await new Promise<void>((resolve, reject) => {
                ApiAuth.reqAuth(payload as IAuthFormData)
                .then((response:any) => {

                    const at = response.data

                    if(at.length > 10){
                        this.setLoggedIn(at)
                        ApiAuth.setAccessToken(at)
                    }

                    resolve()

                }).catch(error => { reject(error) })
            })
        }
    }
})

//region ======== INTERFACES & TYPES ====================================================

/**
 * Authentication State interface
 */
interface IAuthState {
    isLoggedIn: boolean
    authTk: string
}

//endregion =============================================================================


