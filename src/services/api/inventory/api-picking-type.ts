import axios from '../api'
import appConfig from '@/configs/app.conf'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDataTablePage, IPickingTypeRow, IDtoPickingType } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/inventory/cpickingtype`

/***
 * REST API class for backend interaction logic related with inventory picking types
 */
export class ApiPickingType {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    /**
     * Request datatable page data according to the given query parameters
     * @param queryParams Parameterized request for the entities. Contains query params such as pagination details and filter options for searching.
     */
    public static getPage( queryParams: IDataTableQuery ): AxiosPromise<IDataTablePage<IPickingTypeRow>> {

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
     * Get a inventory Picking Type formulary data information from the server according to the given entity identifier.
     *
     * @param pickingTypeId inventory Picking Type identifier
     */
    public static reqPickingTypeById( pickingTypeId: number ): AxiosPromise<IDtoPickingType> {
        return axios.get(`${ url }/${ pickingTypeId }`)
    }

    /**
     * Invoke an api call to toggle the status of the entities with the given identifiers
     * @param ids entities identifiers
     */
    public static bulkToggle( ids: Array<number> ): AxiosPromise<void> {
        return axios.post(`${ url }/toggle`, ids)
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //endregion ===========================================================================
}
