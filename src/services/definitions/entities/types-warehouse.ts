import type { IIndexable } from '@/services/definitions/types-common'

export interface IWarehouseBasic extends IIndexable {
    wName: string,
}

/**
 * Interface for describing a Warehouse row on the datatable
 */
export interface IWarehouseRow extends IWarehouseBasic {
    code: string,
    suppID: number | string
}

/**
 * Warehouse DTO
 */
export interface IDtoWarehouse extends IWarehouseRow {}

