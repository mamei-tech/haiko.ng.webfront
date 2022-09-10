import { defineStore } from 'pinia'

import type { IDataTableQuery, IStaffPage, IStaffRow } from '@/services/definitions'
import { ApiStaff } from '@/services/api/api-staff'

// https://pinia.vuejs.org/core-concepts/#setup-stores

// Sample of option store
export const useStaffStore = defineStore({
    id: 'staff',

    state: () : IStaffState => ({

        staffPage: {
            totalRecords: 0,
            entityList:   [] as IStaffRow[]
        }

    }),

    getters: {
        // doubleCount: ( state ) => state.counter * 2
    },

    actions: {

        // ---mutators ---

        // --- async calls actions ---

        /**
         * Trys to log in in the backed the given user credential data as payload, with the help of a definid axios apis
         * to make the actual request
         *
         * @param payload user credential data for logged in
         */
        async reqStaffPages (payload: IDataTableQuery) : Promise<void> {

             return await new Promise<void>((resolve, reject) => {
                ApiStaff.reqStaffPage(payload)
                .then((response:any) => {

                    this.staffPage = response.data
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
interface IStaffState {
    staffPage: IStaffPage
}

//endregion =============================================================================


