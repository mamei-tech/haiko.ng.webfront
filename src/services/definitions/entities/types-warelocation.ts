import type { IIndexable } from '@/services/definitions/types-common'

/**
 * Warehouse (storage) location types
 */
export enum WARE_LOC_TYPE {
    VIEW = 'view',
    SUPPLIER = 'supplier',
    CUSTOMER = 'customer',
    TRANSIT = 'transit',
    INTERNAL = 'internal',
    PRODUCTION = 'production',
    INVENTORY = 'inventory'
}

export interface IWareLocationBasic extends IIndexable {
    lFullName: string | undefined,
}

/**
 * Interface for describing a Warehouse row on the datatable
 */
export interface IWareLocationRow extends IWareLocationBasic {
    lName: string,
    lType: WARE_LOC_TYPE | string,
}

/**
 * Interface for describing a Warehouse (storage) Location on the datatable (WareLocation)
 */
export interface IDtoWareLocation extends IWareLocationRow {
    parentID: number | undefined,                               // storage location parent of this location
    warehouseID: number,
    strgCatID: number | undefined,

    lNotes: string | undefined,

    isActive: boolean,
    isScrapLocation: boolean,

    // backend computed fields | not writable in CRUDs ops
    pCount: number | undefined,
    stockValCurrent: number | undefined,
    stockValInCount: number | undefined,
    stockValOutCount: number | undefined,

    created: Date | undefined,
    updated: Date | undefined,
    deleted: Date | undefined,
}

export interface IWareLocationType {
    id: string
}

