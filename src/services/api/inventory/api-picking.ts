import axios from '../api'
import appConfig from '@/configs/app.conf'

import type { AxiosPromise } from 'axios'
import type { IDtoPicking } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/inventory/cpicking`

/***
 * REST API class for backend interaction logic related with inventory picking types
 */
export class ApiPicking {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    /**
     * Making a draft picking / transfer.
     * Draft is equally to initially create a new picking / transfer on the system.
     *
     * @param picking picking data to be drafted on the backend
     */
    public static reqDraftTransfer( picking: IDtoPicking ): AxiosPromise<number> {
        return axios.post(`${ url }/draft`, picking)
    }

    //endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //endregion ===========================================================================
}
