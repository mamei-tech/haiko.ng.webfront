import axios from '../api'
import appConfig from '@/configs/app.conf'

import type { AxiosPromise } from 'axios'
import type { IDataTablePage, IDtoUoMCategory } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/inventory/cuom`

/***
 * REST API class for backend interaction logic related with UoM at manager level
 */
export class ApiUoM {

    /**
     * Request datatable page data according to the given query parameters
     */
    public static getPage(): AxiosPromise<IDataTablePage<IDtoUoMCategory>> {

        return axios.get(`${url}/page`, {})
    }

    /**
     * Invoke an api call to deletes a UoM Category from the server
     * @param categoryId UoM category identifier to be deleted
     */
    public static deleteCat( categoryId: number ): AxiosPromise<void> {
        return axios.delete(url + `/category/${ categoryId }`)
    }

    /**
     * Make the request to update the UoM Category data and the permission association to the role
     *
     * @param payload
     */
    public static async updateUoMCat( payload: IDtoUoMCategory ): Promise<void> {
        return axios.put(url + `/category`, payload)
    }

    /**
     * Create / insert a new uom category and its associated units, in the backend system
     *
     * @param uomCategory
     * @returns Promise with the identifier of the just created entity (the same as the owner)
     */
    public static insertUoMCat( uomCategory: IDtoUoMCategory ): AxiosPromise<number> {
        return axios.post(url + `/category`, uomCategory)
    }
}
