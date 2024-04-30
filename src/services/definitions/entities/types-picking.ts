import type { IIndexable } from '@/services/definitions/types-common'
import type { CORE_PICKING_TYPE, RESERVATION_METHODS } from '@/services/definitions'

export interface IPickingTypeBasic extends IIndexable {
    tName: string | undefined,
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
    warehouseID: number | undefined,
    defSrcWLocationID: number | undefined,      // default warehouse location as source for the picking operation
    defDestWLocationID: number | undefined      // default warehouse location as destination for the picking operation
}

/**
 * Picking core operation types
 */
export interface ICorePickingType {
    id:string
}
