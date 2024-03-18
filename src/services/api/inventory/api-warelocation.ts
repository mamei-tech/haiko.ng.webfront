import axios from '../api'
import appConfig from '@/configs/app.conf'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDataTablePage, IWareLocationRow } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/inventory/cwarelocation`

/***
 * REST API class for backend interaction logic related with Warehouse
 */
export class ApiWareLocation {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    /**
     * Request datatable page data according to the given query parameters
     * @param queryParams Parameterized request for the entities. Contains query params such as pagination details and filter options for searching.
     */
    public static getPage( queryParams: IDataTableQuery ): AxiosPromise<IDataTablePage<IWareLocationRow>> {

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

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //endregion ===========================================================================
}
