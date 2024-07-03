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
    pName: string,
    phone: string | undefined,
    cell: string,
    isActive: boolean,
    suppCategoryID: number | string
    pCount: number | undefined
    countryCode: string | undefined,
}

/**
 * Supplier DTO
 */
export interface IDtoSupplier extends ISupplierRow {
    internalNotes: string | undefined,
    suppCategoryID: number | string,

    email: string | undefined,
    website: string | undefined,
    street: string | undefined,
    city: string | undefined,
    zip?: number,
    stateCode: string | undefined,
    jobPosition: string | undefined,
    parentID: number | string,

    isCompany: boolean,

    purchasesCountPend: number | undefined,
    purchasesCountTotal: number | undefined,
    purchasesCountValue: number | undefined
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


/**
 * Very basic data of a Supplier
 */
export interface ISupplierBasic extends IIndexable {
    /**
     * Supplier [display] Name
     */
    cmpDisplayName: string,
}
