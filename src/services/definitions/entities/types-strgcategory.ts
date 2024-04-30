import type { IIndexable } from '@/services/definitions/types-common'
import type { STRG_PROD_POLICY } from '@/services/definitions'

export interface IStrgCategoryBasic extends IIndexable {
    sCatName: string,
}

/**
 * Interface for describing a Storage Category row on the datatable
 */
export interface IStrgCategoryRow extends IStrgCategoryBasic {
    wLocationCount: number | undefined,
    allowProdType: STRG_PROD_POLICY
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
