import { defineStore } from 'pinia'

import type { IDtoRole } from '@/services/definitions'
import { useSt_Pagination } from '@/stores/pagination'
import { ApiRbac } from '@/services/api/api-rbac'


// https://pinia.vuejs.org/core-concepts/#setup-stores

// staff store
export const useSt_Rbac = defineStore({
    id: 'rbac',

    state: () : IRbacState => ({
        entityPage:   [] as IDtoRole[]
    }),

    /**
     * Getters are exactly the equivalent of computed values for the state of a Store |  https://pinia.vuejs.org/core-concepts/getters.html
     * as a convention, we name all the getter with a 'get' prefix
     */
    getters: {

    },

    actions: {

        // ---mutators ---
        // mutates the states directly without any API server request or call / sideEffect, this just mutate the store
        // Also, by default, you can directly read and write to the state by accessing it through the store instance,
        // note you cannot add a new state property if you don't define it in state(), it must contain the
        // https://pinia.vuejs.org/core-concepts/state.html#mutating-the-state | https://pinia.vuejs.org/core-concepts/state.html#replacing-the-state

        // --- server async calls actions ---
        /**
         * Tries to get a datatable page of Staff entities from backend
         */
        async reqRolePages () : Promise<void> {

            const st_pagination = useSt_Pagination()                                       // pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

            return await new Promise<void>((resolve, reject) => {
                ApiRbac.getPage(st_pagination.getQueryData)
                .then((response:any) => {

                    this.entityPage = response.data.entityList
                    st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

                    resolve()

                }).catch(error => {

                    if (error.response.status === 404)
                    {
                        this.entityPage = []
                        st_pagination.mutSetEmptyPage(st_pagination.Offset)
                    }

                    reject(error)
                })
            })
        }
    }
})

//region ======== STATE INTERFACE =======================================================

// interface IStaffState extends IBasicPageState {

interface IRbacState {
    entityPage: Array<IDtoRole>
}

//endregion =============================================================================


