import axios from './api'
import appConfig from '@/configs/app.conf'

import type { AxiosPromise } from 'axios'
import type {
    ICountryBasic,
    ICountryStatesBasic,
    IRoleBasic,
    ISuppCatBasic,
    IProdCatBasic,
    IUoMBasic,
    IProdUoM,
    IWareLocationBasic, IWarehouseBasic, IStrgCategoryBasic
} from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/common/cnomenclatures`

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
        return axios.get(`${url}/country/list`)
    }

    /**
     * Get a list of country provinces / states defined on the system, and according with the given country identifier
     * !! The retrieve countries list just have name, id and the international code, which makes it different
     * from other methods retrieving system province / state data. Check ICountryBasic
     *
     * @param countryId Identifier of the country we want to look for
     */
    public static getCountryStates( countryId: string ): AxiosPromise<ICountryStatesBasic[]> {
        return axios.get(`${url}/country/${ countryId }/state/list`)
    }

    /**
     * Get a list of roles defined on the system
     * !! The retrieve roles list just have name and id, which makes it different from other methods
     * retrieving system role. Check IRoleBasic
     */
    public static getRoles(): AxiosPromise<IRoleBasic[]> {
        return axios.get(`${url}/role/list`)
    }

    /**
     * Get a list of suppliers categories defined on the system
     * !! The retrieve categories list just have name and id, which makes it different from other methods
     * retrieving system Supplier Category data. Check ISuppCatBasic
     */
    public static getSuppCat(): AxiosPromise<ISuppCatBasic[]> {
        return axios.get(`${url}/supplier/category/list`)
    }

    /**
     * Get a list of at least (tops) 50 products only containing the identifier, uom and the name
     * @param lookup Allows a query string to search for specific product
     */
    public static getProdUoM ( lookup: string | null = null ): AxiosPromise<IProdUoM[]> {
        return axios.get(`${url}/product/uom/list/${ lookup != null && lookup.length >= 3 ? lookup : ''}`)
    }

    /**
     * Get a list of products only containing the identifier, uom and the name. The resulting products list will
     * only contains the products that match the given list of products identifiers as request parameter
     *
     * @param ids Identifiers of the products to look for
     */
    public static getProdUoMFilteredById ( ids: Array<number> ) : AxiosPromise<IProdUoM[]> {
        return axios.get(`${url}/product/uom/byids`, {
            params: {
                ids: ids.join(',')
            }
        })
    }

    /**
     * Get a list of product categories defined on the system
     * !! The retrieve categories list just have name and id, which makes it different from other methods
     * retrieving system Products Category data. Check IProdCatBasic
     */
    public static getProdCat(): AxiosPromise<IProdCatBasic[]> {
        return axios.get(`${url}/product/category/list`)
    }

    /**
     * Get a list of units of measurement (UoM) defined on the system
     * !! The retrieve list just have name and id, which makes it different from other methods
     * retrieving system UoM data. Check IUoMBasic
     */
    public static getUoM(): AxiosPromise<IUoMBasic[]> {
        return axios.get(`${url}/uom/list`)
    }

    /**
     * Get a list of Staff defined on the system
     * - The retrieve list just will have minimum data (name) Check IStaffBasic
     */
    public static getStaff(): AxiosPromise<IUoMBasic[]> {
        return axios.get(`${url}/staff/list`)
    }

    /**
     * Get a list of Suppliers defined on the system
     * - The retrieve list just will have minimum data (sName) Check ISupplierBasic
     * - M == minimum / basic information
     */
    public static getSuppliersM(): AxiosPromise<IUoMBasic[]> {
        return axios.get(`${url}/supplier/list`)
    }

    /**
     * Get a list of Currencies defined on the system
     * - The retrieve list just will have minimum data (cDenomination) Check ICurrencyBasic
     * - M == minimum / basic information
     */
    public static getCurrenciesM(): AxiosPromise<IUoMBasic[]> {
        return axios.get(`${url}/currency/list`)
    }

    /**
     * Get a list of warehouse storage locations categories defined on the system
     * - The retrieve list just will have minimum data (sCatName) Check IStrgCategoryBasic
     * - M == minimum / basic information
     */
    public static getStrgCategoriesM(): AxiosPromise<IStrgCategoryBasic[]> {
        return axios.get(`${url}/warehouse/location/categories/list`)
    }

    /**
     * Get a list of warehouse storage locations defined on the system
     * - The retrieve list just will have minimum data (lFullName) Check IWareLocationBasic
     * - M == minimum / basic information
     */
    public static getWareLocationsM( wareID: number = 0 ): AxiosPromise<IWareLocationBasic[]> {
        return wareID <= 0
            ? axios.get(`${ url }/warehouse/location/list`)                         // filtered, LFullname (field) = name of the warehouse + warelocation full name
            : axios.get(`${ url }/warehouse/${ wareID }/location/list`)
    }

    /**
     * Get a list of warehouses defined on the system
     * - The retrieve list just will have minimum data (wName) Check IWarehouseBasic
     * - M == minimum / basic information
     */
    public static getWarehousesM(): AxiosPromise<IWarehouseBasic[]> {
        return axios.get(`${url}/warehouse/list`)
    }
}
