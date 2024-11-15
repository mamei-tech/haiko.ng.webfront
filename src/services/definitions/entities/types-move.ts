import type { IIndexable } from '@/services/definitions'


/**
 *  Specify the each product taking part in a inventory operations (eg. transfer / picking)
 *  Hols the specifications (in terms of products) for an inventory operations.
 */
export interface IMove extends IIndexable {
    moveName: string
    moveDescription: string | undefined
    mScheduleDate: Date | undefined
    mDeadLineDate: Date | undefined
    pProdUoMQty: number
    mUoMId: number
}
