// Store for nomenclatures data from the backend
import { defineStore } from 'pinia'
import { toDicIds } from '@/services/helpers/help-conversion'
import { ApiNomenclaturesMng } from '@/services/api/api-nomenclatures-manager'

import type {
    ById,
    Function1,
    ICountryBasic,
    ICountryStatesBasic,
    IMultiselectBasic,
    IRoleBasic,
    ISuppCatBasic,
    IProdCatBasic, IUoMBasic
} from '@/services/definitions'


// https://pinia.vuejs.org/core-concepts/#setup-stores

// nomenclatures store
export const useSt_Nomenclatures = defineStore({
    id: 'nomenc',

    state: (): IStaffState => ({
        uom:       [] as IUoMBasic[],
        roles:     [] as IRoleBasic[],
        suppCat:   [] as ISuppCatBasic[],
        prodCat:   [] as IProdCatBasic[],
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
         * Get the uom from the state in a multiselect component format ({value: ___, label: ___})
         *
         * @param state UoM state
         */
        getUoM4Multiselect: ( state ): IMultiselectBasic[] => {
            return state.uom.map((uom: IUoMBasic) => {
                return { value: uom.id, label: uom.uName }
            })
        },

        /**
         * Get the product categories from the state in a multiselect component format ({value: ___, label: ___})
         *
         * @param state Nomenclatures Supplier Categories state
         */
        getProdCat4Multiselect: ( state ): IMultiselectBasic[] => {
            return state.prodCat.map((prodCatData: IProdCatBasic) => {
                return { value: prodCatData.id, label: prodCatData.pCatName }
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
         * Retrieve a state / province name according with the given state code (e.g 'LH' -> 'La Habana')
         * reference: https://pinia.vuejs.org/core-concepts/getters.html#passing-arguments-to-getters
         */
        getStatesByCode: ( state ): Function1<string, string> => {
            return ( code: string ): string => {
                const s = state.states.find(( cState: ICountryStatesBasic ) => cState.id.toString() === code)
                return s?.sName ?? ''
            }
        },

        /**
         * Map the roles to a dictionary where the RoleId is the key of the role value (rName, role name)
         *
         * @param state Nomenclatures ROLES state
         */
        getRolesByIdMap: ( state ): ById<IRoleBasic> => toDicIds(state.roles),

        /**
         * Map the suppliers category to a dictionary where the sCategoryID is the key of the category values
         *
         * @param state Nomenclatures SUPPLIER CATEGORIES state
         */
        getSuppCatByIdMap: ( state ): ById<ISuppCatBasic> => toDicIds(state.suppCat),

        /**
         * Map the product category to a dictionary where the pCategoryID is the key of the category value
         *
         * @param state Nomenclatures SUPPLIER CATEGORIES state
         */
        getProdCatByIdMap: ( state ): ById<IProdCatBasic> => toDicIds(state.prodCat),

        /**
         * Map the unit of measurement (UoM) to a dictionary where the uomId is the key of the uom value
         *
         * @param state Nomenclatures UoM state
         */
        getUoMByIdMap: ( state ): ById<IUoMBasic> => toDicIds(state.uom),
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
         * tries to get the product categories from the backend
         */
        async reqNmcProdCat () : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiNomenclaturesMng.getProdCat()
                .then((response:any) => {

                    this.prodCat = response.data
                    resolve()

                }).catch(error => { reject(error) })
            })

        },

        /**
         * tries to get the uom from the backend
         */
        async reqNmcUoM () : Promise<void> {

            return await new Promise<void>((resolve, reject) => {
                ApiNomenclaturesMng.getUoM()
                .then((response:any) => {

                    this.uom = response.data
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
    uom:        Array<IUoMBasic>,
    roles:      Array<IRoleBasic>,
    suppCat:    Array<ISuppCatBasic>,
    prodCat:    Array<IProdCatBasic>,
    countries:  Array<ICountryBasic>,
    states:     Array<ICountryStatesBasic>                // states belonging to a determined / defined countries
}

//endregion =============================================================================


