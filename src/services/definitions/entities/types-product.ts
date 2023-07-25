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
    pUoMID: number | string

    sku: string | undefined
    sellCode: string
}

/**
 * Main product data transfer object
 */
export interface IDtoProduct extends IProductRow {
    notePurchase: string | undefined
    noteSell: string | undefined
    picPath: string | undefined

    CanBePurchased: boolean
    CanBeSold: boolean

    pCategoryID: number
    pSupplierID: number

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
