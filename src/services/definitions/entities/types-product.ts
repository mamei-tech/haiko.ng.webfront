import type { IIndexable } from '@/services/definitions'


/**
 * Interface for describing a Product row on the datatable
 */
export interface IProductRow extends IIndexable {
    pName: string,
    pCategoryID: number | string,
    isActive: boolean
    doWeTrackInventory: boolean
    sellPrice: string
    cost: string | undefined
    pTotalStock: number | undefined
    pUoM: number | string

    sku: string | undefined
    sellCode: string
}

/**
 * Define the very basic data of a Product Categories
 */
export interface IProdCatBasic extends IIndexable {

    /**
     * product category name
     */
    pCatName: string
}
