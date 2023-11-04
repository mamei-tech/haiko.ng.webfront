import axios from './api'
import config from './config'
import { HTTP_RESPONSES } from '@/services/definitions'

import type { AxiosPromise } from 'axios'
import type { IDataTableQuery, IDataTablePage, IDtoRole } from '@/services/definitions'
import type { IPermAssocId } from '@/services/definitions/entities/types-rbac'


const version = config.server.current_version
const url = `v${ version }/mngmt/cmrbac`

/***
 * REST API class for backend interaction logic related with Nomenclatures at manager level
 */
export class ApiRbac {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    /**
     * Request datatable page data according to the given query parameters
     * @param queryParams Parameterized request for the entities. Contains query params such as pagination details and filter options for searching.
     */
    public static getPage( queryParams: IDataTableQuery ): AxiosPromise<IDataTablePage<IDtoRole>> {

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
     * Get a permission list, with the association between role-perms already mapped (the role have the permission).
     * The association is mapped in the "PocoPermAssoc.IsAssociated" field: is true the role have it.
     * GetPermsRoleMapAssoc = get permission role map association
     *
     * @param id role identifier
     */
    public static async getGetPermsRoleMapAssoc( id: number ): Promise<Array<IPermAssocId>> {
        const response = await axios.get(url + `/assoc/${ id }`)

        if (response.status === HTTP_RESPONSES.OK) return response.data as Array<IPermAssocId>
        return []
    }

    /**
     * Create / insert a new role and its associated permission on the system
     *
     * @param newRoleData
     * @returns Promise with the identifier of the just created entity
     */
    // public static insertRolePerms( newRoleData: IDtoRole ): AxiosPromise<number> {
    public static insertRolePerms( newRoleData: IDtoRole ) {
        return axios.post(url, newRoleData)
    }

    /**
     * Make the request to update the role data and the permission association to the role
     *
     * @param id role identifier
     * @param payload
     */
    public static async updateRolePerms( id: number, payload: IDtoRole ): Promise<void> {
        return axios.put(url, payload)
    }

    /**
     * Invoke an api call to deletes a bunch of entities
     * @param ids List of entities identifiers
     */
    public static delete( ids: Array<number> ): AxiosPromise<void> {
        return axios.delete(url, { data: ids })
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //endregion ===========================================================================

}
