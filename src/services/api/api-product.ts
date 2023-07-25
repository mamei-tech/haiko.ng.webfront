import axios from './api'
import config from './config'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDataTablePage, IStaffRow } from '@/services/definitions'


const version = config.server.current_version
const url = `v${ version }/mngmt/cmproduct`

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

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //endregion ===========================================================================
}
