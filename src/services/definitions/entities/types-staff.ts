import type { IIndexable } from '@/services/definitions/types-common'

/**
 * Interface for describing a Staff row on the datatable
 */
export interface IStaffRow extends IIndexable {
    firstName: string,
    username: string,
    roleId: number | string,
    isActive: boolean,
    created?: Date,
    cell: number,
    avatarPath: string
}

/**
 * Extended Staff entity interface
 */
export interface IDtoStaff extends IStaffRow {
    lastName: string,
    email: string,
    password? : string,
    passwordConf?: string,
    locale: string,

    avatarImg?: File                    // on server this value is only used in the request DTO for crete / update, this value doesn't exist in the Staff entity / model
}
