import type { IIndexable } from '@/services/definitions'

// /**
//  * Define the very basic data of a Role
//  */
// export interface IRoleBasic {
//     id: number,
//     rName: string
// }


/**
 * Define the very basic data of a Role
 */
export interface IRoleBasic extends IIndexable{
    /**
     * Role identifier
     */
    // id: number|string,

    /***
     * Role name
     */
    rName: string
}
