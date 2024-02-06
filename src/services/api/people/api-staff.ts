import axios from '../api'
import appConfig from '@/configs/app.conf'
import { HTTP_HEADER_FORM_DATA, HTTP_RESPONSES } from '@/services/definitions'
import useFactory from '@/services/composables/useFactory'
import useCommon from '@/services/composables/useCommon'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDtoStaff, IDataTablePage, IStaffRow } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/people/cstaff`
const { mkStaff } = useFactory()
const { toFormData } = useCommon()

/***
 * REST API class for backend interaction logic related with Staff
 */
export class ApiStaff {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    /**
     * Create / insert a new Staff on the system
     *
     * ❗❗❗ The IDtoStaff.avatarImg field is a File so we can upload the avatar image to the sever. For the
     * backend server is easier to handle the uploaded file is we sen the entire data as **multipart/form-data**.
     * If we did not have the file field (IDtoStaff.avatarImg) we can sent the data as norma javascript o
     *
     * @param staff
     * @returns Promise with the identifier of the just created store (the same as the owner)
     */
    public static reqIns( staff: IDtoStaff ): AxiosPromise<number> {
        // return axios.post(url, staff)

        return axios.post(url, toFormData(staff), {
            headers: { 'Content-Type': HTTP_HEADER_FORM_DATA }
        })
    }

    /**
     * Update a Staff on the system
     *
     * ❗❗❗ The IDtoStaff.avatarImg field is a File so we can upload the avatar image to the sever. For the
     * backend server is easier to handle the uploaded file is we sen the entire data as **multipart/form-data**.
     * If we did not have the file field (IDtoStaff.avatarImg) we can sent the data as norma javascript object (JSON)
     *
     * @param staff object with the edited data
     * @returns ??
     */
    public static update( staff: IDtoStaff ): AxiosPromise<void> {

        return axios.put(url, toFormData(staff), {
            headers: { 'Content-Type': HTTP_HEADER_FORM_DATA }
        })
    }

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

        return axios.get(`${url}/page`, { params: payload })
    }

    /**
     * Get formulary data information from the server about a Staff given its identifier
     * @param id staff identifier
     */
    public static reqStaffById (id: number): AxiosPromise<IDtoStaff> {
        return axios.get(`${ url }/${ id }`)
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
        return axios.post(`${ url }/toggle`, ids)
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================

    /**
     * Get formulary data information from the server about a Staff given its identifier.
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
