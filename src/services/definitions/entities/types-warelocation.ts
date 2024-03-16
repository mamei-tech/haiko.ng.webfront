import type { IIndexable } from '@/services/definitions/types-common'

/**
 * Interface for describing a Warehouse row on the datatable
 */
export interface IWareLocationRow extends IIndexable {
    lName: string,
    lFullName: string,
    lType: string,
}

