// Store for nomenclatures data from the backend
//

import { defineStore } from 'pinia'
import { toDicIds } from '@/services/helpers/help-conversion'
import { ApiNomenclaturesMng } from '@/services/api/api-nomenclatures-manager'

import type {
    ById,
    ICountryBasic,
    ICountryStatesBasic,
    IMultiselectBasic,
    IRoleBasic,
    ISuppCatBasic
} from '@/services/definitions'


// https://pinia.vuejs.org/core-concepts/#setup-stores

// nomenclatures store
export const useSt_Nomenclatures = defineStore({
    id: 'nomenc',

    state: (): IStaffState => ({
        roles:     [] as IRoleBasic[],
        suppCat:   [] as ISuppCatBasic[],
        countries: [] as ICountryBasic[],
        states:    [] as ICountryStatesBasic[]
    }),

    /**
     * Getters are exactly the equivalent of computed values for the state of a Store | https://pinia.vuejs.org/core-concepts/getters.html
     * as a convention, we name all the getter with a 'get' prefix
     */
    getters: {

        /**
         * Get the roles from the state in a multiselect component format ({value: ___, label: ___})
         *
         * @param state Nomenclatures ROLES state
         */
        getRoles4Multiselect: ( state ): IMultiselectBasic[] => {
            return state.roles.map((roleData: IRoleBasic) => {
                return { value: roleData.id, label: roleData.rName }
            })
        },

        /**
         * Get the supplier categories from the state in a multiselect component format ({value: ___, label: ___})
         *
         * @param state Nomenclatures Supplier Categories state
         */
        getSuppCat4Multiselect: ( state ): IMultiselectBasic[] => {
            return state.suppCat.map((suppCatData: ISuppCatBasic) => {
                return { value: suppCatData.id, label: suppCatData.scName }
            })
        },

        /**
         * Get the country from the state in a multiselect component format ({value: ___, label: ___})
         *
         * @param state Nomenclatures COUNTRIES state
         */
        getCountry4Multiselect: ( state ): IMultiselectBasic[] => {
            return state.countries.map((countryData: ICountryBasic) => {
                return { value: countryData.id, label: countryData.cName }
            })
        },

        /**
         * Get the country provinces / states in a multiselect component format ({value: ___, label: ___})
         *
         * @param state Nomenclatures COUNTRIES state
         */
        getCountryStates4Multiselect: ( state ): IMultiselectBasic[] => {
            return state.states.map((stateData: ICountryStatesBasic) => {
                return { value: stateData.id, label: stateData.sName }
            })
        },

        /**
         * Map the roles to a dictionary where the RoleId is the key of the role value (rName, role name)
         *
         * @param state Nomenclatures ROLES state
         */
        getRolesByIdMap: ( state ): ById<IRoleBasic> => toDicIds(state.roles),

        /**
         * Map the roles to a dictionary where the SuppCatId is the key of the role value
         *
         * @param state Nomenclatures SUPPLIER CATEGORIES state
         */
        getSuppCatByIdMap: ( state ): ById<ISuppCatBasic> => toDicIds(state.suppCat)
    },
    actions: {

        // ---mutators ---
        // mutates the states directly without any request call to the backend
        // https://pinia.vuejs.org/core-concepts/state.html#mutating-the-state | https://pinia.vuejs.org/core-concepts/state.html#replacing-the-state


        // --- server async calls actions ---

        /**
         * tries to get the defines system users roles from the backend
         */
        async reqNmcRoles () : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiNomenclaturesMng.getRoles()
                .then((response:any) => {

                    this.roles = response.data
                    resolve()

                }).catch(error => { reject(error) })
            })

        },

        /**
         * tries to get the supplier categories from the backend
         */
        async reqNmcSuppCat () : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiNomenclaturesMng.getSuppCat()
                .then((response:any) => {

                    this.suppCat = response.data
                    resolve()

                }).catch(error => { reject(error) })
            })

        },

        /**
         * tries to get the countries from the backend
         */
        async reqNmcCountries () : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiNomenclaturesMng.getCountries()
                .then((response:any) => {

                    this.countries = response.data
                    resolve()

                }).catch(error => { reject(error) })
            })
        },

        /**
         * tries to get the countries from the backend
         * @param countryId Identifier of the country we want to look for
         */
        async reqNmcCountriesStates (countryId: string) : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiNomenclaturesMng.getCountryStates(countryId)
                .then((response:any) => {

                    this.states = response.data
                    resolve()

                }).catch(error => { reject(error) })
            })
        },
    }
})

//region ======== STATE INTERFACE =======================================================

interface IStaffState {
    roles:      Array<IRoleBasic>,
    suppCat:    Array<ISuppCatBasic>,
    countries:  Array<ICountryBasic>,
    states:     Array<ICountryStatesBasic>                // states belonging to a determined / defined countries
}

//endregion =============================================================================


