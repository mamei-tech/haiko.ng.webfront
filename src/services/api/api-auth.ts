import axios from "./api";
import config from "./config";
import qs from "query-string";

import type { AxiosPromise } from "axios";
import type { IAuthFormData } from '../definitions/types-forms'
import type { IAuthResponse } from "../definitions/types-api";


const version = config.site.current_version;
const url = `v${version}/cauth`


export class ApiAuth {

    /**
     * Request authentication / access to the backend
     * @param formData user credentials
     */
    public static reqAuth( formData: IAuthFormData) : AxiosPromise<IAuthResponse> {

        const environment = "Web";
        const actor = "UStaff";

        return axios.post(`${url}/${actor}/${environment}`, qs.stringify(formData), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
    }

    public static setAccessToken(at: string) {
        // @ts-ignore
        axios.defaults.headers["Authorization"] = `Bearer ${at}`;               // Setting Bearer Token
    }

    public static removeAccessToken() {
        // @ts-ignore
        delete axios.defaults.headers["Authorization"];                         // Removing Bearer Token
    }
}
