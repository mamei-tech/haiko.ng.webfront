import { defineStore } from 'pinia'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { useSt_Pagination } from '@/stores/pagination'
import { ApiStaff } from '@/services/api/api-staff'
import { IsEmptyObj, isNumber } from '@/services/helpers/help-defaults'

import type { IStaffRow, IdsArray } from '@/services/definitions'
import type { IDtoStaff } from '@/services/definitions'


// https://pinia.vuejs.org/core-concepts/#setup-stores

// staff store
export const useSt_Staff = defineStore({
    id: 'staff',

    state: () : IStaffState => ({
        entityPage:   [] as IStaffRow[]
    }),

    /**
     * Getters are exactly the equivalent of computed values for the state of a Store |  https://pinia.vuejs.org/core-concepts/getters.html
     * as a convention, we name all the getter with a 'get' prefix
     */
    getters: {
        /**
         * Retrieve the staff list page data for the datatable. If the nomenclature store has bean called already
         * Then this method tries to map the roleID of each staff row to the role name according to the nomenclature
         * store state, so the staff list representation in the table has the role names instead the roles Id (user friendliness)
         *
         * @param state Staff store state
         */
        getStaffList: ( state ) : Array<IStaffRow> => {
            const st_nomenclatures = useSt_Nomenclatures()                                       // Pinia instance of the nomenclature store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

            if (IsEmptyObj(st_nomenclatures.getRolesByIdMap)) return state.entityPage       // If there are no roles yet, retrieve the staff page as it is
            else {
                // so the nomenclatures store has some role data, so we are going to map the roleId to roleName for each role
                return state.entityPage.map((row: IStaffRow) => {

                    // there is a chance that this line run, and the roleId field was already mapped to the role name making it a string value so we can used as index anymore, so we have to check first
                    if(isNumber(row.roleId))
                        row.roleId = st_nomenclatures.getRolesByIdMap[+row.roleId].rName

                    return row
                })
            }
        },

        getStaffByIdFromLocalStorage: ( state ) => {
            return (staffId : number) => state.entityPage.find((staff) => staff.id == staffId)

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
         * Delete a bunch of Staff from the local store
         * This doesn't make and API server request or call / sideEffect, this just mutate the store
         * @param payload Staff identifiers list to be deleted
         */
        mutDeleteStaffList( payload: IdsArray ): void {

            const st_pagination = useSt_Pagination()                                       // Pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

            this.entityPage = this.entityPage.filter(s => !payload.ids.includes(s.id))
            st_pagination.mutUpdateOnDelete(payload.ids.length)
        },

        // --- server async calls actions ---

        /**
         * Tries to insert a new Staff
         * @param payload Staff entity data to be inserted
         * @param doWeNeedToStay This value with come 'doWeNeedToStay' var from , It is use in the UI logic to say if we stay in the form for maybe create another entity.
         */
        async reqInsertStaff (payload: IDtoStaff, doWeNeedToStay: boolean = false) : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiStaff.insert(payload)
                .then((response:any) => {resolve(response.data)})
                .catch(error => {reject(error)})
            })
        },

        /**
         * Tries to get a datatable page of Staff entities from backend
         */
        async reqStaffPages () : Promise<void> {

            const st_pagination = useSt_Pagination()                                       // pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

             return await new Promise<void>((resolve, reject) => {
                ApiStaff.getPage(st_pagination.getQueryData)
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
         * Tries to delete a bunch (or just one) of Staff
         * @param payload Staff identifiers list to be deleted
         */
        async reqStaffDeletion( payload: IdsArray ): Promise<void> {

            return await new Promise<void>(( resolve, reject ) => {
                ApiStaff.delete(payload.ids).then(( response: any ) => {

                    // deleting (mutate / modify) the staff from the local store
                    this.mutDeleteStaffList(payload)
                    resolve()

                }).catch(error => { reject(error) })
            })
        },

        /**
         * Tries to update Staff data in the backend server
         *
         * @param payload Staff entity data to be updated
         * @param doWeNeedToStay This value with come 'doWeNeedToStay' var from , It is use in the UI logic to say if we stay in the form for maybe create another entity.
         */
        async reqStaffUpdate (payload: IDtoStaff, doWeNeedToStay: boolean = false) : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiStaff.update(payload)
                .then((response:any) => {resolve(response.data)})
                .catch(error => {reject(error)})
            })
        },

        /**
         * Tries to toggle the active status of a entity
         * @param payload entity identifiers list to be toggled
         */
        async reqToggleStatus( payload: IdsArray ): Promise<void> {

            return await new Promise<void>(( resolve, reject ) => {
                ApiStaff.bulkToggle(payload.ids).then((response: any ) => {

                    // toggling (mutate / modify) the status of the corresponding staff from the local store
                    this.entityPage.forEach(s => payload.ids.includes(s.id) ? s.isActive = !s.isActive : null)

                    // alternative using js map function
                    /*this.entityPage = this.entityPage.map(s => {
                        if (payload.ids.includes(s.id)) s.isActive = !s.isActive

                        return s
                    })*/

                    resolve()

                }).catch(error => { reject(error) })
            })
        }
    }
})

//region ======== STATE INTERFACE =======================================================

// interface IStaffState extends IBasicPageState {
interface IStaffState {
    entityPage: Array<IStaffRow>
}

//endregion =============================================================================


