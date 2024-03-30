import type { IIndexable } from '@/services/definitions/types-common'

export interface IWareLocationBasic extends IIndexable {
    lFullName: string | undefined,
}

/**
 * Interface for describing a Warehouse row on the datatable
 */
export interface IWareLocationRow extends IWareLocationBasic {
    lName: string,
    lType: string,
}

/**
 * Interface for describing a Warehouse (storage) Location on the datatable (WareLocation)
 */
export interface IDtoWareLocation extends IWareLocationRow {
    parentID: number | undefined,                               // storage location parent of this location
    warehouseID: number,
    strgCatID: number | undefined,

    lNotes: string,

    isActive: boolean,
    isScrapLocation: boolean,

    // backend computed fields | not writable in CRUDs ops
    pCount: number | undefined,
    stockValCurrent: number | undefined,
    stockValInCount: number | undefined,
    stockValOutCount: number | undefined
}

export interface IWareLocationType {
    id: string
}

