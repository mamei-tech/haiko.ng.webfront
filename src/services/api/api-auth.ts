import axios from './api'
import appConfig from '@/configs/app.conf'
import qs from 'query-string'
import { HTTP_HEADER_FORM_URLENCODED } from '@/services/definitions'

import type { AxiosPromise } from 'axios'
import type { IAuthFormData } from '../definitions/types-forms'
import type { IAuthResponse } from '../definitions/types-api'


const version = appConfig.server.current_version
const url = `v${ version }/cauth`


export class ApiAuth {

    /**
     * Request authentication / access to the backend
     * @param formData user credentials
     */
    public static reqAuth( formData: IAuthFormData ): AxiosPromise<IAuthResponse> {

        return axios.post(`${ url }`, qs.stringify(formData), {
            headers: { 'Content-Type': HTTP_HEADER_FORM_URLENCODED }
        })
    }

    public static setAccessToken( at: string ) {
        // @ts-ignore
        axios.defaults.headers[ 'Authorization' ] = `Bearer ${ at }`               // Setting Bearer Token
    }

    /**
     * we are not using this here 'cause Pinia has a method to reset the entire (auth) store, so we are using that
     * by now, in the auth store
     */
    public static removeAccessToken() {
        // @ts-ignore
        delete axios.defaults.headers[ 'Authorization' ]                         // Removing Bearer Token
    }
}
