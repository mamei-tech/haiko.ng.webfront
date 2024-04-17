import type { IIndexable } from '@/services/definitions/types-common'

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

}
