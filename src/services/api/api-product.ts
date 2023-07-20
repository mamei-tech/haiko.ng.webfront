import axios from './api'
import config from './config'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDtoStaff, IDataTablePage, IStaffRow } from '@/services/definitions'


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

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //endregion ===========================================================================
}
