import { defineStore } from 'pinia'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { ApiStaff } from '@/services/api/api-staff'
import { IsEmptyObj, isNumber } from '@/services/helpers/help-defaults'

import type { IDataTableQuery, IStaffRow, IBasicPageState, IdsArray } from '@/services/definitions'
import type { IDtoStaff } from '@/services/definitions'


// https://pinia.vuejs.org/core-concepts/#setup-stores

// Sample of option store
export const useSt_Staff = defineStore({
    id: 'staff',

    state: () : IStaffState => ({
        pageNumber:    0,
        pageSize:      0,
        totalRecords: 0,
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
         * store state
         *
         * @param state Staff store state
         */
        getStaffList: ( state ) : Array<IStaffRow> => {
            const st_nomenclatures = useSt_Nomenclatures()                                            // Pinia instance of the nomenclature store

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

        getEntitiesCount: ( state ) : number => state.totalRecords,

        getStaffByIdFromLocalStorage: ( state ) => {
            // Getters are just computed properties behind the scenes, so it's not possible to pass any parameters to them. However, you can return a function from the getter to accept any arguments
            // Note that when doing this, getters are not cached anymore, they are simply functions that you invoke. You can however cache some results inside of the getter itself, which is uncommon but should prove more performant
            // https://pinia.vuejs.org/core-concepts/getters.html#passing-arguments-to-getters
            return (staffId : number) => state.entityPage.find((staff) => staff.id == staffId)
        }
    },

    actions: {

        // ---mutators ---
        // mutates the states directly without any API server request or call / sideEffect, this just mutate the store
        // https://pinia.vuejs.org/core-concepts/state.html#mutating-the-state | https://pinia.vuejs.org/core-concepts/state.html#replacing-the-state

        /**
         * Delete a bunch of Staff from the store
         * This doesn't make and API server request or call / sideEffect, this just mutate the store
         * @param payload Staff identifiers list to be deleted
         */
        mutDeleteStaffList( payload: IdsArray ): void {
            this.entityPage = this.entityPage.filter(s => !payload.ids.includes(s.id))
            this.totalRecords -= payload.ids.length
            this.pageSize -= payload.ids.length
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
         *
         * @param payload query of filters and order criteria from datatable UI controls
         */
        async reqStaffPages (payload: IDataTableQuery) : Promise<void> {

             return await new Promise<void>((resolve, reject) => {
                ApiStaff.getPage(payload)
                .then((response:any) => {

                    this.entityPage = response.data.entityList
                    this.totalRecords = response.data.totalRecords
                    this.pageSize = response.data.entityList.length
                    this.pageNumber = payload.Offset

                    resolve()

                }).catch(error => {

                    if (error.response.status === 404)
                    {
                        this.entityPage = []
                        this.totalRecords = 0
                        this.pageSize = 0
                        this.pageNumber = payload.Offset
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

interface IStaffState extends IBasicPageState {
    entityPage: Array<IStaffRow>
}

//endregion =============================================================================


