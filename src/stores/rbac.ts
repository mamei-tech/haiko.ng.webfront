import { defineStore } from 'pinia'
import { useSt_Pagination } from '@/stores/pagination'
import { ApiRbac } from '@/services/api/people/api-rbac'

import type { IDtoRole, IdsArray } from '@/services/definitions'


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

        getRoleByIdFromLocalStorage: ( state ) => {
            return (roleId : number) => state.entityPage.find((role) => role.id == roleId)

            // Getters are just computed properties behind the scenes, so it's not possible to pass any parameters to them. However, you can return a function from the getter to accept any arguments
            // Note that when doing this, getters are not cached anymore, they are simply functions that you invoke. You can however cache some results inside of the getter itself, which is uncommon but should prove more performant
            // https://pinia.vuejs.org/core-concepts/getters.html#passing-arguments-to-getters
        }
    },

    actions: {

        // ---mutators ---
        // mutates the states directly without any API server request or call / sideEffect, this just mutate the store
        // Also, by default, you can directly read and write to the state by accessing it through the store instance,
        // note you cannot add a new state property if you don't define it in state(), it must contain the
        // https://pinia.vuejs.org/core-concepts/state.html#mutating-the-state | https://pinia.vuejs.org/core-concepts/state.html#replacing-the-state

        /**
         * Delete a bunch of Role from the local store
         * This doesn't make and API server request or call / sideEffect, this just mutate the store
         * @param payload Staff identifiers list to be deleted
         */
        mutDeleteRoleList( payload: IdsArray ): void {

            const st_pagination = useSt_Pagination()                                       // Pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

            this.entityPage = this.entityPage.filter(s => !payload.ids.includes(s.id))
            st_pagination.mutUpdateOnDelete(payload.ids.length)
        },

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
        },

        /**
         * Tries to delete a bunch (or just one) of Role
         * @param payload Staff identifiers list to be deleted
         */
        async reqRoleDeletion( payload: IdsArray ): Promise<void> {

            return await new Promise<void>(( resolve, reject ) => {
                ApiRbac.delete(payload.ids).then(( response: any ) => {

                    // deleting (mutate / modify) the staff from the local store
                    this.mutDeleteRoleList(payload)
                    resolve()

                }).catch(error => { reject(error) })
            })
        },

        /**
         * Tries to insert a new Role and its associated permission
         * @param payload Role and Perms data to be inserted
         * @param doWeNeedToStay This value with come 'doWeNeedToStay' var from , It is use in the UI logic to say if we stay in the form for maybe create another entity.
         */
        async reqInsertRolePerms (payload: IDtoRole, doWeNeedToStay: boolean = false) : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiRbac.reqInsRolePerms(payload)
                .then((response:any) => {resolve(response.data)})
                .catch(error => {reject(error)})
            })
        },
    }
})

//region ======== STATE INTERFACE =======================================================

// interface IStaffState extends IBasicPageState {

interface IRbacState {
    entityPage: Array<IDtoRole>
}

//endregion =============================================================================


