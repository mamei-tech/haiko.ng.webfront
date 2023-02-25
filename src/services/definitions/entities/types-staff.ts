import type { IDataListBasicResponse } from '@/services/definitions/types-common'


export interface IStaffPage extends IDataListBasicResponse {
    entityList: Array<IStaffRow>;
}

/**
 * Interface for describing a Staff row on the datatable
 */
export interface IStaffRow {
    id: number,
    firstName: string,
    username: string,
    roleId: number | string,
    isActive: boolean,
    created?: Date,
    cell: number,
    avatarPath: string
}

/**
 * Main Staff entity interface
 */
export interface IDtoStaff extends IStaffRow {
    lastName: string,
    email: string,
    password? : string,
    passwordConf?: string,
    locale: string,
    avatarImg?: File                    // on server this value is only used in the request DTO for crete / update, this value doesn't exist in the Staff entity / model
}
