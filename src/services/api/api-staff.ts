import axios from './api'
import config from './config'
import { HTTP_RESPONSES } from '@/services/definitions'
import useFactory from '@/services/composables/useFactory'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDtoStaff, IStaffPage } from '@/services/definitions'


const version = config.site.current_version
const url = `v${ version }/mngmt/cmstaff`
const { mkStaff } = useFactory()

/***
 * REST API class for backend interaction logic related with Staff
 */
export class ApiStaff {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    /**
     * Create / insert a new Staff on the system
     *
     * @param staff
     * @returns Promise with the identifier of the just created store (the same as the owner)
     */
    public static insert( staff: IDtoStaff ): AxiosPromise<number> {
        return axios.post(url, staff)
    }

    /**
     * Update a Staff on the system
     *
     * @param staff object with the edited data
     * @returns ??
     */
    public static update( staff: IDtoStaff ): AxiosPromise<number> {
        return axios.put(url, staff)
    }

    /**
     * Request datatable page data according to the given query parameters
     * @param queryParams Parameterized request for the entities. Contains query params such as pagination details and filter options for searching.
     */
    public static getPage( queryParams: IDataTableQuery ): AxiosPromise<IStaffPage> {

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
     * Get formulary data information from server, pertaining to a Staff given its identifier
     * @param id staff identifier
     */
    public static reqStaffById (id: number): AxiosPromise<IDtoStaff> {
        return axios.get(url + `/${ id }`)
    }

    /**
     * Invoke an api call to deletes a bunch of entities
     * @param ids List of entities identifiers
     */
    public static delete( ids: Array<number> ): AxiosPromise<void> {
        return axios.delete(url, {
            data: ids
        })
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

    /**
     * Tries to get formulary data information, pertaining to a Staff given its identifier.
     * ❗ If information from server could not be obtained, an empty Entity will be returned then
     *
     * @param id staff identifier
     */
    public static async getStaffById( id: number ): Promise<IDtoStaff> {
        const response = await ApiStaff.reqStaffById(+id)

        if (response.status === HTTP_RESPONSES.OK) return response.data as IDtoStaff
        return mkStaff()
    }

    //endregion ===========================================================================


}
