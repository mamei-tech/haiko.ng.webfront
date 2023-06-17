import axios from './api'
import config from './config'
import useFactory from '@/services/composables/useFactory'
import { HTTP_RESPONSES } from '@/services/definitions'

import type { AxiosPromise } from 'axios'
import type { ISupplierCatRow, IDataTableQuery, IDataTablePage, IDtoSupplierCat, ISupplierRow } from '@/services/definitions'


const version = config.server.current_version
const url = `v${ version }/mngmt/cmsupplier`
const { mkSupplierCat } = useFactory()

/**
 * REST API class for backend interaction logic related with Nomenclatures at manager level
 */
export class ApiSupplier {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    /**
     * Request datatable page data (Supplier Categories) according to the given query parameters
     * @param queryParams Parameterized request for the entities. Contains query params such as pagination details and filter options for searching.
     */
    public static getPageSuppCat( queryParams: IDataTableQuery ): AxiosPromise<IDataTablePage<ISupplierCatRow>> {

        if (queryParams.Orderer === 'ScName') queryParams.Orderer = 'SCName'           // little mapping here

        const payload = {
            Orderer: queryParams.Orderer,
            OrderDir: queryParams.OrderDir,
            Limit: queryParams.Limit,
            Search: queryParams.Search,
            Offset: queryParams.Offset,
            ...queryParams.Filters
        }

        return axios.get(url + '/category/page', { params: payload })
    }

    /**
     * Request datatable page data (Supplier Categories) according to the given query parameters
     * @param queryParams Parameterized request for the entities. Contains query params such as pagination details and filter options for searching.
     */
    public static getPageSupp( queryParams: IDataTableQuery ): AxiosPromise<IDataTablePage<ISupplierRow>> {

        const payload = {
            Orderer: queryParams.Orderer,
            OrderDir: queryParams.OrderDir,
            Limit: queryParams.Limit,
            Search: queryParams.Search,
            Offset: queryParams.Offset,
            ...queryParams.Filters
        }

        return axios.get(url + '/page', { params: payload })
    }

    /**
     * Create / insert a new Supplier Category on the system
     *
     * @param newSupplierCat
     * @returns Promise with the identifier of the just created entity
     */
    // public static insertRolePerms( newRoleData: IDtoRole ): AxiosPromise<number> {
    public static insertSupplierCat( newSupplierCat: IDtoSupplierCat ): AxiosPromise<void>  {
        return axios.post(url + '/category', newSupplierCat)
    }

    /**
     * Invoke an api call to delete a Supplier Category from the server
     * @param categoryId Supplier Category identifier to be deleted
     */
    public static reqDeleteSuppCat( categoryId: number ): AxiosPromise<void> {
        return axios.delete(url + `/category/${ categoryId }`)
    }

    /**
     * Invoke an api call to delete a Supplier from the server
     * @param supplierId Supplier identifier to be deleted
     */
    public static reqDeleteSupp ( supplierId: number ): AxiosPromise<void> {
        return axios.delete(url + `/${ supplierId }`)
    }

    /**
     * Get formulary data information from server, pertaining to a SupplierCategory given its identifier
     * @param categoryId SupplierCategory identifier
     */
    public static reqSupplierCatById (categoryId: number): AxiosPromise<IDtoSupplierCat> {
        return axios.get(url + `/category/${ categoryId }`)
    }

    /**
     * Make the request to update the Supplier Category data
     *
     * @param payload
     */
    public static reqUpdateSupplierCategory( payload: IDtoSupplierCat ): AxiosPromise<void> {
        return axios.put(url + '/category', payload)
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================

    /**
     * Tries to get formulary data information, pertaining to a SupplierCategory given its identifier.
     * ❗ If information from server could not be obtained, an empty Entity will be returned then
     *
     * @param id SupplierCategory identifier
     */
    public static async getStaffById( id: number ): Promise<IDtoSupplierCat> {
        const response = await ApiSupplier.reqSupplierCatById(+id)

        if (response.status === HTTP_RESPONSES.OK) return response.data as IDtoSupplierCat
        return mkSupplierCat()
    }

    //endregion ===========================================================================

}
