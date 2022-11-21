import axios from './api'
import config from './config'

import type { AxiosPromise } from 'axios'
import type { IRoleBasic } from '@/services/definitions'


const version = config.site.current_version
const url = `v${ version }/mngmt/cmnomenclators`

/***
 * REST API class for backend interaction logic related with Nomenclatures at manager level
 */
export class ApiNomenclaturesMng {

    /**
     * Get a list of roles defined on the system
     */
    public static getRoles(): AxiosPromise<IRoleBasic[]> {
        return axios.get(url + '/roles')
    }

}
