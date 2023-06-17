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
 * Supplier Category DTO
 */
export interface IDtoSupplierCat extends ISupplierCatRow {
    sDescription: string,
}

/**
 * Interface for describing a Supplier Category row on the datatable
 */
export interface ISupplierRow extends IIndexable {
    sName: string,
    contactName: string,
    sPhone: string,
    isActive: boolean,
    sCategoryID: number
    pCount: number
}

/**
 * Define the very basic data of a SupplierCategory
 */
export interface ISuppCatBasic extends IIndexable {

    /**
     * supplier category name
     */
    scName: string
}
