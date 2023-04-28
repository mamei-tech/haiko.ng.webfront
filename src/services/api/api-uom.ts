import axios from './api'
import config from './config'

import type { AxiosPromise } from 'axios'
import type { IDataTablePage, IDtoUoMCategory } from '@/services/definitions'


const version = config.server.current_version
const url = `v${ version }/mngmt/cmuom`

/***
 * REST API class for backend interaction logic related with UoM at manager level
 */
export class ApiUoM {

    /**
     * Request datatable page data according to the given query parameters
     */
    public static getPage(): AxiosPromise<IDataTablePage<IDtoUoMCategory>> {

        return axios.get(url + '/page', {})
    }

    /**
     * Invoke an api call to deletes a UoM Category from the server
     * @param categoryId UoM category identifier to be deleted
     */
    public static deleteCat( categoryId: number ): AxiosPromise<void> {
        return axios.delete(url + `/category/${ categoryId }`)
    }
}
