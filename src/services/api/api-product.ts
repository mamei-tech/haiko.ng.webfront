import axios from './api'
import appConfig from '@/configs/app.conf'
import { HTTP_HEADER_FORM_DATA, HTTP_RESPONSES } from '@/services/definitions'
import useFactory from '@/services/composables/useFactory'
import useCommon from '@/services/composables/useCommon'
import useNumeric from '@/services/composables/useNumeric'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDataTablePage, IStaffRow, IDtoProduct, IDtoProductSupplierL } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/mngmt/cmproduct`

const { mkProduct } = useFactory()
const { toFormData, toFormDataR } = useCommon()
const { toUIMoney } = useNumeric()

/***
 * REST API class for backend interaction logic related with Products
 */
export class ApiProduct {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================
    /**
     * Request datatable page data according to the given query parameters
     * @param queryParams Parameterized request for the entities. Contains query params such as pagination details and filter options for searching.
     */
    public static getPage( queryParams: IDataTableQuery ): AxiosPromise<IDataTablePage<IStaffRow>> {

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
     * Invoke an api call to toggle the status of the entities with the given identifiers
     * @param ids entities identifiers
     */
    public static bulkToggle( ids: Array<number> ): AxiosPromise<void> {
        return axios.post(url + '/toggle', ids)
    }

    /**
     * Create / insert a new Product on the system
     *
     * @param product
     * @returns Promise with the identifier of the just created store (the same as the owner)
     */
    public static insert( product: IDtoProduct ): AxiosPromise<number> {
        // return axios.post(url, product)

        return axios.post(url, toFormDataR(product), {
            headers: { 'Content-Type': HTTP_HEADER_FORM_DATA }
        })
    }

    /**
     * Get formulary data information from the server about a Supplier given its identifier.
     * This is mostly used in form population
     * @param productId Product identifier to look for
     */
    public static reqProductById( productId: number ): AxiosPromise<IDtoProduct> {
        return axios.get(url + `/${ productId }`)
    }

    /**
     * Get the Providers associated with a specific product
     * @param productId product identifier to look for
     */
    public static reqProductSuppliers ( productId: number ): AxiosPromise<Array<IDtoProductSupplierL>> {
        return axios.get(url + `/${ productId }/suppliers`)
    }

    /**
     * Send the request (multipart/form-data) to update an existing product
     * @param product product object tom be updated
     */
    public static update (product : IDtoProduct) : AxiosPromise<void> {

        return axios.put(url, toFormDataR(product), {
            headers: { 'Content-Type': HTTP_HEADER_FORM_DATA }
        })
    }

    public static reqDeleteProducts( ids: Array<number>): AxiosPromise<void> {
        return axios.delete(url, {
            data: ids
        })
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================

    /**
     * Get formulary data information from the server about a Product given its identifier.
     * ❗ If information from server could not be obtained, an empty Entity will be returned then
     * This is mostly used in form population
     *
     * @param id Product identifier
     */
    public static async getProductById( id: number ): Promise<IDtoProduct> {
        const response = await ApiProduct.reqProductById(id)

        // small data sanitation here because of the integer raw currency scale that we are working with
        if(response.data.sellPrice !== undefined)
            response.data.sellPrice = toUIMoney(+response.data.sellPrice)

        if (response.status === HTTP_RESPONSES.OK) return response.data as IDtoProduct
        return mkProduct()
    }

    //endregion ===========================================================================
}
