import type { IIndexable } from '@/services/definitions'


/**
 * Interface for describing a Product row on the datatable
 */
export interface IProductRow extends IIndexable {
    pName: string,
    pCategoryID: number | string,
    isActive: boolean
    doWeTrackInventory: boolean
    sellPrice: string | number | undefined
    cost: string | number | undefined
    pUoMID: number | string

    pTotalStock: number | undefined

    sellCode: string | undefined
}

/**
 * Main product data transfer object (DTO)
 */
export interface IDtoProduct extends IProductRow {
    notePurchase: string | undefined
    noteSell: string | undefined
    noteTransfer: string | undefined
    picPath: string | undefined

    canBePurchased: boolean
    canBeSold: boolean

    pCategoryID: number

    pUoMPurchaseID: number

    pTotalStockValue: number | undefined
    pTotalSalesCountInMonth: number | undefined
    pTotalSalesValueInMonth: number | undefined
    pTotalPurchasesIn3Month: number | undefined
    pCountBoMRecipes: number | undefined

    sellTax: number | undefined

    lResponsibleID: number | undefined
    weight: number | undefined
    volume: number | undefined
    preDay2Manuf: number | undefined,

    // -- helpers properties, not real (database entity) props
    supplierLines: Array<IDtoProductSupplierL> | undefined
    suppLinesToDelete: Array<number> | undefined
}

/**
 * Product Supplier line. It's a M2M relationship
 * L == line (means related)
 */
export interface IDtoProductSupplierL {
    /**
     * ❗ only front/ui logic intended. It will not be used on the backend.
     */
    id: number | undefined
    supplierId: number | undefined
    supplierCode: string | undefined
    sku: string | undefined
    /**
     * Sell price of the supplier, so it will be a 'cost' for the business in case of purchase from the supplier
     */
    sPrice: string | number | undefined
    currencyId: number
    sTax: number | undefined
    isActive: boolean

    sName: string | undefined       // this here is a trick, so the backend can have the Suppliers Name so it can generate the SKU (supplier name dependant function) values, without find the supplier names in the database
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
