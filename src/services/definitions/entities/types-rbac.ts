import type { IIndexable } from '@/services/definitions'


/**
 * Define the very basic data of a Role
 */
export interface IRoleBasic extends IIndexable {
    /***
     * Role name
     */
    rName: string
}

export interface IDtoRole extends IIndexable {
    /***
     * Role name
     */
    rName: string
    description: string
    permsToRemove: number[],
    permsToGrant: number[]
}

/**
 * Hold the permission data plus a field (IsAssociated) telling if if the permission is associated with an specific role
 */
export interface IPermAssoc extends IIndexable {
    /**
     * Permission name
     */
    pName: string,
    group: string,
    description: string,
    /**
     * Tells if the permission is associated with the role
     */
    isAssociated: true
}

/**
 *
 */
export interface IGroupPermsDict {
    [ key: string ]: Array<IPermAssoc>
}
