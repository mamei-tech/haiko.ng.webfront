import type { IIndexable } from '@/services/definitions/types-common'


/**
 * Interface for describing a Supplier Category row on the datatable
 */
export interface ISupplierCatRow extends IIndexable {
    scName: string,
    sCount: number,
    scColor: string,
}

/**
 * Unit of Measurement Dto
 */
export interface IDtoSupplierCat extends ISupplierCatRow {
    sDescription: string,
}
