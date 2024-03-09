import type { IIndexable } from '@/services/definitions/types-common'


/**
 * Interface for describing a Storage Category row on the datatable
 */
export interface IStrgCategoryRow extends IIndexable {
    sCatName: string,
    wLocationCount: number | undefined,
    allowProdType: string
}

export interface IDtoStrgCategory extends IStrgCategoryRow {

    prodCapacityLine: Array<IStrgCatProdLine>,
    prodCapacityToDelete: Array<number>
}

/**
 * Product Capacity Associations for Storage Category entities
 */
export interface IStrgCatProdLine extends IIndexable {
    id: number,
    strgCatID: number,
    productID: number | string,

    maxCapacity: number,
    uomLabel: string | undefined
}
