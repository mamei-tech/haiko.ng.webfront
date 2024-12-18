import type { IIndexable } from '@/services/definitions'


/**
 *  Specify the each product taking part in a inventory operations (eg. transfer / picking)
 *  Hols the specifications (in terms of products) for an inventory operations.
 *
 */
export interface IDtoMove extends IIndexable {
    mProdId: number | undefined                         // it will be hidden [column] in some tables

    moveDescription: string | undefined
    mScheduleDate: Date | string | undefined
    mDeadLineDate: Date | string | undefined
    prodUoMQty: number                                // the demand the business need for the product
    mUoMId: number

    moveName: string | undefined                      // at the moment we are auto fill this with the name of the product
}
