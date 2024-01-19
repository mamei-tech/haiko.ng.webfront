import type { IIndexable } from '@/services/definitions/types-common'

/**
 * Interface for describing a Warehouse row on the datatable
 */
export interface IWarehouseRow extends IIndexable {
    wName: string,
    code: string,
    suppID: number | string ,
}

/**
 * Warehouse DTO
 */
export interface IDtoWarehouse extends IWarehouseRow {}

