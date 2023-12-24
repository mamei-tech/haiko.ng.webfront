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
    avatarPath: string | undefined
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

    avatarImg?: File                    // on server this value is only used in the request DTO for create / update, this value doesn't exist in the Staff entity / model
}

/**
 * Very basic data of a Staff
 */
export interface IStaffBasic extends IIndexable {
    /**
     * Staff first name + last name
     */
    fullName: string
}
