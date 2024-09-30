import type { IIndexable } from '@/services/definitions/types-common'

export interface IWarehouseBasic extends IIndexable {
    wName: string,
}

/**
 * Warehouse DTO
 */
export interface IDtoWarehouse extends IWarehouseBasic {
    code: string,
    suppID: number | string,
    suppAddressID: number | string
}

