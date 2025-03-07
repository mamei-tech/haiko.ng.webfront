import axios from '../api'
import appConfig from '@/configs/app.conf'

import type { AxiosPromise } from 'axios'
import type { IPickingRow } from '@/services/definitions/entities/types-picking'
import type { IDataTablePage, IDataTableQuery, IDtoPicking } from '@/services/definitions'


const version = appConfig.server.current_version
const url = `v${ version }/inventory/cpicking`

/***
 * REST API class for backend interaction logic related with inventory picking types
 */
export class ApiPicking {

    //#region ======= SERVER INTERACTION METHODS (PROMISES / REQUESTS) ====================

    public static getPage( queryParams: IDataTableQuery ): AxiosPromise<IDataTablePage<IPickingRow>> {

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
     * Making a draft picking / transfer.
     * Draft is equally to initially create a new picking / transfer on the system.
     *
     * @param picking picking data to be drafted on the backend
     */
    public static reqDraftTransfer( picking: IDtoPicking ): AxiosPromise<number> {
        return axios.post(`${ url }/draft`, picking)
    }

    //#endregion ===========================================================================

    //#region ======= DATA READY METHODS ==================================================
    //#endregion ===========================================================================
}
