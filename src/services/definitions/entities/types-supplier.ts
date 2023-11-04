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
    contactName: string | undefined,
    sPhone: string | undefined,
    cell: string,
    isActive: boolean,
    sCategoryID: number | string
    pCount: number
    countryCode: string | undefined,
}

/**
 * Supplier DTO
 */
export interface IDtoSupplier extends ISupplierRow {
    sName: string,
    sContactNotes: string | undefined,
    sInternalNotes: string | undefined,
    sCategoryID: number | string,

    sEmail: string | undefined,
    sWebSite: string | undefined,
    sAddress: string | undefined,
    stateCode: string | undefined,
    zip?: number,

    isCompany: boolean,

    purchasesCountPend: number,
    purchasesCountTotal: number,
    purchasesCountValue: number
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
     * Supplier Name
     */
    sName: string
}
