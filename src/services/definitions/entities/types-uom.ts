import type { IIndexable } from '@/services/definitions'


/**
 * Category of the Units of Measurement
 */
export interface IDtoUoMCategory extends IIndexable {
    ucName: string,
    units: Array<IDtoUoM>
    /**
     * Collection of array numbers to be deleted when we want to update the UoM category
     */
    unitsToDelete: number[]
}

/**
 * Unit of Measurement Dto
 */
export interface IDtoUoM extends IIndexable {
    uName: string,
    uCategoryId: number,
    uType: number,
    uRatio: number,
    isActive: boolean
}

/**
 * Define the very basic data of a Unit of Measurement (UoM)
 */
export interface IUoMBasic extends IIndexable {

    /**
     * UoM denomination / name
     */
    uName: string
}
