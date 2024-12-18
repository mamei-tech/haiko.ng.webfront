import type { RESERVATION_METHODS } from '@/services/definitions'

import type { IIndexable } from '@/services/definitions/types-common'
import type { IDtoMove } from '@/services/definitions/entities/types-move'


/**
 * picking core operation types definitions
 */
export enum CORE_PICKING_TYPE {
    EMPTY = '',
    INCOMING = 'incoming',                  // receipt
    OUTGOING = 'outgoing',
    TRANSFER = 'internal',                  // internal | transfer
    MNFACTRN = 'manufacturing'
}

export interface IPickingTypeBasic extends IIndexable {
    tName: string | undefined,

    defSrcWLocationID: number | undefined,      // default warehouse location as source for the picking operation
    defDestWLocationID: number | undefined      // default warehouse location as destination for the picking operation
}

/**
 * Interface for describing a inventory PickingType row on the datatable
 */
export interface IPickingTypeRow extends IPickingTypeBasic {
    tColor: string,
    isActive: boolean,
}

export interface IDtoPickingType extends IPickingTypeRow {
    iName: string | undefined,
    seqCode: string,                            // sequence code
    pCoreType: CORE_PICKING_TYPE,               // internal code
    resMethod: RESERVATION_METHODS,
    resDaysBefore: number | undefined,
}

/**
 * Picking core operation types
 */
export interface ICorePickingType {
    id:string
}

export interface IDtoPickingBase extends IIndexable {
    pickName: string | undefined
    state: string | undefined
}

/**
 * Represent a inventory Picking data transfer object (DTO). This was meant to be used primarily in creations ops (CRUD)
 * A 'picking' its A.K.A 'Inventory Transfer Operation' in the UI
 */
export interface IDtoPicking extends IDtoPickingBase {

    contactId: number,
    pickingType: number,
    pSrcWareLocationId: number,
    pDestWareLocationId: number,
    pSrcDocument: string | undefined,
    pScheduleDate: Date | string | undefined,
    pResponsibleId: number,
    pNotes: string | undefined,

    pShippingPolicy: string

    moves: Array<IDtoMove>                 // actual product for the picking
}
