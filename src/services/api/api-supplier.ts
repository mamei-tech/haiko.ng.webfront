import axios from './api'
import config from './config'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDataTablePage, IDtoRole } from '@/services/definitions'
import type { ISupplierCatRow } from '@/services/definitions'


const version = config.server.current_version
const url = `v${ version }/mngmt/cmsupplier`

/**
 * REST API class for backend interaction logic related with Nomenclatures at manager level
 */
export class ApiSupplier {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    /**
     * Request datatable page data according to the given query parameters
     * @param queryParams Parameterized request for the entities. Contains query params such as pagination details and filter options for searching.
     */
    public static getPage( queryParams: IDataTableQuery ): AxiosPromise<IDataTablePage<ISupplierCatRow>> {

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
     * Invoke an api call to delete a Supplier Category from the server
     * @param categoryId Supplier Category identifier to be deleted
     */
    public static reqDeleteSuppCat( categoryId: number ): AxiosPromise<void> {
        return axios.delete(url + `/category/${ categoryId }`)
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //endregion ===========================================================================


}
