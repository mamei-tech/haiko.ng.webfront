// Store for nomenclatures data from the backend
//

import { defineStore } from 'pinia'
import { toDicIds } from '@/services/helpers/help-conversion'
import { mapRolesNom2Multiselect } from '@/services/helpers/help-forms'
import { ApiNomenclaturesMng } from '@/services/api/api-nomenclatures-manager'


import type { ById, IIndexable, IMultiselectBasic, IRoleBasic } from '@/services/definitions'


// https://pinia.vuejs.org/core-concepts/#setup-stores

// Sample of option store
export const useNomencStore = defineStore({
    id: 'nomenc',

    state: (): IStaffState => ({
        roles: [] as IRoleBasic[]
    }),

    /**
     * Getters are exactly the equivalent of computed values for the state of a Store | https://pinia.vuejs.org/core-concepts/getters.html
     * as a convention, we name all the getter with a 'get' prefix
     */
    getters: {

        /**
         * Get the roles form the state in a multiselect component form ({value: ___, label: ___})
         *
         * @param state Nomenclatures ROLES state
         */
        getRolesForMultiselect: ( state ): IMultiselectBasic[] => mapRolesNom2Multiselect(state.roles),

        /**
         * Map the roles to a dictionary where the RoleId is the key of the role value (rName, role name)
         *
         * @param state Nomenclatures ROLES state
         */
        getRolesByIdMap: ( state ): ById<IRoleBasic> => toDicIds(state.roles)
    },
    actions: {

        // ---mutators ---
        // mutates the states directly without any request call to the backend
        // https://pinia.vuejs.org/core-concepts/state.html#mutating-the-state | https://pinia.vuejs.org/core-concepts/state.html#replacing-the-state


        // --- server async calls actions ---

        /**
         * tries to get the defines system users roles from the backend
         * to make the actual request
         */
        async reqNomencRoles () : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiNomenclaturesMng.getRoles()
                .then((response:any) => {

                    this.roles = response.data
                    resolve()

                }).catch(error => { reject(error) })
            })

        },

    }
})

//region ======== STATE INTERFACE =======================================================

interface IStaffState {
    roles: Array<IRoleBasic>
}

//endregion =============================================================================


