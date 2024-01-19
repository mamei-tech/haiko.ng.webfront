import axios from './api'
import appConfig from '@/configs/app.conf'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDataTablePage, IWarehouseRow, IDtoWarehouse } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/mngmt/cmwarehouse`

/***
 * REST API class for backend interaction logic related with Warehouse
 */
export class ApiWarehouse {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    /**
     * Request the creation of a new warehouse on the system
     * @param warehouse
     */
    public static insertWarehouse( warehouse: IDtoWarehouse ): AxiosPromise<number> {
        return axios.post(url, warehouse)
    }

    /**
     * Request datatable page data according to the given query parameters
     * @param queryParams Parameterized request for the entities. Contains query params such as pagination details and filter options for searching.
     */
    public static getPage( queryParams: IDataTableQuery ): AxiosPromise<IDataTablePage<IWarehouseRow>> {

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
