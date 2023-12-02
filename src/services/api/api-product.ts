import axios from './api'
import appConfig from '@/configs/app.conf'
import { HTTP_HEADER_FORM_DATA } from '@/services/definitions'
import useCommon from '@/services/composables/useCommon'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDataTablePage, IStaffRow, IDtoProduct } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/mngmt/cmproduct`

const { toFormData, toFormDataR } = useCommon()

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
    public static insertProduct( product: IDtoProduct ): AxiosPromise<number> {
        // return axios.post(url, product)

        return axios.post(url, toFormDataR(product), {
            headers: { 'Content-Type': HTTP_HEADER_FORM_DATA }
        })
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //endregion ===========================================================================
}
