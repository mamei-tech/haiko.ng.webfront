import axios from '../api'
import appConfig from '@/configs/app.conf'
import useFactory from '@/services/composables/useFactory'
import { HTTP_RESPONSES } from '@/services/definitions'
import useCommon from '@/services/composables/useCommon'

import type { AxiosPromise } from 'axios'
import type { ISupplierCatRow, IDataTableQuery, IDataTablePage, IDtoSupplierCat, ISupplierRow, IDtoSupplier, IDtoProductSupplierL } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/purchase/csupplier`
const { isUndEmpZero } = useCommon()
const { mkSupplierCat, mkSupplier } = useFactory()

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

        return axios.get(`${url}/category/page` , { params: payload })
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

        return axios.get(`${url}/page`, { params: payload })
    }

    /**
     * Create / insert a new Supplier Category on the system
     *
     * @param newSupplierCat
     * @returns Promise with the identifier of the just created entity
     */
    // public static insertRolePerms( newRoleData: IDtoRole ): AxiosPromise<number> {
    public static reqInsSupplierCat( newSupplierCat: IDtoSupplierCat ): AxiosPromise<void>  {
        return axios.post(`${url}/category`, newSupplierCat)
    }

    /**
     * Invoke an api call to delete a Supplier Category from the server
     * @param categoryId Supplier Category identifier to be deleted
     */
    public static reqDeleteSuppCat( categoryId: number ): AxiosPromise<void> {
        return axios.delete(`${url}/category/${ categoryId }`)
    }

    /**
     * Invoke an api call to delete a Supplier from the server
     * @param supplierId Supplier identifier to be deleted
     * @param mode Tells if we need to process the request as an update of "DtoSupExtI" (extended supplier contact information)
     */
    public static reqDeleteSupp ( supplierId: number, mode : string | undefined = undefined ): AxiosPromise<void> {

        return isUndEmpZero(mode)
            ?  axios.delete(`${url}/${ supplierId }`)
            :  axios.delete(`${url}/ext/${ supplierId }`)
    }

    /**
     * Get formulary data information from the server about a SupplierCategory given its identifier
     * @param categoryId SupplierCategory identifier
     */
    public static reqSupplierCatById (categoryId: number): AxiosPromise<IDtoSupplierCat> {
        return axios.get(`${url}/category/${ categoryId }`)
    }

    /**
     * Get formulary data information from the server about a Warehouse given its identifier.
     * This is mostly used in form population
     * @param warehouseId Warehouse identifier to look for
     */
    public static reqSupplierById (warehouseId: number): AxiosPromise<IDtoSupplier> {
        return axios.get(`${url}/${ warehouseId }`)
    }

    /**
     * Make the request to update the Supplier Category data
     *
     * @param payload
     */
    public static reqUpdateSupplierCategory( payload: IDtoSupplierCat ): AxiosPromise<void> {
        return axios.put(`${url}/category`, payload)
    }

    /**
     * Create / insert a new Supplier on the system
     *
     * @param payload entity data used to update the entity
     * @param mode Tells if we need to process the request for the creation of "DtoSupExtI" (extended supplier contact information)"
     */
    public static reqInsSupplier( payload: IDtoSupplier, mode: string | undefined = undefined): AxiosPromise<number>  {

        return isUndEmpZero(mode)
            ? axios.post(url, payload)
            : axios.post(`${url}/ext`, payload)
    }

    /**
     * Make the request to update the Supplier data
     *
     * @param payload entity data used to update the entity
     * @param mode Tells if we need to process the request as an update of "DtoSupExtI" (extended supplier contact information)
     */
    public static reqUpdateSupplier( payload: IDtoSupplier, mode: string | undefined = undefined ): AxiosPromise<void> {

        return isUndEmpZero(mode)
            ? axios.put(url, payload)
            : axios.put(`${url}/ext`, payload)
    }

    /**
     * Invoke an api call to toggle the status of the entities with the given identifiers
     * @param ids entities identifiers
     */
    public static bulkToggle( ids: Array<number> ): AxiosPromise<void> {
        return axios.post(`${url}/toggle`, ids)
    }

    /**
     * Get the Providers associated with a specific product
     * @param productId product identifier to look for
     */
    public static reqProductSuppliers ( productId: number ): AxiosPromise<Array<IDtoProductSupplierL>> {
        return axios.get(`${ url }/product/${ productId }`)
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================

    /**
     * Get formulary data information from the server about a Supplier given its identifier.
     * ❗ If information from server could not be obtained, an empty Entity will be returned then
     * This is mostly used in form population
     *
     * @param id Supplier identifier
     */
    public static async getSuppById( id: number ): Promise<IDtoSupplier> {
        const response = await ApiSupplier.reqSupplierById(+id)

        if (response.status === HTTP_RESPONSES.OK) return response.data as IDtoSupplier
        return mkSupplier()
    }

    /**
     * Get formulary data information from the server about a SupplierCategory given its identifier.
     * ❗ If information from server could not be obtained, an empty Entity will be returned then
     * This is mostly used in form population
     * @param id SupplierCategory identifier
     */
    public static async getSuppCatById( id: number ): Promise<IDtoSupplierCat> {
        const response = await ApiSupplier.reqSupplierCatById(+id)

        if (response.status === HTTP_RESPONSES.OK) return response.data as IDtoSupplierCat
        return mkSupplierCat()
    }

    //endregion ===========================================================================

}
