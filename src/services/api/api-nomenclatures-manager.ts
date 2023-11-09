import axios from './api'
import appConfig from '@/configs/app.conf'

import type { AxiosPromise } from 'axios'
import type { ICountryBasic, ICountryStatesBasic, IRoleBasic, ISuppCatBasic, IProdCatBasic, IUoMBasic } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/mngmt/cmnomenclators`

/***
 * REST API class for backend interaction logic related with Nomenclatures at manager level
 */
export class ApiNomenclaturesMng {

    /**
     * Get a list of countries defined on the system
     * !! The retrieve countries list just have name, id and the international code, which makes it different
     * from other methods retrieving county data. Check ICountryBasic
     */
    public static getCountries(): AxiosPromise<ICountryBasic[]> {
        return axios.get(url + '/countries')
    }

    /**
     * Get a list of country provinces / states defined on the system, and according with the given country identifier
     * !! The retrieve countries list just have name, id and the international code, which makes it different
     * from other methods retrieving system province / state data. Check ICountryBasic
     *
     * @param countryId Identifier of the country we want to look for
     */
    public static getCountryStates( countryId: string ): AxiosPromise<ICountryStatesBasic[]> {
        return axios.get(url + `/countries/states/${ countryId }`)
    }

    /**
     * Get a list of roles defined on the system
     * !! The retrieve roles list just have name and id, which makes it different from other methods
     * retrieving system role. Check IRoleBasic
     */
    public static getRoles(): AxiosPromise<IRoleBasic[]> {
        return axios.get(url + '/roles')
    }

    /**
     * Get a list of suppliers categories defined on the system
     * !! The retrieve categories list just have name and id, which makes it different from other methods
     * retrieving system Supplier Category data. Check ISuppCatBasic
     */
    public static getSuppCat(): AxiosPromise<ISuppCatBasic[]> {
        return axios.get(url + '/supplierscat')
    }

    /**
     * Get a list of product categories defined on the system
     * !! The retrieve categories list just have name and id, which makes it different from other methods
     * retrieving system Products Category data. Check IProdCatBasic
     */
    public static getProdCat(): AxiosPromise<IProdCatBasic[]> {
        return axios.get(url + '/productcat')
    }

    /**
     * Get a list of units of measurement (UoM) defined on the system
     * !! The retrieve list just have name and id, which makes it different from other methods
     * retrieving system UoM data. Check IUoMBasic
     */
    public static getUoM(): AxiosPromise<IUoMBasic[]> {
        return axios.get(url + '/uom')
    }

    /**
     * Get a list of Staff defined on the system
     * - The retrieve list just will have minimum data (name) Check IStaffBasic
     */
    public static getStaff(): AxiosPromise<IUoMBasic[]> {
        return axios.get(url + '/staffs')
    }

    /**
     * Get a list of Suppliers defined on the system
     * - The retrieve list just will have minimum data (sName) Check ISupplierBasic
     * - M == minimum / basic information
     */
    public static getSuppliersM(): AxiosPromise<IUoMBasic[]> {
        return axios.get(url + '/suppliers')
    }

    /**
     * Get a list of Currencies defined on the system
     * - The retrieve list just will have minimum data (cDenomination) Check ICurrencyBasic
     * - M == minimum / basic information
     */
    public static getCurrenciesM(): AxiosPromise<IUoMBasic[]> {
        return axios.get(url + '/currencies')
    }
}
