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

    /**
     * Make the request to update the Warehouse entity data
     *
     * @param payload
     */
    public static reqUpdateWarehouse( payload: IDtoWarehouse ): AxiosPromise<void> {
        return axios.put(url, payload)
    }

    /**
     * Get formulary data information from the server about a to a Warehouse given its identifier.
     * This is mostly used in form population
     * @param warehouseId Warehouse identifier to look for
     */
    public static reqWarehouseById (warehouseId: number): AxiosPromise<IDtoWarehouse> {
        return axios.get(url + `/${ warehouseId }`)
    }

    /**
     * Invoke an api call to delete a Warehouse from the server
     * @param warehouseId Warehouse identifier to delete
     */
    public static reqDeleteWarehouse (warehouseId: number): AxiosPromise<void> {
        return axios.delete(url + `/${ warehouseId }`)
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //endregion ===========================================================================
}
