import axios from './api'
import config from './config'

import type { AxiosPromise } from 'axios'
import type { IRoleBasic, ISuppCatBasic } from '@/services/definitions'


const version = config.server.current_version
const url = `v${ version }/mngmt/cmnomenclators`

/***
 * REST API class for backend interaction logic related with Nomenclatures at manager level
 */
export class ApiNomenclaturesMng {

    /**
     * Get a list of roles defined on the system
     * !! The retrieve roles list just have name and id, which makes it different from other methods
     * retrieving system role. Check IRoleBasic
     */
    public static getRoles(): AxiosPromise<IRoleBasic[]> {
        return axios.get(url + '/roles')
    }

    /**
     * Get a list of suppliers categories defined on the system
     * !! The retrieve categories list just have name and id, which makes it different from other methods
     * retrieving system role. Check IRoleBasic
     */
    public static getSuppCat(): AxiosPromise<ISuppCatBasic[]> {
        return axios.get(url + '/supplierscat')
    }
}
